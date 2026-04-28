import {
  addDays,
  differenceInCalendarDays,
  format,
  isToday as isTodayFn,
  parseISO,
  startOfDay,
} from "date-fns";
import { enGB, vi, type Locale } from "date-fns/locale";

const LOCALES: Record<"vi" | "en", Locale> = { vi, en: enGB };

function toDate(value: string | Date): Date {
  return typeof value === "string" ? parseISO(value) : value;
}

export function formatShortDate(value: string | Date, lang: "vi" | "en" = "vi"): string {
  return format(toDate(value), "dd MMM yyyy", { locale: LOCALES[lang] });
}

export function expiresInDays(days: number, from: Date = new Date()): string {
  return addDays(from, days).toUTCString();
}

export function isToday(value: string | Date): boolean {
  return isTodayFn(toDate(value));
}

export function formatWeekdayLong(value: string | Date = new Date()): string {
  return format(toDate(value), "EEEE, dd/MM/yyyy", { locale: vi });
}

export function formatDate(value: string | Date): string {
  return format(toDate(value), "dd/MM/yyyy HH:mm");
}

export function formatDateOnly(value: string | Date): string {
  return format(toDate(value), "dd/MM/yyyy");
}

export function daysFromToday(value: string | Date): number {
  return differenceInCalendarDays(startOfDay(toDate(value)), startOfDay(new Date()));
}
