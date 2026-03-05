"use client";

import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Package, Users, TrendingUp, AlertTriangle, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import apiClient from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/ui/badge";
import { formatVND } from "@/lib/utils";
import type { OrderListItem } from "@/types";
import { normalizeOrderStatus, getOrderCustomerName } from "@/types";

function isToday(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
}

export default function AdminDashboardPage() {
  const { data: orders = [], isLoading } = useQuery<OrderListItem[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await apiClient.get<OrderListItem[]>("/api/admin/orders");
      return data;
    },
  });

  const ordersToday = orders.filter((o) => isToday(o.createdAtUtc));
  const revenueToday = ordersToday.reduce((s, o) => s + o.totalAmount, 0);
  const submittedCount = orders.filter((o) => normalizeOrderStatus(o.status) === "Submitted").length;
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { label: "Đơn hàng hôm nay", value: String(ordersToday.length), icon: ShoppingBag, color: "text-pitaya-500", bg: "bg-pitaya-50" },
    { label: "Doanh thu hôm nay", value: formatVND(revenueToday), icon: TrendingUp, color: "text-cactus-500", bg: "bg-cactus-100" },
    { label: "Đơn chờ xác nhận", value: String(submittedCount), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Tổng đơn hàng", value: String(orders.length), icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dragon-dark">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Tổng quan – {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="border-slate-100">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-2xl ${s.bg} flex items-center justify-center shrink-0`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="text-lg font-extrabold text-dragon-dark leading-tight truncate">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Đơn hàng gần đây</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders" className="flex items-center gap-1 text-pitaya-600 text-xs">
                Xem tất cả <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="divide-y divide-slate-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-slate-50 rounded w-20 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="px-5 py-8 text-center text-slate-500 text-sm">Chưa có đơn hàng nào.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-mono text-sm font-semibold text-pitaya-600">{order.orderNumber ?? order.id.slice(0, 8)}</p>
                      <p className="text-xs text-slate-500">{getOrderCustomerName(order)} · {order.itemCount ?? "—"} SP</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={normalizeOrderStatus(order.status)} />
                      <p className="text-sm font-bold text-dragon-dark">{formatVND(order.totalAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cần xử lý ngay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: Clock,         color: "bg-amber-100 text-amber-600", label: "Đơn chờ xác nhận",   href: "/admin/orders", action: "Xem ngay" },
              { icon: AlertTriangle, color: "bg-orange-100 text-orange-600", label: "Lô sắp hết hạn",     href: "/admin/inventory", action: "Kiểm tra" },
              { icon: Package,       color: "bg-red-100 text-red-600",     label: "Tồn kho FEFO",       href: "/admin/inventory", action: "Xem" },
              { icon: CheckCircle2,  color: "bg-cactus-100 text-cactus-600", label: "Quản lý đơn hàng",   href: "/admin/orders", action: "Cập nhật" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all group"
              >
                <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <p className="flex-1 text-sm font-medium text-dragon-dark">{item.label}</p>
                <span className="text-xs text-pitaya-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.action} →
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
