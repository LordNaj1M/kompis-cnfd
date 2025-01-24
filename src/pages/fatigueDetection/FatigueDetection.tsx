// pages/FatigueDetection.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Center,
  Flex,
  // useToast,
  // Card,
  // CardBody,
  // CardHeader,
  // FormControl,
  // FormLabel,
  // Select,
  // Spinner,
  useMediaQuery,
} from "@chakra-ui/react";
// import {
//   CartesianGrid,
//   Legend,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
import Webcam from "react-webcam";
import { socket } from "../../lib/socket";
// import { useAreas, useAreaById } from "../../hooks/useArea";
// import { useNavigate } from "react-router-dom";

interface FatigueResult {
  detection_data: Detection_Data[];
  status: "";
  // user_id: string;
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

const FatigueDetection = () => {
  // const navigate = useNavigate();
  // const toast = useToast();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  const [isCameraActive, setIsCameraActive] = useState(false);

  // const [areaId, setAreaId] = useState('');
  // const { areas, isLoading, isError } = useAreas();
  // const [selectedAreaId, setSelectedAreaId] = useState<string>(areaId || "");
  // const { areaById } = useAreaById(areaId || "");

  const [fatigueData, setFatigueData] = useState<FatigueResult>({
    detection_data: [],
    status: "",
    // user_id: "",
    createdAt: "",
  });

  const [fatigueDataArray, setFatigueDataArray] = useState<FatigueResult[]>([]);
  useEffect(() => {
    setFatigueDataArray((prevArray) => {
      const newArray = [
        ...prevArray,
        {
          ...fatigueData,
          createdAt:
            fatigueData?.createdAt == ""
              ? ""
              : new Date(fatigueData.createdAt).toLocaleString("id-ID", {
                  timeZone: "Asia/Jakarta",
                }),
        },
      ];
      return newArray.length > 10 ? newArray.slice(1) : newArray;
    });
  }, [fatigueData]);

  // const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newAreaId = event.target.value;
  //   setSelectedAreaId(newAreaId);
  //   await navigate(`/crowd-detection/${newAreaId}`, { replace: true });
  // };

  // Fungsi untuk menggambar bounding box
  const drawBoundingBoxes = useCallback(() => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (video && canvas && fatigueData.detection_data) {
      const context = canvas.getContext("2d");

      // Pastikan dimensi canvas sesuai
      canvas.width = 640;
      canvas.height = 480;

      if (context) {
        // Clear the previous drawing
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw video frame
        context.drawImage(video, 0, 0, 640, 480);

        // Draw all bounding boxes
        fatigueData.detection_data.forEach((det) => {
          // Set warna dan gaya
          context.strokeStyle = "red";
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
  }, [fatigueData.detection_data]);

  // Fungsi untuk capture dan kirim frame
  const processFrame = () => {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;

    if (video && canvas && socket.connected) {
      const context = canvas.getContext("2d");
      if (context) {
        // Set canvas dimensions once
        canvas.width = 640;
        canvas.height = 480;

        // Draw video frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Send frame to server
        const frame = canvas.toDataURL("image/jpeg", 0.8);
        socket.emit("io-fatigue-frame", frame);
      }
    }
  };

  // Toggle camera function
  const toggleCamera = () => {
    setIsCameraActive((prev) => {
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
    if (isCameraActive) {
      // Connect socket if not connected
      if (!socket.connected) {
        socket.connect();
      }

      // Set up socket event listeners
      const onFatigueResult = (result: FatigueResult) => {
        setFatigueData(result);
      };

      socket.on("io-fatigue-result", onFatigueResult);

      // Cleanup function
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        socket.off("io-fatigue-result", onFatigueResult);
        socket.disconnect();
        setFatigueDataArray([]);
      };
    }
  }, [isCameraActive]); // Empty dependency array - only run once on mount

  useEffect(() => {
    if (isCameraActive) {
      // Set up an animation frame loop
      let animationFrameId: number;

      const updateCanvas = () => {
        drawBoundingBoxes();
        animationFrameId = requestAnimationFrame(updateCanvas);
      };

      // Start the animation loop
      updateCanvas();
      console.log(fatigueData.status);

      // Cleanup function to cancel animation frame
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [isCameraActive, fatigueData, drawBoundingBoxes]);

  // useEffect(() => {
  //   if (!areaId) {
  //     <VStack spacing={4}>
  //       <Text>Invalid area ID.</Text>
  //       <Button onClick={() => navigate(-1)} colorScheme="red">
  //         Go Back
  //       </Button>
  //     </VStack>;
  //   } else {
  //     setSelectedAreaId(areaId);
  //   }
  // }, [areaId, navigate]);

  // useEffect(() => {
  //   if (areaId && !isLoading) {
  //     const areaExists = areas?.some((area) => area.id === areaId);
  //     if (!areaExists) {
  //       toast({
  //         title: "Invalid Area",
  //         description: "The selected area does not exist",
  //         status: "error",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //       navigate("/crowd-detection", { replace: true });
  //       setSelectedAreaId("");
  //     }
  //   }
  // }, [areaId, areas, isLoading, navigate, toast]);

  // if (isError) {
  //   return (
  //     <Card bg="white" borderColor="black" borderWidth="1px">
  //       <CardHeader>
  //         <Heading size="lg">CROWD AREA LIST</Heading>
  //       </CardHeader>
  //       <CardBody>
  //         <Text color="red.500">Error loading areas: {isError.message}</Text>
  //       </CardBody>
  //     </Card>
  //   );
  // }
  // const StatusBox = ({ label, timestamp, isActive }: any) => {
  //   return (
  //     <Flex p={4}>
  //       <Box
  //         rounded={"lg"}
  //         p={4}
  //         h={"full"}
  //         border={2}
  //         className={`rounded-lg p-4 h-full border-2 ${
  //           isActive
  //             ? "border-blue-500 bg-blue-50"
  //             : "border-gray-200 bg-gray-50"
  //         }`}
  //       >
  //         <h3 className="font-semibold text-lg mb-2">{label}</h3>
  //         <p className="text-sm text-gray-600">
  //           Last detected:
  //           <br />
  //           {timestamp || "Never detected"}
  //         </p>
  //       </Box>
  //     </Flex>
  //   );
  // };

  // const statuses = [
  //   { label: "Normal", value: "normal" },
  //   { label: "Tired", value: "lelah" },
  //   { label: "Microsleep", value: "microsleep" },
  //   { label: "Macrosleep", value: "macrosleep" },
  // ];

  return (
    <>
      <Box p={6}>
        <Flex
          justify="space-between"
          align="center"
          flexDirection={isMobile ? "column" : "row"}
        >
          <VStack align="start" spacing={4}>
            <Heading size="lg">FATIGUE DETECTION</Heading>
          </VStack>
        </Flex>
      </Box>

      <VStack spacing={4} w="full" maxW="1200px" mx="auto">
        <Box
          w="full"
          borderWidth={1}
          borderRadius="lg"
          overflow="hidden"
          bg={"white"}
        >
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
                    facingMode: "user",
                  }}
                  style={{ width: "100%", maxWidth: "640px" }}
                />
                {/* Canvas untuk bounding box */}
                <canvas
                  ref={canvasRef}
                  style={{
                    position: "absolute",
                    width: "640px",
                    height: "480px",
                    pointerEvents: "none",
                  }}
                />
              </>
            ) : (
              <Box
                w="100%"
                maxW="640px"
                h="40px"
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
              colorScheme={isCameraActive ? "red" : "green"}
              onClick={toggleCamera}
            >
              {isCameraActive ? "Turn Off Camera" : "Turn On Camera"}
            </Button>
          </Flex>
        </Box>

        <Box w="full" borderWidth={1} borderRadius="lg" p={4} bg={"white"}>
          <Heading size="md" p={1}>
            ANALYTIC RESULT
          </Heading>
          <Text>
            Status:{" "}
            {fatigueDataArray[0]?.createdAt == "" ? "" : fatigueData.status}
          </Text>
          <Text>
            Terakhir Diperbarui:{" "}
            {fatigueDataArray[0]?.createdAt == ""
              ? ""
              : new Date(fatigueData.createdAt).toLocaleString("id-ID", {
                  timeZone: "Asia/Jakarta",
                })}
          </Text>
        </Box>

        <Box w="full" borderWidth={1} borderRadius="lg" p={4} bg={"white"}>
          <Heading size="md" p={1}>
            FATIGUE DATA LOG
          </Heading>
          {/* {statuses.map((status) => (
            <StatusBox
              key={status.value}
              label={status.label}
              // timestamp={getLatestTimestamp(status.value)}
              // isActive={currentStatus === status.value}
            />
          ))} */}

          {/* <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={
                fatigueDataArray[0]?.createdAt != "" ? fatigueDataArray : []
              }
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="createdAt"
                fill="#8884d8"
                name="Fatigue Time"
              />
            </LineChart>
          </ResponsiveContainer> */}
        </Box>
      </VStack>
    </>
  );
};

export default FatigueDetection;
