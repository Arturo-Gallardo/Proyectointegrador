import * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { apiLogin, apiRegister } from "api/client";

const AuthContext = createContext(null);

const TOKEN_KEY = "untitled_token";
const USER_KEY = "untitled_user";

function readStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());

  const persistSession = useCallback((sessionUser, token) => {
    setUser(sessionUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
      if (token) window.localStorage.setItem(TOKEN_KEY, token);
    }
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  const login = useCallback(
    async ({ email, password, prototypeRole }) => {
      try {
        const data = await apiLogin({ email, password });
        persistSession(
          {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            restaurantName: data.restaurantName,
          },
          data.token
        );
        return { ok: true, source: "api" };
      } catch {
        persistSession(
          {
            email,
            firstName: email.split("@")[0] || "Invitado",
            lastName: "",
            role: prototypeRole || "OWNER",
            restaurantName: "Mi perfil personal",
          },
          "demo-token"
        );
        return { ok: true, source: "demo" };
      }
    },
    [persistSession]
  );

  const signup = useCallback(
    async ({ email, password, firstName, lastName, prototypeRole }) => {
      try {
        const data = await apiRegister({
          email,
          password,
          firstName,
          lastName,
        });
        persistSession(
          {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            restaurantName: data.restaurantName,
          },
          data.token
        );
        return { ok: true, source: "api" };
      } catch {
        persistSession(
          {
            email,
            firstName: firstName || "Nuevo",
            lastName: lastName || "Usuario",
            role: prototypeRole || "MANAGER",
            restaurantName: "Mi perfil personal",
          },
          "demo-token"
        );
        return { ok: true, source: "demo" };
      }
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem(TOKEN_KEY)
      : null;

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
    }),
    [user, token, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
