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
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }, [accessToken, refreshToken]);

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

  // const refreshAccessToken = () => {
  //   return DressService.refreshAccessToken(refreshToken)
  //     .then((newAccessToken) => {
  //       setAccessToken(newAccessToken);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       openModal();
  //     });
  // };

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
