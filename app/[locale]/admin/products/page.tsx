"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  AlertCircle,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { formatVND, formatDate } from "@/lib/utils";
import {
  useAdminProductsQuery,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateProductPrices,
} from "@/lib/core/admin-products/use-admin-products";
import {
  DEFAULT_PRICE_TIERS,
  filterProducts,
  productFormErrorMessage,
  validatePriceTiers,
  validateProductForm,
  type PriceTierInput,
} from "@/lib/core/admin-products/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type {
  ProductResponse,
  ProductCreateRequest,
  ProductUpdateRequest,
  UpdatePriceRequest,
  WholesalePrice,
} from "@/types";

const DEFAULT_UNIT = "kg";

type DialogState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; product: ProductResponse }
  | { type: "price"; product: ProductResponse }
  | { type: "delete"; product: ProductResponse };

export default function AdminProductsPage() {
  const t = useTranslations("admin.products");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const close = () => setDialog({ type: "none" });

  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useAdminProductsQuery();
  const products = productsData ?? [];

  const { mutate: createProduct, isPending: creating } = useCreateProduct({
    onSuccess: () => {
      toast.success(t("toast.created"));
      close();
    },
    onError: (msg) => toast.error(msg),
  });

  const { mutate: updateProduct, isPending: updating } = useUpdateProduct({
    onSuccess: () => {
      toast.success(t("toast.updated"));
      close();
    },
    onError: (msg) => toast.error(msg),
  });

  const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct({
    onSuccess: () => {
      toast.success(t("toast.deleted"));
      close();
    },
    onError: (msg) => toast.error(msg),
  });

  const { mutate: updatePrices, isPending: updatingPrices } = useUpdateProductPrices({
    onSuccess: () => {
      toast.success(t("toast.pricesUpdated"));
      close();
    },
    onError: (msg) => toast.error(msg),
  });

  const filtered = filterProducts(products, search);

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[320px]">
        <div className="blob-pitaya animate-blob absolute -top-16 right-[6%] h-[300px] w-[300px] rounded-full" />
      </div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap animate-fade-in-up">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pitaya-600">{t("eyebrow")}</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-dragon-dark mt-1">
            {t("title.prefix")} <span className="text-gradient-pitaya">{t("title.highlight")}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">{t("totalCount", { count: products.length })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            {t("action.refresh")}
          </Button>
          <Button variant="gradient" size="sm" onClick={() => setDialog({ type: "create" })}>
            <Plus className="w-4 h-4" />
            {t("action.add")}
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder={t("search.placeholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="border-slate-100">
        <CardContent className="p-0">
          {isError && (
            <div className="flex items-center gap-2 text-red-500 text-sm p-4 bg-red-50 border-b border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {t("error.loadFailed")}
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>{t("table.nameSku")}</TableHead>
                <TableHead>{t("table.unit")}</TableHead>
                <TableHead className="text-right">{t("table.retailPrice")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.createdAt")}</TableHead>
                <TableHead className="text-right">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    {t("empty.noProducts")}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-dragon-dark">{product.name}</p>
                        {product.sku && (
                          <p className="text-xs text-slate-400 font-mono">{product.sku}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{product.unit}</TableCell>
                    <TableCell className="text-right font-semibold text-dragon-dark">
                      {formatVND(product.baseRetailPrice)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.isActive ? "bg-cactus-100 text-cactus-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {product.isActive ? t("status.active") : t("status.inactive")}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {formatDate(product.createdAtUtc)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          title={t("action.updatePrice")}
                          onClick={() => setDialog({ type: "price", product })}
                        >
                          <DollarSign className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title={t("action.edit")}
                          onClick={() => setDialog({ type: "edit", product })}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          title={t("action.delete")}
                          onClick={() => setDialog({ type: "delete", product })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {dialog.type === "create" && (
        <CreateProductDialog
          onClose={close}
          onSubmit={(body) => createProduct(body)}
          isPending={creating}
        />
      )}

      {dialog.type === "edit" && (
        <EditProductDialog
          product={dialog.product}
          onClose={close}
          onSubmit={(body) => updateProduct({ id: dialog.product.id, body })}
          isPending={updating}
        />
      )}

      {dialog.type === "price" && (
        <UpdatePricesDialog
          product={dialog.product}
          onClose={close}
          onSubmit={(body) => updatePrices({ id: dialog.product.id, body })}
          isPending={updatingPrices}
        />
      )}

      {dialog.type === "delete" && (
        <Dialog open onOpenChange={(open) => !open && close()}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{t("delete.title")}</DialogTitle>
              <DialogDescription>
                {t("delete.description", { name: dialog.product.name })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={close}>
                {t("action.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteProduct(dialog.product.id)}
                disabled={deleting}
              >
                {deleting ? t("action.deleting") : t("action.delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function CreateProductDialog({
  onClose,
  onSubmit,
  isPending,
}: {
  onClose: () => void;
  onSubmit: (body: ProductCreateRequest) => void;
  isPending: boolean;
}) {
  const t = useTranslations("admin.products");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [baseRetailPrice, setBaseRetailPrice] = useState("");
  const [unit, setUnit] = useState(DEFAULT_UNIT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateProductForm({ name, description, sku, baseRetailPrice, unit });
    if (error) {
      toast.error(productFormErrorMessage(error));
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      sku: sku.trim() || undefined,
      baseRetailPrice: parseFloat(baseRetailPrice),
      unit: unit.trim() || DEFAULT_UNIT,
    });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="create-name">{t("form.nameLabel")}</Label>
            <Input
              id="create-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("form.namePlaceholder")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="create-desc">{t("form.descLabel")}</Label>
            <Input
              id="create-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("form.optional")}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="create-sku">{t("form.skuLabel")}</Label>
            <Input
              id="create-sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder={t("form.optional")}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="create-price">{t("form.retailPriceLabel")}</Label>
              <Input
                id="create-price"
                type="number"
                min={0}
                step={1000}
                value={baseRetailPrice}
                onChange={(e) => setBaseRetailPrice(e.target.value)}
                placeholder="0"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="create-unit">{t("form.unitLabel")}</Label>
              <Input
                id="create-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="kg"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              {t("action.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("action.creating") : t("action.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditProductDialog({
  product,
  onClose,
  onSubmit,
  isPending,
}: {
  product: ProductResponse;
  onClose: () => void;
  onSubmit: (body: ProductUpdateRequest) => void;
  isPending: boolean;
}) {
  const t = useTranslations("admin.products");
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [sku, setSku] = useState(product.sku ?? "");
  const [baseRetailPrice, setBaseRetailPrice] = useState(String(product.baseRetailPrice));
  const [unit, setUnit] = useState(product.unit || DEFAULT_UNIT);
  const [isActive, setIsActive] = useState(product.isActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateProductForm({ name, description, sku, baseRetailPrice, unit });
    if (error) {
      toast.error(productFormErrorMessage(error));
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      sku: sku.trim() || undefined,
      baseRetailPrice: parseFloat(baseRetailPrice),
      unit: unit.trim() || DEFAULT_UNIT,
      isActive,
    });
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("edit.title")}</DialogTitle>
          <DialogDescription>{t("edit.description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">{t("form.nameLabel")}</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="edit-desc">{t("form.descLabel")}</Label>
            <Input
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="edit-sku">{t("form.skuLabel")}</Label>
            <Input id="edit-sku" value={sku} onChange={(e) => setSku(e.target.value)} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-price">{t("form.retailPriceLabel")}</Label>
              <Input
                id="edit-price"
                type="number"
                min={0}
                step={1000}
                value={baseRetailPrice}
                onChange={(e) => setBaseRetailPrice(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-unit">{t("form.unitLabel")}</Label>
              <Input id="edit-unit" value={unit} onChange={(e) => setUnit(e.target.value)} className="mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-slate-300"
            />
            <Label htmlFor="edit-active">{t("form.activeLabel")}</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              {t("action.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("action.saving") : t("action.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UpdatePricesDialog({
  product,
  onClose,
  onSubmit,
  isPending,
}: {
  product: ProductResponse;
  onClose: () => void;
  onSubmit: (body: UpdatePriceRequest) => void;
  isPending: boolean;
}) {
  const t = useTranslations("admin.products");
  const [retailPrice, setRetailPrice] = useState(String(product.baseRetailPrice));
  const [tiers, setTiers] = useState<PriceTierInput[]>(() => {
    const wp = product.wholesalePrices ?? [];
    if (wp.length > 0) {
      return wp.map((t) => ({
        minQuantity: t.minQuantity,
        unitPrice: t.unitPrice,
        tierName: t.tierName,
      }));
    }
    return DEFAULT_PRICE_TIERS;
  });

  // Resync when product changes
  useEffect(() => {
    setRetailPrice(String(product.baseRetailPrice));
    const wp = product.wholesalePrices ?? [];
    setTiers(
      wp.length > 0
        ? wp.map((t) => ({
            minQuantity: t.minQuantity,
            unitPrice: t.unitPrice,
            tierName: t.tierName,
          }))
        : DEFAULT_PRICE_TIERS,
    );
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validatePriceTiers(retailPrice, tiers);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    onSubmit({
      retailPrice: parseFloat(retailPrice),
      tiers: result.tiers,
    });
  };

  const addTier = () => {
    const maxMin = Math.max(0, ...tiers.map((t) => t.minQuantity));
    setTiers([...tiers, { minQuantity: maxMin + 100, unitPrice: 0, tierName: "" }]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, field: keyof WholesalePrice, value: number | string) => {
    setTiers(tiers.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("prices.title")}</DialogTitle>
          <DialogDescription>
            {t("prices.description", { name: product.name })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="price-retail">{t("form.retailPriceLabel")}</Label>
            <Input
              id="price-retail"
              type="number"
              min={0}
              step={1000}
              value={retailPrice}
              onChange={(e) => setRetailPrice(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>{t("prices.wholesaleLabel")}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTier}>
                <Plus className="w-3 h-3" /> {t("prices.addTier")}
              </Button>
            </div>
            <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
              {tiers.map((tier, i) => (
                <div key={i} className="flex items-center gap-2 flex-wrap">
                  <Input
                    type="number"
                    min={0}
                    placeholder={t("prices.minQtyPlaceholder")}
                    value={tier.minQuantity || ""}
                    onChange={(e) => updateTier(i, "minQuantity", parseInt(e.target.value) || 0)}
                    className="w-24"
                  />
                  <Input
                    type="number"
                    min={0}
                    step={1000}
                    placeholder={t("prices.unitPricePlaceholder")}
                    value={tier.unitPrice || ""}
                    onChange={(e) => updateTier(i, "unitPrice", parseFloat(e.target.value) || 0)}
                    className="w-32"
                  />
                  <Input
                    placeholder={t("prices.tierNamePlaceholder")}
                    value={tier.tierName ?? ""}
                    onChange={(e) => updateTier(i, "tierName", e.target.value)}
                    className="flex-1 min-w-[100px]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => removeTier(i)}
                    disabled={tiers.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              {t("action.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("action.saving") : t("prices.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
