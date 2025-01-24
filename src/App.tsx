import {
  SidenavProvider,
  SidenavContainer,
  SidenavItem,
  Sidenav,
} from "./navbar/sidenav";
import { Navbar } from "./navbar/navbar";
import { useUser } from "./hooks/useUser";
import { MdDashboard } from "react-icons/md";
import { FaPeopleGroup, FaUsersGear } from "react-icons/fa6";
import { FaUserInjured } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useAuth } from "./hooks/useAuth";

const App = () => {
  const { user, isError } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const { logout } = useAuth();

  const handleLogout = () => {
    onClose();
    logout();
  };

  const navItems: SidenavItem[] = [
    {
      icon: MdDashboard,
      label: "Dashboard",
      to: user?.role === "admin" ? "/admin/dashboard" : "/",
    },
    {
      icon: FaPeopleGroup,
      label: "Crowd Detection",
      to:
        user?.role === "admin" ? "/admin/crowd-detection" : "/crowd-detection",
    },
    {
      icon: FaUserInjured,
      label: "Fatigue Detection",
      to:
        user?.role === "admin"
          ? "/admin/fatigue-detection"
          : "/fatigue-detection",
    },
  ];

  if (user?.role === "admin") {
    navItems.push({
      icon: FaUsersGear,
      label: "Users Management",
      to: "/admin/users-management",
    });
  }

  useEffect(() => {
    if (isError?.response?.data.message === "jwt expired") {
      onOpen();
    }
  }, [isError, onOpen]);

  return (
    <>
      <SidenavProvider>
        <SidenavContainer sidenav={<Sidenav navItems={navItems} />}>
          <main>
            <Navbar />
            <Outlet />
          </main>
        </SidenavContainer>
      </SidenavProvider>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Session Expired
            </AlertDialogHeader>
            <AlertDialogBody>
              Your session has expired. Please log in again to continue.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme="orange" onClick={handleLogout} ml={3}>
                Log In Again
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default App;
