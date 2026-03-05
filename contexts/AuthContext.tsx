"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import apiClient from "@/lib/api-client";
import type { User, LoginRequest, LoginResponse, RegisterRequest } from "@/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

function persistSession(token: string, user: User) {
  localStorage.setItem("access_token", token);
  localStorage.setItem("user", JSON.stringify(user));
  setCookie("access_token", token);
}

function clearSession() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  deleteCookie("access_token");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Rehydrate session on mount; sync user from GET /api/auth/me when token exists */
  useEffect(() => {
    let cancelled = false;

    async function rehydrate() {
      try {
        const storedToken = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser) as User);
            } catch {
              /* ignore malformed JSON */
            }
          }

          /* Lấy thông tin user hiện tại từ JWT (GET /api/auth/me) */
          try {
            const { data } = await apiClient.get<User>("/api/auth/me");
            if (!cancelled && data) {
              setUser(data);
              localStorage.setItem("user", JSON.stringify(data));
            }
          } catch {
            /* Token hết hạn hoặc invalid → xóa session */
            if (!cancelled) clearSession();
            if (!cancelled) setToken(null);
            if (!cancelled) setUser(null);
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    rehydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const { data } = await apiClient.post<LoginResponse>(
      "/api/auth/login",
      credentials
    );
    // Backend field is `accessToken` (camelCase)
    persistSession(data.accessToken, data.user);
    setToken(data.accessToken);
    setUser(data.user);
  }, []);

  const register = useCallback(async (body: RegisterRequest) => {
    const { data } = await apiClient.post<LoginResponse>(
      "/api/auth/register",
      body
    );
    persistSession(data.accessToken, data.user);
    setToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      // Notify backend (best-effort; ignore errors)
      await apiClient.post("/api/auth/logout");
    } catch {
      /* ignore */
    } finally {
      clearSession();
      setToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === "Admin",   // backend sends "Admin", not "admin"
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
