// export default CrowdConfiguration;
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
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { deleteArea, useAreasByUserId } from "../../../hooks/useArea";
import { useNavigate } from "react-router-dom";

import { BiLayerPlus } from "react-icons/bi";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useUser } from "../../../hooks/useUser";

interface Area {
  id: string;
  name: string;
  capacity: number;
  user_id: string;
}

const CrowdConfiguration = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [areaToDelete, setAreaToDelete] = useState<string | null>(null);
  const [areaId, setAreaId] = useState("");

  const bgCard = useColorModeValue("white", "gray.700");
  const bgHover = useColorModeValue("gray.50", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const isMobile = useMediaQuery("(max-width: 768px)")[0];

  const { areasByUserId, isLoading, isError } = useAreasByUserId(
    user?.id || ""
  );

  const handleCreateArea = () => {
    navigate(`/crowd-configuration/create`);
  };

  const handleViewArea = (areaId: string) => {
    navigate(`/crowd-configuration/view/${areaId}`);
  };

  const handleEditArea = (areaId: string) => {
    navigate(`/crowd-configuration/edit/${areaId}`);
  };

  const handleDeleteAreaConfirmation = (areaId: string) => {
    setAreaId(areaId);
    setAreaToDelete(areaId);
    onOpen();
  };

  const handleDeleteArea = () => {
    if (!areaToDelete) return;

    try {
      const deleteAreaPromise = deleteArea(areaToDelete);
      toast.promise(deleteAreaPromise, {
        loading: {
          title: "Deleting Area",
          description: "Please wait while we delete Area_" + areaToDelete,
        },
        success: {
          title: "Delete Area Successful",
          description: "Area_" + areaToDelete + " has been deleted!",
          duration: 1000,
          isClosable: true,
          onCloseComplete() {
            navigate(0);
          },
        },
        error: (error) => ({
          title: "Delete Area Failed",
          description:
            "An error occurred during delete Area_" +
            areaToDelete +
            ": " +
            error,
          duration: 5000,
          isClosable: true,
        }),
      });
    } catch (error) {
      toast({
        title: "Delete Area Failed",
        description:
          "An error occurred during delete Area_" + areaToDelete + ": " + error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  // Action buttons component
  const ActionButtons = ({ area }: { area: Area }) => (
    <HStack
      spacing={2}
      justify={isMobile ? "flex-start" : "center"}
      display={"flex"}
    >
      <Tooltip label="View" placement="bottom">
        <IconButton
          aria-label="View Area"
          icon={<HiOutlineInformationCircle />}
          fontSize="xl"
          colorScheme="blue"
          variant="ghost"
          size={isMobile ? "sm" : "md"}
          onClick={() => handleViewArea(area.id)}
        />
      </Tooltip>
      <Tooltip label="Edit" placement="bottom">
        <IconButton
          aria-label="Edit Area"
          icon={<CiEdit />}
          fontSize="xl"
          colorScheme="green"
          variant="ghost"
          size={isMobile ? "sm" : "md"}
          onClick={() => handleEditArea(area.id)}
        />
      </Tooltip>
      <Tooltip label="Delete" placement="bottom">
        <IconButton
          aria-label="Delete Area"
          icon={<RiDeleteBin5Line />}
          fontSize="xl"
          colorScheme="red"
          variant="ghost"
          size={isMobile ? "sm" : "md"}
          onClick={() => handleDeleteAreaConfirmation(area.id)}
        />
      </Tooltip>
    </HStack>
  );

  if (isError || !user) {
    return (
      <Card bg={bgCard} borderColor={borderColor} borderWidth="1px">
        <CardHeader>
          <Heading size="lg">CROWD AREA CONFIGURATION</Heading>
        </CardHeader>
        <CardBody>
          <Text color="red.500">Error loading areas: {isError.message}</Text>
        </CardBody>
      </Card>
    );
  }

  // Mobile card view for each area
  const MobileAreaCard = ({ area, index }: { area: Area; index: number }) => (
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
            <Text fontSize="sm" color={labelColor}>
              #{index + 1}
            </Text>
          </Flex>

          <Box>
            <Text fontSize="sm" color={labelColor}>
              Name
            </Text>
            <Text fontWeight="medium">{area.name}</Text>
          </Box>

          <Box>
            <Text fontSize="sm" color={labelColor}>
              Capacity
            </Text>
            <Text fontWeight="medium">{area.capacity}</Text>
          </Box>

          <Flex justifyContent="flex-end">
            <ActionButtons area={area} />
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
            <Th textAlign="center">No</Th>
            <Th textAlign="center">Name</Th>
            <Th textAlign="center">Capacity</Th>
            <Th textAlign="center">Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {areasByUserId?.map((area, index) => (
            <Tr
              key={area?.id}
              _hover={{ bg: bgHover }}
              transition="background 0.2s"
            >
              <Td textAlign="center">{index + 1}</Td>
              <Td textAlign="center">{area.name}</Td>
              <Td textAlign="center">{area.capacity}</Td>
              <Td textAlign="center">
                <ActionButtons area={area} />
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
          <Flex justify="space-between" align="center">
            <Heading size={isMobile ? "md" : "lg"}>
              CROWD AREA CONFIGURATION
            </Heading>
            <Button
              leftIcon={<BiLayerPlus />}
              bg="orange.300"
              color="black"
              _hover={{ bg: "orange.100" }}
              size={isMobile ? "xl" : "md"}
              padding={isMobile ? 3 : ""}
              onClick={handleCreateArea}
            >
              {isMobile ? "" : "Create Area"}
            </Button>
          </Flex>
        </Box>
        <Card bg={bgCard} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            {isLoading ? (
              <Flex justify="center" align="center" minH="200px">
                <Spinner size="xl" />
              </Flex>
            ) : isMobile ? (
              <VStack spacing={4} align="stretch">
                {areasByUserId?.map((area, index) => (
                  <MobileAreaCard key={area.id} area={area} index={index} />
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
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize={isMobile ? "md" : "lg"}
              fontWeight="bold"
            >
              Delete Area_{areaId}
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteArea} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CrowdConfiguration;
