// src/utils/ApiSocket.js
import { ErrorSocket } from "./ErrorSocket";
import * as Sentry from "@sentry/react";


const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://campushub4293.pythonanywhere.com";

// ================================
// CSRF token helper
// ================================
function getCsrfToken() {
  // 1️⃣ Try localStorage first (authoritative source)
  try {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.csrf_token) {
        return parsed.csrf_token;
      }
    }
  } catch (err) {
    // console.warn("[API DEBUG] Failed to parse auth_user from localStorage", err);
    Sentry.captureException(err);
  }

  // 2️⃣ Fallback to cookie
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrf_token=`);
  if (parts.length === 2) return parts.pop().split(";").shift();

  return null;
}


// ================================
// Unified response handler
// ================================
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    window.dispatchEvent(new Event("auth:logout"));
    const errorMessage = data?.error || `HTTP ${res.status}`;
    const err = new Error(errorMessage);
    // Sentry.captureException(err);
    throw err;
  }

  if (!res.ok) {
    const errorMessage = data?.error || `HTTP ${res.status}`;
    const err = new Error(errorMessage);
    err.status = res.status;
    err.data = data;

    // Report to Sentry
    Sentry.captureException(err);
    ErrorSocket.emit(err);

    throw err;
  }

  return data;
};

// ================================
// Core request wrapper (FETCH)
// ================================
async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  // 🔥 AUTO detect FormData (no flags, no bugs)
  const isFormData = options.body instanceof FormData;

  // ✅ Always read CSRF token at request time
  const csrfToken = getCsrfToken();
  // console.log("[API DEBUG] CSRF Token at request:", csrfToken);

  const headers = {
    ...(options.headers || {}),
  };

  // ✅ Only set JSON header if NOT FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Attach CSRF header for mutating requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
      // console.log("[API DEBUG] CSRF Header Set");
    } else {
      // console.warn("[API DEBUG] CSRF Token missing for mutating request!");
    }
  }

  const fetchOptions = {
    method,
    headers,
    credentials: "include", // 🔥 send cookies (JWT + CSRF)
    body: options.body
      ? isFormData
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  };

  // console.log("[API DEBUG] Fetch Options:", fetchOptions);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, fetchOptions);
    return await handleResponse(res);
  } catch (err) {
    Sentry.captureException(err);
    ErrorSocket.emit(err); // 🔥 Emit global error event
    throw err;
  }
}

// ================================
// Public API helpers
// ================================
export const ApiSocket = {
  get: (path, options = {}) =>
    apiRequest(path, { method: "GET", ...options }),

  post: (path, body, options = {}) =>
    apiRequest(path, { method: "POST", body, ...options }),

  put: (path, body, options = {}) =>
    apiRequest(path, { method: "PUT", body, ...options }),

  patch: (path, body, options = {}) =>
    apiRequest(path, { method: "PATCH", body, ...options }),

  delete: (path, body = null, options = {}) =>
    apiRequest(path, { method: "DELETE", body, ...options }),
};

export default ApiSocket;


