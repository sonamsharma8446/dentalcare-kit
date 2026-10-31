// All calls to the backend go through this one function.
// In development "/api" is proxied to the Express server (see vite.config.js).
// In production set VITE_API_URL to your Render backend, e.g. https://xxx.onrender.com/api
const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const TOKEN_KEY = 'dentalcare_admin_token';

// The login token is kept in localStorage (wrapped in try/catch because it can be blocked).
export const tokenStore = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* private mode: the user just has to log in again after a refresh */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* nothing to clear */
    }
  },
};

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors || {}; // { fieldName: "message" } for form errors
  }
}

function toQueryString(params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== '' && value !== null && value !== undefined) query.set(key, value);
  }
  const text = query.toString();
  return text ? `?${text}` : '';
}

export async function api(path, { method = 'GET', body, params, signal } = {}) {
  const token = tokenStore.get();
  let response;
  try {
    response = await fetch(API_URL + path + toQueryString(params), {
      method,
      signal,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* the server sent no JSON */
  }

  if (!response.ok) {
    // An expired or invalid token: log out (but not for a wrong password on the login form)
    if (response.status === 401 && token && path !== '/auth/login') {
      tokenStore.clear();
      window.dispatchEvent(new Event('admin-unauthorized'));
    }
    throw new ApiError(data?.message || 'Something went wrong', response.status, data?.errors);
  }
  return data;
}
