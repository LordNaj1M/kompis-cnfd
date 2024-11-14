import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CrowdDetection from './pages/CrowdDetection';
import FatigueDetection from './pages/FatigueDetection';
import UsersManagement from './pages/UsersManagement';
import Profile from './pages/Profile';
import Configuration from './pages/Configuration';

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
          { path: "users-management", element: <UsersManagement /> },
          { path: "profile", element: <Profile /> },
          { path: "configuration", element: <Configuration /> }
        ]
      }
    ]
  }
  
]);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={routes} />
    </ChakraProvider>
  </React.StrictMode>
);