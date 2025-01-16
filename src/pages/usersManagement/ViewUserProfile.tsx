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
import { useUserById } from "../../hooks/useUser";
import { FiEdit2 } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useEffect } from "react";

const ViewUserProfile = () => {
  const { userId } = useParams();
  const { user, isLoading, isError } = useUserById(userId || "");
  const navigate = useNavigate();

  const bgCard = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

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

  const handleEditProfile = () => {
    navigate(`/admin/users-management/edit/${userId}`);
  };

  const handleChangePasswordProfile = () => {
    navigate(`/admin/users-management/change-password/${userId}`);
  };

  const ProfileField = ({ label, value }: { label: string; value: string }) => (
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

  return (
    <Box p={isMobile ? 4 : 6}>
      <VStack align="stretch" spacing={6}>
        <Heading size="lg">USER PROFILE</Heading>
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
                    onClick={() => navigate("/admin/users-management")}
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
                  onClick={handleEditProfile}
                  ml="auto"
                >
                  Edit Profile
                </Button>
                <Button
                  leftIcon={<RiLockPasswordLine />}
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: "blue.800" }}
                  size={isMobile ? "md" : "lg"}
                  width={isMobile ? "full" : "auto"}
                  onClick={handleChangePasswordProfile}
                >
                  Change Password
                </Button>
                {isMobile && (
                  <Button
                    bg="gray"
                    color="white"
                    _hover={{ bg: "gray.800" }}
                    size={isMobile ? "md" : "lg"}
                    width={isMobile ? "full" : "auto"}
                    onClick={() => navigate("/admin/users-management")}
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

export default ViewUserProfile;
