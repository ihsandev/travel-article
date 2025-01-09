import axios from "axios";
import Cookies from "js-cookie";

export const apiCall = axios.create({
  baseURL: "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api",
});

apiCall.interceptors.request.use((config) => {
  const token = Cookies.get("_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
