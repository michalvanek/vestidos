import React, { createContext, useState, useEffect } from "react";
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

  useEffect(() => {
    // Call the refreshAccessToken function on component mount (initial load) to ensure access token is up-to-date
    if (isLoggedIn) {
      refreshAccessToken();
    }
  }, []);

  const getAccessTokenHeader = () => {
    return localStorage.getItem("accessToken");
  };

  const login = (email, password) => {
    return DressService.login(email, password)
      .then((response) => {
        const { accessToken, refreshToken } = response.data;
        setIsLoggedIn(true);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAccessToken("");
    setRefreshToken("");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return DressService.logout(accessToken, refreshToken)
      .then(() => {
        console.log("logout successfull");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const refreshAccessToken = () => {
    return DressService.refreshAccessToken(refreshToken)
      .then((response) => {
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        return newAccessToken;
      })
      .catch((error) => {
        console.error(error);
        logout();
        throw error;
      });
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        refreshAccessToken,
        getAccessTokenHeader,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
