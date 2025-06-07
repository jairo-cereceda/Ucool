import React, { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return {
        token,
        id: decoded.id,
        establecimiento_id: decoded.establecimiento_id,
        email: decoded.email,
        rol: decoded.rol,
        isVerified: decoded.isVerified,
        isSubscribed: decoded.isSubscribed,
      };
    } catch (error) {
      console.error("Token inválido:", error);
      localStorage.removeItem("token");
      return null;
    }
  });

  const login = (token) => {
    const decoded = jwtDecode(token);
    localStorage.setItem("token", token);
    setUser({
      token,
      id: decoded.id,
      establecimiento_id: decoded.establecimiento_id,
      email: decoded.email,
      rol: decoded.rol,
      isVerified: decoded.isVerified,
      isSubscribed: decoded.isSubscribed,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
