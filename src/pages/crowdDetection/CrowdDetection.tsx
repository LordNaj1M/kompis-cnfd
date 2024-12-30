// pages/CrowdDetection.tsx
import { useCallback, useEffect, useRef, useState,  } from 'react';
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

interface CrowdResult { 
  detection_data: Detection_Data[];
  status: '';
  count: number;
  area_id: string;
  createdAt: string; 
}

interface Detection_Data { 
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
  const processingRef = useRef(false);
  
  // const [areaId, setAreaId] = useState('');
  const { areas, isLoading, isError } = useAreas();
  const [selectedAreaId, setSelectedAreaId] = useState<string>(areaId || '');
  const { areaById } = useAreaById(areaId || '');

  const [crowdData, setCrowdData] = useState<CrowdResult>({
    detection_data: [],
    status: '',
    count: 0,
    area_id: '',
    createdAt: ''
  });

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAreaId = event.target.value;
    setSelectedAreaId(newAreaId);
    await navigate(`/crowd-detection/${newAreaId}`, { replace: true });
  };

  // Fungsi untuk menggambar bounding box
  const drawBoundingBoxes = useCallback(() => {
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;
  
      if (video && canvas && crowdData.detection_data) {
        const context = canvas.getContext('2d');
        
        // Pastikan dimensi canvas sesuai
        canvas.width = 640;
        canvas.height = 480;
  
        if (context) {
          // Clear the previous drawing
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Draw video frame
          context.drawImage(video, 0, 0, 640, 480);
  
          // Draw all bounding boxes
          crowdData.detection_data.forEach((det) => {
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
    }, [crowdData.detection_data]);

  // Fungsi untuk capture dan kirim frame
  const processFrame = () => {
    if (processingRef.current) {
      console.log('Still processing previous frame, skipping...');
      return;
    }

    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (video && canvas && socket.connected) {
      try {
        processingRef.current = true;  // Set flag before processing
        console.log('Processing frame at:', new Date().toISOString());

        const context = canvas.getContext('2d');
        if (context) {
          // Set canvas dimensions once
          canvas.width = 640;
          canvas.height = 480;

          // Draw video frame
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // // Draw bounding boxes if available
          // if (crowdData.detection_data?.length > 0) {
          //   drawBoundingBoxes(context, crowdData.detection_data);
          // }

          // Send frame to server
          const frame = canvas.toDataURL("image/jpeg", 0.8);
          socket.emit("io-crowd-frame", frame);
          console.log('send');
        }
      } finally {
        processingRef.current = false;  // Reset flag after processing
      }
    }
  };

  // Toggle camera function
  const toggleCamera = () => {
    console.log('Toggle camera called, current state:', isCameraActive);
    setIsCameraActive(prev => {
      console.log('Setting camera state to:', !prev);
      if (!prev) {
        // Start processing frames
        intervalRef.current = setInterval(processFrame, 1000);
      } else {
        // Stop processing frames
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      return !prev;
    });
  };

  // Socket connection effect
  useEffect(() => {
    // Connect socket if not connected
    if (!socket.connected) {
      socket.connect();
    }

    // Set up socket event listeners
    const onCrowdResult = (result: CrowdResult) => {
      console.log('YOLO Detection:', result);
      setCrowdData(result);
    };

    socket.on('io-crowd-result', onCrowdResult);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      socket.off('io-crowd-result', onCrowdResult);
      socket.disconnect();
    };
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    if (isCameraActive && crowdData.detection_data?.length > 0) {
      // Set up an animation frame loop
      let animationFrameId: number;
      
      const updateCanvas = () => {
        drawBoundingBoxes();
        animationFrameId = requestAnimationFrame(updateCanvas);
      };
      
      // Start the animation loop
      updateCanvas();
      
      // Cleanup function to cancel animation frame
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [isCameraActive, crowdData, drawBoundingBoxes]);

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
  }, [areaId, navigate]);

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
        setSelectedAreaId('');
      }
    }
  }, [areaId, areas, isLoading, navigate, toast]);
  

  // // Fungsi lanjutan menerima frame dari server
  // const captureAndDrawFrame = () => {
  //   const video = webcamRef.current?.video;
  //   const canvas = canvasRef.current;

  //   if (video && canvas) {
  //     const context = canvas.getContext('2d');
      
  //     // Pastikan dimensi canvas sesuai
  //     canvas.width = 640;
  //     canvas.height = 480;

  //     if (context) {
  //       // Gambar video ke canvas
  //       context.drawImage(video, 0, 0, 640, 480);

  //       const detection_datas = crowdData.detection_data || [];
  //       detection_datas.forEach((det) => {
  //         // Set warna dan gaya
  //         context.strokeStyle = 'red';
  //         context.lineWidth = 2;

  //         // Gambar kotak
  //         context.strokeRect(
  //           det.bounding_box.x_min, 
  //           det.bounding_box.y_min, 
  //           det.bounding_box.x_max - det.bounding_box.x_min, 
  //           det.bounding_box.y_max - det.bounding_box.y_min
  //         );
  //       });
  //     }
  //   }
  // };
  
  // // Fungsi untuk mengirim frame ke server
  // const sendFrameToServer = () => {
  //   const video = webcamRef.current?.video;
  //   const canvas = canvasRef.current;
    
  //   if (video && canvas) {
  //     const context = canvas.getContext("2d");
  //     // Pastikan dimensi canvas sesuai
  //     canvas.width = 640;
  //     canvas.height = 480;

  //     if (context) {
  //       context.drawImage(video, 0, 0, canvas.width, canvas.height);

  //       // Konversi canvas ke data URL
  //       const frame = canvas.toDataURL("image/jpeg", 1);
  //       let i=0;
  //       // Kirim frame ke server
  //       if (socket.connected) {
  //         socket.emit("io-crowd-frame", frame);
  //         console.log('send '+ i++);
          
  //       } else {
  //         console.warn("Socket not connected. Attempting to reconnect...");
  //         socket.connect();
  //       }
  //     }
  //   }
  // };

  // // Fungsi untuk toggle camera
  // const toggleCamera = () => {
  //   setIsCameraActive(prev => {
  //     if (!prev) {
  //       // Aktifkan kamera dan mulai menggambar bounding box
  //       const draw = () => {
  //         captureAndDrawFrame(); // Menggambar bounding box
  //         requestAnimationFrame(draw);
  //       };
  //       draw();

  //       // Kirim frame ke server setiap 1 detik
  //       intervalRef.current = setInterval(() => {
  //         sendFrameToServer(); // Mengirim frame ke server
  //       }, 1000);
  //     } else {
  //       // Matikan kamera
  //       if (intervalRef.current) {
  //         clearInterval(intervalRef.current);
  //         intervalRef.current = null;
  //       }
  //     }
  //     return !prev;
  //   });
  // };

  // useEffect(() => {
  //   // console.log('Socket URL:', import.meta.env.VITE_APP_SOCKET_URL);

  //   // Inisialisasi socket
  //   if (!socket.connected) {
  //     socket.connect();
  //   }

  //   socket.on('connect', () => {
  //     // toast({
  //     //   title: 'Terhubung ke server',
  //     //   status: 'success',
  //     //   duration: 3000,
  //     // });
  //   });

  //   socket.on('connect_error', () => {
  //     // toast({
  //     //   title: 'Gagal terhubung ke server',
  //     //   status: 'error',
  //     //   duration: 3000,
  //     // });
  //   });

  //   // Tambahkan listener untuk hasil analisis YOLO
  //   socket.on('io-crowd-result', (result) => {
  //     console.log('YOLO Detection:', result);
  //     setCrowdData(result);
  //     // Tambahkan logika untuk menangani hasil deteksi di sini
  //   });

  //   return () => {
  //     // Bersihkan interval jika ada
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //     if (socket.connected) {
  //       socket.disconnect();
  //     }      
  //   };
  // });

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
          <Text>Jumlah: {crowdData.count}</Text>
          <Text>Status: {crowdData.status}</Text>
          <Text>Terakhir Diperbarui: {crowdData.createdAt}</Text>
        </Box>
      </VStack>
    </>
  );
};

export default CrowdDetection;