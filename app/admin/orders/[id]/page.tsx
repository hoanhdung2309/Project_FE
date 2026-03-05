"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, SlidersHorizontal, Package } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api-client";
import { formatVND, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrderResponse, OrderOrderItem, OrderItemResponse } from "@/types";
import { normalizeOrderStatus } from "@/types";

/** Detail API returns orderItems (or items); unify for table */
function getDetailItems(order: OrderResponse): { id: string; productId: string; productName?: string; quantity: number; unitPrice: number; lineTotal: number }[] {
  const raw = order.orderItems ?? order.items ?? [];
  return raw.map((item: OrderOrderItem | OrderItemResponse) => {
    const qty = "actualQuantity" in item && item.actualQuantity != null ? item.actualQuantity : item.quantity;
    const lineTotal = "lineTotal" in item && typeof item.lineTotal === "number" ? item.lineTotal : item.unitPrice * qty;
    const productName = "productName" in item ? item.productName : undefined;
    return {
      id: item.id,
      productId: item.productId,
      productName,
      quantity: qty,
      unitPrice: item.unitPrice,
      lineTotal,
    };
  });
}

function getOrderCustomerDisplay(order: OrderResponse): string {
  return order.user?.displayName ?? order.user?.email ?? order.userId;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { data: order, isLoading, isError } = useQuery<OrderResponse>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data } = await apiClient.get<OrderResponse>(`/api/orders/${orderId}`);
      return data;
    },
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="h-8 w-48 bg-slate-100 rounded animate-pulse mb-6" />
        <div className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse">
          <div className="h-5 bg-slate-100 rounded w-1/3 mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-slate-50 rounded w-full" />
            <div className="h-4 bg-slate-50 rounded w-2/3" />
            <div className="h-4 bg-slate-50 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách đơn
          </Link>
        </Button>
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-dragon-dark font-medium">Không tìm thấy đơn hàng</p>
          <p className="text-slate-500 text-sm mt-1">Đơn có thể đã bị xóa hoặc ID không hợp lệ.</p>
        </div>
      </div>
    );
  }

  const items = getDetailItems(order);
  const status = normalizeOrderStatus(order.status);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders" className="flex items-center gap-2 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách đơn
          </Link>
        </Button>
        {status === "Confirmed" && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/orders/${order.id}/adjust`} className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Điều chỉnh đơn
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin chung */}
        <Card className="lg:col-span-2 border-slate-100">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-lg">Đơn hàng {order.orderCode ?? `#${order.id.slice(0, 8)}`}</CardTitle>
              <OrderStatusBadge status={status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span className="text-slate-500">Mã đơn:</span>
              <span className="font-mono text-dragon-dark">{order.orderCode ?? order.id}</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span className="text-slate-500">Khách hàng:</span>
              <span className="text-dragon-dark">{getOrderCustomerDisplay(order)}</span>
              {order.user?.phone && (
                <span className="text-slate-400"> · {order.user.phone}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span className="text-slate-500">Tạo lúc:</span>
              <span className="text-dragon-dark">{formatDate(order.createdAtUtc)}</span>
            </div>
            {order.notes && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 block mb-1">Ghi chú:</span>
                <p className="text-dragon-dark">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tổng tiền */}
        <Card className="border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tổng thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-extrabold text-pitaya-600">
              {formatVND(order.totalAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chi tiết sản phẩm */}
      <Card className="mt-6 border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Chi tiết sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-500 text-sm">
              Đơn không có dòng sản phẩm.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-slate-500 font-medium">Sản phẩm</TableHead>
                  <TableHead className="text-slate-500 font-medium text-right">Đơn giá</TableHead>
                  <TableHead className="text-slate-500 font-medium text-right">Số lượng</TableHead>
                  <TableHead className="text-slate-500 font-medium text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="border-slate-50">
                    <TableCell>
                      <span className="font-medium text-dragon-dark">
                        {item.productName ?? `Sản phẩm ${item.productId.slice(0, 8)}`}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-slate-600">
                      {formatVND(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right font-semibold text-dragon-dark">
                      {formatVND(item.lineTotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {items.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <span className="text-slate-500 mr-2">Tổng cộng:</span>
              <span className="text-lg font-bold text-pitaya-600">
                {formatVND(order.totalAmount)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
