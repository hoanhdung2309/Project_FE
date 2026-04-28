"use client";

import { useCallback, useMemo, useState } from "react";

export type SortId = "featured" | "price_asc" | "price_desc" | "new";

export const PRICE_MIN = 20000;
export const PRICE_MAX = 200000;

interface ProductLike<TCategory extends string, TSize extends string> {
  category: TCategory;
  size: TSize;
  certs: string[];
  price: number;
}

export interface UseProductFiltersOptions<
  TCategory extends string,
  TSize extends string,
  TProduct extends ProductLike<TCategory, TSize>,
> {
  products: ReadonlyArray<TProduct>;
  allCategories: ReadonlyArray<TCategory>;
  initialPriceMax?: number;
}

export function useProductFilters<
  TCategory extends string,
  TSize extends string,
  TProduct extends ProductLike<TCategory, TSize>,
>({
  products,
  allCategories,
  initialPriceMax = PRICE_MAX,
}: UseProductFiltersOptions<TCategory, TSize, TProduct>) {
  type CategoryId = TCategory | "all";

  const [category, setCategory] = useState<CategoryId>("all");
  const [size, setSize] = useState<TSize[]>([]);
  const [cert, setCert] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(initialPriceMax);
  const [sort, setSort] = useState<SortId>("featured");

  const counts = useMemo(() => {
    const map = { all: products.length } as Record<CategoryId, number>;
    for (const c of allCategories) {
      map[c] = 0;
    }
    for (const p of products) {
      map[p.category] = (map[p.category] ?? 0) + 1;
    }
    return map;
  }, [products, allCategories]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => category === "all" || p.category === category);
    if (size.length > 0) list = list.filter((p) => size.includes(p.size));
    if (cert.length > 0) list = list.filter((p) => cert.some((c) => p.certs.includes(c)));
    list = list.filter((p) => p.price <= priceMax);
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].reverse();
    return list;
  }, [products, category, size, cert, priceMax, sort]);

  const toggleSize = useCallback(
    (v: TSize) => setSize((arr) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])),
    [],
  );

  const toggleCert = useCallback(
    (v: string) => setCert((arr) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])),
    [],
  );

  const reset = useCallback(() => {
    setSize([]);
    setCert([]);
    setPriceMax(initialPriceMax);
  }, [initialPriceMax]);

  return {
    state: { category, size, cert, priceMax, sort },
    derived: { counts, filtered, hasResults: filtered.length > 0 },
    actions: {
      setCategory,
      toggleSize,
      toggleCert,
      setPriceMax,
      setSort,
      reset,
    },
  };
}

export type ProductFiltersApi<
  TCategory extends string,
  TSize extends string,
  TProduct extends ProductLike<TCategory, TSize>,
> = ReturnType<typeof useProductFilters<TCategory, TSize, TProduct>>;
