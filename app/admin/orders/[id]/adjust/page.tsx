"use client";

import { useState, useRef, useMemo, use, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Save,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { formatVND, formatDate, cn } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  OrderResponse,
  OrderItemResponse,
  AdjustmentItemDto,
  AdjustOrderResult,
} from "@/types";

interface AdjustmentRow {
  itemId: string;
  productName: string;
  unit: string;
  orderedQty: number;
  actualQty: number;
  unitPrice: number;
}

export default function AdjustOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: orderId } = use(params);
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [note, setNote] = useState("");

  /*
   * Idempotency-Key: generated ONCE per page mount.
   * If the user retries (network failure), the same key is sent,
   * the server ignores the duplicate and returns the cached result.
   */
  const idempotencyKey = useRef<string>(uuidv4());

  /* Fetch order – GET /api/admin/orders/{id} */
  const { data: order, isLoading, isError } = useQuery<OrderResponse>({
    queryKey: ["admin-order", orderId],
    queryFn: async () => {
      const { data } = await apiClient.get<OrderResponse>(`/api/admin/orders/${orderId}`);
      return data;
    },
  });

  const items: OrderItemResponse[] = order?.items ?? [];

  /* Per-item actualQuantity state – synced when order loads */
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  useEffect(() => {
    if (order?.items?.length) {
      setAdjustments(Object.fromEntries(order.items.map((i) => [i.id, i.quantity])));
    }
  }, [order?.id]);

  function setActualQty(itemId: string, value: number) {
    setAdjustments((prev) => ({
      ...prev,
      [itemId]: Math.max(0, value),
    }));
  }

  /* ── Real-time computation ── */
  const rows: AdjustmentRow[] = items.map((item) => ({
    itemId: item.id,
    productName: item.productName,
    unit: item.unit ?? "kg",
    orderedQty: item.quantity,           // backend field: quantity
    actualQty: adjustments[item.id] ?? item.quantity,
    unitPrice: item.unitPrice,
  }));

  const originalTotal = useMemo(
    () => rows.reduce((s, r) => s + r.orderedQty * r.unitPrice, 0),
    [rows]
  );
  const adjustedTotal = useMemo(
    () => rows.reduce((s, r) => s + r.actualQty * r.unitPrice, 0),
    [rows]
  );
  const difference = adjustedTotal - originalTotal;

  const hasChanges = rows.some((r) => r.actualQty !== r.orderedQty);

  /* ── Mutation: submit adjustment ──
   * PATCH /api/admin/orders/{id}/adjust
   * Body: AdjustmentItemDto[]  ← direct array (NOT wrapped in object)
   * Field: orderItemId         ← NOT itemId
   * Header: Idempotency-Key   ← unique per submit attempt
   */
  const { mutate: submitAdjustment, isPending } = useMutation<
    AdjustOrderResult,
    Error,
    AdjustmentItemDto[]
  >({
    mutationFn: async (body) => {
      const { data } = await apiClient.patch<AdjustOrderResult>(
        `/api/admin/orders/${orderId}/adjust`,
        body,        // send array directly
        {
          headers: {
            "Idempotency-Key": idempotencyKey.current,
          },
        }
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success("Đơn hàng đã được điều chỉnh thành công!", {
        description: `Chênh lệch: ${formatVND(data.difference)}`,
      });
      setConfirmOpen(false);
      router.push("/admin/orders");
    },
    onError: (err) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Có lỗi xảy ra khi lưu điều chỉnh.";
      toast.error(msg);
      /* Regenerate key on error so user can retry safely */
      idempotencyKey.current = uuidv4();
    },
  });

  function handleSubmit() {
    /* Backend expects: AdjustmentItemDto[] with field orderItemId */
    const body: AdjustmentItemDto[] = rows.map((r) => ({
      orderItemId: r.itemId,    // matches backend field name
      actualQuantity: r.actualQty,
    }));
    submitAdjustment(body);
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 rounded-full border-2 border-pitaya-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500">Không tìm thấy đơn hàng hoặc bạn không có quyền xem.</p>
        <Button asChild>
          <Link href="/admin/orders">Quay lại danh sách đơn</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-dragon-dark">
            Điều chỉnh đơn hàng
          </h1>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="font-mono text-pitaya-600 font-semibold text-sm">
              #{orderId.slice(0, 8).toUpperCase()}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      {/* Order info card */}
      <Card className="mb-5">
        <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: "User ID", value: order.userId },
            { label: "Tổng tiền gốc", value: formatVND(order.totalAmount) },
            { label: "Ngày tạo", value: formatDate(order.createdAtUtc) },
            { label: "Ghi chú", value: order.notes ?? "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-slate-400 mb-0.5">{label}</p>
              <p className="font-semibold text-dragon-dark">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Idempotency-Key info */}
      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-xl px-3 py-2 mb-5 border border-slate-100">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>
          Idempotency-Key:{" "}
          <code className="font-mono text-slate-500">{idempotencyKey.current}</code>
          {" "}— An toàn khi gửi lại nếu mạng bị ngắt.
        </span>
      </div>

      {/* Adjustment table */}
      <Card className="mb-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Bảng điều chỉnh số lượng thực tế</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Sản phẩm</TableHead>
                <TableHead className="text-center">SL đặt</TableHead>
                <TableHead className="text-center w-36">SL thực tế</TableHead>
                <TableHead className="text-right">Đơn giá</TableHead>
                <TableHead className="text-right">Tổng gốc</TableHead>
                <TableHead className="text-right">Tổng điều chỉnh</TableHead>
                <TableHead className="text-right">Chênh lệch</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((row) => {
                const origTotal = row.orderedQty * row.unitPrice;
                const adjTotal  = row.actualQty  * row.unitPrice;
                const diff      = adjTotal - origTotal;
                const changed   = row.actualQty !== row.orderedQty;

                return (
                  <TableRow
                    key={row.itemId}
                    className={changed ? "bg-amber-50/60" : ""}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {changed && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        )}
                        {row.productName}
                      </div>
                    </TableCell>

                    <TableCell className="text-center text-slate-600">
                      {row.orderedQty.toLocaleString("vi-VN")} {row.unit}
                    </TableCell>

                    <TableCell className="text-center">
                      <input
                        type="number"
                        min={0}
                        value={row.actualQty}
                        onChange={(e) =>
                          setActualQty(row.itemId, parseInt(e.target.value) || 0)
                        }
                        className={cn(
                          "w-28 text-center h-8 rounded-xl border text-sm font-semibold",
                          "focus:outline-none focus:ring-2 focus:ring-pitaya-500",
                          changed
                            ? "border-amber-400 bg-amber-50 text-amber-800"
                            : "border-slate-200 bg-white"
                        )}
                      />
                      <span className="ml-1 text-xs text-slate-400">{row.unit}</span>
                    </TableCell>

                    <TableCell className="text-right text-slate-600">
                      {formatVND(row.unitPrice)}
                    </TableCell>

                    <TableCell className="text-right text-slate-600">
                      {formatVND(origTotal)}
                    </TableCell>

                    <TableCell className="text-right font-semibold">
                      {formatVND(adjTotal)}
                    </TableCell>

                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 font-semibold text-sm",
                          diff > 0
                            ? "text-cactus-600"
                            : diff < 0
                            ? "text-red-500"
                            : "text-slate-400"
                        )}
                      >
                        {diff > 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : diff < 0 ? (
                          <TrendingDown className="w-3.5 h-3.5" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                        {diff !== 0
                          ? `${diff > 0 ? "+" : ""}${formatVND(diff)}`
                          : "Không đổi"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="font-bold text-dragon-dark px-4 py-3">
                  TỔNG CỘNG
                </TableCell>
                <TableCell className="text-right font-bold text-slate-600 px-4">
                  {formatVND(originalTotal)}
                </TableCell>
                <TableCell className="text-right font-bold text-pitaya-600 px-4">
                  {formatVND(adjustedTotal)}
                </TableCell>
                <TableCell className="text-right px-4">
                  <span
                    className={cn(
                      "font-extrabold text-base",
                      difference > 0
                        ? "text-cactus-600"
                        : difference < 0
                        ? "text-red-500"
                        : "text-slate-400"
                    )}
                  >
                    {difference !== 0
                      ? `${difference > 0 ? "+" : ""}${formatVND(difference)}`
                      : "Không thay đổi"}
                  </span>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Before / After comparison summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs text-slate-400 mb-1">Tổng tiền gốc</p>
            <p className="text-xl font-extrabold text-dragon-dark">
              {formatVND(originalTotal)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-pitaya-200 bg-pitaya-50">
          <CardContent className="p-4">
            <p className="text-xs text-pitaya-400 mb-1">Tổng sau điều chỉnh</p>
            <p className="text-xl font-extrabold text-pitaya-600">
              {formatVND(adjustedTotal)}
            </p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-2",
            difference > 0
              ? "border-cactus-500 bg-cactus-100"
              : difference < 0
              ? "border-red-300 bg-red-50"
              : "border-slate-200"
          )}
        >
          <CardContent className="p-4">
            <p
              className={cn(
                "text-xs mb-1",
                difference > 0
                  ? "text-cactus-600"
                  : difference < 0
                  ? "text-red-400"
                  : "text-slate-400"
              )}
            >
              {difference > 0
                ? "Khách cần trả thêm"
                : difference < 0
                ? "Cần hoàn tiền khách"
                : "Không thay đổi"}
            </p>
            <p
              className={cn(
                "text-xl font-extrabold",
                difference > 0
                  ? "text-cactus-700"
                  : difference < 0
                  ? "text-red-600"
                  : "text-slate-400"
              )}
            >
              {difference !== 0
                ? `${difference > 0 ? "+" : ""}${formatVND(difference)}`
                : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Note */}
      <div className="mb-6 space-y-1.5">
        <Label htmlFor="adj-note">Ghi chú điều chỉnh</Label>
        <textarea
          id="adj-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ví dụ: Khách hàng chỉ nhận được 150kg thay vì 200kg do vườn thiếu hàng..."
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-dragon-dark bg-white focus:outline-none focus:ring-2 focus:ring-pitaya-500 resize-none"
        />
      </div>

      {/* Warning if no changes */}
      {!hasChanges && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Chưa có thay đổi nào. Hãy nhập số lượng thực tế khác với số lượng đặt hàng.
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" asChild>
          <Link href="/admin/orders">Hủy bỏ</Link>
        </Button>
        <Button
          onClick={() => setConfirmOpen(true)}
          disabled={!hasChanges || isPending}
        >
          <Save className="w-4 h-4" />
          Xem trước & Lưu
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Xác nhận điều chỉnh đơn hàng
            </DialogTitle>
            <DialogDescription>
              Hành động này sẽ cập nhật đơn #{orderId.slice(0, 8).toUpperCase()} và thông báo cho khách hàng.
            </DialogDescription>
          </DialogHeader>

          {/* Summary */}
          <div className="rounded-xl border border-slate-100 overflow-hidden text-sm">
            {rows
              .filter((r) => r.actualQty !== r.orderedQty)
              .map((r) => (
                <div
                  key={r.itemId}
                  className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 last:border-0"
                >
                  <span className="font-medium text-dragon-dark">{r.productName}</span>
                  <span className="text-slate-500">
                    {r.orderedQty} → {" "}
                    <span className="font-bold text-pitaya-600">{r.actualQty}</span>
                    {" "}{r.unit}
                  </span>
                </div>
              ))}
            <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 font-semibold">
              <span>Chênh lệch tiền</span>
              <span
                className={
                  difference > 0
                    ? "text-cactus-600"
                    : difference < 0
                    ? "text-red-500"
                    : "text-slate-500"
                }
              >
                {difference > 0 ? "+" : ""}
                {formatVND(difference)}
              </span>
            </div>
          </div>

          {note && (
            <div className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2">
              <span className="font-semibold">Ghi chú:</span> {note}
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Kiểm tra lại
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang lưu...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Xác nhận lưu
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
