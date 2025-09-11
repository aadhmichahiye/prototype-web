// src/plugins/request.js
import axios from "axios";
import { getToken } from "./auth";
import { useUserStore } from "../stores/userStore";

/**
 * Axios instance
 */
const request = axios.create({
  baseURL: "https://backend-prototype-g1s6.onrender.com/api/",
  // baseURL: " http://localhost:5001/api/",
  timeout: 1000000,
  insecureHTTPParser: false,
});

/**
 * Queue to hold requests while a token refresh is in progress.
 * Each item: { resolve, reject, config }
 */
let isRefreshing = false;
let requestQueue = [];

/** helper: process queued requests after refresh */
function processQueue(error, token = null) {
  requestQueue.forEach(({ resolve, reject, originalConfig }) => {
    if (error) {
      reject(error);
    } else {
      // attach new token and retry original request
      if (token) {
        originalConfig.headers = originalConfig.headers || {};
        originalConfig.headers.Authorization = `Bearer ${token}`;
      }
      resolve(request(originalConfig));
    }
  });
  requestQueue = [];
}

/* ---------- Request interceptor ---------- */
request.interceptors.request.use(
  (config) => {
    // If the request explicitly sets skipAuth, do not attach Authorization header
    if (config.skipAuth) return config;

    // Use getToken util to keep a single source for persisted token
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------- Response interceptor ---------- */
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    // If no response (network error), just reject
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // If request had skipAuth, do not attempt refresh — just reject
    if (originalConfig && originalConfig.skipAuth) {
      return Promise.reject(error);
    }

    // Only handle 401 (Unauthorized). Avoid infinite loops using _retry flag.
    if (status === 401 && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;

      const userStore = useUserStore();

      try {
        if (isRefreshing) {
          // If refresh already in progress, queue this request
          return new Promise((resolve, reject) => {
            requestQueue.push({ resolve, reject, originalConfig });
          });
        }

        // Mark refreshing and call store's refresh method
        isRefreshing = true;

        // IMPORTANT: refreshAccessToken should call the backend refresh endpoint
        // and update the store's token. It should return the new access token.
        const newToken = await userStore.refreshAccessToken();

        // Process queued requests with the new token
        processQueue(null, newToken);

        // Attach new token to original request and retry
        originalConfig.headers = originalConfig.headers || {};
        originalConfig.headers.Authorization = `Bearer ${newToken}`;

        isRefreshing = false;
        return request(originalConfig);
      } catch (refreshError) {
        // Refresh failed: reject queued requests and clear auth
        processQueue(refreshError, null);
        isRefreshing = false;

        // Optionally: clear tokens & redirect to login within store's refreshAccessToken
        // (we expect store.refreshAccessToken to clear auth on failure)
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default request;
