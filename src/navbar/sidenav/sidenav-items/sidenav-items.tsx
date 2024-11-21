import {
  List,
  ListItem,
  Icon,
  Flex,
  Text,
  Link,
  Tooltip,
  IconButton,
  useColorModeValue
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { NavLink } from "react-router-dom";
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
 
  const sidebarItemInOverMode = (item: SidenavItem, index: number) => (
    <ListItem key={index} w="full">
      <Link
        display="block"
        as={NavLink}
        to={item.to}
        onClick={() => onClose()}
        _focus={{ 
          bg: {focusLink},
          outline: 'none'
        }}
        _hover={{ 
          bg: {hoverLink},
          color: 'orange.500'
        }}
        _activeLink={{
          bg: "orange.500", 
          color: "white" 
        }}
        w="full"
        borderRadius="md"
      >
        <Flex alignItems="center" p={2}>
          <Icon boxSize="5" as={item.icon} />
          <Text ml={2}>{item.label}</Text>
        </Flex>
      </Link>
    </ListItem>
  );

  const sidebarItemInSemiMode = (
    { icon: Icon, ...item }: SidenavItem,
    index: number
  ) => (
    <ListItem key={index}>
      <Tooltip label={item.label} placement="right">
        <IconButton
          key={index}
          as={NavLink}
          to={item.to}
          _focus={{ 
            bg: {focusLink},
            outline: 'none'
          }}
          _activeLink={{ boxShadow: "md", bg: "orange.500", color: "white" }}
          bg="transparent"
          aria-label={item.label}
          borderRadius="xl"
          icon={<Icon />}
          transition="all 0.2s"
        />
      </Tooltip>
    </ListItem>
  );

  return (
    <List spacing={3}>
      {mode === "semi"
        ? navItems.map((item, index) => sidebarItemInSemiMode(item, index))
        : navItems.map((item, index) => sidebarItemInOverMode(item, index))}
    </List>
  );
}
  
export default SidenavItems;