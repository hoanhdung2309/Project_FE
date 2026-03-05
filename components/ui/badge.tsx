import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:    "bg-slate-100 text-slate-700",
        pitaya:     "bg-pitaya-100 text-pitaya-700",
        cactus:     "bg-cactus-100 text-cactus-600",
        /* OrderStatus variants – match backend enum */
        draft:      "bg-slate-100 text-slate-600",
        submitted:  "bg-amber-100 text-amber-700",    // awaiting admin confirmation
        confirmed:  "bg-blue-100 text-blue-700",
        shipped:    "bg-cyan-100 text-cyan-700",
        delivered:  "bg-cactus-100 text-cactus-600",
        cancelled:  "bg-red-100 text-red-600",
        /* Inventory variants */
        fresh:      "bg-cactus-100 text-cactus-600",
        expiring:   "bg-orange-100 text-orange-700",
        expired:    "bg-red-100 text-red-600",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

/* ── Backend OrderStatus → Badge variant/label ── */
const STATUS_VARIANT_MAP: Record<
  OrderStatus,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  Draft:     "draft",
  Submitted: "submitted",
  Confirmed: "confirmed",
  Shipped:   "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

const STATUS_LABEL_MAP: Record<OrderStatus, string> = {
  Draft:     "Nháp",
  Submitted: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Shipped:   "Đang giao",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={STATUS_VARIANT_MAP[status]}>
      {STATUS_LABEL_MAP[status] ?? status}
    </Badge>
  );
}

export { Badge, badgeVariants };
