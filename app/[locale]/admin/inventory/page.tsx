"use client";

import { useTranslations } from "next-intl";
import {
  Package,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  RefreshCw,
  TrendingDown,
} from "lucide-react";
import { formatDateOnly, cn } from "@/lib/utils";
import {
  URGENT_DAYS,
  getBatchDaysLabel,
  getProgressBarColor,
  getProgressBarWidth,
} from "@/lib/core/inventory/batch-status";
import { useInventoryBatches } from "@/lib/core/inventory/use-batches";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function InventoryPage() {
  const t = useTranslations("admin.inventory");
  const { batches, summary, isLoading, isFetching, refetch } = useInventoryBatches();

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[320px]">
        <div className="blob-pitaya animate-blob absolute -top-16 right-[6%] h-[300px] w-[300px] rounded-full" />
      </div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 animate-fade-in-up">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pitaya-600">{t("eyebrow")}</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-dragon-dark mt-1">
            {t("title.prefix")} <span className="text-gradient-pitaya">{t("title.highlight")}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {t("subtitle")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refetch}
          disabled={isFetching}
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          {t("action.refresh")}
        </Button>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-card-md hover-lift rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">{t("stats.totalBatches")}</span>
            </div>
            <p className="text-2xl font-extrabold text-dragon-dark">{summary.total}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {t("stats.totalQuantity", { qty: summary.totalQuantity.toLocaleString("vi-VN") })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-xs text-red-500">{t("stats.expired")}</span>
            </div>
            <p className="text-2xl font-extrabold text-red-600">{summary.expired}</p>
            <p className="text-xs text-red-400 mt-0.5">{t("stats.expiredHint")}</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-orange-500">{t("stats.expiring")}</span>
            </div>
            <p className="text-2xl font-extrabold text-orange-600">{summary.expiring}</p>
            <p className="text-xs text-orange-400 mt-0.5">{t("stats.expiringHint")}</p>
          </CardContent>
        </Card>

        <Card className="border-cactus-100 bg-cactus-100/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-cactus-500" />
              <span className="text-xs text-cactus-600">{t("stats.fresh")}</span>
            </div>
            <p className="text-2xl font-extrabold text-cactus-600">{summary.fresh}</p>
            <p className="text-xs text-cactus-500 mt-0.5">{t("stats.freshHint")}</p>
          </CardContent>
        </Card>
      </div>

      {/* FEFO Timeline */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          {t("timeline.heading")}
        </span>
      </div>

      <div className="relative">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 mb-6 animate-pulse">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-slate-200 ring-4 ring-slate-100" />
                <div className="w-0.5 h-24 bg-slate-100 mt-1" />
              </div>
              <div className="flex-1 rounded-2xl border border-slate-100 bg-white h-28" />
            </div>
          ))
        ) : batches.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-500">
            <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            {t("timeline.empty")}
          </div>
        ) : (
          batches.map((batch, idx) => {
            const { daysRemaining: days, style } = batch;
            const Icon = style.icon;
            const isLast = idx === batches.length - 1;
            const isUrgent = days <= URGENT_DAYS;
            const isExpired = days < 0;

            return (
              <div key={batch.id} className="flex gap-4 sm:gap-5 mb-5">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full shrink-0 mt-1 ${style.dot} transition-all`} />
                  {!isLast && <div className={`w-0.5 flex-1 mt-1 min-h-[2rem] ${style.line}`} />}
                </div>

                {/* Batch card */}
                <div
                  className={cn(
                    "flex-1 rounded-2xl border p-4 transition-shadow hover:shadow-md",
                    style.card,
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
                          {t("batch.received")}{" "}
                          <span className="font-medium">
                            {batch.receivedAt ? formatDateOnly(batch.receivedAt) : "—"}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {t("batch.expires")}{" "}
                          <span className={`font-semibold ${style.text}`}>
                            {formatDateOnly(batch.expiryDate)}
                          </span>
                        </span>
                        {batch.supplierName && (
                          <span className="text-slate-400">{t("batch.supplier", { name: batch.supplierName })}</span>
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
                        {getBatchDaysLabel(days)}
                      </p>

                      {isUrgent && (
                        <Button
                          variant={isExpired ? "destructive" : "outline"}
                          size="sm"
                          className="mt-2 text-xs h-7"
                        >
                          {isExpired ? t("batch.actionDispose") : t("batch.actionPrioritize")}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Expiry progress bar */}
                  {days >= 0 && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-white rounded-full overflow-hidden border border-slate-100">
                        <div
                          className={cn("h-full rounded-full transition-all", getProgressBarColor(days))}
                          style={{ width: `${getProgressBarWidth(days)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-500">
        <span className="font-semibold">{t("legend.title")}</span>
        {[
          { dot: "bg-red-500", label: t("legend.expired") },
          { dot: "bg-orange-500", label: t("legend.expiring") },
          { dot: "bg-cactus-500", label: t("legend.fresh") },
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
