import {
  Text,
  Button,
  Container,
  Card,
  Spinner,
  VStack,
  CardBody,
  Box,
  Heading
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading, isError } = useUser();

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (isError || !user) {
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
          <Heading size="lg">DASHBOARD</Heading>
          <Text>Assalamualaikum Dashboard</Text>
        </VStack>
      </Box>
      <Card className="max-w-md mx-auto mt-8">
        <CardBody className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Email: {user.email}</span> 
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Name: {user.name}</span> 
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Role: {user.role}</span> 
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;