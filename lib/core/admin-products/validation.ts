import type { ProductResponse } from "@/types";

export function filterProducts(
  products: ProductResponse[],
  search: string,
): ProductResponse[] {
  const q = search.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.sku ?? "").toLowerCase().includes(q),
  );
}

export interface ProductFormValues {
  name: string;
  description: string;
  sku: string;
  baseRetailPrice: string;
  unit: string;
}

export type ProductFormError = "name-required" | "price-invalid";

export function validateProductForm(
  values: ProductFormValues,
): ProductFormError | null {
  if (!values.name.trim()) return "name-required";
  const price = parseFloat(values.baseRetailPrice);
  if (Number.isNaN(price) || price < 0) return "price-invalid";
  return null;
}

export function productFormErrorMessage(error: ProductFormError): string {
  switch (error) {
    case "name-required":
      return "Vui lòng nhập tên sản phẩm.";
    case "price-invalid":
      return "Giá lẻ không hợp lệ.";
  }
}

export interface PriceTierInput {
  minQuantity: number;
  unitPrice: number;
  tierName?: string;
}

export function validatePriceTiers(
  retailPrice: string,
  tiers: PriceTierInput[],
): { error: string | null; tiers: PriceTierInput[] } {
  const retail = parseFloat(retailPrice);
  if (Number.isNaN(retail) || retail < 0) {
    return { error: "Giá lẻ không hợp lệ.", tiers: [] };
  }
  const valid = tiers
    .filter((t) => t.minQuantity >= 0 && t.unitPrice >= 0)
    .sort((a, b) => a.minQuantity - b.minQuantity);
  if (valid.some((t) => t.unitPrice === 0)) {
    return { error: "Vui lòng nhập đơn giá cho tất cả các mức.", tiers: [] };
  }
  return { error: null, tiers: valid };
}

export const DEFAULT_PRICE_TIERS: PriceTierInput[] = [
  { minQuantity: 1, unitPrice: 0, tierName: "Lẻ" },
  { minQuantity: 100, unitPrice: 0, tierName: "Sỉ nhỏ" },
  { minQuantity: 500, unitPrice: 0, tierName: "Sỉ lớn" },
];
