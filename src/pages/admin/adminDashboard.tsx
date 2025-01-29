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
  BarChart,
  Bar,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useCrowds } from "../../hooks/useCrowd";
import { useFatigues } from "../../hooks/useFatigue";
import React from "react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { crowds, lastCrowdPerArea, isLoading, isError } = useCrowds();
  const { lastFatiguePerUser } = useFatigues();

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

  if (isError || !crowds) {
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
  function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
      return (
        <Box className="custom-tooltip">
          <Heading
            className="label"
            size={isMobile ? "sm" : "md"}
          >{`${label}`}</Heading>
          <Text
            className="status"
            fontSize="lg"
          >{`Status: ${payload[0].payload?.status}`}</Text>
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
              data={lastCrowdPerArea || []}
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
        className="Latest Fatigue Detection"
        bg={bgCard}
        borderColor={borderColor}
        borderWidth="1px"
        mb={4}
      >
        <CardHeader paddingBlockEnd={0}>
          <Heading size="md">LATEST FATIGUE DETECTION</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={[1, 2, 4]} spacing={4}>
            {lastFatiguePerUser.map((fatigueUser) => (
              <Card
                className="Latest Fatigue User Detection"
                key={fatigueUser.id}
                bg={bgCardChild}
                borderColor={borderColor}
                borderWidth="1px"
                mb={4}
              >
                <CardHeader paddingBlockEnd={0}>
                  <Heading size="md">{fatigueUser.userEmail}</Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    Detected:{" "}
                    {fatigueUser.createdAt !== ""
                      ? fatigueUser.status
                      : "No Data"}
                  </Text>
                  <Text>
                    Last Detected:{" "}
                    {fatigueUser.createdAt !== ""
                      ? fatigueUser.createdAt
                      : "No Data"}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default AdminDashboard;
