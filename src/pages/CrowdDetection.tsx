import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { socket } from '../lib/socket';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Button,
  Center,
  Flex,
  useToast
} from '@chakra-ui/react';

// Tipe data untuk status keramaian
interface CrowdStatus {
  count: number;
  status: 'sepi' | 'sedang' | 'padat';
  timestamp: string;
}

const CrowdDetection = () => {
  const webcamRef = useRef<Webcam>(null);
  const [, setIsConnected] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const toast = useToast();
  
  // State untuk menyimpan data crowd
  const [, setCrowdData] = useState<CrowdStatus>({
    count: 0,
    status: 'sepi',
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    // Inisialisasi socket
    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      toast({
        title: 'Terhubung ke server',
        status: 'success',
        duration: 3000,
      });
    });

    socket.on('connect_error', () => {
      toast({
        title: 'Gagal terhubung ke server',
        status: 'error',
        duration: 3000,
      });
    });

    // Menerima update data crowd dari server
    socket.on('crowd_update', (data: CrowdStatus) => {
      setCrowdData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [toast]);

  // Fungsi untuk mengirim frame ke server
  const captureAndSendFrame = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        socket.emit('frame', imageSrc);
      }
    }
  };

  // Fungsi untuk toggle camera
  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
    if (!isCameraActive) {
      // Mulai interval capture saat kamera aktif
      const interval = setInterval(captureAndSendFrame, 1000);
      return () => clearInterval(interval);
    }
  };

  return (
    <VStack spacing={6} p={4} w="full" maxW="1200px" mx="auto">
      {/* Camera Section */}
      <Box w="full" borderWidth={1} borderRadius="lg" overflow="hidden">
        <Heading size="md" p={4} bg="gray.50">
          CROWD DETECTION - CAMERA
        </Heading>
        <Center p={4} position="relative">
          {isCameraActive ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "environment"
              }}
              style={{ width: '100%', maxWidth: '11640px' }}
            />
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
            colorScheme={isCameraActive ? 'red' : 'green'}
            onClick={toggleCamera}
          >
            {isCameraActive ? 'Matikan Kamera' : 'Aktifkan Kamera'}
          </Button>
        </Flex>
      </Box>
    </VStack>
  );
};

export default CrowdDetection;