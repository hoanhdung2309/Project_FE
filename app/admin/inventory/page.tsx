"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Package,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  RefreshCw,
  TrendingDown,
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { formatVND, daysFromToday, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { InventoryBatch, BatchStatus } from "@/types";

function getBatchStyle(status: BatchStatus, days: number) {
  if (status === "Expired" || days < 0) {
    return {
      dot:    "bg-red-500 ring-4 ring-red-100",
      line:   "bg-red-200",
      card:   "border-red-200 bg-red-50",
      badge:  "bg-red-100 text-red-700",
      text:   "text-red-600",
      label:  "Đã hết hạn",
      icon:   AlertCircle,
    };
  }
  if (days <= 14) {
    return {
      dot:    "bg-orange-500 ring-4 ring-orange-100",
      line:   "bg-orange-200",
      card:   "border-orange-200 bg-orange-50",
      badge:  "bg-orange-100 text-orange-700",
      text:   "text-orange-600",
      label:  "Sắp hết hạn",
      icon:   AlertTriangle,
    };
  }
  return {
    dot:    "bg-cactus-500 ring-4 ring-cactus-100",
    line:   "bg-cactus-200",
    card:   "border-cactus-100 bg-white",
    badge:  "bg-cactus-100 text-cactus-600",
    text:   "text-cactus-600",
    label:  "Còn mới",
    icon:   CheckCircle2,
  };
}

function formatExpiryDate(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

export default function InventoryPage() {
  const {
    data: batches = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<InventoryBatch[]>({
    queryKey: ["inventory-batches"],
    queryFn: async () => {
      const { data } = await apiClient.get<InventoryBatch[]>(
        "/api/admin/inventory/batches?sort=expiryDate&order=asc"
      );
      return data;
    },
  });

  /* Summary stats */
  const expired  = batches.filter((b) => b.daysUntilExpiry < 0);
  const expiring = batches.filter((b) => b.daysUntilExpiry >= 0 && b.daysUntilExpiry <= 14);
  const fresh    = batches.filter((b) => b.daysUntilExpiry > 14);
  const totalQty = batches.reduce((s, b) => s + b.quantity, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dragon-dark">
            Quản lý Tồn kho (FEFO)
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            First Expired, First Out — Lô hàng gần hết hạn được ưu tiên xuất trước
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

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="border-slate-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">Tổng lô</span>
            </div>
            <p className="text-2xl font-extrabold text-dragon-dark">{batches.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">{totalQty.toLocaleString("vi-VN")} kg/hộp</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-xs text-red-500">Đã hết hạn</span>
            </div>
            <p className="text-2xl font-extrabold text-red-600">{expired.length}</p>
            <p className="text-xs text-red-400 mt-0.5">Cần xử lý ngay!</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-orange-500">Sắp hết hạn</span>
            </div>
            <p className="text-2xl font-extrabold text-orange-600">{expiring.length}</p>
            <p className="text-xs text-orange-400 mt-0.5">Trong 14 ngày tới</p>
          </CardContent>
        </Card>

        <Card className="border-cactus-100 bg-cactus-100/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-cactus-500" />
              <span className="text-xs text-cactus-600">Còn mới</span>
            </div>
            <p className="text-2xl font-extrabold text-cactus-600">{fresh.length}</p>
            <p className="text-xs text-cactus-500 mt-0.5">Trên 14 ngày</p>
          </CardContent>
        </Card>
      </div>

      {/* FEFO Timeline */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Timeline lô hàng (sắp xếp theo hạn sử dụng – sớm nhất trước)
        </span>
      </div>

      <div className="relative">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 mb-6 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-slate-200 ring-4 ring-slate-100" />
                  <div className="w-0.5 h-24 bg-slate-100 mt-1" />
                </div>
                <div className="flex-1 rounded-2xl border border-slate-100 bg-white h-28" />
              </div>
            ))
          : batches.length === 0
          ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-500">
                <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                Chưa có lô hàng nào trong hệ thống.
              </div>
            )
          : batches.map((batch, idx) => {
              const days = daysFromToday(batch.expiryDate);
              const style = getBatchStyle(batch.status, days);
              const Icon = style.icon;
              const isLast = idx === batches.length - 1;

              return (
                <div key={batch.id} className="flex gap-4 sm:gap-5 mb-5">
                  {/* Timeline spine */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full shrink-0 mt-1 ${style.dot} transition-all`}
                    />
                    {!isLast && (
                      <div className={`w-0.5 flex-1 mt-1 min-h-[2rem] ${style.line}`} />
                    )}
                  </div>

                  {/* Batch card */}
                  <div
                    className={cn(
                      "flex-1 rounded-2xl border p-4 transition-shadow hover:shadow-md",
                      style.card
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                            {batch.batchNumber}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${style.badge}`}
                          >
                            <Icon className="w-3 h-3" />
                            {style.label}
                          </span>
                          <span className="text-xs text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                            {batch.category}
                          </span>
                        </div>

                        <h3 className="font-bold text-dragon-dark text-sm sm:text-base">
                          {batch.productName}
                        </h3>

                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Nhập:{" "}
                            <span className="font-medium">
                              {batch.receivedAt ? formatExpiryDate(batch.receivedAt) : "—"}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Hết hạn:{" "}
                            <span className={`font-semibold ${style.text}`}>
                              {formatExpiryDate(batch.expiryDate)}
                            </span>
                          </span>
                          {batch.supplierName && (
                            <span className="text-slate-400">
                              NCC: {batch.supplierName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: quantity + days remaining */}
                      <div className="text-right shrink-0">
                        <p className="text-xl font-extrabold text-dragon-dark">
                          {batch.quantity.toLocaleString("vi-VN")}
                          <span className="text-sm font-normal text-slate-400 ml-1">
                            {batch.unit}
                          </span>
                        </p>
                        <p className={`text-xs font-semibold mt-0.5 ${style.text}`}>
                          {days < 0
                            ? `Quá hạn ${Math.abs(days)} ngày`
                            : days === 0
                            ? "Hết hạn HÔM NAY"
                            : `Còn ${days} ngày`}
                        </p>

                        {/* Urgency actions */}
                        {days <= 7 && (
                          <Button
                            variant={days < 0 ? "destructive" : "outline"}
                            size="sm"
                            className="mt-2 text-xs h-7"
                          >
                            {days < 0 ? "Xử lý hủy" : "Ưu tiên xuất"}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Expiry progress bar */}
                    {days >= 0 && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-white rounded-full overflow-hidden border border-slate-100">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              days <= 7
                                ? "bg-red-400"
                                : days <= 14
                                ? "bg-orange-400"
                                : "bg-cactus-400"
                            )}
                            style={{
                              /* Assumes shelf life ~60 days; clamp to 100% */
                              width: `${Math.min(100, (days / 60) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-500">
        <span className="font-semibold">Chú thích:</span>
        {[
          { dot: "bg-red-500", label: "Đã hết hạn (< 0 ngày)" },
          { dot: "bg-orange-500", label: "Sắp hết hạn (≤ 14 ngày)" },
          { dot: "bg-cactus-500", label: "Còn mới (> 14 ngày)" },
        ].map(({ dot, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
