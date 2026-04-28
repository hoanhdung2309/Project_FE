import { setRequestLocale } from "next-intl/server";
import { DragonShell } from "@/components/dragon/shell";
import { ProductsPage } from "@/components/dragon/products-page";

export default async function Products({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <DragonShell active="products">
      <ProductsPage />
    </DragonShell>
  );
}
