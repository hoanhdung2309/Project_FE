"use client";

import { useCallback, useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "@/types";
import {
  clearSession,
  loadStoredToken,
  loadStoredUser,
  persistSession,
  persistUser,
} from "./session";

export interface AuthSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuthSession(): AuthSession {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function rehydrate() {
      const storedToken = loadStoredToken();
      if (!storedToken) {
        if (!cancelled) setIsLoading(false);
        return;
      }
      setToken(storedToken);
      const storedUser = loadStoredUser();
      if (storedUser) setUser(storedUser);

      try {
        const { data } = await apiClient.get<User>("/api/auth/me");
        if (cancelled || !data) return;
        setUser(data);
        persistUser(data);
      } catch {
        if (cancelled) return;
        clearSession();
        setToken(null);
        setUser(null);
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
      credentials,
    );
    persistSession(data.accessToken, data.user);
    setToken(data.accessToken);
    setUser(data.user);
  }, []);

  const register = useCallback(async (body: RegisterRequest) => {
    const { data } = await apiClient.post<LoginResponse>(
      "/api/auth/register",
      body,
    );
    persistSession(data.accessToken, data.user);
    setToken(data.accessToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch {
      /* best-effort */
    } finally {
      clearSession();
      setToken(null);
      setUser(null);
    }
  }, []);

  return {
    user,
    token,
    isAuthenticated: token !== null,
    isAdmin: user?.role === "Admin",
    isLoading,
    login,
    register,
    logout,
  };
}
