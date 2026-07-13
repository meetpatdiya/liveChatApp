import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../Context/AuthContext";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const {isAuthenticated} = useAuth();
  
  useEffect(() => {
    if (isAuthenticated !== true) return;
    const newSocket = io("http://localhost:3000", {
      auth: {
        userId: localStorage.getItem("userId"),
      },
    });
    setSocket(newSocket);
    console.log(socket,"hello bhai"); 
    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
    });
    return () => newSocket.disconnect();
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
