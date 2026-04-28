"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, SlidersHorizontal, Package } from "lucide-react";

import { formatVND, formatDate } from "@/lib/utils";
import {
  getOrderDetailCustomerName,
  getOrderDetailLines,
  useAdminOrderDetail,
} from "@/lib/core/admin-orders/use-admin-orders";
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
import { normalizeOrderStatus } from "@/types";

export default function AdminOrderDetailPage() {
  const t = useTranslations("admin.orders.detail");
  const params = useParams();
  const orderId = params.id as string;

  const { data: order, isLoading, isError } = useAdminOrderDetail(orderId);

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
            {t("action.back")}
          </Link>
        </Button>
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-dragon-dark font-medium">{t("notFound.title")}</p>
          <p className="text-slate-500 text-sm mt-1">{t("notFound.description")}</p>
        </div>
      </div>
    );
  }

  const items = getOrderDetailLines(order);
  const status = normalizeOrderStatus(order.status);
  const customerName = getOrderDetailCustomerName(order);
  const hasItems = items.length > 0;
  const isConfirmed = status === "Confirmed";

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[280px]">
        <div className="blob-pitaya animate-blob absolute -top-16 right-[6%] h-[260px] w-[260px] rounded-full" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 animate-fade-in-up">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders" className="flex items-center gap-2 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
            {t("action.back")}
          </Link>
        </Button>
        {isConfirmed && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/orders/${order.id}/adjust`} className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              {t("action.adjust")}
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-card-md rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-lg">
                {t("card.orderTitle", { code: order.orderCode ?? `#${order.id.slice(0, 8)}` })}
              </CardTitle>
              <OrderStatusBadge status={status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span className="text-slate-500">{t("field.orderCode")}</span>
              <span className="font-mono text-dragon-dark">{order.orderCode ?? order.id}</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span className="text-slate-500">{t("field.customer")}</span>
              <span className="text-dragon-dark">{customerName}</span>
              {order.user?.phone && (
                <span className="text-slate-400"> · {order.user.phone}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span className="text-slate-500">{t("field.createdAt")}</span>
              <span className="text-dragon-dark">{formatDate(order.createdAtUtc)}</span>
            </div>
            {order.notes && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 block mb-1">{t("field.notes")}</span>
                <p className="text-dragon-dark">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("field.totalPayment")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-extrabold text-pitaya-600">
              {formatVND(order.totalAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t("items.title")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!hasItems ? (
            <div className="px-6 py-8 text-center text-slate-500 text-sm">
              {t("items.empty")}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-slate-500 font-medium">{t("items.product")}</TableHead>
                  <TableHead className="text-slate-500 font-medium text-right">{t("items.unitPrice")}</TableHead>
                  <TableHead className="text-slate-500 font-medium text-right">{t("items.quantity")}</TableHead>
                  <TableHead className="text-slate-500 font-medium text-right">{t("items.lineTotal")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="border-slate-50">
                    <TableCell>
                      <span className="font-medium text-dragon-dark">
                        {item.productName ?? t("items.productFallback", { id: item.productId.slice(0, 8) })}
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
          {hasItems && (
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <span className="text-slate-500 mr-2">{t("items.grandTotal")}</span>
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
