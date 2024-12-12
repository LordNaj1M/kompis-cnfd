// src/pages/profile/ChangeUserPassword.tsx
import { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardBody, 
  FormControl, 
  FormLabel, 
  Heading, 
  Input, 
  Stack, 
  useColorModeValue, 
  useToast, 
  VStack, 
  useMediaQuery, 
  Flex,
  Container,
  Spinner,
  Text,
  Divider
} from '@chakra-ui/react';
import { editPasswordByAdmin, useUserById } from '../../hooks/useUser';
import { useNavigate, useParams } from 'react-router-dom';

const ChangeUserPassword = () => {
  const { userId } = useParams();
  const { user, isLoading, isError } = useUserById(userId || '');
  const navigate = useNavigate();
  const toast = useToast();

  const [passwordAdmin, setPasswordAdmin] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [newUserPassword, setNewPassword] = useState('');

  const cardBg = useColorModeValue('white', 'gray.800');
  const isMobile = useMediaQuery('(max-width: 768px)')[0];

  useEffect(() => {
    if (!userId) {
      <Container centerContent py={10}>
        <VStack spacing={4}>
          <Text>Invalid user ID.</Text>
          <Button onClick={() => navigate(-1)} colorScheme="red">
            Go Back
          </Button>
        </VStack>
      </Container>
    }
  }, [userId, navigate]);

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
      </Container>
    );
  }
  
  if (isError || !user || typeof user === 'string') {
    return (
        <Container centerContent py={10}>
          <VStack spacing={4}>
            <Text>Error loading data...</Text>
            <Button onClick={() => navigate(0)}>Retry</Button>
          </VStack>
        </Container>
    );
  }
  
  const handleChangeUserPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordInput === newUserPassword) {
      try {
        const changeUserPasswordPromise = editPasswordByAdmin(user?.id, { passwordAdmin, newUserPassword });
        toast.promise(changeUserPasswordPromise, {
          loading: { title: 'Updating User Password', description: `Please wait while we update the User's new password.` },
          success: { title: 'Change User Password Success', description: `The User's new password has been successfully updated!`, duration: 1000, isClosable: true, onCloseComplete() {navigate(`/admin/users-management/view/${user?.id}`)},},
          error: (error) => ({ title: 'Change User Password Failed', description: 'An error occurred while updating the password: ' + error, duration: 5000, isClosable: true}),
      });
      } catch (error) {
        toast({
          title: 'Change User Password Failed',
          description: `An error occurred: ${error}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }        
    } else {
      toast({
        title: 'Change Password Failed',
        description: `The User's new password you retyped is not the same!`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={6} p={4} w="full" maxW="1200px" mx="auto">
      <Box p={6}>
        <VStack align="start" spacing={4}>
          <Heading size={isMobile ? 'md' : 'lg'} textAlign="center">
            CHANGE PASSWORD USER_{user?.email}
          </Heading>
        </VStack>
      </Box>
      <Card 
        maxW="450px" 
        w="full" 
        boxShadow="xl" 
        borderRadius="xl" 
        bg={cardBg}
        overflow="hidden"
      >
        <CardBody p={[4, 6, 8]}>
          <form onSubmit={handleChangeUserPassword} name='editForm'>
            <Stack spacing={4}>
            <FormControl>
              <FormLabel>Admin Password</FormLabel>
                <Input
                    type="password"
                    value={passwordAdmin}
                    onChange={(e) => setPasswordAdmin(e.target.value)}
                    placeholder="Enter Admin Password"
                    required
                />
              </FormControl>

              <Divider borderColor="blackAlpha.900"/>

              <FormControl>
              <FormLabel>New Password</FormLabel>
                <Input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter the User's new password"
                    required
                />
              </FormControl>

              <FormControl>
              <FormLabel>Retype New Password</FormLabel>
                <Input
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Retype the User's new password"
                    required
                />
              </FormControl>

              <Flex
                mt={4}
                gap={4}
                direction={isMobile ? 'column' : 'row'}
                justify="center"
              >
                {!isMobile && (
                <Button
                  bg="gray"
                  color="white"
                  _hover={{ bg: 'gray.800' }}
                  size={isMobile ? 'md' : 'lg'}
                  width={isMobile ? 'full' : 'auto'}
                  onClick={()=>navigate(`/admin/users-management/view/${user?.id}`)}
                >
                  Cancel
                </Button>
                )}
                <Button
                  type="submit"
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: 'blue.800' }}
                  size={isMobile ? 'md' : 'lg'}
                  width={isMobile ? 'full' : 'auto'}
                >
                  Change
                </Button>
                {isMobile && (
                <Button
                  bg="gray"
                  color="white"
                  _hover={{ bg: 'gray.800' }}
                  size={isMobile ? 'md' : 'lg'}
                  width={isMobile ? 'full' : 'auto'}
                  onClick={()=>navigate(`/admin/users-management/view/${user?.id}`)}
                >
                  Cancel
                </Button>
                )}
              </Flex>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default ChangeUserPassword;