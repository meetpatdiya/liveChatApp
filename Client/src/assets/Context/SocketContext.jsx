import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const {isAuthenticated} = useAuth();
useEffect(() => {
  console.log("isAuthenticated:", isAuthenticated);
}, [isAuthenticated]);
   useEffect(() => {
    if (!isAuthenticated) return;

    const newSocket = io("http://localhost:3000", {
      auth: {
        userId: localStorage.getItem("userId"),
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
      setSocket(newSocket);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
