import request from "../utils/request";

export function userLogin(data) {
  return request({
    url: "auth/login", // change to "user/login" if your backend uses that route
    method: "post",
    data,
    withCredentials: true, // ensures refresh cookie (Set-Cookie) is accepted
    // don't set skipAuth here; it's a normal auth call
  });
}

export function refreshAccessToken() {
  return request({
    url: "auth/refresh", // change if backend uses a different route
    method: "post",
    data: {}, // body empty; server reads cookie
    skipAuth: true, // custom flag your interceptor should honor
    withCredentials: true,
  });
}

export function userLogout() {
  return request({
    url: "auth/logout", // change if needed
    method: "post",
    data: {},
    skipAuth: true, // skip auth (token might be expired)
    withCredentials: true,
  });
}

export function userRegistration(data) {
  return request({
    url: "user/register",
    method: "post",
    data,
  });
}
