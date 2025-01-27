// src/pages/crowdDetection/CreateArea.tsx
import { useState } from "react";
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
} from "@chakra-ui/react";
import { createArea } from "../../../hooks/useArea";
import { useNavigate } from "react-router-dom";

const CreateArea = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);

  const cardBg = useColorModeValue("white", "gray.800");
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  const handleCreateArea = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const createPromise = createArea({ name, capacity });
      toast.promise(createPromise, {
        loading: {
          title: "Create Area Process",
          description: "Please wait while we create area.",
        },
        success: {
          title: "Create Area Successful",
          description: "You can now use new area.",
          duration: 1000,
          isClosable: true,
          onCloseComplete() {
            navigate(`/admin/crowd-configuration`);
          },
        },
        error: (error) => ({
          title: "Create Area Failed",
          description: "An error occurred during create area: " + error,
          duration: 5000,
          isClosable: true,
        }),
      });
    } catch (error) {
      toast({
        title: "Create Area Failed",
        description: `An error occurred during create area: ${error}`,
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
          <Heading size="lg">CREATE AREA</Heading>
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
          <form onSubmit={handleCreateArea} name="editForm">
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Area Name</FormLabel>
                <Input
                  type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Area name"
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Area Capacity</FormLabel>
                <Input
                  type="capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  placeholder="Enter Area capacity"
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
                    onClick={() => navigate(`/admin/crowd-configuration`)}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  bg="orange.300"
                  color="black"
                  _hover={{ bg: "orange.100" }}
                  size={isMobile ? "md" : "lg"}
                  width={isMobile ? "full" : "auto"}
                >
                  Create
                </Button>
                {isMobile && (
                  <Button
                    bg="gray"
                    color="white"
                    _hover={{ bg: "gray.800" }}
                    size={isMobile ? "md" : "lg"}
                    width={isMobile ? "full" : "auto"}
                    onClick={() => navigate(`/admin/crowd-configuration`)}
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

export default CreateArea;
