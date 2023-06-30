import axios from "axios";

export class DressService {
  static serverURL = "http://localhost:5001";

  static axiosInstance = axios.create({
    baseURL: this.serverURL,
  });

  static getAllDresses() {
    let dataURL = "/api/dress";
    return this.axiosInstance.get(dataURL);
  }

  static getAllColors() {
    let dataURL = "/api/color";
    return this.axiosInstance.get(dataURL);
  }

  static getAllBrands() {
    let dataURL = "/api/brand";
    return this.axiosInstance.get(dataURL);
  }

  static getAllPrices() {
    let dataURL = "/api/price";
    return this.axiosInstance.get(dataURL);
  }

  static login(email, password) {
    let dataURL = "/api/users/login";
    return this.axiosInstance.post(dataURL, { email, password });
  }

  static logout(accessToken, refreshToken) {
    let dataURL = "/api/users/logout";
    return this.axiosInstance.delete(dataURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        token: refreshToken,
      },
    });
  }
  static refreshAccessToken(refreshToken) {
    let dataURL = "/api/users/token";
    return this.axiosInstance.post(dataURL, { token: refreshToken });
  }
}
