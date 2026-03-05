"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import apiClient from "@/lib/api-client";
import { formatVND, formatDate } from "@/lib/utils";
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

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

  /* GET /api/products */
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<ProductResponse[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await apiClient.get<ProductResponse[]>("/api/products");
      return data;
    },
  });

  /* POST /api/products */
  const { mutate: createProduct, isPending: creating } = useMutation({
    mutationFn: async (body: ProductCreateRequest) => {
      const { data } = await apiClient.post<ProductResponse>("/api/products", body);
      return data;
    },
    onSuccess: () => {
      toast.success("Đã tạo sản phẩm.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setCreateOpen(false);
    },
    onError: (err) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Tạo sản phẩm thất bại.";
      toast.error(msg);
    },
  });

  /* PUT /api/products/{id} */
  const { mutate: updateProduct, isPending: updating } = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: ProductUpdateRequest }) => {
      await apiClient.put(`/api/products/${id}`, body);
    },
    onSuccess: () => {
      toast.success("Đã cập nhật sản phẩm.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditOpen(false);
      setSelectedProduct(null);
    },
    onError: (err) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Cập nhật thất bại.";
      toast.error(msg);
    },
  });

  /* DELETE /api/products/{id} */
  const { mutate: deleteProduct, isPending: deleting } = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      toast.success("Đã xóa sản phẩm.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteOpen(false);
      setSelectedProduct(null);
    },
    onError: (err) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Xóa thất bại.";
      toast.error(msg);
    },
  });

  /* PUT /api/products/{id}/prices (Bearer Admin) */
  const { mutate: updatePrices, isPending: updatingPrices } = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdatePriceRequest }) => {
      const { data } = await apiClient.put<{ message?: string }>(`/api/products/${id}/prices`, body);
      return data;
    },
    onSuccess: (_, { id }) => {
      toast.success("Đã cập nhật giá. Cache đã xóa.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      setPriceOpen(false);
      setSelectedProduct(null);
    },
    onError: (err) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Cập nhật giá thất bại.";
      toast.error(msg);
    },
  });

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-dragon-dark">Quản lý Sản phẩm</h1>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} sản phẩm</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Tìm theo tên, SKU..."
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
              Không thể tải danh sách sản phẩm.
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Tên / SKU</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead className="text-right">Giá lẻ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
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
                    Không có sản phẩm nào.
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
                        {product.isActive ? "Đang bán" : "Tắt"}
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
                          title="Cập nhật giá"
                          onClick={() => {
                            setSelectedProduct(product);
                            setPriceOpen(true);
                          }}
                        >
                          <DollarSign className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Sửa"
                          onClick={() => {
                            setSelectedProduct(product);
                            setEditOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          title="Xóa"
                          onClick={() => {
                            setSelectedProduct(product);
                            setDeleteOpen(true);
                          }}
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

      {/* Create dialog */}
      <CreateProductDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={(body) => createProduct(body)}
        isPending={creating}
      />

      {/* Edit dialog */}
      <EditProductDialog
        open={editOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
          setEditOpen(open);
        }}
        product={selectedProduct}
        onSubmit={(body) => selectedProduct && updateProduct({ id: selectedProduct.id, body })}
        isPending={updating}
      />

      {/* Update prices dialog */}
      <UpdatePricesDialog
        open={priceOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
          setPriceOpen(open);
        }}
        product={selectedProduct}
        onSubmit={(body) => selectedProduct && updatePrices({ id: selectedProduct.id, body })}
        isPending={updatingPrices}
      />

      {/* Delete confirm */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xóa sản phẩm</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa &quot;{selectedProduct?.name}&quot;? Hành động không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedProduct && deleteProduct(selectedProduct.id)}
              disabled={deleting}
            >
              {deleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ── Create product form ── */
function CreateProductDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: ProductCreateRequest) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [baseRetailPrice, setBaseRetailPrice] = useState("");
  const [unit, setUnit] = useState(DEFAULT_UNIT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(baseRetailPrice);
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      toast.error("Giá lẻ không hợp lệ.");
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      sku: sku.trim() || undefined,
      baseRetailPrice: price,
      unit: unit.trim() || DEFAULT_UNIT,
    });
  };

  const reset = () => {
    setName("");
    setDescription("");
    setSku("");
    setBaseRetailPrice("");
    setUnit(DEFAULT_UNIT);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm</DialogTitle>
          <DialogDescription>Tạo sản phẩm mới. Giá sỉ có thể cập nhật sau bằng &quot;Cập nhật giá&quot;.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="create-name">Tên sản phẩm *</Label>
            <Input
              id="create-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Thanh Long Ruột Đỏ L1"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="create-desc">Mô tả</Label>
            <Input
              id="create-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tùy chọn"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="create-sku">SKU</Label>
            <Input
              id="create-sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Tùy chọn"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="create-price">Giá lẻ (VND) *</Label>
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
              <Label htmlFor="create-unit">Đơn vị</Label>
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
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang tạo..." : "Tạo sản phẩm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ── Edit product form ── */
function EditProductDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductResponse | null;
  onSubmit: (body: ProductUpdateRequest) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [baseRetailPrice, setBaseRetailPrice] = useState("");
  const [unit, setUnit] = useState(DEFAULT_UNIT);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (open && product) {
      setName(product.name);
      setDescription(product.description ?? "");
      setSku(product.sku ?? "");
      setBaseRetailPrice(String(product.baseRetailPrice));
      setUnit(product.unit || DEFAULT_UNIT);
      setIsActive(product.isActive);
    }
  }, [open, product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const price = parseFloat(baseRetailPrice);
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      toast.error("Giá lẻ không hợp lệ.");
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      sku: sku.trim() || undefined,
      baseRetailPrice: price,
      unit: unit.trim() || DEFAULT_UNIT,
      isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sửa sản phẩm</DialogTitle>
          <DialogDescription>Cập nhật thông tin cơ bản. Để đổi giá sỉ, dùng &quot;Cập nhật giá&quot;.</DialogDescription>
        </DialogHeader>
        {product && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Tên sản phẩm *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-desc">Mô tả</Label>
              <Input
                id="edit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-sku">SKU</Label>
              <Input id="edit-sku" value={sku} onChange={(e) => setSku(e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Giá lẻ (VND) *</Label>
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
                <Label htmlFor="edit-unit">Đơn vị</Label>
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
              <Label htmlFor="edit-active">Đang bán (hiển thị trên shop)</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ── Update prices form (retail + tiers) ── */
function UpdatePricesDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductResponse | null;
  onSubmit: (body: UpdatePriceRequest) => void;
  isPending: boolean;
}) {
  const [retailPrice, setRetailPrice] = useState("");
  const [tiers, setTiers] = useState<{ minQuantity: number; unitPrice: number; tierName?: string }[]>([
    { minQuantity: 1, unitPrice: 0, tierName: "Lẻ" },
    { minQuantity: 100, unitPrice: 0, tierName: "Sỉ nhỏ" },
    { minQuantity: 500, unitPrice: 0, tierName: "Sỉ lớn" },
  ]);

  useEffect(() => {
    if (open && product) {
      setRetailPrice(String(product.baseRetailPrice));
      const wp = product.wholesalePrices ?? [];
      if (wp.length > 0) {
        setTiers(
          wp.map((t) => ({
            minQuantity: t.minQuantity,
            unitPrice: t.unitPrice,
            tierName: t.tierName,
          }))
        );
      } else {
        setTiers([
          { minQuantity: 1, unitPrice: 0, tierName: "Lẻ" },
          { minQuantity: 100, unitPrice: 0, tierName: "Sỉ nhỏ" },
          { minQuantity: 500, unitPrice: 0, tierName: "Sỉ lớn" },
        ]);
      }
    }
  }, [open, product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const retail = parseFloat(retailPrice);
    if (Number.isNaN(retail) || retail < 0) {
      toast.error("Giá lẻ không hợp lệ.");
      return;
    }
    const validTiers = tiers
      .filter((t) => t.minQuantity >= 0 && t.unitPrice >= 0)
      .sort((a, b) => a.minQuantity - b.minQuantity);
    if (validTiers.some((t) => t.unitPrice === 0)) {
      toast.error("Vui lòng nhập đơn giá cho tất cả các mức.");
      return;
    }
    onSubmit({
      retailPrice: retail,
      tiers: validTiers.map((t) => ({
        minQuantity: t.minQuantity,
        unitPrice: t.unitPrice,
        tierName: t.tierName,
      })),
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
    setTiers(
      tiers.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật giá</DialogTitle>
          <DialogDescription>
            Giá lẻ + các mức giá sỉ cho &quot;{product?.name}&quot;. Yêu cầu đăng nhập Admin.
          </DialogDescription>
        </DialogHeader>
        {product && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="price-retail">Giá lẻ (VND) *</Label>
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
                <Label>Giá sỉ (mức số lượng)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTier}>
                  <Plus className="w-3 h-3" /> Thêm mức
                </Button>
              </div>
              <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                {tiers.map((tier, i) => (
                  <div key={i} className="flex items-center gap-2 flex-wrap">
                    <Input
                      type="number"
                      min={0}
                      placeholder="SL tối thiểu"
                      value={tier.minQuantity || ""}
                      onChange={(e) => updateTier(i, "minQuantity", parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="Đơn giá VND"
                      value={tier.unitPrice || ""}
                      onChange={(e) => updateTier(i, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="w-32"
                    />
                    <Input
                      placeholder="Tên mức (tùy chọn)"
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
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang lưu..." : "Cập nhật giá"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
