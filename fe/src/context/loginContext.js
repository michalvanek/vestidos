import React, { createContext, useState } from "react";
import { DressService } from "./DressService";

// Create the login context
export const LoginContext = createContext();

// Create a provider component for the login context
export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  // Function to handle login
  const login = async (email, password) => {
    try {
      await DressService.login(email, password);
      setIsLoggedIn(true);
    } catch (error) {
      setError("Invalid email or password");
      console.error(error);
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      await DressService.logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Create the context value
  const loginContextValue = {
    isLoggedIn,
    error,
    login,
    logout,
  };

  // Provide the context value to children components
  return (
    <LoginContext.Provider value={loginContextValue}>
      {children}
    </LoginContext.Provider>
  );
};
