import type { PriceTier, Product, ProductResponse } from "@/types";

export type ApiTier = {
  minQuantity: number;
  unitPrice: number;
  tierName?: string;
};

export type ApiProduct = ProductResponse & { priceTiers?: ApiTier[] };

export function buildPriceTiers(
  baseRetailPrice: number,
  raw: ApiTier[] = [],
): PriceTier[] {
  if (raw.length === 0) {
    return [{ minQuantity: 1, price: baseRetailPrice, label: "Lẻ" }];
  }
  const sorted = [...raw].sort((a, b) => a.minQuantity - b.minQuantity);
  return sorted.map((t, i) => {
    const next = sorted[i + 1];
    return {
      minQuantity: t.minQuantity,
      maxQuantity: next ? next.minQuantity - 1 : undefined,
      price: t.unitPrice,
      label: t.tierName ?? `Mức ${i + 1}`,
    };
  });
}

export function toProduct(res: ApiProduct): Product {
  const raw =
    res.priceTiers ?? (res as { wholesalePrices?: ApiTier[] }).wholesalePrices ?? [];
  return { ...res, priceTiers: buildPriceTiers(res.baseRetailPrice, raw) };
}

export function getActiveTier(tiers: PriceTier[], qty: number): PriceTier | null {
  if (qty === 0 || tiers.length === 0) return null;
  return [...tiers].reverse().find((t) => qty >= t.minQuantity) ?? tiers[0] ?? null;
}

export function getUnitPrice(
  product: Product,
  qty: number,
  priceMap: Record<string, { unitPrice: number }>,
): number {
  const fromApi = priceMap[product.id]?.unitPrice;
  if (fromApi != null) return fromApi;
  const tiers = product.priceTiers ?? [];
  if (tiers.length === 0) return product.baseRetailPrice;
  const sorted = [...tiers].sort((a, b) => b.minQuantity - a.minQuantity);
  const tier = sorted.find((t) => qty >= t.minQuantity);
  return tier?.price ?? product.baseRetailPrice;
}

export function getDisplayPrice(
  product: Product,
  qty: number,
  priceMap: Record<string, { unitPrice: number }>,
): { price: number; tierLabel: string | undefined } {
  const effective = priceMap[product.id];
  const activeTier = getActiveTier(product.priceTiers ?? [], qty);
  const fallback =
    activeTier?.price ?? product.priceTiers?.[0]?.price ?? product.baseRetailPrice;
  return {
    price: effective ? effective.unitPrice : fallback,
    tierLabel: activeTier?.label,
  };
}
