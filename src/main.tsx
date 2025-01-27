import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminCrowdDetection from "./pages/admin/adminCrowdDetection";
import AdminFatigueDetection from "./pages/admin/adminFatigueDetection";
import UsersManagement from "./pages/admin/usersManagement/UsersManagement";
import ViewUserProfile from "./pages/admin/usersManagement/ViewUserProfile";
import EditUserProfile from "./pages/admin/usersManagement/EditUserProfile";
import ChangeUserPassword from "./pages/admin/usersManagement/ChangeUserPassword";
import UserDashboard from "./pages/user/userDashboard";
import UserCrowdDetection from "./pages/user/userCrowdDetection";
import UserFatigueDetection from "./pages/user/userFatigueDetection";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import ChangePassword from "./pages/profile/ChangePassword";
import ErrorPage from "./pages/ErrorPage";

// eslint-disable-next-line react-refresh/only-export-components
const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

// eslint-disable-next-line react-refresh/only-export-components
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  return !token ? children : <Navigate to="/" />;
};

// eslint-disable-next-line react-refresh/only-export-components
const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const userDataString = localStorage.getItem("userData");
  const user = userDataString ? JSON.parse(userDataString) : null;
  return token && user?.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

const routes = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "",
        element: <App />,
        children: [
          { path: "", element: <UserDashboard /> },
          { path: "crowd-detection", element: <UserCrowdDetection /> },
          { path: "crowd-detection/:areaId", element: <UserCrowdDetection /> },
          { path: "fatigue-detection", element: <UserFatigueDetection /> },
          {
            path: "profile",
            children: [
              { path: "", element: <Profile /> },
              { path: "edit", element: <EditProfile /> },
              { path: "change-password", element: <ChangePassword /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        path: "",
        element: <App />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "crowd-detection", element: <AdminCrowdDetection /> },
          { path: "fatigue-detection", element: <AdminFatigueDetection /> },
          {
            path: "users-management",
            children: [
              { path: "", element: <UsersManagement /> },
              { path: "view/:userId", element: <ViewUserProfile /> },
              { path: "edit/:userId", element: <EditUserProfile /> },
              {
                path: "change-password/:userId",
                element: <ChangeUserPassword />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={routes} />
    </ChakraProvider>
  </React.StrictMode>
);
