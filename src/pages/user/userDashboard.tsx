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
  // useMediaQuery
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
import React from "react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { crowdsUser, lastCrowdPerAreaUser, isLoading, isError } =
    useCrowdsByUser(user?.id || "");
  const { areasByUserId } = useAreasByUserId(user?.id || "");

  const bgCard = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  // const isMobile = useMediaQuery("(max-width: 768px)")[0];

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
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <VStack align="start" spacing={3} bg={"whiteAlpha.400"} padding={4}>
          <Heading className="label" size="sm">
            {label}
          </Heading>
          <p className="intro">{`Count : ${payload[0].value} People`}</p>
          <p className="Time">{`Time : ${payload[0].payload.createdAt}`}</p>
        </VStack>
      );
    }
  };

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
        <CardHeader>
          <Heading size="md">Latest Crowd Detection</Heading>
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

      {areasByUserId?.map((areasUser) => (
        <Card
          className="Crowd Detection Per Area"
          key={areasUser.id}
          bg={bgCard}
          borderColor={borderColor}
          borderWidth="1px"
          mb={4}
        >
          <CardHeader paddingBlockEnd={0}>
            <Heading size="md">{areasUser.name}</Heading>
            <Heading size="sm">CROWD DETECTION RESULT</Heading>
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

      <Card bg={bgCard} borderColor={borderColor} borderWidth="1px" mb={4}>
        <CardHeader paddingBlockEnd={0}>
          <Heading size="md">FATIGUE DETECTION RESULT</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={[1, 2, 4]} spacing={4}>
            <Card
              className="Normal"
              bg={bgCard}
              borderColor={borderColor}
              borderWidth="1px"
              mb={4}
            >
              <CardHeader paddingBlockEnd={0}>
                <Heading size="md">NORMAL</Heading>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
            <Card
              className="Open Mouth"
              bg={bgCard}
              borderColor={borderColor}
              borderWidth="1px"
              mb={4}
            >
              <CardHeader paddingBlockEnd={0}>
                <Heading size="md">MENGUAP</Heading>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
            <Card
              className="Close Eye"
              bg={bgCard}
              borderColor={borderColor}
              borderWidth="1px"
              mb={4}
            >
              <CardHeader paddingBlockEnd={0}>
                <Heading size="md">MICROSLEEP</Heading>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
            <Card
              className="Close Eye n Open Mouth"
              bg={bgCard}
              borderColor={borderColor}
              borderWidth="1px"
              mb={4}
            >
              <CardHeader paddingBlockEnd={0}>
                <Heading size="md">SANGAT LELAH</Heading>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
          </SimpleGrid>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default UserDashboard;
