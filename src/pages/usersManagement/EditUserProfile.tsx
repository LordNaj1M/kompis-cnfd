// src/pages/profile/EditUserProfile.tsx
import { useEffect, useState } from "react";
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
  Select,
  Divider,
} from "@chakra-ui/react";
import { editProfileByAdmin, useUserById } from "../../hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";

const EditUserProfile = () => {
  const { userId } = useParams();
  const { user, isLoading, isError } = useUserById(userId || "");
  const navigate = useNavigate();
  const toast = useToast();

  const [passwordAdmin, setPasswordAdmin] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const cardBg = useColorModeValue("white", "gray.800");
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (!userId) {
      <Container centerContent py={10}>
        <VStack spacing={4}>
          <Text>Invalid user ID.</Text>
          <Button onClick={() => navigate(-1)} colorScheme="red">
            Go Back
          </Button>
        </VStack>
      </Container>;
    }
  }, [userId, navigate]);

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (isError || !user || typeof user === "string") {
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
        const updatePromise = editProfileByAdmin(user?.id, {
          passwordAdmin,
          name,
          email,
        });
        toast.promise(updatePromise, {
          loading: {
            title: "Updating",
            description: "Please wait while we update User profile data.",
          },
          success: {
            title: "Edit User Profile Successful",
            description: "User profile data has been updated!",
            duration: 1000,
            isClosable: true,
            onCloseComplete() {
              navigate(`/admin/users-management/view/${user?.id}`);
            },
          },
          error: (error) => ({
            title: "Edit User Profile Failed",
            description: "An error occurred during edit User profile: " + error,
            duration: 5000,
            isClosable: true,
          }),
        });
      } catch (error) {
        toast({
          title: "Edit User Profile Failed",
          description: `An error occurred during edit User profile: ${error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Edit User Profile Failed",
        description: "You enter the same data, no need to update!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={6} p={4} w="full" maxW="1200px" mx="auto">
      <Box p={6}>
        <VStack align="start" spacing={4}>
          <Heading size="lg">EDIT USER PROFILE</Heading>
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
          <form onSubmit={handleUpdate} name="editForm">
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

              <Divider borderColor="blackAlpha.900" />

              <FormControl>
                <FormLabel>User Email</FormLabel>
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
                <FormLabel>User Name</FormLabel>
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
                <Select disabled={true} placeholder={user?.role}></Select>
              </FormControl>

              <Flex
                mt={4}
                gap={4}
                direction={isMobile ? "column" : "row"}
                justify="center"
              >
                {!isMobile && (
                  <Button
                    bg="gray"
                    color="white"
                    _hover={{ bg: "gray.800" }}
                    size={isMobile ? "md" : "lg"}
                    width={isMobile ? "full" : "auto"}
                    onClick={() =>
                      navigate(`/admin/users-management/view/${user?.id}`)
                    }
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  colorScheme="green"
                  color="white"
                  size={isMobile ? "md" : "lg"}
                  width={isMobile ? "full" : "auto"}
                >
                  Update
                </Button>
                {isMobile && (
                  <Button
                    bg="gray"
                    color="white"
                    _hover={{ bg: "gray.800" }}
                    size={isMobile ? "md" : "lg"}
                    width={isMobile ? "full" : "auto"}
                    onClick={() =>
                      navigate(`/admin/users-management/view/${user?.id}`)
                    }
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

export default EditUserProfile;
