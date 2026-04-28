"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/ui/badge";
import { formatVND, formatWeekdayLong } from "@/lib/utils";
import {
  summarizeAdminDashboard,
  useAdminOrdersQuery,
} from "@/lib/core/admin-orders/use-admin-orders";
import { normalizeOrderStatus, getOrderCustomerName } from "@/types";

export default function AdminDashboardPage() {
  const t = useTranslations("admin.dashboard");

  const QUICK_ACTIONS = [
    {
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
      label: t("quick.pendingOrders.label"),
      href: "/admin/orders",
      action: t("quick.pendingOrders.action"),
    },
    {
      icon: AlertTriangle,
      color: "bg-orange-100 text-orange-600",
      label: t("quick.expiringBatches.label"),
      href: "/admin/inventory",
      action: t("quick.expiringBatches.action"),
    },
    {
      icon: Package,
      color: "bg-red-100 text-red-600",
      label: t("quick.fefoInventory.label"),
      href: "/admin/inventory",
      action: t("quick.fefoInventory.action"),
    },
    {
      icon: CheckCircle2,
      color: "bg-cactus-100 text-cactus-600",
      label: t("quick.manageOrders.label"),
      href: "/admin/orders",
      action: t("quick.manageOrders.action"),
    },
  ];

  const { data: ordersData, isLoading } = useAdminOrdersQuery();
  const orders = ordersData ?? [];
  const { ordersToday, revenueToday, submittedCount, recentOrders } =
    summarizeAdminDashboard(orders);
  const hasRecentOrders = recentOrders.length > 0;

  const stats = [
    {
      label: t("stats.ordersToday"),
      value: String(ordersToday.length),
      icon: ShoppingBag,
      color: "text-pitaya-500",
      bg: "bg-pitaya-50",
    },
    {
      label: t("stats.revenueToday"),
      value: formatVND(revenueToday),
      icon: TrendingUp,
      color: "text-cactus-500",
      bg: "bg-cactus-100",
    },
    {
      label: t("stats.pendingOrders"),
      value: String(submittedCount),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: t("stats.totalOrders"),
      value: String(orders.length),
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[360px]">
        <div className="blob-pitaya animate-blob absolute -top-20 right-[6%] h-[320px] w-[320px] rounded-full" />
        <div className="blob-cactus animate-blob absolute -top-10 left-[10%] h-[260px] w-[260px] rounded-full" />
      </div>
      <div className="mb-6 animate-fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pitaya-600">{t("eyebrow")}</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-dragon-dark mt-1">
          <span className="text-gradient-pitaya">{t("title")}</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">{t("subtitle", { date: formatWeekdayLong() })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="border-0 shadow-card-md hover-lift rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={`w-11 h-11 rounded-2xl ${s.bg} flex items-center justify-center shrink-0`}
              >
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="text-lg font-extrabold text-dragon-dark leading-tight truncate">
                  {s.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border-0 shadow-card-md rounded-2xl">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">{t("recentOrders.title")}</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/admin/orders"
                className="flex items-center gap-1 text-pitaya-600 text-xs"
              >
                {t("recentOrders.viewAll")} <ArrowRight className="w-3 h-3" />
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
            ) : !hasRecentOrders ? (
              <div className="px-5 py-8 text-center text-slate-500 text-sm">
                {t("recentOrders.empty")}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="font-mono text-sm font-semibold text-pitaya-600">
                        {order.orderNumber ?? order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {t("recentOrders.customerLine", {
                          name: getOrderCustomerName(order),
                          count: order.itemCount ?? "—",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={normalizeOrderStatus(order.status)} />
                      <p className="text-sm font-bold text-dragon-dark">
                        {formatVND(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card-md rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("quick.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {QUICK_ACTIONS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all group"
              >
                <div
                  className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center shrink-0`}
                >
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
