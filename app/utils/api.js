// ─── Storage keys (user object only — tokens live in HttpOnly cookies) ────────
const ADMIN_USER_KEY      = "authUser";
const SUPERADMIN_USER_KEY = "superadminUser";

// ─── Local helpers ─────────────────────────────────────────────────────────────
const getStorageItem = (key) => {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(key); } catch { return null; }
};

const setStorageItem = (key, value) => {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, value); } catch { /* quota exceeded — non-fatal */ }
};

const removeStorageItem = (key) => {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(key); } catch { /* non-fatal */ }
};

const parseUser = (raw) => {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

// ─── Session management ────────────────────────────────────────────────────────
// Tokens are stored in HttpOnly cookies set by the Next.js session routes.
// Only the non-sensitive user object (name, email, role) stays in localStorage
// so the UI can render immediately without an extra network round-trip.

export const setAuthSession = async (token, user) => {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to save session");
  }
  setStorageItem(ADMIN_USER_KEY, JSON.stringify(user || null));
};

export const clearAuthSession = async () => {
  try {
    await fetch("/api/auth/session", { method: "DELETE" });
  } catch { /* network failure — continue to clear local state */ }
  removeStorageItem(ADMIN_USER_KEY);
};

export const getAuthUser = () => parseUser(getStorageItem(ADMIN_USER_KEY));

export const updateAuthUser = (updates) => {
  const next = { ...(getAuthUser() || {}), ...(updates || {}) };
  setStorageItem(ADMIN_USER_KEY, JSON.stringify(next));
  return next;
};

export const setSuperadminSession = async (token, user) => {
  const res = await fetch("/api/auth/superadmin-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to save superadmin session");
  }
  setStorageItem(SUPERADMIN_USER_KEY, JSON.stringify(user || null));
};

export const clearSuperadminSession = async () => {
  try {
    await fetch("/api/auth/superadmin-session", { method: "DELETE" });
  } catch { /* network failure — continue to clear local state */ }
  removeStorageItem(SUPERADMIN_USER_KEY);
};

export const getSuperadminUser = () => parseUser(getStorageItem(SUPERADMIN_USER_KEY));

// ─── API calls (routed through Next.js proxy — token never in browser JS) ─────

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : null;
  const text = isJson ? "" : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      // Fire-and-forget: clear the stale session without blocking the error throw
      clearAuthSession().catch(() => {});
    }
    throw new Error(
      data?.error || text || `Request failed with status ${response.status}`
    );
  }
  return data;
};

const withJsonHeaders = (options = {}) => {
  const body = options.body;
  const shouldMarkJson =
    typeof body === "string" &&
    body.length > 0 &&
    !(typeof FormData !== "undefined" && body instanceof FormData);

  if (!shouldMarkJson) return options;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return { ...options, headers };
};

export const apiCall = async (endpoint, options = {}) => {
  const url = `/api/proxy${endpoint}`;
  const response = await fetch(url, withJsonHeaders(options));
  return parseResponse(response);
};

export const superadminApiCall = async (endpoint, options = {}) => {
  const url = `/api/superadmin-proxy${endpoint}`;
  const response = await fetch(url, withJsonHeaders(options));

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : null;
  const text = isJson ? "" : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      clearSuperadminSession().catch(() => {});
    }
    throw new Error(
      data?.error || text || `Request failed with status ${response.status}`
    );
  }
  return data;
};

// ─── Raw authenticated fetch (for non-JSON responses such as ZIP downloads) ───
// Uses the same proxy so the token stays in the HttpOnly cookie.
export const authFetch = (endpoint, options = {}) =>
  fetch(`/api/proxy${endpoint}`, options);
