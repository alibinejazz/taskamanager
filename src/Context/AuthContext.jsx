import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(null); // State for login error
  const [regError, setRegError] = useState(null); // State for registration error

  let baseUrl = "https://task-manager.codionslab.com/api";

  const login = async ({ email, password }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/v1/login`,
        {
          email,
          password,
        }
      );
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", response.data.data.token);
      setLoginError(null); // Reset login error on successful login
    } catch (error) {
      console.error("Login failed", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        setLoginError(error.response.data); // Set login error message
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/v1/register`,
        userData
      );
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setRegError(null); // Reset registration error on successful registration
    } catch (error) {
      console.error("Registration failed", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        setRegError(error.response.data); // Set registration error message
      }
      throw error;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const isAdmin = user?.data.user.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, isAdmin, loading, loginError, regError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
