import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  useColorModeValue,
  HStack,
  Image,
  Container,
  Button,
  Spinner,
  useToast,
  VStack
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSidenav } from "./sidenav";
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import LogoAnaheim from "./../assets/logo-anaheim.svg";
import { FiMenu } from 'react-icons/fi';

export function Navbar() {
  const { onOpen } = useSidenav();
  const navigate = useNavigate();
  const { logout, error } = useAuth();
  const { user, isLoading, isError } = useUser();
  const toast = useToast();

  const borderColor = useColorModeValue('gray.300', 'gray.700');

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line no-async-promise-executor
    const logoutPromise = new Promise(async (resolve, reject) => {
      try {
        // Simulasi delay 2 detik untuk proses logout
        await new Promise((res) => setTimeout(res, 2000));

        const success = await logout(); // Panggil fungsi logout dari useAuth
        if (success) {
          resolve(true);
        } else {
          reject(error);
        }
      } catch (error) {
        reject(error);
      }
    });

    // const logoutPromise = () => {
    //   return new Promise<boolean>((resolve, reject) => {
    //     // Gunakan IIFE async untuk menjalankan async logic
    //     (async () => {
    //       try {
    //         await new Promise((res) => setTimeout(res, 2000));
    //         logout();
    //         resolve(true);
    //       } catch (err) {
    //         reject(err);
    //       }
    //     })();
    //   });
    // };
  
    // Menampilkan toast selama proses logout
    toast.promise(logoutPromise, {
      loading: {title: 'Logging out', description: 'Please wait while we log you out.',},
      success: {title: 'Logout Successful', description: 'See you back!', duration: 3000, isClosable: true},
      error: {title: 'Logout Failed', description: 'An error occurred during logout: ' + error, duration: 5000, isClosable: true},
    });
  };

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Button
          onClick={handleLogout}
          colorScheme="red"
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
            onClick={handleLogout}
            colorScheme="red"
          >
            Logout
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex="sticky"
    >
      <Flex
        px={4}
        h={16}
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton    
            aria-label="menu"
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            icon={<FiMenu />}
            variant="ghost"
          />
        <HStack spacing={4}>          
          <IconButton    
            aria-label="menu"
            display={{ base: "flex", md: "none" }}
            icon={<Image src={LogoAnaheim} boxSize='45px'/>}
            variant="ghost"
          />
          <Text
            fontSize={{ base: "md", md: "2xl" }}
            fontWeight="bold"
          >
            AHLAN WA SAHLAN, {user.name}!
          </Text>
        </HStack>

        <Menu>
          <MenuButton>
            <HStack spacing={3}>
              <Box 
                border={['/profile', '/admin/configuration', '/profile/edit', '/profile/change-password'].includes(location.pathname) ? "5px solid" : "none"}
                borderRadius="3xl"
                borderColor='orange.500'
              >
                <Avatar
                  size="sm"
                  name={user.name}
                  bg="cyan.500"
                />
              </Box> 
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem
              as={NavLink}
              to={'/profile'}
              _focus={{ bg: "gray.100" }}
              _hover={{ bg: "gray.200" }}
              _activeLink={{ bg: "orange.500", color: "white" }}
              w="full"
              borderRadius="2xl"
            >
              Profile
            </MenuItem>
            <MenuItem
              as={NavLink}
              to={'/admin/configuration'}
              _focus={{ bg: "gray.100" }}
              _hover={{ bg: "gray.200" }}
              _activeLink={{ bg: "orange.500", color: "white" }}
              w="full"
              borderRadius="2xl"
              display={user.role==="admin" ? "flex" : "none"}
            >
              Configuration
            </MenuItem>
            <MenuItem
              _hover={{ bg: "gray.200" }}
              w="full"
              borderRadius="2xl"
              onClick={handleLogout}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}

//Reference : https://dev.to/gauravsoni119/mastering-sidenav-with-chakra-ui-4enl