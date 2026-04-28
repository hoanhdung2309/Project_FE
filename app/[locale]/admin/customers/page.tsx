"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import {
  Search,
  Eye,
  RefreshCw,
  AlertCircle,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  ALL_USER_ROLES,
  countUserStats,
  filterUsers,
  useAdminUsersQuery,
  USER_ROLE_BADGE_VARIANT,
} from "@/lib/core/admin-users/use-admin-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { UserRole } from "@/types";

const ROLE_FILTER_OPTIONS: (UserRole | "All")[] = ["All", ...ALL_USER_ROLES];

export default function AdminCustomersPage() {
  const t = useTranslations("admin.customers.list");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");

  const {
    data: usersData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useAdminUsersQuery();
  const users = usersData ?? [];

  const filtered = filterUsers(users, { search, role: roleFilter });
  const stats = countUserStats(users);

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
          <p className="text-slate-500 text-sm mt-1">{t("totalCount", { count: users.length })}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          {t("action.refresh")}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: t("stats.total"), value: stats.total, icon: Users, color: "text-dragon-dark" },
          { label: t("stats.active"), value: stats.active, icon: UserCheck, color: "text-cactus-600" },
          { label: t("stats.inactive"), value: stats.inactive, icon: UserX, color: "text-red-500" },
          { label: t("stats.wholesaler"), value: stats.wholesaler, icon: Users, color: "text-pitaya-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border-0 p-4 shadow-card-md hover-lift"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-slate-500">{label}</p>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={t("search.placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {ROLE_FILTER_OPTIONS.map((r) => {
            const isActive = roleFilter === r;
            return (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                  isActive
                    ? "bg-pitaya-500 text-white border-pitaya-500"
                    : "bg-white text-slate-600 border-slate-200 hover:border-pitaya-300"
                }`}
              >
                {t(`roleFilter.${r}`)}
              </button>
            );
          })}
        </div>
      </div>

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
              <TableHead>{t("table.customer")}</TableHead>
              <TableHead>{t("table.phone")}</TableHead>
              <TableHead>{t("table.role")}</TableHead>
              <TableHead>{t("table.creditLimit")}</TableHead>
              <TableHead>{t("table.status")}</TableHead>
              <TableHead>{t("table.createdAt")}</TableHead>
              <TableHead className="text-center">{t("table.detail")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
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
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  {t("empty.noMatch")}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => {
                const creditLimitLabel =
                  user.creditLimit != null
                    ? user.creditLimit.toLocaleString("vi-VN") + " ₫"
                    : "—";
                return (
                  <TableRow key={user.id} className={!user.isActive ? "opacity-60" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-pitaya-100 text-pitaya-600 flex items-center justify-center text-sm font-bold shrink-0">
                          {user.displayName[0]?.toUpperCase()}
                        </span>
                        <div>
                          <p className="font-semibold text-dragon-dark text-sm">{user.displayName}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">{user.phone ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={USER_ROLE_BADGE_VARIANT[user.role]}>
                        {t(`role.${user.role}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">{creditLimitLabel}</TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-cactus-600 bg-cactus-100 px-2 py-0.5 rounded-full">
                          <UserCheck className="w-3 h-3" />
                          {t("status.active")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                          <UserX className="w-3 h-3" />
                          {t("status.inactive")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {formatDate(user.createdAtUtc)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/customers/${user.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
            {t("pagination.showing", { shown: filtered.length, total: users.length })}
          </div>
        )}
      </div>
    </div>
  );
}
