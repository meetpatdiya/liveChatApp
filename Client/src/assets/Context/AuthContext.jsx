import { createContext, useContext, useEffect, useState } from "react";
import api from "../ApiServices/Api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const Check = async () => {
      try {
        await api.get("/");
        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
        }
      }
    };
    Check();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
