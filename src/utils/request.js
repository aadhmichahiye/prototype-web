import axios from "axios";
import { getToken } from "@/utils/auth";
import { useUserStore } from "@/stores/UserStore";

const request = axios.create({
  baseURL: "https://backend-prototype-g1s6.onrender.com/api/",
  timeout: 1000000,
  insecureHTTPParser: false,
});

// Add a request interceptor
request.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (useUserStore().token) {
      config.headers["Authorization"] = "Bearer " + getToken();
      // config.headers["Access-Control-Allow-Headers"] = "Authorization";
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
request.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default request;