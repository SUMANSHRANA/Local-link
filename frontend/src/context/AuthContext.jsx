import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Service agents don't have a /api/users/me endpoint
      if (user?.role === "serviceAgent") {
        setLoading(false);
        return;
      }

      api.get("/users/me").then(res => {
        const userData = {
          id: res.data._id,
          fullName: res.data.fullName,
          email: res.data.emailAddress,
          role: res.data.role,
          contact: res.data.contact,
          address: res.data.address,
        };
        setUser(userData);
        localStorage.setItem("authUser", JSON.stringify(userData));
      }).catch(() => {
        logout();
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (tokenVal, userData) => {
    localStorage.setItem("token", tokenVal);
    localStorage.setItem("authUser", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${tokenVal}`;
    setToken(tokenVal);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
