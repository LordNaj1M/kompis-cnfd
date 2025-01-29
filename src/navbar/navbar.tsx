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
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSidenav } from "./sidenav";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import LogoAnaheim from "./../assets/logo-anaheim.svg";
import { FiMenu } from "react-icons/fi";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

export function Navbar() {
  const { onOpen } = useSidenav();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user, isLoading, isError } = useUser();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.300", "gray.700");

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const logoutPromise = logout();
      toast.promise(logoutPromise, {
        loading: {
          title: "Logging out",
          description: "Please wait while we log you out.",
        },
        success: {
          title: "Logout Successful",
          description: "See you back!",
          duration: 1000,
          isClosable: true,
          onCloseComplete() {
            navigate("/login");
          },
        },
        error: (error) => ({
          title: "Logout Failed",
          description: "An error occurred during logout: " + error,
          duration: 5000,
          isClosable: true,
        }),
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: `An error occurred during logout: ${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
        <Button onClick={handleLogout} colorScheme="red">
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
          <Button onClick={handleLogout} colorScheme="red">
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
      bg={bgColor}
      borderColor={borderColor}
      zIndex="sticky"
    >
      <Flex px={4} h={16} alignItems="center" justifyContent="space-between">
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
            icon={<Image src={LogoAnaheim} boxSize="45px" />}
            variant="ghost"
          />
          <Text fontSize={{ base: "md", md: "2xl" }} fontWeight="bold">
            AHLAN WA SAHLAN, {user.name}!
          </Text>
        </HStack>

        <Flex alignItems="center">
          <IconButton
            aria-label="Toggle Dark Mode"
            icon={
              colorMode === "light" ? (
                <MdOutlineDarkMode />
              ) : (
                <MdOutlineLightMode />
              )
            }
            onClick={toggleColorMode}
            variant="outline"
            isRound
            _hover={{ bg: "teal.500", color: "white" }}
            _active={{ bg: "teal.600", color: "white" }}
          />
          <Menu>
            <MenuButton ml={4}>
              <HStack spacing={3}>
                <Box
                  border={
                    location.pathname.startsWith("/profile")
                      ? "5px solid"
                      : "none"
                  }
                  borderRadius="3xl"
                  borderColor="orange.500"
                >
                  <Avatar size="sm" name={user.name} bg="cyan.500" />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem
                as={NavLink}
                to={"/profile"}
                // _focus={{ bg: "gray.100" }}
                // _hover={{ bg: "gray.200" }}
                _activeLink={{ bg: "orange.500", color: "white" }}
                w="full"
                borderRadius="2xl"
              >
                Profile
              </MenuItem>
              <MenuItem
                // _hover={{ bg: "gray.200" }}
                w="full"
                borderRadius="2xl"
                onClick={handleLogout}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}

//Reference : https://dev.to/gauravsoni119/mastering-sidenav-with-chakra-ui-4enl
