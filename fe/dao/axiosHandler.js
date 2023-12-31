import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const baseURL = import.meta.env.VITE_SERVER_URL;

const axiosHandler = axios.create({
  baseURL,
});

axiosHandler.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");

    // Check if the request not contains the Authorization header
    if (!config.headers["Authorization"]) {
      return config; // Skip token validation, if the header is not present
    }
    // Check if the token exists and is not expired
    if (token) {
      const decodedToken = jwt_decode(token);
      const isTokenExpired = dayjs(decodedToken.exp * 1000).isBefore(dayjs());

      if (isTokenExpired) {
        const decodedRefreshToken = jwt_decode(
          localStorage.getItem("refreshToken")
        );
        const isRefreshTokenExpired = dayjs(
          decodedRefreshToken.exp * 1000
        ).isBefore(dayjs());
        if (isRefreshTokenExpired) {
          console.log(`refreshToken is expired: ${isRefreshTokenExpired}`);
        }

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const response = await axios.post(`${baseURL}api/users/token`, {
            token: refreshToken,
          });

          const newAccessToken = response.data.accessToken;

          config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          // Update the local storage with the new access token
          localStorage.setItem("accessToken", newAccessToken);
        } catch (error) {
          console.log(`${error}`);
          // Handle the error or redirect to the login page
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosHandler;
