// src/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

function getCSRFCookie(name = "csrftoken") {
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[2]) : null;
}
api.interceptors.request.use(cfg => {
  if (/(post|put|patch|delete)/i.test(cfg.method || "")) {
    const t = getCSRFCookie();
    if (t && !cfg.headers["X-CSRFToken"]) cfg.headers["X-CSRFToken"] = t;
  }
  return cfg;
});

// Named exports expected by your code:
export function getCSRF() { return api.get("/auth/csrf/"); }
export function login(username, password) { return api.post("/auth/login/", { username, password }); }
export function me() { return api.get("/auth/me/"); }
export function logout() { return api.post("/auth/logout/"); }

// (optional) also export a grouped helper object
export const auth = { csrf: getCSRF, login, me, logout };
