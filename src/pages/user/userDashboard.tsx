// src/pages/Dashboard.tsx
import {
  Text,
  Button,
  Container,
  Card,
  Spinner,
  VStack,
  CardBody,
  Box,
  Heading,
  useColorModeValue,
  CardHeader,
  SimpleGrid,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useCrowdsByUser } from "../../hooks/useCrowd";
import { useAreasByUserId } from "../../hooks/useArea";
import { useUser } from "../../hooks/useUser";
import { useFatigueSortByUserId } from "../../hooks/useFatigue";
import React from "react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { crowdsUser, lastCrowdPerAreaUser, isLoading, isError } =
    useCrowdsByUser(user?.id || "");
  const { areasByUserId } = useAreasByUserId(user?.id || "");
  const {
    normalStatusByUser,
    menguapStatusByUser,
    microsleepStatusByUser,
    sangatLelahStatusByUser,
  } = useFatigueSortByUserId(user?.id || "");

  const bgCard = useColorModeValue("white", "gray.700");
  const bgCardChild = useColorModeValue("gray.50", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (isError || !crowdsUser) {
    return (
      <Container centerContent py={10}>
        <VStack spacing={4}>
          <Text>Error loading data...</Text>
          <Button onClick={() => navigate(0)}>Retry</Button>
        </VStack>
      </Container>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
      return (
        <Box className="custom-tooltip">
          <Heading
            className="status"
            size={isMobile ? "sm" : "md"}
          >{`${payload[0].payload?.status}`}</Heading>
          <Text className="count" fontSize={isMobile ? "md" : "lg"}>{`Count : ${
            payload[0].value
          } People${payload[0].payload?.count > 1 ? "s" : ""}`}</Text>
          <Text
            className="time"
            fontSize={isMobile ? "md" : "lg"}
          >{`Time: ${payload[0].payload?.createdAt}`}</Text>
        </Box>
      );
    }
    return null;
  }

  return (
    <React.Fragment>
      <Box p={6}>
        <VStack align="start" spacing={4}>
          <Heading size="lg">DASHBOARD</Heading>
        </VStack>
      </Box>

      <Card
        className="Latest Crowd Detection"
        bg={bgCard}
        borderColor={borderColor}
        borderWidth="1px"
        mb={4}
      >
        <CardHeader paddingBlockEnd={0}>
          <Heading size="md">LATEST CROWD DETECTION</Heading>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={lastCrowdPerAreaUser || []}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="areaName" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Crowd Area Count" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card
        className="Fatigue Detection Result"
        bg={bgCard}
        borderColor={borderColor}
        borderWidth="1px"
        mb={4}
      >
        <CardHeader paddingBlockEnd={0}>
          <Heading size="md">FATIGUE DETECTION RESULT</Heading>
        </CardHeader>
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
                  {normalStatusByUser.createdAt
                    ? normalStatusByUser.createdAt
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
                  {menguapStatusByUser.createdAt
                    ? menguapStatusByUser.createdAt
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
                  {microsleepStatusByUser.createdAt
                    ? microsleepStatusByUser.createdAt
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
                  {sangatLelahStatusByUser.createdAt
                    ? sangatLelahStatusByUser.createdAt
                    : "No Data"}
                </Text>
              </CardBody>
            </Card>
          </SimpleGrid>
        </CardBody>
      </Card>

      <Card
        className="Crowd Detection Data"
        bg={bgCard}
        borderColor={borderColor}
        borderWidth="1px"
        mb={4}
      >
        <CardHeader paddingBlockEnd={0}>
          <Heading size="md">CROWD DETECTION RESULT</Heading>
        </CardHeader>
        <CardBody>
          {areasByUserId?.map((areasUser) => (
            <Card
              className="Crowd Detection Per Area"
              key={areasUser.id}
              bg={bgCardChild}
              borderColor={borderColor}
              borderWidth="1px"
              mb={4}
            >
              <CardHeader paddingBlockEnd={0}>
                <Heading size="md">{areasUser.name}</Heading>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={crowdsUser
                      .filter((crowd) => crowd.area_id === areasUser.id)
                      .slice(0, 10)
                      .reverse()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="createdAt" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      fill="#8884d8"
                      name="Crowd Area Count"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          ))}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default UserDashboard;
