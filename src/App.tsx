import { BsBarChart } from "react-icons/bs";
import { BiMap } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { FaPeopleGroup } from "react-icons/fa6";
import { Outlet } from "react-router-dom";
import {
  SidenavProvider,
  SidenavContainer,
  SidenavItem,
  Sidenav
} from "./navbar/sidenav";
import { Navbar } from "./navbar/navbar";

const App = () => {
  const navItems: SidenavItem[] = [
    { icon: BsBarChart, label: "Dashboard", to: "/" },
    { icon: FaPeopleGroup, label: "Crowd Detection", to: "/crowd-detection" },
    { icon: BiMap, label: "Location", to: "/location" },
    { icon: FiSettings, label: "Settings", to: "/settings" }
  ];

  return (
    <SidenavProvider>
      <SidenavContainer sidenav={<Sidenav navItems={navItems} />}>
        <main>
          <Navbar />
          <Outlet />
        </main>
      </SidenavContainer>
    </SidenavProvider>
  );
};

export default App;