import { createContext, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(Boolean(tokenStore.get())); // is a saved login still valid?

  // On page load: if a token is saved, ask the server who it belongs to.
  useEffect(() => {
    if (!tokenStore.get()) return;
    api('/auth/me')
      .then((result) => setAdmin(result.admin))
      .catch(() => tokenStore.clear())
      .finally(() => setChecking(false));
  }, []);

  // The API client announces this when the server says the token is no longer valid.
  useEffect(() => {
    const onUnauthorized = () => setAdmin(null);
    window.addEventListener('admin-unauthorized', onUnauthorized);
    return () => window.removeEventListener('admin-unauthorized', onUnauthorized);
  }, []);

  async function login(email, password) {
    const result = await api('/auth/login', { method: 'POST', body: { email, password } });
    tokenStore.set(result.token);
    setAdmin(result.admin);
  }

  function logout() {
    tokenStore.clear();
    setAdmin(null);
  }

  return <AuthContext.Provider value={{ admin, checking, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
