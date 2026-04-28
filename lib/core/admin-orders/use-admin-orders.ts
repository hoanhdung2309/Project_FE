"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import apiClient from "@/lib/api-client";
import { getApiErrorMessage } from "@/lib/core/shared/errors";
import { isToday } from "@/lib/utils/date";
import type {
  ConfirmOrderResult,
  OrderItemResponse,
  OrderListItem,
  OrderOrderItem,
  OrderResponse,
  OrderStatus,
} from "@/types";
import { getOrderCustomerName, normalizeOrderStatus } from "@/types";

export interface OrderDetailLine {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export function getOrderDetailLines(order: OrderResponse): OrderDetailLine[] {
  const raw = order.orderItems ?? order.items ?? [];
  return raw.map((item: OrderOrderItem | OrderItemResponse) => {
    const qty =
      "actualQuantity" in item && item.actualQuantity != null
        ? item.actualQuantity
        : item.quantity;
    const lineTotal =
      "lineTotal" in item && typeof item.lineTotal === "number"
        ? item.lineTotal
        : item.unitPrice * qty;
    const productName = "productName" in item ? item.productName : undefined;
    return {
      id: item.id,
      productId: item.productId,
      productName,
      quantity: qty,
      unitPrice: item.unitPrice,
      lineTotal,
    };
  });
}

export function getOrderDetailCustomerName(order: OrderResponse): string {
  return order.user?.displayName ?? order.user?.email ?? order.userId;
}

const ORDERS_KEY = ["admin-orders"] as const;

export const ALL_ORDER_STATUSES: OrderStatus[] = [
  "Draft",
  "Submitted",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  Draft: "Nháp",
  Submitted: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Shipped: "Đang giao",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
};

export function useAdminOrdersQuery() {
  return useQuery<OrderListItem[]>({
    queryKey: ORDERS_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<OrderListItem[]>("/api/orders");
      return data;
    },
  });
}

export function useAdminOrderDetail(orderId: string) {
  return useQuery<OrderResponse>({
    queryKey: ["admin-order", orderId],
    queryFn: async () => {
      const { data } = await apiClient.get<OrderResponse>(
        `/api/admin/orders/${orderId}`,
      );
      return data;
    },
    enabled: Boolean(orderId),
  });
}

type ConfirmCallbacks = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function useConfirmOrder({ onSuccess, onError }: ConfirmCallbacks = {}) {
  const qc = useQueryClient();
  return useMutation<ConfirmOrderResult, Error, string>({
    mutationFn: async (orderId) => {
      const { data } = await apiClient.post<ConfirmOrderResult>(
        `/api/orders/${orderId}/confirm`,
        null,
        { headers: { "Idempotency-Key": uuidv4() } },
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ORDERS_KEY });
      onSuccess?.();
    },
    onError: (err: unknown) => {
      onError?.(getApiErrorMessage(err, "Xác nhận thất bại. Vui lòng thử lại."));
    },
  });
}

export function filterOrders(
  orders: OrderListItem[],
  search: string,
  statusFilter: OrderStatus | "All",
): OrderListItem[] {
  const q = search.trim().toLowerCase();
  return orders.filter((o) => {
    const customerName = getOrderCustomerName(o);
    const matchSearch =
      !q ||
      (o.orderCode ?? o.orderNumber ?? "").toLowerCase().includes(q) ||
      customerName.toLowerCase().includes(q) ||
      (o.user?.email ?? "").toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "All" || normalizeOrderStatus(o.status) === statusFilter;
    return matchSearch && matchStatus;
  });
}

export function countOrdersByStatus(
  orders: OrderListItem[],
): Record<OrderStatus, number> {
  return ALL_ORDER_STATUSES.reduce(
    (acc, s) => ({
      ...acc,
      [s]: orders.filter((o) => normalizeOrderStatus(o.status) === s).length,
    }),
    {} as Record<OrderStatus, number>,
  );
}

export interface AdminDashboardSummary {
  ordersToday: OrderListItem[];
  revenueToday: number;
  submittedCount: number;
  recentOrders: OrderListItem[];
}

export function summarizeAdminDashboard(
  orders: OrderListItem[],
  recentLimit = 5,
): AdminDashboardSummary {
  const ordersToday = orders.filter((o) => isToday(o.createdAtUtc));
  const revenueToday = ordersToday.reduce((sum, o) => sum + o.totalAmount, 0);
  const submittedCount = orders.filter(
    (o) => normalizeOrderStatus(o.status) === "Submitted",
  ).length;
  const recentOrders = orders.slice(0, recentLimit);
  return { ordersToday, revenueToday, submittedCount, recentOrders };
}
