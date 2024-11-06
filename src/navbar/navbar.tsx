import { FiMenu } from "react-icons/fi";
import { IconButton } from "@chakra-ui/react";
import { useSidenav } from "./sidenav";

export function Navbar() {
  const { onOpen } = useSidenav();
  return (
    <IconButton
      aria-label="menu"
      display={{ base: "flex", md: "none" }}
      onClick={onOpen}
      icon={<FiMenu />}
    />
  );
}
