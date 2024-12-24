// pages/CrowdDetection.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Button,
  Center,
  Flex,
  useToast,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Select,
  Spinner,
  useMediaQuery
} from '@chakra-ui/react';
import Webcam from 'react-webcam';
import { socket } from '../../lib/socket';
import { useAreas, useAreaById } from '../../hooks/useArea';
import { useNavigate, useParams } from 'react-router-dom';

interface AnalysisResult { 
  data: {
    num_people: number;
    detections: Detection[];
  };
  statusCrowd: 'kosong' | 'sepi' | 'sedang' | 'padat' | 'over';
  timestamp: string; 
}

interface Detection { 
  bounding_box: BoundingBox; 
}
interface BoundingBox { 
  x_min: number; 
  y_min: number; 
  x_max: number; 
  y_max: number; 
}

const CrowdDetection = () => {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // const [areaId, setAreaId] = useState('');
  const { areas, isLoading, isError } = useAreas();
  const [selectedAreaId, setSelectedAreaId] = useState<string>(areaId || '');
  const { areaById } = useAreaById(areaId || '');

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAreaId = event.target.value;
    setSelectedAreaId(newAreaId);
    await navigate(`/crowd-detection/${newAreaId}`, { replace: true });
  };

  useEffect(() => {
    if (!areaId) {
        <VStack spacing={4}>
          <Text>Invalid area ID.</Text>
          <Button onClick={() => navigate(-1)} colorScheme="red">
            Go Back
          </Button>
        </VStack>
    } else {
      setSelectedAreaId(areaId);
    }
  }, [areaId, areaById, navigate]);

  useEffect(() => {
    if (areaId && !isLoading) {
      const areaExists = areas?.some(area => area.id === areaId);
      if (!areaExists) {
        toast({
          title: "Invalid Area",
          description: "The selected area does not exist",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        navigate('/crowd-detection', { replace: true });
      }
    }
  }, [areaId, areas, isLoading, navigate, toast]);

  // State untuk menyimpan data crowd
  const [crowdData, setCrowdData] = useState<AnalysisResult>({
    data: {
      num_people: 2,
      detections: [
        {
          bounding_box: {
            x_min: 50, 
            y_min: 100, 
            x_max: 200, 
            y_max: 300
          }
        },
        {
          bounding_box: {
            x_min: 300, 
            y_min: 50, 
            x_max: 500, 
            y_max: 200
          }
        }
      ]
    },
    statusCrowd: 'sedang',
    timestamp: new Date().toISOString()
  });

  // Fungsi untuk mengirim frame ke server
  const captureAndDrawFrame = useCallback(() => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      
      // Pastikan dimensi canvas sesuai
      canvas.width = 640;
      canvas.height = 480;

      if (context) {
        // Gambar video ke canvas
        context.drawImage(video, 0, 0, 640, 480);

        const detections = crowdData.data.detections || [];
        detections.forEach((det) => {
          // Set warna dan gaya
          context.strokeStyle = 'red';
          context.lineWidth = 2;

          // Gambar kotak
          context.strokeRect(
            det.bounding_box.x_min, 
            det.bounding_box.y_min, 
            det.bounding_box.x_max - det.bounding_box.x_min, 
            det.bounding_box.y_max - det.bounding_box.y_min
          );
        });
      }
    }
  }, [crowdData.data.detections]);
  
  // Fungsi untuk mengirim frame ke server
  const sendFrameToServer = useCallback(() => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext("2d");
      // Pastikan dimensi canvas sesuai
      canvas.width = 640;
      canvas.height = 480;

      if (context) {
        // Konversi canvas ke data URL
        const frame = canvas.toDataURL("image/jpeg", 1);
        
        // Kirim frame ke server
        if (socket.connected && areaId) {
          socket.emit("io-crowd-frame", frame);
          console.log('send');
          
        } else {
          console.warn("Socket not connected. Attempting to reconnect...");
          socket.connect();
        }
      }
    }
  }, [areaId]);

  // Fungsi untuk toggle camera
  const toggleCamera = useCallback(() => {
    setIsCameraActive(prev => {
      if (!prev) {
        // Aktifkan kamera dan mulai menggambar bounding box
        const draw = () => {
          captureAndDrawFrame(); // Menggambar bounding box
          requestAnimationFrame(draw);
        };
        draw();

        // Kirim frame ke server setiap 1 detik
        intervalRef.current = setInterval(() => {
          sendFrameToServer(); // Mengirim frame ke server
        }, 1000);
      } else {
        // Matikan kamera
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      return !prev;
    });
  }, [captureAndDrawFrame, sendFrameToServer]);

  useEffect(() => {
    // console.log('Socket URL:', import.meta.env.VITE_APP_SOCKET_URL);

    // Inisialisasi socket
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', () => {
      // toast({
      //   title: 'Terhubung ke server',
      //   status: 'success',
      //   duration: 3000,
      // });
    });

    socket.on('connect_error', () => {
      // toast({
      //   title: 'Gagal terhubung ke server',
      //   status: 'error',
      //   duration: 3000,
      // });
    });

    // Tambahkan listener untuk hasil analisis YOLO
    socket.on('io-crowd-result', (result) => {
      console.log('YOLO Detection:', result);
      // setCrowdData(result);
      // Tambahkan logika untuk menangani hasil deteksi di sini
    });

    return () => {
      // Bersihkan interval jika ada
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (socket.connected) {
        socket.disconnect();
      }      
    };
  });

  if (isError) {
    return (
      <Card bg='white' borderColor='black' borderWidth="1px">
        <CardHeader>
          <Heading size="lg">CROWD AREA LIST</Heading>
        </CardHeader>
        <CardBody>
          <Text color="red.500">Error loading areas: {isError.message}</Text>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Box p={6}>
        <Flex justify="space-between" align="center" flexDirection={isMobile ? 'column' : 'row'}>
          <VStack align="start" spacing={4}>
            <Heading size="lg">CROWD DETECTION</Heading>
            <Text>name={areaById?.name}</Text>
          </VStack>

          <Box marginBlockStart={isMobile ? 2 : 0} p={2} bg={'yellow.200'} borderWidth={1} borderRadius="lg">
            <FormControl>
            <FormLabel>Selected Area</FormLabel>
              {isLoading ? (
                <Flex justify="center" align="center">
                  <Spinner size="xl" />
                </Flex>
              ) : (
                <Select value={selectedAreaId} onChange={handleChange} bg={'white'}>
                  {!selectedAreaId && (
                    <option value="" disabled>
                      Select Area
                    </option>
                  )}

                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </Select>
              )}
            </FormControl>
          </Box>
        </Flex>
      </Box>

      <VStack spacing={4} w="full" maxW="1200px" mx="auto">
        <Box w="full" borderWidth={1} borderRadius="lg" overflow="hidden" bg={'white'}>
          <Heading size="md" p={4}>
            CAMERA
          </Heading>
          <Center p={4} position="relative">
            {isCameraActive ? (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "environment"
                  }}
                  style={{ width: '100%', maxWidth: '640px' }}
                />
                {/* Canvas untuk bounding box */}
                <canvas 
                  ref={canvasRef} 
                  style={{ 
                    position: 'absolute', 
                    width: '640px', 
                    height: '480px', 
                    pointerEvents: 'none' 
                  }} 
                />
              </>
            ) : (
              <Box 
                w="100%" 
                maxW="640px" 
                h="480px" 
                bg="gray.100" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
              >
                <Text>Kamera tidak aktif</Text>
              </Box>
            )}
          </Center>
          <Flex justify="center" p={4}>
            <Button
              colorScheme={!areaId ? 'yellow' : isCameraActive ? 'red' : 'green'}
              onClick={toggleCamera}
              isDisabled={!areaId}
            >
              {!areaId ? 'Please Select Area' : isCameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
            </Button>
          </Flex>
        </Box>

        <Box w="full" borderWidth={1} borderRadius="lg" p={4} bg={'white'}>
          <Heading size="md" p={1}>ANALYTIC RESULT</Heading>
          <Text>Jumlah: {crowdData.data.num_people}</Text>
          <Text>Status: {crowdData.statusCrowd}</Text>
          <Text>Terakhir Diperbarui: {crowdData.timestamp}</Text>
        </Box>
      </VStack>
    </>
  );
};

export default CrowdDetection;