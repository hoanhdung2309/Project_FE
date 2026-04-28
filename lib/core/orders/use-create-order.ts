"use client";

import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { getApiErrorMessage } from "@/lib/core/shared/errors";
import type { OrderCreateRequest, OrderResponse } from "@/types";

type CreateOrderOptions = {
  onSuccess?: (order: OrderResponse) => void;
  onError?: (message: string) => void;
};

export function useCreateOrder({ onSuccess, onError }: CreateOrderOptions = {}) {
  return useMutation({
    mutationFn: async (body: OrderCreateRequest) => {
      const { data } = await apiClient.post<OrderResponse>("/api/orders", body);
      return data;
    },
    onSuccess,
    onError: (err: unknown) => {
      onError?.(getApiErrorMessage(err, "Tạo đơn hàng thất bại. Vui lòng thử lại."));
    },
  });
}
