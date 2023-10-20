import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const baseURL =
  import.meta.env.VITE_SERVER_URL || "https://vestidos-cd-valles.onrender.com";

const axiosHandler = axios.create({
  baseURL,
});

axiosHandler.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");

    // Check if the token exists and is not expired
    if (token) {
      const decodedToken = jwt_decode(token);
      const isTokenExpired = dayjs(decodedToken.exp * 1000).isBefore(dayjs());

      if (isTokenExpired) {
        // Token is expired, make a new refresh token request
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
      } else {
        // Token is valid, use it for the request
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosHandler;
