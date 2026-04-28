"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { Product } from "@/types";
import { toProduct, type ApiProduct } from "./tier";

export function useProductsQuery() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiProduct[]>("/api/products");
      return data.map(toProduct);
    },
  });
}
