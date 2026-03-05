"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { User, Mail, Phone, Shield, KeyRound, RefreshCw, AlertCircle } from "lucide-react";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User as UserType } from "@/types";

export default function ProfilePage() {
  const { user: cachedUser } = useAuth();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<UserType>({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await apiClient.get<UserType>("/api/auth/me");
      return data;
    },
    /* Fall back to cached user from AuthContext while loading */
    placeholderData: cachedUser ?? undefined,
  });

  const avatar = user?.displayName?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-dragon-base flex items-center justify-center px-4 py-10">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pitaya-100 opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cactus-100 opacity-30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="w-10 h-10 rounded-full bg-pitaya-500 flex items-center justify-center shadow-md">
              <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                <ellipse cx="16" cy="20" rx="9" ry="10" fill="white" opacity=".85" />
                <ellipse cx="16" cy="21" rx="6" ry="7" fill="#e91e63" />
                <line x1="16" y1="11" x2="12" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="11" x2="20" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="11" x2="16" y2="2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-2xl font-black text-pitaya-600 tracking-tight">PITAYA</span>
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-pitaya-500" />
                Hồ sơ cá nhân
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => refetch()}
                disabled={isFetching}
                title="Làm mới"
              >
                <RefreshCw className={`w-4 h-4 text-slate-400 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error banner */}
            {isError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Không thể tải thông tin từ server. Hiển thị dữ liệu cache.
              </div>
            )}

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 py-2">
              {isLoading && !cachedUser ? (
                <div className="w-20 h-20 rounded-full bg-slate-100 animate-pulse" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-pitaya-500 flex items-center justify-center text-white text-3xl font-black shadow-md">
                  {avatar}
                </div>
              )}
              {isLoading && !cachedUser ? (
                <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
              ) : (
                <p className="text-lg font-bold text-dragon-dark">{user?.displayName}</p>
              )}
            </div>

            {/* Info rows */}
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 overflow-hidden">
              <InfoRow
                icon={<Mail className="w-4 h-4 text-slate-400" />}
                label="Email"
                value={user?.email}
                loading={isLoading && !cachedUser}
              />
              <InfoRow
                icon={<Shield className="w-4 h-4 text-slate-400" />}
                label="Vai trò"
                loading={isLoading && !cachedUser}
                value={undefined}
                custom={
                  user?.role ? (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.role === "Admin"
                          ? "bg-pitaya-100 text-pitaya-700"
                          : "bg-cactus-100 text-cactus-700"
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {user.role === "Admin" ? "Quản trị viên" : "Khách hàng"}
                    </span>
                  ) : undefined
                }
              />
              <InfoRow
                icon={<User className="w-4 h-4 text-slate-400" />}
                label="ID tài khoản"
                value={user?.id}
                mono
                loading={isLoading && !cachedUser}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <Button asChild variant="outline" className="w-full justify-start gap-2">
                <Link href="/account/change-password">
                  <KeyRound className="w-4 h-4" />
                  Đổi mật khẩu
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start gap-2 text-slate-500">
                <Link href="/shop">
                  ← Quay lại cửa hàng
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2025 PITAYA. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  custom,
  mono = false,
  loading = false,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  custom?: React.ReactNode;
  mono?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white">
      <span className="shrink-0">{icon}</span>
      <span className="text-xs text-slate-400 w-24 shrink-0">{label}</span>
      {loading ? (
        <div className="h-4 flex-1 bg-slate-100 rounded animate-pulse" />
      ) : custom ? (
        <div className="flex-1">{custom}</div>
      ) : (
        <span className={`flex-1 text-sm font-medium text-dragon-dark truncate ${mono ? "font-mono text-xs" : ""}`}>
          {value ?? "—"}
        </span>
      )}
    </div>
  );
}
