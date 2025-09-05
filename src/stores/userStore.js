// src/stores/user.js
import { defineStore } from "pinia";
import router from "../router/index";
import {
  userLogin,
  refreshAccessToken as apiRefresh,
  userLogout,
} from "../api/user";
import { setToken, removeToken, getToken } from "../utils/auth";

let _refreshTimerId = null;
let _isRefreshing = false;
let _refreshPromise = null;

export const useUserStore = defineStore("USER", {
  state: () => ({
    token: "",
    userData: {},
  }),

  getters: {
    getLoginToken: (state) => state.token,
    userInfo: (state) => state.userData,
  },

  actions: {
    // --- Login: call API, store access token & user, start timer ---
    async login(payload) {
      try {
        const res = await userLogin(payload); // api call includes withCredentials
        if (res?.status === 200 && res.data) {
          const accessToken =
            res.data.tokens?.accessToken || res.data.accessToken;
          const user = res.data.user || res.data.user;

          if (!accessToken)
            throw new Error("No access token returned from login");

          // persist access token + user
          this.token = accessToken;
          setToken(accessToken);
          this.setUserData(user);

          // start periodic refresh
          this.startTokenRefreshTimer();

          return res;
        }
        throw new Error(res?.data?.message || "Login failed");
      } catch (err) {
        // bubble up for UI to show message
        throw err;
      }
    },

    // --- Logout: call API to revoke refresh cookie, clear local state, redirect ---
    async logout() {
      try {
        // call server to revoke refresh token / clear cookie
        await userLogout();
      } catch (e) {
        // ignore network errors but still clear local state
        console.warn("Logout API failed:", e);
      } finally {
        // clear client state and redirect
        this.loginTokenRemove();
        this.userData = {};
        router.push("/login");
      }
    },

    // Save token in state + storage (helper used elsewhere)
    loginToken(token) {
      this.token = token;
      setToken(token);
      this.startTokenRefreshTimer();
    },

    // Remove token from state + storage (helper)
    loginTokenRemove() {
      this.token = "";
      removeToken();
      this.stopTokenRefreshTimer();
    },

    setUserData(data) {
      this.userData = data || {};
      try {
        localStorage.setItem("users", JSON.stringify(this.userData));
      } catch (e) {
        console.warn("Unable to persist user data", e);
      }
    },

    getUserData() {
      return this.userData;
    },

    // Restore token + user on page load (call from main.js)
    pageLoadedORRefreshed() {
      this.token = getToken() || "";

      const metaData = localStorage.getItem("users");
      if (metaData) {
        try {
          const userInfo = JSON.parse(metaData);
          this.setUserData(userInfo);
        } catch (error) {
          console.error("Failed to parse user data from localStorage", error);
          this.userData = {};
        }
      }

      if (this.token) {
        this.startTokenRefreshTimer();
      }
    },

    // --- Refresh access token (single-flight) ---
    async refreshAccessToken() {
      if (_isRefreshing && _refreshPromise) return _refreshPromise;

      _isRefreshing = true;
      _refreshPromise = (async () => {
        try {
          // call refresh endpoint; server reads HttpOnly refresh cookie
          const resp = await apiRefresh(); // apiRefresh uses skipAuth + withCredentials

          const newAccessToken =
            resp?.data?.accessToken || resp?.data?.tokens?.accessToken;
          if (!newAccessToken)
            throw new Error("No accessToken returned from refresh endpoint");

          // persist new access token
          this.token = newAccessToken;
          setToken(newAccessToken);

          _isRefreshing = false;
          _refreshPromise = null;
          return newAccessToken;
        } catch (err) {
          // on failure, clear auth and rethrow so interceptors or callers can handle redirect
          this.loginTokenRemove();
          this.userData = {};
          _isRefreshing = false;
          _refreshPromise = null;
          throw err;
        }
      })();

      return _refreshPromise;
    },

    // --- Timer control: refresh every X ms (default 6 minutes) ---
    startTokenRefreshTimer(intervalMs = 6 * 60 * 1000) {
      this.stopTokenRefreshTimer();
      if (!this.token) return;

      _refreshTimerId = setInterval(async () => {
        try {
          await this.refreshAccessToken();
        } catch (err) {
          // refresh failed — refreshAccessToken already cleared auth
          console.warn("Periodic token refresh failed:", err);
        }
      }, intervalMs);
    },

    stopTokenRefreshTimer() {
      if (_refreshTimerId) {
        clearInterval(_refreshTimerId);
        _refreshTimerId = null;
      }
    },
  },
});
