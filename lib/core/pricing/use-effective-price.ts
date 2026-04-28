"use client";

import { useEffect, useRef, useState } from "react";
import apiClient from "@/lib/api-client";
import type {
  PriceCalculationItem,
  PriceCalculationRequest,
  PriceCalculationResponse,
} from "@/types";

const DEBOUNCE_MS = 500;

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export interface UseEffectivePriceReturn {
  priceMap: Record<string, PriceCalculationItem>;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

export function useEffectivePrice(
  items: { productId: string; quantity: number }[],
): UseEffectivePriceReturn {
  const debouncedItems = useDebounce(
    JSON.stringify(items.filter((i) => i.quantity > 0)),
    DEBOUNCE_MS,
  );

  const [priceMap, setPriceMap] = useState<Record<string, PriceCalculationItem>>({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const parsed: { productId: string; quantity: number }[] =
      JSON.parse(debouncedItems);

    if (parsed.length === 0) {
      setPriceMap({});
      setTotalAmount(0);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    const body: PriceCalculationRequest = { items: parsed };

    apiClient
      .post<PriceCalculationResponse>("/api/orders/calculate-price", body, {
        signal: abortRef.current.signal,
      })
      .then(({ data }) => {
        const map: Record<string, PriceCalculationItem> = {};
        for (const item of data.itemPrices) {
          map[item.productId] = item;
        }
        setPriceMap(map);
        setTotalAmount(data.totalAmount);
      })
      .catch((err: { code?: string } | null) => {
        if (err?.code !== "ERR_CANCELED") {
          setError("Không thể tải giá. Vui lòng thử lại.");
        }
      })
      .finally(() => setIsLoading(false));
  }, [debouncedItems]);

  return { priceMap, totalAmount, isLoading, error };
}
