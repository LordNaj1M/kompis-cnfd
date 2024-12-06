import {
  List,
  ListItem,
  Icon,
  Flex,
  Text,
  Link,
  Tooltip,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { NavLink, useLocation } from "react-router-dom";
import { useSidenav } from "../sidenav-context/sidenav-context";
  
export interface SidenavItem {
  icon: IconType;
  label: string;
  to: string;
}
  
export interface SidenavItemsProps {
  navItems: SidenavItem[];
  mode?: "semi" | "over";
}
  
export function SidenavItems({ navItems, mode = "semi" }: SidenavItemsProps) {
  const { onClose } = useSidenav();
  const focusLink = useColorModeValue('gray.100', 'gray.700');
  const hoverLink = useColorModeValue('gray.200', 'gray.600');

  const location = useLocation();
  const isUserManagementActive = 
    location.pathname === "/admin/users-management" || 
    location.pathname.startsWith("/admin/view/") || 
    location.pathname.startsWith("/admin/edit/") || 
    location.pathname.startsWith("/admin/change-password/");
 
  const sidebarItemInOverMode = (item: SidenavItem, index: number) => {
    const isActive = 
      item.to === "/admin/users-management" 
        ? isUserManagementActive 
        : location.pathname === item.to;

    return (
      <ListItem key={index} w="full">
        <Link
          display="block"
          as={NavLink}
          to={item.to}
          onClick={() => onClose()}
          _focus={{ 
            bg: focusLink,
            outline: 'none'
          }}
          _hover={{ 
            bg: hoverLink,
            color: 'orange.500'
          }}
          _activeLink={{
            bg: "orange.500", 
            color: "white"
          }}
          w="full"
          borderRadius="md"
          bg={isActive ? "orange.500" : "transparent"}
          color={isActive ? "white" : "inherit"}
        >
          <Flex alignItems="center" p={2}>
            <Icon boxSize="5" as={item.icon} />
            <Text ml={2}>{item.label}</Text>
          </Flex>
        </Link>
      </ListItem>
    );
  };

  const sidebarItemInSemiMode = (
    { icon: Icon, ...item }: SidenavItem,
    index: number
  ) => {
    const isActive = 
      item.to === "/admin/users-management" 
        ? isUserManagementActive 
        : location.pathname === item.to;

    return (
      <ListItem key={index}>
        <Tooltip label={item.label} placement="right">
          <IconButton
            key={index}
            as={NavLink}
            to={item.to}
            _focus={{ 
              bg: focusLink,
              outline: 'none'
            }}
            _activeLink={{ 
              bg: "orange.500", 
              color: "white"
            }}
            aria-label={item.label}
            borderRadius="xl"
            icon={<Icon />}
            transition="all 0.2s"
            bg={isActive ? "orange.500" : "transparent"}
            color={isActive ? "white" : "inherit"}
          />
        </Tooltip>
      </ListItem>
    );
  };

  return (
    <List spacing={3}>
      {mode === "semi"
        ? navItems.map((item, index) => sidebarItemInSemiMode(item, index))
        : navItems.map((item, index) => sidebarItemInOverMode(item, index))}
    </List>
  );
}
  
export default SidenavItems;