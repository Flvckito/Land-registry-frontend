// Lightweight fetch wrapper that injects the JWT, handles JSON, and
// transparently refreshes a 401-expired access token using the refresh token.
import { tokenStorage } from "./tokenStorage";

const RAW_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export const API_BASE_URL = RAW_BASE.replace(/\/+$/, "");

async function refreshAccessToken() {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) throw new Error("No refresh token available.");
  const res = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    tokenStorage.clear();
    throw new Error("Session expired. Please sign in again.");
  }
  const data = await res.json();
  tokenStorage.setTokens({ access: data.access, refresh: data.refresh ?? refresh });
  return data.access;
}

async function doFetch(path, { method = "GET", body, headers = {}, auth = true, _retried = false } = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const finalHeaders = { Accept: "application/json", ...headers };
  let payload = body;
  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (auth) {
    const access = tokenStorage.getAccess();
    if (access) finalHeaders["Authorization"] = `Bearer ${access}`;
  }

  const res = await fetch(url, { method, headers: finalHeaders, body: payload });

  if (res.status === 401 && auth && !_retried) {
    try {
      await refreshAccessToken();
      return doFetch(path, { method, body, headers, auth, _retried: true });
    } catch (err) {
      throw err;
    }
  }

  if (res.status === 204) return null;

  const ctype = res.headers.get("content-type") || "";
  const data = ctype.includes("application/json") ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const message =
      (data && (data.detail || data.message || (typeof data === "string" ? data : JSON.stringify(data)))) ||
      `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const apiClient = {
  get: (path, opts) => doFetch(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => doFetch(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => doFetch(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => doFetch(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => doFetch(path, { ...opts, method: "DELETE" }),
};
