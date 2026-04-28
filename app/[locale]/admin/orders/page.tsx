"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { toast } from "sonner";
import { formatVND, formatDate } from "@/lib/utils";
import {
  ALL_ORDER_STATUSES,
  countOrdersByStatus,
  filterOrders,
  useAdminOrdersQuery,
  useConfirmOrder,
} from "@/lib/core/admin-orders/use-admin-orders";
import { OrderStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrderStatus } from "@/types";
import { normalizeOrderStatus, getOrderCustomerName } from "@/types";

export default function AdminOrdersPage() {
  const t = useTranslations("admin.orders.list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");

  const {
    data: ordersData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useAdminOrdersQuery();
  const orders = ordersData ?? [];

  const { mutate: confirmOrder, isPending: confirming } = useConfirmOrder({
    onSuccess: () => toast.success(t("toast.confirmed")),
    onError: (msg) => toast.error(msg),
  });

  const filtered = filterOrders(orders, search, statusFilter);
  const stats = countOrdersByStatus(orders);

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[320px]">
        <div className="blob-pitaya animate-blob absolute -top-16 right-[6%] h-[300px] w-[300px] rounded-full" />
      </div>
      <div className="flex items-center justify-between mb-6 gap-4 animate-fade-in-up">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pitaya-600">{t("eyebrow")}</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-dragon-dark mt-1">
            {t("title.prefix")} <span className="text-gradient-pitaya">{t("title.highlight")}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {t("totalCount", { count: orders.length })}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          {t("action.refresh")}
        </Button>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {ALL_ORDER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s === statusFilter ? "All" : s)}
            className={`rounded-2xl border p-3 text-left transition-all ${
              statusFilter === s
                ? "border-pitaya-500 bg-pitaya-50 shadow-sm"
                : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
            }`}
          >
            <p className="text-xl font-black text-dragon-dark">{stats[s] ?? 0}</p>
            <OrderStatusBadge status={s} />
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={t("search.placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={statusFilter !== "All" ? "default" : "outline"}
          size="default"
          onClick={() => setStatusFilter("All")}
        >
          <Filter className="w-4 h-4" />
          {statusFilter !== "All" ? t(`status.${statusFilter}`) : t("filter.allStatuses")}
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isError && (
          <div className="flex items-center gap-2 text-red-500 text-sm p-4 bg-red-50 border-b border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {t("error.loadFailed")}
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>{t("table.orderCode")}</TableHead>
              <TableHead>{t("table.customer")}</TableHead>
              <TableHead className="text-center">{t("table.itemCount")}</TableHead>
              <TableHead className="text-right">{t("table.total")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.createdAt")}</TableHead>
              <TableHead className="text-center">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                  <SlidersHorizontal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  {t("empty.noMatch")}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => {
                const status = normalizeOrderStatus(order.status);
                const isSubmitted = status === "Submitted";
                const isConfirmed = status === "Confirmed";
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-semibold text-pitaya-600 text-sm">
                      {order.orderCode ?? order.orderNumber ?? `#${order.id.slice(0, 8)}`}
                    </TableCell>
                    <TableCell className="font-medium">{getOrderCustomerName(order)}</TableCell>
                    <TableCell className="text-center text-slate-600">{t("table.itemCountValue", { count: order.itemCount ?? 0 })}</TableCell>
                    <TableCell className="text-right font-bold text-dragon-dark">
                      {formatVND(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={status} />
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {formatDate(order.createdAtUtc)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        {isSubmitted && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => confirmOrder(order.id)}
                            disabled={confirming}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {t("action.confirm")}
                          </Button>
                        )}
                        {isConfirmed && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/orders/${order.id}/adjust`}>
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                              {t("action.adjust")}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
            <span>{t("pagination.showing", { shown: filtered.length, total: orders.length })}</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                    p === 1 ? "bg-pitaya-500 text-white" : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
