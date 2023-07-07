import axios from "axios";

export class DressService {
  static serverURL = "https://vestidos-cd-valles.onrender.com";

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
  static createColor(colorData, accessToken) {
    let dataURL = `/api/color/`;
    return this.axiosInstance.post(dataURL, colorData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  static editColor(colorData, colorId, accessToken) {
    let dataURL = `/api/color/${colorId}`;
    return this.axiosInstance.put(dataURL, colorData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  static deleteColor(colorId, accessToken) {
    let dataURL = `/api/color/${colorId}`;
    return this.axiosInstance.delete(dataURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  //------------------------------------------------------------------------
  // ----------------- BRAND requests --------------------------------------
  //------------------------------------------------------------------------
  static getAllBrands(accessToken) {
    let dataURL = "/api/brand";
    return this.axiosInstance.get(dataURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  static createBrand(brandData, accessToken) {
    let dataURL = `/api/brand/`;
    return this.axiosInstance.post(dataURL, brandData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  static editBrand(brandData, brandId, accessToken) {
    let dataURL = `/api/brand/${brandId}`;
    return this.axiosInstance.put(dataURL, brandData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  static deleteBrand(brandId, accessToken) {
    let dataURL = `/api/brand/${brandId}`;
    return this.axiosInstance.delete(dataURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  static getAllPrices() {
    let dataURL = "/api/price";
    return this.axiosInstance.get(dataURL);
  }
  static editPrice(priceData, priceId, accessToken) {
    let dataURL = `/api/price/${priceId}`;
    return this.axiosInstance.put(dataURL, priceData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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

  static createDress(dressData, accessToken) {
    let dataURL = "/api/dress";
    return this.axiosInstance.post(dataURL, dressData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  static deleteDress(dressId, accessToken) {
    let dataURL = `/api/dress/${dressId}`;
    return this.axiosInstance.delete(dataURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}
