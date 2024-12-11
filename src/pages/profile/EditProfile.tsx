// src/pages/profile/EditProfile.tsx
import { useEffect, useState } from 'react';
import { 
  Text, 
  Box, 
  Button, 
  Card, 
  CardBody, 
  Container, 
  FormControl, 
  FormLabel, 
  Heading, 
  Input, 
  Spinner, 
  Stack, 
  useColorModeValue, 
  useToast, 
  VStack, 
  useMediaQuery, 
  Flex, 
  Select
} from '@chakra-ui/react';
import { useUser, editProfile } from '../../hooks/useUser';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, isLoading, isError} = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const isMobile = useMediaQuery('(max-width: 768px)')[0];

  useEffect(() => { 
    if (user) { 
        setEmail(user.email); 
        setName(user.name);
    } 
  }, [user]);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name !== user?.name || email !== user?.email) {
      try {
          const updatePromise = editProfile({ name, email });
          toast.promise(updatePromise, {
            loading: {title: 'Updating', description: 'Please wait while we update your profile data.',},
            success: {title: 'Edit Profile Successful', description: 'Your profile data has been updated!', duration: 1000, isClosable: true, onCloseComplete() {navigate('/profile')},},
            error: (error) => ({title: 'Edit Profile Failed', description: 'An error occurred during edit profile: ' + error, duration: 5000, isClosable: true}),
          });
        } catch (error) {
          toast({
            title: 'Edit Profile Failed',
            description: `An error occurred during edit profile: ${error}`,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
    } else {
      toast({
        title: 'Edit Profile Failed',
        description: 'You enter the same data, no need to update!',
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
          <Heading size="lg">EDIT PROFILE</Heading>
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
          <form onSubmit={handleUpdate} name='editForm'>
            <Stack spacing={4}>
              <FormControl>
              <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={user?.email}
                    required
                    autoComplete="email"
                />
              </FormControl>

              <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={user?.name}
                required
              />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Role</FormLabel>
                <Select
                  disabled={true}
                  placeholder={user?.role}
                >
                </Select>
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
                  onClick={()=>navigate('/profile')}
                >
                  Cancel
                </Button>
                )}
                <Button
                  type="submit"
                  colorScheme="green"
                  color="white"
                  size={isMobile ? 'md' : 'lg'}
                  width={isMobile ? 'full' : 'auto'}
                >
                  Update
                </Button>
                {isMobile && (
                <Button
                  bg="gray"
                  color="white"
                  _hover={{ bg: 'gray.800' }}
                  size={isMobile ? 'md' : 'lg'}
                  width={isMobile ? 'full' : 'auto'}
                  onClick={()=>navigate('/profile')}
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

export default EditProfile;