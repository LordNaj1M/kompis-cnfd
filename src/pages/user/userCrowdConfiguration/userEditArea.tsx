// src/pages/crowdDetection/EditArea.tsx
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
} from "@chakra-ui/react";
import { editArea, useAreaById } from "../../../hooks/useArea";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";

const EditUserProfile = () => {
  const { user } = useUser();
  const { areaId } = useParams();
  const { areaById, isLoading, isError } = useAreaById(areaId || "");
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [user_id, setUserId] = useState(user?.id || "");

  const cardBg = useColorModeValue("white", "gray.800");
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  useEffect(() => {
    if (areaById) {
      setName(areaById.name);
      setCapacity(areaById.capacity);
    }
  }, [areaById]);

  useEffect(() => {
    if (!areaId) {
      <Container centerContent py={10}>
        <VStack spacing={4}>
          <Text>Invalid Area ID.</Text>
          <Button onClick={() => navigate(-1)} colorScheme="red">
            Go Back
          </Button>
        </VStack>
      </Container>;
    }
  }, [areaId, navigate]);

  if (isLoading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (isError || !areaById || typeof areaById === "string") {
    return (
      <Container centerContent py={10}>
        <VStack spacing={4}>
          <Text>Error loading data...</Text>
          <Button onClick={() => navigate(0)}>Retry</Button>
        </VStack>
      </Container>
    );
  }

  const handleBack = () => {
    navigate(`/crowd-configuration/view/${areaId}`);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name !== areaById?.name || capacity !== areaById?.capacity) {
      try {
        const updatePromise = editArea(areaById?.id, {
          name,
          capacity,
          user_id,
        });
        toast.promise(updatePromise, {
          loading: {
            title: "Updating",
            description: "Please wait while we update Area data.",
          },
          success: {
            title: "Edit Area Successful",
            description: "Area data has been updated!",
            duration: 1000,
            isClosable: true,
            onCloseComplete() {
              handleBack();
            },
          },
          error: (error) => ({
            title: "Edit Area Failed",
            description: "An error occurred during edit Area: " + error,
            duration: 5000,
            isClosable: true,
          }),
        });
      } catch (error) {
        toast({
          title: "Edit Area Failed",
          description: `An error occurred during edit Area: ${error}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Edit Area Failed",
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
          <Heading size="lg">EDIT AREA</Heading>
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
                <FormLabel>Area Name</FormLabel>
                <Input
                  type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={areaById?.name}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Area Capacity</FormLabel>
                <Input
                  type="capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  placeholder={areaById?.capacity.toString()}
                  required
                />
              </FormControl>

              <FormControl>
                <Input
                  type="hidden"
                  value={user?.id}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
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
                    onClick={() => handleBack()}
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
                    onClick={() => handleBack()}
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
