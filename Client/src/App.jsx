import React from "react";
import Registraion from "./assets/Components/Registraion";
import Homepage from "./assets/Components/HomePage";
import Login from "./assets/Components/Login";
import NotFound from "./assets/Components/NotFound";
import Dashboard from "./assets/Components/Dashboard";
import ViewChats from "./assets/Components/ViewChats";
import { SocketProvider } from "./assets/Context/SocketContext";
import { AuthProvider } from "./assets/Context/AuthContext";
import ProtectedRoute from "./assets/Components/ProtectedRoutes";
import NoChatSelected from "./assets/Components/NoChatSelected";
import ChatInfo from "./assets/Components/ChatInfo";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/register",
      element: <Registraion />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/chatdashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <NoChatSelected />
            </ProtectedRoute>
          ),
        },
        {
          path: ":id",
          element: (
            <ProtectedRoute>
              <ViewChats />
            </ProtectedRoute>
          ),
          children:[{
            path:"info",
            element: <ChatInfo/>
          }]
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
