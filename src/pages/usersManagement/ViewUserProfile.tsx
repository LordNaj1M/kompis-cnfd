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
    Flex,
    useColorModeValue,
    useMediaQuery,
  } from '@chakra-ui/react';
  import { useNavigate, useParams } from 'react-router-dom';
  import { useUserById } from '../../hooks/useUser';
  import { FiEdit2, FiUser } from 'react-icons/fi';
  import { RiLockPasswordLine } from 'react-icons/ri';
  
  const ViewUserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const bgCard = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const labelColor = useColorModeValue('gray.600', 'gray.400');
    const isMobile = useMediaQuery('(max-width: 768px)')[0];
  
    // Handle invalid userId
    if (!userId) {
      return (
        <Container centerContent py={10}>
          <VStack spacing={4}>
            <Text color="red.500">Invalid user ID.</Text>
            <Button onClick={() => navigate(-1)} colorScheme="blue">
              Go Back
            </Button>
          </VStack>
        </Container>
      );
    }
  
    // Fetch user data
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user, isLoading, isError } = useUserById(userId);
  
    const handleEditProfile = () => {
      navigate(`/admin/edit/${userId}`);
      console.log(`Edit Profile with ID: ${userId}`);
    };
  
    const handleChangePasswordProfile = () => {
      navigate(`/admin/change-password/${userId}`);
      console.log(`Change Password Profile with ID: ${userId}`);
    };
  
    const ProfileField = ({ label, value }: { label: string; value: string }) => (
      <Box>
        <Text fontSize="sm" color={labelColor} mb={1}>
          {label}
        </Text>
        <Text fontSize={isMobile ? 'md' : 'lg'} fontWeight="medium">
          {value}
        </Text>
      </Box>
    );
  
    if (isLoading) {
      return (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" thickness="4px" speed="0.65s" />
        </Flex>
      );
    }
  
    if (isError || !user || typeof user === 'string') {
      return (
        <Container centerContent py={10}>
          <VStack spacing={4}>
            <Text color="red.500">Error loading profile data...</Text>
            <Button leftIcon={<FiUser />} onClick={() => navigate(0)} colorScheme="blue">
              Retry
            </Button>
          </VStack>
        </Container>
      );
    }
  
    return (
      <Box p={isMobile ? 4 : 6}>
        <VStack align="stretch" spacing={6}>
          <Heading size="lg">PROFILE</Heading>
          <Card bg={bgCard} borderColor={borderColor} borderWidth="1px">
            <CardBody>
              <VStack spacing={6} align="stretch">
                <VStack spacing={4} align="stretch">
                  <ProfileField label="Email Address" value={user.email} />
                  <ProfileField label="Full Name" value={user.name} />
                  <ProfileField label="Role" value={user.role} />
                </VStack>
                <Flex
                  mt={4}
                  gap={4}
                  direction={isMobile ? 'column' : 'row'}
                  justify="flex-start"
                >
                  <Button
                    leftIcon={<FiEdit2 />}
                    variant="solid"
                    colorScheme="green"
                    size={isMobile ? 'md' : 'lg'}
                    width={isMobile ? 'full' : 'auto'}
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    leftIcon={<RiLockPasswordLine />}
                    variant="ghost"
                    colorScheme="black"
                    bg="gray"
                    color="white"
                    _hover={{ bg: 'gray.800' }}
                    size={isMobile ? 'md' : 'lg'}
                    width={isMobile ? 'full' : 'auto'}
                    onClick={handleChangePasswordProfile}
                  >
                    Change Password
                  </Button>
                </Flex>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    );
  };
  
  export default ViewUserProfile;
    