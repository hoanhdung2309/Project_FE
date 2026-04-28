"use client";

import { createContext, use, type ReactNode } from "react";
import {
  useAuthSession,
  type AuthSession,
} from "@/lib/core/auth/use-auth-session";

const AuthContext = createContext<AuthSession | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useAuthSession();
  return <AuthContext value={session}>{children}</AuthContext>;
}

export function useAuth(): AuthSession {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
