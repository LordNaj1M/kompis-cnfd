import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useColorModeValue,
  Spinner,
  Text,
  Card,
  CardHeader,
  CardBody,
  Heading,
  HStack,
  Tooltip,
  VStack,
  Badge,
  Flex,
  useMediaQuery,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useUsers, deleteUserByAdmin } from '../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { HiOutlineInformationCircle } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UserManagementTable = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  const bgCard = useColorModeValue('white', 'gray.700');
  const bgHover = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  const { users, isLoading, isError } = useUsers();
  
  // Handle view profile user
  const handleViewUserProfile = (userId: string) => {
    navigate(`/admin/view/${userId}`);
  };

  // Handle edit user
  const handleEditUser = (userId: string) => {
    navigate(`/admin/edit/${userId}`);
  };

  // Handle delete user confirmation
  const handleDeleteUserConfirmation = (userId: string) => {
    setUserToDelete(userId);
    onOpen();
  };
  // Handle delete user
  const handleDeleteUser = () => {
    if (!userToDelete) return;

    // eslint-disable-next-line no-async-promise-executor
    const deleteUserPromise = new Promise(async (resolve, reject) => {
      try {
        await new Promise((res) => setTimeout(res, 2000));

        const success = await deleteUserByAdmin(userToDelete);
        if (success) {
          resolve(true);
          navigate(0);
        }
      } catch (error) {
        reject(error);
      }
    });
      
    toast.promise(deleteUserPromise, {
      loading: {title: 'Deleting User', description: 'Please wait while we delete User_' + userToDelete},
      success: {title: 'Delete User Successful', description: 'User_' + userToDelete + ' has been updated!', duration: 3000, isClosable: true},
      error: {title: 'Delete User Failed', description: 'An error occurred during delete User_' + userToDelete, duration: 5000, isClosable: true},
    });
    onClose();
  };

  // Action buttons component
  const ActionButtons = ({ user }: { user: User}) => (
    <HStack 
      spacing={2} 
      justify={isMobile ? "flex-start" : "center"}      
      display={user.role==="admin" ? "none" : "flex"}
    >
      <Tooltip label="View" placement="bottom">
        <IconButton
          aria-label="View profile"
          icon={<HiOutlineInformationCircle/>}
          fontSize="xl"
          colorScheme="blue"
          variant="ghost"
          size={isMobile ? "sm" : "md"}
          onClick={() => handleViewUserProfile(user.id)}
        />
      </Tooltip>
      <Tooltip label="Edit" placement="bottom">
        <IconButton
          aria-label="Edit user"
          icon={<CiEdit />}
          fontSize="xl"
          colorScheme="green"
          variant="ghost"
          size={isMobile ? "sm" : "md"}
          onClick={() => handleEditUser(user.id)}
        />
      </Tooltip>
      <Tooltip label="Delete" placement="bottom">
        <IconButton
          aria-label="Delete profile"
          icon={<RiDeleteBin5Line />}
          fontSize="xl"
          colorScheme="red"
          variant="ghost"
          size={isMobile ? "sm" : "md"}
          onClick={() => handleDeleteUserConfirmation(user.id)}
        />
      </Tooltip>  
    </HStack>
  );

  if (isError) {
    return (
      <Card bg={bgCard} borderColor={borderColor} borderWidth="1px">
        <CardHeader>
          <Heading size="lg">USER MANAGEMENT</Heading>
        </CardHeader>
        <CardBody>
          <Text color="red.500">Error loading users: {isError.message}</Text>
        </CardBody>
      </Card>
    );
  }

  // Mobile card view for each user
  const MobileUserCard = ({ user, index }: { user: User; index: number }) => (
    <Card 
      bg={bgCard} 
      borderColor={borderColor} 
      borderWidth="1px"
      mb={4}
      _hover={{ bg: bgHover }}
      transition="background 0.2s"
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color={labelColor}>#{index + 1}</Text>
            <Badge colorScheme={user.role === 'admin' ? 'purple' : 'blue'}>
              {user.role}
            </Badge>
          </Flex>
          
          <Box>
            <Text fontSize="sm" color={labelColor}>Name</Text>
            <Text fontWeight="medium">{user.name}</Text>
          </Box>
          
          <Box>
            <Text fontSize="sm" color={labelColor}>Email</Text>
            <Text fontWeight="medium">{user.email}</Text>
          </Box>
          
          <Flex justifyContent="flex-end">
            <ActionButtons user={user} />
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  );

  // Desktop table view
  const DesktopTable = () => (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th textAlign="center">Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users?.map((user, index) => (
            <Tr 
              key={user?.id}
              _hover={{ bg: bgHover }}
              transition="background 0.2s"
            >
              <Td>{index + 1}</Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Badge colorScheme={user.role === 'admin' ? 'purple' : 'blue'}>
                  {user.role}
                </Badge>
              </Td>
              <Td>
                <ActionButtons user={user} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <Box p={6}>
          <VStack align="start" spacing={4}>
            <Heading size="lg">USER MANAGEMENT</Heading>
          </VStack>
        </Box>
        <Card bg={bgCard} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            {isLoading ? (
              <Flex justify="center" align="center" minH="200px">
                <Spinner size="xl" />
              </Flex>
            ) : isMobile ? (
              <VStack spacing={4} align="stretch">
                {users?.map((user, index) => (
                  <MobileUserCard key={user.id} user={user} index={index} />
                ))}
              </VStack>
            ) : (
              <DesktopTable />
            )}
          </CardBody>
        </Card>
      </div>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete User
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleDeleteUser} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default UserManagementTable;