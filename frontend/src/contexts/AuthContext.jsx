import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { configureFetchWithAuth } from "../utils/fetchWithAuth";

const AuthContext = createContext();

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER"
};

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`;

function getFirstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function normalizeRole(roleValue) {
  if (!roleValue) return null;
  const normalized = String(roleValue).toUpperCase();
  if (normalized.includes("ADMIN")) return ROLES.ADMIN;
  if (normalized.includes("USER")) return ROLES.USER;
  return normalized;
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {

  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);

  const logout = useCallback(() => {
    setToken(null);
    setCurrentUser(null);
    setRole(null);
  }, []);

  useEffect(() => {
    configureFetchWithAuth({
      getToken: () => token,
      onUnauthorized: () => {
        if (token) {
          logout();
        }
      }
    });
  }, [token, logout]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    const resolvedToken = getFirstDefined(
      data?.token,
      data?.jwt,
      data?.accessToken,
      data?.access_token
    );

    if (!resolvedToken) {
      throw new Error("Login succeeded but token was missing");
    }

    const decodedPayload = decodeJwtPayload(resolvedToken);

    const userFromPayload =
      data?.user && typeof data.user === "object"
        ? data.user
        : {};

    const userFromRoot =
      data && typeof data === "object"
        ? data
        : {};

    const resolvedUserId = getFirstDefined(
      userFromPayload.id,
      userFromPayload.userId,
      userFromPayload.uid,
      userFromRoot.id,
      userFromRoot.userId,
      userFromRoot.uid,
      decodedPayload?.id,
      decodedPayload?.userId,
      decodedPayload?.uid,
      decodedPayload?.sub
    );

    const roleFromJwt = Array.isArray(decodedPayload?.roles)
      ? decodedPayload.roles[0]
      : decodedPayload?.role;

    const resolvedRole = normalizeRole(
      getFirstDefined(userFromPayload.role, userFromRoot.role, roleFromJwt)
    );

    const loggedInUser = {
      ...userFromRoot,
      ...userFromPayload,
      id: resolvedUserId ?? null,
      userId:
        getFirstDefined(userFromPayload.userId, userFromRoot.userId) ??
        resolvedUserId ??
        null,
      name:
        getFirstDefined(userFromPayload.name, userFromRoot.name, decodedPayload?.name) ??
        "",
      email:
        getFirstDefined(userFromPayload.email, userFromRoot.email, decodedPayload?.email, email) ??
        ""
    };

    setToken(resolvedToken);
    setCurrentUser(loggedInUser);
    setRole(resolvedRole);

    return {
      token: resolvedToken,
      user: loggedInUser,
      role: resolvedRole
    };
  };

  const value = {
    token,
    login,
    currentUser,
    role,
    setToken,
    setCurrentUser,
    setRole,
    logout,
    isAuthenticated: !!token,
    isAdmin: role === ROLES.ADMIN,
    isUser: role === ROLES.USER
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}