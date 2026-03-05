"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Search,
  Eye,
  RefreshCw,
  AlertCircle,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
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
import type { UserSummaryResponse, UserRole } from "@/types";

const ROLE_LABELS: Record<UserRole, string> = {
  Customer:   "Khách lẻ",
  Wholesaler: "Khách sỉ",
  Admin:      "Quản trị",
};

const ROLE_VARIANT: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
  Customer:   "outline",
  Wholesaler: "default",
  Admin:      "destructive",
};

const ALL_ROLES: (UserRole | "All")[] = ["All", "Customer", "Wholesaler", "Admin"];
const ROLE_FILTER_LABELS: Record<UserRole | "All", string> = {
  All:        "Tất cả",
  Customer:   "Khách lẻ",
  Wholesaler: "Khách sỉ",
  Admin:      "Quản trị",
};

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<UserSummaryResponse[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await apiClient.get<UserSummaryResponse[]>("/api/admin/users");
      return data;
    },
  });

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone ?? "").includes(q);
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = {
    total:      users.length,
    active:     users.filter((u) => u.isActive).length,
    inactive:   users.filter((u) => !u.isActive).length,
    wholesaler: users.filter((u) => u.role === "Wholesaler").length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dragon-dark">Quản lý Khách hàng</h1>
          <p className="text-slate-500 text-sm mt-0.5">{users.length} tài khoản tổng cộng</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Tổng tài khoản", value: stats.total, icon: Users, color: "text-dragon-dark" },
          { label: "Đang hoạt động", value: stats.active, icon: UserCheck, color: "text-cactus-600" },
          { label: "Đã tắt", value: stats.inactive, icon: UserX, color: "text-red-500" },
          { label: "Khách sỉ", value: stats.wholesaler, icon: Users, color: "text-pitaya-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-slate-500">{label}</p>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Tìm theo tên, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {ALL_ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                roleFilter === r
                  ? "bg-pitaya-500 text-white border-pitaya-500"
                  : "bg-white text-slate-600 border-slate-200 hover:border-pitaya-300"
              }`}
            >
              {ROLE_FILTER_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isError && (
          <div className="flex items-center gap-2 text-red-500 text-sm p-4 bg-red-50 border-b border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Không thể tải danh sách khách hàng từ server.
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Khách hàng</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Phân quyền</TableHead>
              <TableHead>Hạn mức công nợ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-center">Chi tiết</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
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
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    Không tìm thấy khách hàng phù hợp.
                  </TableCell>
                </TableRow>
              )
              : filtered.map((user) => (
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
                    <Badge variant={ROLE_VARIANT[user.role]}>{ROLE_LABELS[user.role]}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {user.creditLimit != null
                      ? user.creditLimit.toLocaleString("vi-VN") + " ₫"
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-cactus-600 bg-cactus-100 px-2 py-0.5 rounded-full">
                        <UserCheck className="w-3 h-3" />
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                        <UserX className="w-3 h-3" />
                        Đã tắt
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
              ))}
          </TableBody>
        </Table>

        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
            Hiển thị {filtered.length} / {users.length} khách hàng
          </div>
        )}
      </div>
    </div>
  );
}
