import { expiresInDays } from "@/lib/utils/date";
import type { User } from "@/types";

const TOKEN_KEY = "access_token";
const USER_KEY = "user";
const COOKIE_NAME = "access_token";
const DEFAULT_COOKIE_DAYS = 7;

function setCookie(name: string, value: string, days = DEFAULT_COOKIE_DAYS) {
  if (typeof document === "undefined") return;
  const expires = expiresInDays(days);
  document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function loadStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function loadStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function persistSession(token: string, user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setCookie(COOKIE_NAME, token);
}

export function persistUser(user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  deleteCookie(COOKIE_NAME);
}
