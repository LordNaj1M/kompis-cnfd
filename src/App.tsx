import { BsBarChart } from "react-icons/bs";
import { BiMap, BiChalkboard } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
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
    { icon: BsBarChart, label: "Dashboard", to: "/dashboard" },
    { icon: BiChalkboard, label: "Forecast", to: "/dashboard/forecast" },
    { icon: BiMap, label: "Location", to: "/dashboard/location" },
    { icon: FiSettings, label: "Settings", to: "/dashboard/settings" }
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