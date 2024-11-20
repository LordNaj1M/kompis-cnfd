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
  const { logout } = useAuth();
  const { user, isLoading, isError } = useUser();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.300', 'gray.700');

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
    <Box
      as="nav"
      position="sticky"
      top={0}
      bg={bgColor}
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
            fontSize="xl"
            fontWeight="bold"
          >
            AHLAN WA SAHLAN,&nbsp;
            <Box as="span" display={{ base: "block", md: "inline" }}>
              {user.name}!
            </Box>
          </Text>
        </HStack>

        <Menu>
          <MenuButton>
            <HStack spacing={3}>
              <Box 
                border={location.pathname === '/profile' || location.pathname === '/configuration' ? "5px solid" : "none"}
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
              to={'/configuration'}
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
              onClick={logout}
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