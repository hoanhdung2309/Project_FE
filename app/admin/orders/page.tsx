"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { formatVND, formatDate } from "@/lib/utils";
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
import type { OrderListItem, OrderStatus, ConfirmOrderResult } from "@/types";
import { normalizeOrderStatus, getOrderCustomerName } from "@/types";

const ALL_STATUSES: OrderStatus[] = [
  "Draft", "Submitted", "Confirmed", "Shipped", "Delivered", "Cancelled",
];

const STATUS_FILTER_LABELS: Record<OrderStatus, string> = {
  Draft:     "Nháp",
  Submitted: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Shipped:   "Đang giao",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<OrderListItem[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await apiClient.get<OrderListItem[]>("/api/orders");
      return data;
    },
  });

  /* POST /api/orders/{id}/confirm  (requires JWT + Admin role) */
  const { mutate: confirmOrder, isPending: confirming } = useMutation<
    ConfirmOrderResult,
    Error,
    string
  >({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.post<ConfirmOrderResult>(
        `/api/orders/${orderId}/confirm`,
        null,
        { headers: { "Idempotency-Key": uuidv4() } }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Đơn hàng đã được xác nhận! Kho đã trừ theo FEFO.");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (err) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Xác nhận thất bại. Vui lòng thử lại.";
      toast.error(msg);
    },
  });

  /* Client-side filter */
  const filtered = orders.filter((o) => {
    const customerName = getOrderCustomerName(o);
    const matchSearch =
      (o.orderCode ?? o.orderNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || normalizeOrderStatus(o.status) === statusFilter;
    return matchSearch && matchStatus;
  });

  /* Stats (status may be number from API) */
  const stats = ALL_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: orders.filter((o) => normalizeOrderStatus(o.status) === s).length }),
    {} as Record<OrderStatus, number>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dragon-dark">Quản lý Đơn hàng</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {orders.length} đơn hàng tổng cộng
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {ALL_STATUSES.map((s) => (
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
            placeholder="Tìm theo mã đơn, tên khách hàng..."
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
          {statusFilter !== "All" ? STATUS_FILTER_LABELS[statusFilter] : "Tất cả trạng thái"}
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isError && (
          <div className="flex items-center gap-2 text-red-500 text-sm p-4 bg-red-50 border-b border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Không thể tải đơn hàng từ server.
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead className="text-center">Số SP</TableHead>
              <TableHead className="text-right">Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : filtered.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                    <SlidersHorizontal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Không tìm thấy đơn hàng phù hợp.
                  </TableCell>
                </TableRow>
              )
              : filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-semibold text-pitaya-600 text-sm">
                    {order.orderCode ?? order.orderNumber ?? `#${order.id.slice(0, 8)}`}
                  </TableCell>
                  <TableCell className="font-medium">{getOrderCustomerName(order)}</TableCell>
                  <TableCell className="text-center text-slate-600">
                    {order.itemCount} SP
                  </TableCell>
                  <TableCell className="text-right font-bold text-dragon-dark">
                    {formatVND(order.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={normalizeOrderStatus(order.status)} />
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
                      {/* Confirm – POST /api/orders/{id}/confirm */}
                      {normalizeOrderStatus(order.status) === "Submitted" && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => confirmOrder(order.id)}
                          disabled={confirming}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Xác nhận
                        </Button>
                      )}
                      {/* Adjust – PATCH /api/orders/{id}/adjust */}
                      {normalizeOrderStatus(order.status) === "Confirmed" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/orders/${order.id}/adjust`}>
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            Điều chỉnh
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination placeholder */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
            <span>Hiển thị {filtered.length} / {orders.length} đơn hàng</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                    p === 1
                      ? "bg-pitaya-500 text-white"
                      : "hover:bg-slate-100 text-slate-600"
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
