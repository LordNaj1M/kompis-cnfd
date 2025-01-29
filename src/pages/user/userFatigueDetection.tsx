// pages/FatigueDetection.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Center,
  useMediaQuery,
  Card,
  CardHeader,
  useColorModeValue,
  CardBody,
  SimpleGrid,
  Container,
  Spinner,
} from "@chakra-ui/react";
import Webcam from "react-webcam";
import { socket } from "../../lib/socket";
import { useUser } from "../../hooks/useUser";
import React from "react";

interface FatigueResult {
  detection_data: Detection_Data[];
  status: string;
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

const UserFatigueDetection = () => {
  const { user } = useUser();
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);

  const bgCard = useColorModeValue("white", "gray.700");
  const bgCardChild = useColorModeValue("gray.50", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  const [fatigueData, setFatigueData] = useState<FatigueResult>({
    detection_data: [],
    status: "",
    createdAt: "",
  });

  const [normalStatus, setNormalStatus] = useState({
    status: "",
    createdAt: "",
  });
  const [menguapStatus, setMenguapStatus] = useState({
    status: "",
    createdAt: "",
  });
  const [microsleepStatus, setMicrosleepStatus] = useState({
    status: "",
    createdAt: "",
  });
  const [sangatLelahStatus, setSangatLelahStatus] = useState({
    status: "",
    createdAt: "",
  });

  useEffect(() => {
    switch (fatigueData.status) {
      case "Normal":
        setNormalStatus(fatigueData);
        break;
      case "Open Mouth":
        setMenguapStatus(fatigueData);
        break;
      case "Close Eye":
        setMicrosleepStatus(fatigueData);
        break;
      case "Open Mouth and Close Eye":
        setSangatLelahStatus(fatigueData);
        break;
    }
  }, [fatigueData]);

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
        socket.emit("io-fatigue-frame", frame, user?.id ?? "");
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
        setFatigueData({
          detection_data: [],
          status: "",
          createdAt: "",
        });
      };
    }
  }, [isCameraActive]);

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

      // Cleanup function to cancel animation frame
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [isCameraActive, fatigueData, drawBoundingBoxes]);

  return (
    <React.Fragment>
      <Box p={6}>
        <VStack align="start" spacing={4}>
          <Heading size="lg">FATIGUE DETECTION</Heading>
        </VStack>
      </Box>

      <Card bg={bgCard} borderColor={borderColor} borderWidth="1px" mb={4}>
        <CardHeader paddingBlockEnd={0}>
          <Heading size={isMobile ? "sm" : "md"}>CAMERA</Heading>
        </CardHeader>
        <CardBody>
          <Center position="relative">
            {isCameraActive ? (
              <React.Fragment>
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
              </React.Fragment>
            ) : (
              <Box
                w="100%"
                maxW="640px"
                h="40px"
                bg={borderColor}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={"black"}
              >
                <Text>Kamera tidak aktif</Text>
              </Box>
            )}
          </Center>
          <SimpleGrid
            columns={[1]}
            p={4}
            spacing={4}
            width={"100%"}
            placeItems="center"
          >
            <Text size={"md"}>
              * Tunjukkan wajah Anda, hanya Anda; terlihat jelas tanpa halangan,
              bayangan, dan dengan pencahayaan yang baik serta latar belakang
              netral.
            </Text>
            <Button
              colorScheme={isCameraActive ? "red" : "green"}
              onClick={toggleCamera}
            >
              {isCameraActive ? "Turn Off Camera" : "Turn On Camera"}
            </Button>
          </SimpleGrid>
        </CardBody>
      </Card>

      <Card bg={bgCard} borderColor={borderColor} borderWidth="1px" mb={4}>
        <CardHeader paddingBlockEnd={0}>
          <Heading size={isMobile ? "sm" : "md"}>ANALYTIC RESULT</Heading>
        </CardHeader>
        {isCameraActive && fatigueData?.createdAt == "" ? (
          <Container centerContent py={10}>
            <Spinner size="xl" />
          </Container>
        ) : (
          <CardBody>
            <Text>
              Status: {fatigueData?.createdAt == "" ? "" : fatigueData.status}
            </Text>
            <Text>
              Terakhir Diperbarui:{" "}
              {fatigueData?.createdAt == ""
                ? ""
                : new Date(fatigueData.createdAt).toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                  })}
            </Text>
          </CardBody>
        )}
      </Card>

      <Card bg={bgCard} borderColor={borderColor} borderWidth="1px" mb={4}>
        <CardHeader paddingBlockEnd={0}>
          <Heading size={isMobile ? "sm" : "md"}>FATIGUE DATA LOG</Heading>
        </CardHeader>
        {isCameraActive && fatigueData?.createdAt == "" ? (
          <Container centerContent py={10}>
            <Spinner size="xl" />
          </Container>
        ) : (
          <CardBody>
            <SimpleGrid columns={[1, 2, 4]} spacing={4}>
              <Card
                className="Normal"
                bg={bgCardChild}
                borderColor={borderColor}
                borderWidth="1px"
                mb={4}
              >
                <CardHeader paddingBlockEnd={0}>
                  <Heading size={isMobile ? "sm" : "md"}>NORMAL</Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    Last Detected:{" "}
                    {fatigueData?.createdAt == ""
                      ? ""
                      : normalStatus.createdAt
                      ? new Date(normalStatus.createdAt).toLocaleString(
                          "id-ID",
                          {
                            timeZone: "Asia/Jakarta",
                          }
                        )
                      : "No Data"}
                  </Text>
                </CardBody>
              </Card>
              <Card
                className="Open Mouth"
                bg={bgCardChild}
                borderColor={borderColor}
                borderWidth="1px"
                mb={4}
              >
                <CardHeader paddingBlockEnd={0}>
                  <Heading size={isMobile ? "sm" : "md"}>MENGUAP</Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    Last Detected:{" "}
                    {fatigueData?.createdAt == ""
                      ? ""
                      : menguapStatus.createdAt
                      ? new Date(menguapStatus.createdAt).toLocaleString(
                          "id-ID",
                          {
                            timeZone: "Asia/Jakarta",
                          }
                        )
                      : "No Data"}
                  </Text>
                </CardBody>
              </Card>
              <Card
                className="Close Eye"
                bg={bgCardChild}
                borderColor={borderColor}
                borderWidth="1px"
                mb={4}
              >
                <CardHeader paddingBlockEnd={0}>
                  <Heading size={isMobile ? "sm" : "md"}>MICROSLEEP</Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    Last Detected:{" "}
                    {fatigueData?.createdAt == ""
                      ? ""
                      : microsleepStatus.createdAt
                      ? new Date(microsleepStatus.createdAt).toLocaleString(
                          "id-ID",
                          {
                            timeZone: "Asia/Jakarta",
                          }
                        )
                      : "No Data"}
                  </Text>
                </CardBody>
              </Card>
              <Card
                className="Close Eye n Open Mouth"
                bg={bgCardChild}
                borderColor={borderColor}
                borderWidth="1px"
                mb={4}
              >
                <CardHeader paddingBlockEnd={0}>
                  <Heading size={isMobile ? "sm" : "md"}>SANGAT LELAH</Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    Last Detected:{" "}
                    {fatigueData?.createdAt == ""
                      ? ""
                      : sangatLelahStatus.createdAt
                      ? new Date(sangatLelahStatus.createdAt).toLocaleString(
                          "id-ID",
                          {
                            timeZone: "Asia/Jakarta",
                          }
                        )
                      : "No Data"}
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </CardBody>
        )}
      </Card>
    </React.Fragment>
  );
};

export default UserFatigueDetection;
