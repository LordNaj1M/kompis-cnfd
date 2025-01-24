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
  // useMediaQuery
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useCrowds } from "../../hooks/useCrowd";
import { useAreas } from "../../hooks/useArea";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { crowds, lastCrowdPerArea, isLoading, isError } = useCrowds();
  const areas = useAreas();

  const bgCard = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  // const bgHover = useColorModeValue('gray.50', 'gray.600');
  // const labelColor = useColorModeValue('gray.600', 'gray.400');
  // const isMobile = useMediaQuery("(max-width: 768px)")[0];

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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Box p={6}>
        <VStack align="start" spacing={4}>
          <Heading size="lg">DASHBOARD ADMIN</Heading>
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
              data={lastCrowdPerArea}
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

      {areas?.areas.map((area) => (
        <Card
          className="Crowd Detection Per Area"
          key={area.id}
          bg={bgCard}
          borderColor={borderColor}
          borderWidth="1px"
          mb={4}
        >
          <CardHeader>
            <Heading size="md">{area.name}</Heading>
            <Heading size="sm">Crowd Detection Result</Heading>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={crowds
                  .filter((crowd) => crowd.area_id === area.id)
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
    </div>
  );
};

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

  return null;
};

export default AdminDashboard;
