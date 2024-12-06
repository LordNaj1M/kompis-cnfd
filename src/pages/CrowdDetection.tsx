import { Box, Heading, VStack, Text } from '@chakra-ui/react';

const CrowdDetection = () => {
  return (
    <Box p={6}>
      <VStack align="start" spacing={4}>
        <Heading size="lg">CROWD DETECTION</Heading>
        <Text>Assalamualaikum Crowd Detection</Text>
      </VStack>
    </Box>
  );
};

export default CrowdDetection;/*
// pages/CrowdDetection.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
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
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const toast = useToast();
  
  // State untuk menyimpan data crowd
  const [crowdData, setCrowdData] = useState<AnalysisResult>({
    data: {
      num_people: 0,
      detections: []
    },
    statusCrowd: 'sepi',
    timestamp: new Date().toISOString()
  });

  // Fungsi untuk mengirim frame ke server
  const captureAndSendFrame = useCallback(() => {
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
            det.bounding_box.x_max, 
            det.bounding_box.y_max
          );
        });
      
        // Konversi canvas ke data URL
        const frame = canvas.toDataURL('image/jpeg', 0.5);
        
        // Cek status koneksi sebelum mengirim
        if (socket.connected) {
          // Kirim frame ke server
          socket.emit('frame', frame);
        } else {
          console.warn('Socket not connected. Attempting to reconnect...');
          socket.connect();
        }
      }
    }
  }, [crowdData.data.detections]);

  // Fungsi untuk toggle camera
  const toggleCamera = useCallback(() => {
    setIsCameraActive(prev => {
      if (!prev) {
        // Aktifkan kamera
        intervalRef.current = setInterval(captureAndSendFrame, 1000);
      } else {
        // Matikan kamera
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
      return !prev;
    });
  }, [captureAndSendFrame]);

  useEffect(() => {
    // Log socket URL untuk debugging
    console.log('Socket URL:', import.meta.env.VITE_APP_SOCKET_URL);

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

    // Tambahkan listener untuk hasil analisis YOLO
    socket.on('analysis-result', (result) => {
      console.log('YOLO Detection:', result);
      setCrowdData(result);
      // Tambahkan logika untuk menangani hasil deteksi di sini
    });

    return () => {
      // Bersihkan interval jika ada
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Disconnect socket
      if (isConnected==true) {
        socket.disconnect();
      }
    };
  }, [isConnected, toast]);

  return (
    <VStack spacing={6} p={4} w="full" maxW="1200px" mx="auto">
      <Box w="full" borderWidth={1} borderRadius="lg" overflow="hidden">
        <Heading size="md" p={4} bg="gray.50">
          CROWD DETECTION - CAMERA
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
            {/* Canvas tersembunyi /}
            <canvas 
              ref={canvasRef} 
              style={{ 
                display: 'none', 
                width: '640px', 
                height: '480px' 
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
            colorScheme={isCameraActive ? 'red' : 'green'}
            onClick={toggleCamera}
          >
            {isCameraActive ? 'Matikan Kamera' : 'Aktifkan Kamera'}
          </Button>
        </Flex>
      </Box>

      
      <Box w="full" borderWidth={1} borderRadius="lg" p={4}>
        <Heading size="sm" mb={2}>Informasi Keramaian</Heading>
        <Text>Jumlah: {crowdData.data.num_people}</Text>
        <Text>Status: {crowdData.statusCrowd}</Text>
        <Text>Terakhir Diperbarui: {crowdData.timestamp}</Text>
      </Box>
    </VStack>
  );
};

export default CrowdDetection;
*/