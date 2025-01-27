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
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useAreaById } from "../../../hooks/useArea";
import { FiEdit2 } from "react-icons/fi";
import { useEffect } from "react";

const ViewDetailArea = () => {
  const { areaId } = useParams();
  const { areaById, isLoading, isError } = useAreaById(areaId || "");
  const navigate = useNavigate();

  const bgCard = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

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

  const handleEditArea = () => {
    navigate(`/admin/crowd-configuration/edit/${areaId}`);
  };

  const DetailField = ({ label, value }: { label: string; value: string }) => (
    <Box>
      <Text fontSize="sm" color={labelColor} mb={1}>
        {label}
      </Text>
      <Text fontSize={isMobile ? "md" : "lg"} fontWeight="medium">
        {value}
      </Text>
    </Box>
  );

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

  return (
    <Box p={isMobile ? 4 : 6}>
      <VStack align="stretch" spacing={6}>
        <Heading size="lg">DETAIL AREA</Heading>
        <Card bg={bgCard} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <VStack spacing={4} align="stretch">
                <DetailField label="Area Name" value={areaById.name} />
                <DetailField
                  label="Area Capacity"
                  value={areaById.capacity.toString()}
                />
              </VStack>

              <Flex
                mt={4}
                gap={4}
                direction={isMobile ? "column" : "row"}
                justify="flex-start"
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
                    Back
                  </Button>
                )}
                <Button
                  leftIcon={<FiEdit2 />}
                  variant="solid"
                  colorScheme="green"
                  size={isMobile ? "md" : "lg"}
                  width={isMobile ? "full" : "auto"}
                  onClick={handleEditArea}
                  ml="auto"
                >
                  Edit Area
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
                    Back
                  </Button>
                )}
              </Flex>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default ViewDetailArea;
