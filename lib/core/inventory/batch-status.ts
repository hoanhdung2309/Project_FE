import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import type { BatchStatus, InventoryBatch } from "@/types";
import { daysFromToday } from "@/lib/utils/date";

export const EXPIRING_SOON_DAYS = 14;
export const URGENT_DAYS = 7;
export const SHELF_LIFE_DAYS = 60;

export interface BatchStyle {
  dot: string;
  line: string;
  card: string;
  badge: string;
  text: string;
  label: string;
  icon: LucideIcon;
}

export function getBatchStyle(status: BatchStatus, days: number): BatchStyle {
  if (status === "Expired" || days < 0) {
    return {
      dot: "bg-red-500 ring-4 ring-red-100",
      line: "bg-red-200",
      card: "border-red-200 bg-red-50",
      badge: "bg-red-100 text-red-700",
      text: "text-red-600",
      label: "Đã hết hạn",
      icon: AlertCircle,
    };
  }
  if (days <= EXPIRING_SOON_DAYS) {
    return {
      dot: "bg-orange-500 ring-4 ring-orange-100",
      line: "bg-orange-200",
      card: "border-orange-200 bg-orange-50",
      badge: "bg-orange-100 text-orange-700",
      text: "text-orange-600",
      label: "Sắp hết hạn",
      icon: AlertTriangle,
    };
  }
  return {
    dot: "bg-cactus-500 ring-4 ring-cactus-100",
    line: "bg-cactus-200",
    card: "border-cactus-100 bg-white",
    badge: "bg-cactus-100 text-cactus-600",
    text: "text-cactus-600",
    label: "Còn mới",
    icon: CheckCircle2,
  };
}

export function getBatchDaysLabel(days: number): string {
  if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
  if (days === 0) return "Hết hạn HÔM NAY";
  return `Còn ${days} ngày`;
}

export function getProgressBarColor(days: number): string {
  if (days <= URGENT_DAYS) return "bg-red-400";
  if (days <= EXPIRING_SOON_DAYS) return "bg-orange-400";
  return "bg-cactus-400";
}

export function getProgressBarWidth(days: number): number {
  return Math.min(100, Math.max(0, (days / SHELF_LIFE_DAYS) * 100));
}

export interface BatchWithDays extends InventoryBatch {
  daysRemaining: number;
  style: BatchStyle;
}

export function enrichBatch(batch: InventoryBatch): BatchWithDays {
  const daysRemaining = daysFromToday(batch.expiryDate);
  return {
    ...batch,
    daysRemaining,
    style: getBatchStyle(batch.status, daysRemaining),
  };
}

export interface InventorySummary {
  total: number;
  expired: number;
  expiring: number;
  fresh: number;
  totalQuantity: number;
}

export function summarizeBatches(batches: BatchWithDays[]): InventorySummary {
  return {
    total: batches.length,
    expired: batches.filter((b) => b.daysRemaining < 0).length,
    expiring: batches.filter(
      (b) => b.daysRemaining >= 0 && b.daysRemaining <= EXPIRING_SOON_DAYS,
    ).length,
    fresh: batches.filter((b) => b.daysRemaining > EXPIRING_SOON_DAYS).length,
    totalQuantity: batches.reduce((s, b) => s + b.quantity, 0),
  };
}
