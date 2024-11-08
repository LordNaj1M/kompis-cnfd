import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  DrawerBody,
  Image
} from "@chakra-ui/react";
import LogoAnaheim from "./../../assets/logo-anaheim.svg";
import { useSidenav } from "./sidenav-context/sidenav-context";
import SidenavItems, { SidenavItem } from "./sidenav-items/sidenav-items";

export interface SidenavProps {
  navItems: SidenavItem[];
}

export function Sidenav({ navItems }: SidenavProps) {
  const { isOpen, onClose } = useSidenav();
  return (
    <React.Fragment>
      <VStack spacing="5" as="nav" display={{ base: "none", md: "flex" }}>
        <Image src={LogoAnaheim} /> {/*OR PUT YOUR LOGO HERE */}
        <SidenavItems navItems={navItems} />
      </VStack>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Sidenav Header</DrawerHeader>
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