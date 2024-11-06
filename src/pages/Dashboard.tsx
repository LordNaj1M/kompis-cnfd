/*import { useEffect } from 'react';
import {
  Box,
  Button
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return(
    <Box>
      <Button
                onClick={logout}
                colorScheme="red"
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
    </Box>
  );
};
export default Dashboard;
*/

import {
  Text,
  Button,
  Container,
  Card,
  Spinner,
  VStack,
  CardBody
} from '@chakra-ui/react';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isLoading, isError } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Button
                onClick={logout}
                colorScheme="red"
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
      </Container>
    );
  }

  if (isError || !user) {
    return (
      <Container centerContent py={10}>
        <VStack spacing={4}>
          <Text>Error loading data...</Text>
          <Button onClick={() => navigate(0)}>Retry</Button>
          <Button
                onClick={logout}
                colorScheme="red"
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md mx-auto mt-8">
        <CardBody className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Role:</span> {user.role}
            </p>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={logout}
            className="w-full"
          >
            Logout
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;

/*
import { useEffect } from 'react';
import {
  Text,
  Box,
  Button
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return(
    <Box>
      <Text color="gray.600">Email: {userData.email || 'N/A'}</Text>
      <Text color="gray.600">Name: {userData.name || 'N/A'}</Text>
      <Text color="gray.600">Role: {userData.role || 'N/A'}</Text>
      <Button
                onClick={logout}
                colorScheme="red"
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
    </Box>
  );
};
export default Dashboard;
/*
import { useEffect } from 'react';
import {
  Container,
  Text,
  VStack,
  Spinner,
  useToast,
  Button,
  Box
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user, isLoading, isError } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Cek jika tidak ada token, redirect ke login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle error
  useEffect(() => {
    if (isError) {
      toast({
        title: 'Error',
        description: 'Failed to load user data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isError, toast]);

  useEffect(() => {
    console.log('Current user data:', user);
  }, [user]);

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Button
                onClick={logout}
                colorScheme="red"
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container centerContent py={10}>
        <VStack spacing={4}>
          <Text>Error loading data...</Text>
          <Button onClick={() => navigate(0)}>Retry</Button>
          <Button
                onClick={logout}
                colorScheme="red"
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Box>
      <Text>Welcome to the Dashboard</Text>
      <Text>Data: {user?.name}</Text>
      <Button mt={4} colorScheme="red" onClick={logout}>
        Logout
      </Button>
    </Box>
    /*<Container maxW="container.lg" py={10}>
      <VStack spacing={6} align="stretch">
        <Card>
          <CardHeader>
            <HStack spacing={4} justify="space-between">
              <HStack spacing={4}>
                <Avatar 
                  name={user?.name} 
                  size="lg"
                  bg="black"
                  color="white"
                />
                <VStack align="start" spacing={1}>
                  <Heading size="md">Welcome, {user?.name}</Heading>
                  <Text color="gray.600">{user?.email}</Text>
                  <Badge colorScheme={user?.role === 'admin' ? 'red' : 'green'}>
                    {user?.role}
                  </Badge>
                </VStack>
              </HStack>
              <Button
                onClick={logout}
                colorScheme="red"
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
            </HStack>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Your Account Details</Heading>
          </CardHeader>
          <Divider />
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text fontWeight="bold">User ID:</Text>
                <Text>{user?.id}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Name:</Text>
                <Text>{user?.name}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Email:</Text>
                <Text>{user?.email}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Role:</Text>
                <Badge colorScheme={user?.role === 'admin' ? 'red' : 'green'}>
                  {user?.role}
                </Badge>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {user?.role === 'admin' && (
          <Card>
            <CardHeader>
              <Heading size="md">Admin Panel</Heading>
            </CardHeader>
            <Divider />
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Button
                  onClick={() => navigate('/admin/users')}
                  colorScheme="blue"
                >
                  Manage Users
                </Button>
                <Button
                  onClick={() => navigate('/admin/settings')}
                  colorScheme="green"
                >
                  System Settings
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  );
};

export default Dashboard;
/*
// src/pages/Dashboard.tsx
import { useEffect } from 'react';
import { Box, Container, Heading, Text, VStack, HStack, Avatar, Spinner, useToast, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user, isLoading, isError } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Cek jika tidak ada token, redirect ke login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle error
  useEffect(() => {
    if (isError) {
      toast({
        title: 'Error',
        description: 'Gagal mengambil data user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isError, toast]);

  const handleLogout = () => {
    logout();
  };

  // Tampilkan loading
  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Button onClick={handleLogout}>
            Logout
          </Button>
      </Container>
    );
  }

  // Tampilkan error
  if (isError) {
    return (
      <Container centerContent py={10}>
        <Text>Error mengambil data...</Text>
        <Button onClick={handleLogout}>
            Logout
          </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Box bg="white" p={6} rounded="lg" shadow="md">
          <Button onClick={handleLogout}>
            Logout
          </Button>
          <HStack spacing={4}>
            <Avatar name={user?.name} size="lg" />
            <VStack align="start" spacing={1}>
              <Heading size="md">Selamat Datang, {user?.name}</Heading>
              <Text color="gray.600">{user?.email}</Text>
              <Text color="gray.500">Role: {user?.role}</Text>
            </VStack>
          </HStack>
        </Box>

        <Box bg="white" p={6} rounded="lg" shadow="md">
          <VStack align="start" spacing={4}>
            <Heading size="sm">Informasi Akun</Heading>
            <Box>
              <Text fontWeight="bold">ID:</Text>
              <Text>{user?.id}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Email:</Text>
              <Text>{user?.email}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Nama:</Text>
              <Text>{user?.name}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Role:</Text>
              <Text>{user?.role}</Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Dashboard;
/*
import { Box, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const Dashboard = () => {
  const navigate = useNavigate();
  
  const { data, error } = useSWR('http://localhost:5000/dashboard', fetcher);

  const handleLogout = () => {
    // Remove the JWT token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/');
  };

  if (error) return <Box>Error loading data<Button colorScheme="red" onClick={handleLogout}>Logout</Button></Box>;
  if (!data) return <Box>Loading...<Button colorScheme="red" onClick={handleLogout}>Logout</Button></Box>;

  return (
    <Box>
      <Text>Welcome to the Dashboard!</Text>
      <Text>{data.message}</Text>

      <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
    </Box>
  );
};

export default Dashboard;



/*
import { Box, Text, Button } from '@chakra-ui/react';  
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

//const fetcher = (url: string) => fetch(url).then(res => res.json());

const Dashboard = () => {
  //const { data, error } = useSWR('/api/dashboard', fetcher);

  //if (error) return <Box>Error loading data</Box>;
  //if (!data) return <Box>Loading...</Box>;

  const navigate = useNavigate();
  
  // Cek status login dari localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Jika belum login, arahkan ke halaman login
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    // Hapus status login dari localStorage
    localStorage.removeItem('isLoggedIn');
    // Arahkan ke halaman login
    navigate('/login');
  };

  return (
    <Box>
      <Text>Welcome to the Dashboard</Text>
      {/*<Text>Data: {JSON.stringify(data)}</Text>}
      <Button mt={4} colorScheme="red" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default Dashboard;
*/