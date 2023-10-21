import { createContext, useState, useEffect } from "react";
import { DressService } from "../../dao/dressService";

export const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || ""
  );
  const [error, setError] = useState(null); // New error state

  useEffect(() => {
    // Check localStorage for tokens on component mount (initial load)
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }, [accessToken, refreshToken]);

  const getAccessTokenHeader = () => {
    return localStorage.getItem("accessToken");
  };

  const login = async (email, password) => {
    try {
      const response = await DressService.login(email, password);
      const { accessToken, refreshToken } = response.data;
      setIsLoggedIn(true);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setError(null); // Clear any previous error
    } catch (error) {
      console.error(error);
      setError("Login failed. Please check your credentials.");
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoggedIn(false);
      setAccessToken("");
      setRefreshToken("");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      await DressService.logout(accessToken, refreshToken);
      console.log("Logout successful");
      setError(null); // Clear any previous error
    } catch (error) {
      console.error(error);
      setError("Logout failed. Please try again.");
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await DressService.refreshAccessToken(refreshToken);
      const newAccessToken = response.data.accessToken;
      setAccessToken(newAccessToken);
      setError(null); // Clear any previous error
      return newAccessToken;
    } catch (error) {
      console.error(error);
      setError("Access token refresh failed. Please log in again.");
      logout();
      throw error;
    }
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        refreshAccessToken,
        getAccessTokenHeader,
        error, // Pass error state to your components
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
