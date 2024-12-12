import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CrowdDetection from './pages/crowdDetection/CrowdDetection';
import CrowdConfiguration from './pages/crowdDetection/CrowdConfiguration';
import FatigueDetection from './pages/fatigueDetection/FatigueDetection';
import FatigueConfiguration from './pages/fatigueDetection/FatigueConfiguration';
import UsersManagement from './pages/usersManagement/UsersManagement';
import ViewUserProfile from './pages/usersManagement/ViewUserProfile';
import EditUserProfile from './pages/usersManagement/EditUserProfile';
import ChangeUserPassword from './pages/usersManagement/ChangeUserPassword';
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';
import ChangePassword from './pages/profile/ChangePassword';
import ErrorPage from './pages/ErrorPage';

// eslint-disable-next-line react-refresh/only-export-components
const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" />;
};

// eslint-disable-next-line react-refresh/only-export-components
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return !token ? children : <Navigate to="/" />;
};

// eslint-disable-next-line react-refresh/only-export-components
const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const userDataString = localStorage.getItem('userData');
  const user = userDataString ? JSON.parse(userDataString) : null;
  return token && user?.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
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
      { path: "", element: <App />, 
        children: [
          { path: "", element: <Dashboard /> },
          { path: "crowd-detection", element: <CrowdDetection /> },
          { path: "fatigue-detection", element: <FatigueDetection /> },
          { path: "profile",
            children: [
              { path: "", element: <Profile /> },
              { path: "edit", element: <EditProfile /> },
              { path: "change-password", element: <ChangePassword /> }
            ]
          }
        ]
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      { path: "", element: <App />, 
        children: [
          { path: "users-management",
            children: [
              { path: "", element: <UsersManagement /> },
              { path: "view/:userId", element: <ViewUserProfile /> },
              { path: "edit/:userId", element: <EditUserProfile /> },
              { path: "change-password/:userId", element: <ChangeUserPassword /> }
            ]
          },
          { path: "crowd-configuration",
            children: [
              { path: "", element: <CrowdConfiguration /> },
              { path: "view/:areaId", element: "<EditProfile />" },
              { path: "edit/:areaId", element: "<ChangePassword />" }
            ]
          },
          { path: "fatigue-configuration",
            children: [
              { path: "", element: <FatigueConfiguration /> },
              { path: "view/:areaId", element: "<EditProfile />" },
              { path: "edit/:areaId", element: "<ChangePassword />" }
            ]
          }
        ]
      }
    ]
  },
  {
    path: "*",  
    element: <ErrorPage />,
  }  
]);


root.render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={routes} />
    </ChakraProvider>
  </React.StrictMode>
);