"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import type { InventoryBatch } from "@/types";
import {
  enrichBatch,
  summarizeBatches,
  type BatchWithDays,
  type InventorySummary,
} from "./batch-status";

interface UseInventoryBatchesReturn {
  batches: BatchWithDays[];
  summary: InventorySummary;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
}

export function useInventoryBatches(): UseInventoryBatchesReturn {
  const { data, isLoading, isFetching, refetch } = useQuery<InventoryBatch[]>({
    queryKey: ["inventory-batches"],
    queryFn: async () => {
      const { data } = await apiClient.get<InventoryBatch[]>(
        "/api/admin/inventory/batches?sort=expiryDate&order=asc",
      );
      return data;
    },
  });

  const batches = useMemo(() => (data ?? []).map(enrichBatch), [data]);
  const summary = useMemo(() => summarizeBatches(batches), [batches]);

  return {
    batches,
    summary,
    isLoading,
    isFetching,
    refetch: () => {
      refetch();
    },
  };
}
