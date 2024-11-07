import {
  SidenavProvider,
  SidenavContainer,
  SidenavItem,
  Sidenav
} from "./navbar/sidenav";
import { Navbar } from "./navbar/navbar";
import { useUser } from "./hooks/useUser";
import { MdDashboard } from "react-icons/md";
import { FaPeopleGroup, FaUsersGear } from "react-icons/fa6";
import { FaUserInjured } from "react-icons/fa";
import { Outlet } from "react-router-dom";

const App = () => {
  const { user } = useUser();

  const navItems: SidenavItem[] = [
    { icon: MdDashboard, label: "Dashboard", to: "/" },
    { icon: FaPeopleGroup, label: "Crowd Detection", to: "/crowd-detection" },
    { icon: FaUserInjured, label: "Fatigue Detection", to: "/fatigue-detection" },
  ];

  if (user && user.role === "admin") {
    navItems.push({ icon: FaUsersGear, label: "Users Management", to: "/users-management" });
  }

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