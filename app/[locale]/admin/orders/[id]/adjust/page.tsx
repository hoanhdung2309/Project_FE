"use client";

import { useState, use } from "react";
import { useTranslations } from "next-intl";
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

import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { formatVND, formatDate, cn } from "@/lib/utils";
import { useAdjustOrder } from "@/lib/core/orders/use-adjust-order";
import { getApiErrorMessage } from "@/lib/core/shared/errors";
import { normalizeOrderStatus } from "@/types";
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

export default function AdjustOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: orderId } = use(params);
  const t = useTranslations("admin.orders.adjust");
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [note, setNote] = useState("");

  const {
    order,
    rows,
    totals,
    setActualQty,
    submit,
    isLoading,
    isError,
    isPending,
    idempotencyKey,
  } = useAdjustOrder({
    orderId,
    onSuccess: (result) => {
      toast.success(t("toast.success"), {
        description: t("toast.successDescription", { amount: formatVND(result.difference) }),
      });
      setConfirmOpen(false);
      router.push("/admin/orders");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, t("toast.errorFallback")));
    },
  });

  const { originalTotal, adjustedTotal, difference, hasChanges, changedRows } = totals;

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
        <p className="text-slate-500">{t("notFound")}</p>
        <Button asChild>
          <Link href="/admin/orders">{t("action.back")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[280px]">
        <div className="blob-pitaya animate-blob absolute -top-16 right-[6%] h-[260px] w-[260px] rounded-full" />
      </div>
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pitaya-600">{t("eyebrow")}</p>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-dragon-dark mt-0.5">
            {t("title.prefix")} <span className="text-gradient-pitaya">{t("title.highlight")}</span>
          </h1>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="font-mono text-pitaya-600 font-semibold text-sm">
              #{orderId.slice(0, 8).toUpperCase()}
            </span>
            <OrderStatusBadge status={normalizeOrderStatus(order.status)} />
          </div>
        </div>
      </div>

      {/* Order info card */}
      <Card className="mb-5">
        <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: t("info.userId"), value: order.userId },
            { label: t("info.originalTotal"), value: formatVND(order.totalAmount) },
            { label: t("info.createdAt"), value: formatDate(order.createdAtUtc) },
            { label: t("info.notes"), value: order.notes ?? "—" },
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
          {t("idempotency.label")}{" "}
          <code className="font-mono text-slate-500">{idempotencyKey}</code>
          {" "}{t("idempotency.hint")}
        </span>
      </div>

      {/* Adjustment table */}
      <Card className="mb-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("table.title")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>{t("table.product")}</TableHead>
                <TableHead className="text-center">{t("table.orderedQty")}</TableHead>
                <TableHead className="text-center w-36">{t("table.actualQty")}</TableHead>
                <TableHead className="text-right">{t("table.unitPrice")}</TableHead>
                <TableHead className="text-right">{t("table.originalTotal")}</TableHead>
                <TableHead className="text-right">{t("table.adjustedTotal")}</TableHead>
                <TableHead className="text-right">{t("table.difference")}</TableHead>
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
                          : t("diff.unchanged")}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="font-bold text-dragon-dark px-4 py-3">
                  {t("table.grandTotal")}
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
                      : t("diff.noChange")}
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
            <p className="text-xs text-slate-400 mb-1">{t("summary.original")}</p>
            <p className="text-xl font-extrabold text-dragon-dark">
              {formatVND(originalTotal)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-pitaya-200 bg-pitaya-50">
          <CardContent className="p-4">
            <p className="text-xs text-pitaya-400 mb-1">{t("summary.adjusted")}</p>
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
                ? t("summary.customerOwes")
                : difference < 0
                ? t("summary.customerRefund")
                : t("diff.noChange")}
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
        <Label htmlFor="adj-note">{t("note.label")}</Label>
        <textarea
          id="adj-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("note.placeholder")}
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-dragon-dark bg-white focus:outline-none focus:ring-2 focus:ring-pitaya-500 resize-none"
        />
      </div>

      {/* Warning if no changes */}
      {!hasChanges && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {t("warning.noChanges")}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" asChild>
          <Link href="/admin/orders">{t("action.cancel")}</Link>
        </Button>
        <Button
          onClick={() => setConfirmOpen(true)}
          disabled={!hasChanges || isPending}
        >
          <Save className="w-4 h-4" />
          {t("action.previewSave")}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              {t("dialog.title")}
            </DialogTitle>
            <DialogDescription>
              {t("dialog.description", { code: orderId.slice(0, 8).toUpperCase() })}
            </DialogDescription>
          </DialogHeader>

          {/* Summary */}
          <div className="rounded-xl border border-slate-100 overflow-hidden text-sm">
            {changedRows.map((r) => (
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
              <span>{t("dialog.differenceLabel")}</span>
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
              <span className="font-semibold">{t("dialog.notesLabel")}</span> {note}
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              {t("dialog.review")}
            </Button>
            <Button onClick={submit} disabled={isPending}>
              {isPending ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t("dialog.saving")}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {t("dialog.confirmSave")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
