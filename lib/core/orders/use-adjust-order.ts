"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import apiClient from "@/lib/api-client";
import type {
  AdjustmentItemDto,
  AdjustOrderResult,
  OrderItemResponse,
  OrderResponse,
} from "@/types";

export interface AdjustmentRow {
  itemId: string;
  productName: string;
  unit: string;
  orderedQty: number;
  actualQty: number;
  unitPrice: number;
}

export interface AdjustOrderTotals {
  originalTotal: number;
  adjustedTotal: number;
  difference: number;
  hasChanges: boolean;
  changedRows: AdjustmentRow[];
}

export interface UseAdjustOrderReturn {
  order: OrderResponse | undefined;
  rows: AdjustmentRow[];
  totals: AdjustOrderTotals;
  setActualQty: (itemId: string, value: number) => void;
  submit: () => void;
  isLoading: boolean;
  isError: boolean;
  isPending: boolean;
  idempotencyKey: string;
}

interface Options {
  orderId: string;
  onSuccess?: (result: AdjustOrderResult) => void;
  onError?: (error: unknown) => void;
}

export function useAdjustOrder({
  orderId,
  onSuccess,
  onError,
}: Options): UseAdjustOrderReturn {
  /* Regenerated on error so user can safely retry; stable across re-renders otherwise */
  const idempotencyKeyRef = useRef(uuidv4());
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery<OrderResponse>({
    queryKey: ["admin-order", orderId],
    queryFn: async () => {
      const { data } = await apiClient.get<OrderResponse>(
        `/api/admin/orders/${orderId}`,
      );
      return data;
    },
  });

  useEffect(() => {
    if (!order?.items?.length) return;
    setAdjustments(
      Object.fromEntries(order.items.map((i) => [i.id, i.quantity])),
    );
  }, [order?.id, order?.items]);

  const items: OrderItemResponse[] = order?.items ?? [];

  const rows: AdjustmentRow[] = useMemo(
    () =>
      items.map((item) => ({
        itemId: item.id,
        productName: item.productName ?? "",
        unit: item.unit ?? "kg",
        orderedQty: item.quantity,
        actualQty: adjustments[item.id] ?? item.quantity,
        unitPrice: item.unitPrice,
      })),
    [items, adjustments],
  );

  const totals: AdjustOrderTotals = useMemo(() => {
    const originalTotal = rows.reduce(
      (s, r) => s + r.orderedQty * r.unitPrice,
      0,
    );
    const adjustedTotal = rows.reduce(
      (s, r) => s + r.actualQty * r.unitPrice,
      0,
    );
    const changedRows = rows.filter((r) => r.actualQty !== r.orderedQty);
    return {
      originalTotal,
      adjustedTotal,
      difference: adjustedTotal - originalTotal,
      hasChanges: changedRows.length > 0,
      changedRows,
    };
  }, [rows]);

  const setActualQty = useCallback((itemId: string, value: number) => {
    setAdjustments((prev) => ({ ...prev, [itemId]: Math.max(0, value) }));
  }, []);

  const { mutate, isPending } = useMutation<
    AdjustOrderResult,
    Error,
    AdjustmentItemDto[]
  >({
    mutationFn: async (body) => {
      const { data } = await apiClient.patch<AdjustOrderResult>(
        `/api/admin/orders/${orderId}/adjust`,
        body,
        { headers: { "Idempotency-Key": idempotencyKeyRef.current } },
      );
      return data;
    },
    onSuccess: (data) => onSuccess?.(data),
    onError: (err) => {
      idempotencyKeyRef.current = uuidv4();
      onError?.(err);
    },
  });

  const submit = useCallback(() => {
    const body: AdjustmentItemDto[] = rows.map((r) => ({
      orderItemId: r.itemId,
      actualQuantity: r.actualQty,
    }));
    mutate(body);
  }, [rows, mutate]);

  return {
    order,
    rows,
    totals,
    setActualQty,
    submit,
    isLoading,
    isError,
    isPending,
    idempotencyKey: idempotencyKeyRef.current,
  };
}
