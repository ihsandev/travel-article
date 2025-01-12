import axios from "axios";
import Cookies from "js-cookie";

/**
 * Axios instance for making API calls with a base URL and request interceptor
 * that adds an Authorization header with a token from cookies if available.
 */
export const apiCall = axios.create({
  baseURL: "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api",
});

apiCall.interceptors.request.use((config) => {
  /**
   * Interceptor that adds an Authorization header with a Bearer token
   * retrieved from cookies to the request if the token is available.
   *
   * @param {Object} config - The Axios request configuration.
   * @returns {Object} The modified Axios request configuration.
   */
  const token = Cookies.get("_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
