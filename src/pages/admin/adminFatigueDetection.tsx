// src/pages/admin/adminFatigueDetection.tsx
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
import { useNavigate } from "react-router-dom";
import { useUsers } from "../../hooks/useUser";
import { useFatigueSortByUserId } from "../../hooks/useFatigue";
import React from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface UserFatigueCardProps {
  user: User;
}

const UserFatigueCard: React.FC<UserFatigueCardProps> = ({ user }) => {
  const bgCard = useColorModeValue("white", "gray.700");
  const bgCardChild = useColorModeValue("gray.50", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  const {
    normalStatusByUser,
    menguapStatusByUser,
    microsleepStatusByUser,
    sangatLelahStatusByUser,
  } = useFatigueSortByUserId(user.id);

  return (
    <Card
      className="Detection Data Per User"
      bg={bgCard}
      borderColor={borderColor}
      borderWidth="1px"
      mb={4}
    >
      <CardHeader paddingBlockEnd={0}>
        <Heading size="md">DATA RESULT {user.email}</Heading>
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
  );
};

const AdminFatigueDetection = () => {
  const navigate = useNavigate();
  const { users, isLoading, isError } = useUsers();

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (isError || !users) {
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
    <React.Fragment>
      <Box p={6}>
        <VStack align="start" spacing={4}>
          <Heading size="lg">FATIGUE DETECTION</Heading>
        </VStack>
      </Box>

      {users
        .filter((user: User) => user.role === "user")
        .map((user: User) => (
          <UserFatigueCard key={user.id} user={user} />
        ))}
    </React.Fragment>
  );
};

export default AdminFatigueDetection;
