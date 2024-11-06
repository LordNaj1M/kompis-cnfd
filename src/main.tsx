import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// eslint-disable-next-line react-refresh/only-export-components
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

// eslint-disable-next-line react-refresh/only-export-components
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return !token ? children : <Navigate to="/dashboard" />;
};

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      { path: "", element: <Dashboard /> },
      { path: "location", element: <div>Location Page</div> },
      { path: "settings", element: <div>Settings Page</div> },
      { path: "forecast", element: <div>Forecast Page</div> }
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