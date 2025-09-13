// src/utils/authGuard.js
// Global router guard: ensures auth & role-based access. Uses userStore.refreshAccessToken()
// Adjust import paths if your project doesn't use `@` alias (use relative paths).

import { useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore"; // <-- if your store file is src/stores/user.js
import { getToken } from "../utils/auth"; // your existing token util (returns stored access token)

export default async function authGuard(to, from) {
  const router = useRouter(); // only for possible programmatic redirect (not required)
  const userStore = useUserStore();

  // 1) hydrate store if you have restore helper (best-effort)
  if (typeof userStore.pageLoadedORRefreshed === "function") {
    try {
      userStore.pageLoadedORRefreshed();
    } catch (e) {
      // ignore hydration errors
      // console.warn("hydrate failed", e);
    }
  }

  const requiresAuth = !!to.meta?.requiresAuth;
  const allowedRoles = to.meta?.roles || null;

  // If route doesn't require auth -> allow
  if (!requiresAuth) return true;

  // 2) get token (from store or storage)
  const token = userStore.token || getToken();
  if (!token) {
    // not logged in
    return { path: "/", replace: true };
  }

  // 3) If token expired (or will expire within X seconds) -> try refresh
  //    tokenExpired(token, 30) returns true if token already expired or will expire in 30s
  if (tokenExpired(token, 30)) {
    if (typeof userStore.refreshAccessToken === "function") {
      try {
        await userStore.refreshAccessToken();
        // refresh succeeded -> store.token updated
      } catch (err) {
        // refresh failed -> clear state & redirect to home
        try {
          userStore.loginTokenRemove && userStore.loginTokenRemove();
          userStore.userData = {};
        } catch (e) {}
        return { path: "/", replace: true };
      }
    } else {
      // no refresh available -> redirect
      return { path: "/", replace: true };
    }
  }

  // 4) ensure user data exists
  const user = userStore.userData || null;
  if (!user || !user._id) {
    return { path: "/", replace: true };
  }

  // 5) role-based access
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return { path: "/", replace: true };
    }
  }

  // all good
  return true;
}

/* -------------------------
   Helpers
   ------------------------- */

/**
 * tokenExpired(token, withinSeconds = 0)
 * - decodes JWT payload (no external dependency)
 * - returns true if token has expired or will expire within `withinSeconds`
 */
function tokenExpired(token, withinSeconds = 0) {
  if (!token) return true;
  try {
    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== "number") return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now + Number(withinSeconds || 0);
  } catch (err) {
    // if anything fails while parsing, treat token as invalid/expired
    return true;
  }
}

/**
 * decodeJwtPayload(token)
 * - small base64url -> JSON decoder using browser atob()
 */
function decodeJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length < 2) throw new Error("Invalid JWT");
  // base64url -> base64
  let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  // pad
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);
  // decode
  const json =
    typeof atob === "function"
      ? atob(b64)
      : Buffer.from(b64, "base64").toString("utf8");
  return JSON.parse(json);
}
