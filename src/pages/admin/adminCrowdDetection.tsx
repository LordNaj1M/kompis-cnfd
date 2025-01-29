// src/pages/admin/adminCrowdDetection.tsx
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
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useCrowds } from "../../hooks/useCrowd";
import { useAreas } from "../../hooks/useArea";
import { useUsers } from "../../hooks/useUser";
import React from "react";

const AdminCrowdDetection = () => {
  const navigate = useNavigate();
  const { crowds, isLoading, isError } = useCrowds();
  const { users } = useUsers();
  const { areas } = useAreas();

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
          <Heading size="lg">CROWD DETECTION</Heading>
        </VStack>
      </Box>

      {users
        .filter((user) => user.role === "user")
        .map((user) => (
          <Card
            className="Crowd Detection Data Per User"
            key={user.id}
            bg={bgCard}
            borderColor={borderColor}
            borderWidth="1px"
            mb={4}
          >
            <CardHeader paddingBlockEnd={0}>
              <Heading size="md">DATA RESULT {user.email}</Heading>
            </CardHeader>
            <CardBody>
              {areas
                ?.filter((area) => area.user_id === user.id)
                .map((area) => (
                  <Card
                    className="Crowd Detection Per User Per Area"
                    key={area.id}
                    bg={bgCardChild}
                    borderColor={borderColor}
                    borderWidth="1px"
                    mb={4}
                  >
                    <CardHeader paddingBlockEnd={0}>
                      <Heading size="md">{area.name}</Heading>
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
            </CardBody>
          </Card>
        ))}
    </React.Fragment>
  );
};

export default AdminCrowdDetection;
