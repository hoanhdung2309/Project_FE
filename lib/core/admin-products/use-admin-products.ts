"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { getApiErrorMessage } from "@/lib/core/shared/errors";
import type {
  ProductResponse,
  ProductCreateRequest,
  ProductUpdateRequest,
  UpdatePriceRequest,
} from "@/types";

const PRODUCTS_KEY = ["products"] as const;

type Callbacks = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function useAdminProductsQuery() {
  return useQuery<ProductResponse[]>({
    queryKey: PRODUCTS_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<ProductResponse[]>("/api/products");
      return data;
    },
  });
}

export function useCreateProduct({ onSuccess, onError }: Callbacks = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: ProductCreateRequest) => {
      const { data } = await apiClient.post<ProductResponse>("/api/products", body);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
      onSuccess?.();
    },
    onError: (err: unknown) => {
      onError?.(getApiErrorMessage(err, "Tạo sản phẩm thất bại."));
    },
  });
}

export function useUpdateProduct({ onSuccess, onError }: Callbacks = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: ProductUpdateRequest }) => {
      await apiClient.put(`/api/products/${id}`, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
      onSuccess?.();
    },
    onError: (err: unknown) => {
      onError?.(getApiErrorMessage(err, "Cập nhật thất bại."));
    },
  });
}

export function useDeleteProduct({ onSuccess, onError }: Callbacks = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
      onSuccess?.();
    },
    onError: (err: unknown) => {
      onError?.(getApiErrorMessage(err, "Xóa thất bại."));
    },
  });
}

export function useUpdateProductPrices({ onSuccess, onError }: Callbacks = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdatePriceRequest }) => {
      await apiClient.put(`/api/products/${id}/prices`, body);
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
      qc.invalidateQueries({ queryKey: ["product", id] });
      onSuccess?.();
    },
    onError: (err: unknown) => {
      onError?.(getApiErrorMessage(err, "Cập nhật giá thất bại."));
    },
  });
}
