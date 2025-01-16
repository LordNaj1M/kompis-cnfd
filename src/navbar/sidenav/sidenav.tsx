import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  DrawerBody,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import LogoAnaheim from "./../../assets/logo-anaheim.svg";
import { useSidenav } from "./sidenav-context/sidenav-context";
import SidenavItems, { SidenavItem } from "./sidenav-items/sidenav-items";

export interface SidenavProps {
  navItems: SidenavItem[];
}

export function Sidenav({ navItems }: SidenavProps) {
  const { isOpen, onClose } = useSidenav();
  const headerColor = useColorModeValue("gray.200", "gray.700");

  return (
    <React.Fragment>
      <VStack spacing="5" as="nav" display={{ base: "none", md: "flex" }}>
        <Image src={LogoAnaheim} />
        <SidenavItems navItems={navItems} />
      </VStack>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px solid" borderColor={headerColor}>
            COMVIS-CNFD APP
          </DrawerHeader>
          <DrawerBody>
            <SidenavItems navItems={navItems} mode="over" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  );
}

export default Sidenav;

//Reference : https://dev.to/gauravsoni119/mastering-sidenav-with-chakra-ui-4enl
