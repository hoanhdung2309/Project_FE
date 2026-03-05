"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  UserCheck,
  UserX,
  ShieldCheck,
  KeyRound,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { formatDate, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type {
  UserSummaryResponse,
  UserRole,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
  AdminResetPasswordRequest,
} from "@/types";

const ROLE_LABELS: Record<UserRole, string> = {
  Customer:   "Khách lẻ",
  Wholesaler: "Khách sỉ",
  Admin:      "Quản trị",
};

const ALL_ROLES: UserRole[] = ["Customer", "Wholesaler", "Admin"];

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <div className="text-sm font-semibold text-dragon-dark">{value}</div>
      </div>
    </div>
  );
}

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const queryClient = useQueryClient();

  /* Dialog states */
  const [roleDialogOpen, setRoleDialogOpen]     = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [pwDialogOpen, setPwDialogOpen]         = useState(false);

  /* Form states */
  const [selectedRole, setSelectedRole]   = useState<UserRole>("Customer");
  const [isActive, setIsActive]           = useState(true);
  const [creditLimit, setCreditLimit]     = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* Fetch user detail */
  const { data: user, isLoading, isError } = useQuery<UserSummaryResponse>({
    queryKey: ["admin-user", userId],
    queryFn: async () => {
      const { data } = await apiClient.get<UserSummaryResponse>(`/api/admin/users/${userId}`);
      return data;
    },
    enabled: !!userId,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  }

  /* Mutation: update role */
  const { mutate: updateRole, isPending: updatingRole } = useMutation({
    mutationFn: async (body: UpdateUserRoleRequest) => {
      await apiClient.put(`/api/admin/users/${userId}/role`, body);
    },
    onSuccess: () => {
      toast.success("Đã cập nhật phân quyền.");
      setRoleDialogOpen(false);
      invalidate();
    },
    onError: (err) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Cập nhật phân quyền thất bại.";
      toast.error(msg);
    },
  });

  /* Mutation: update status / credit limit */
  const { mutate: updateStatus, isPending: updatingStatus } = useMutation({
    mutationFn: async (body: UpdateUserStatusRequest) => {
      await apiClient.patch(`/api/admin/users/${userId}/status`, body);
    },
    onSuccess: () => {
      toast.success("Đã cập nhật trạng thái tài khoản.");
      setStatusDialogOpen(false);
      invalidate();
    },
    onError: (err) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Cập nhật trạng thái thất bại.";
      toast.error(msg);
    },
  });

  /* Mutation: reset password */
  const { mutate: resetPassword, isPending: resettingPw } = useMutation({
    mutationFn: async (body: AdminResetPasswordRequest) => {
      await apiClient.post(`/api/admin/users/${userId}/reset-password`, body);
    },
    onSuccess: () => {
      toast.success("Đã đặt lại mật khẩu thành công.");
      setPwDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Đặt lại mật khẩu thất bại.";
      toast.error(msg);
    },
  });

  function openRoleDialog() {
    if (user) setSelectedRole(user.role);
    setRoleDialogOpen(true);
  }

  function openStatusDialog() {
    if (user) {
      setIsActive(user.isActive);
      setCreditLimit(user.creditLimit != null ? String(user.creditLimit) : "");
    }
    setStatusDialogOpen(true);
  }

  function handleUpdateRole() {
    updateRole({ role: selectedRole });
  }

  function handleUpdateStatus() {
    const body: UpdateUserStatusRequest = { isActive };
    const parsed = parseFloat(creditLimit);
    if (creditLimit !== "" && !isNaN(parsed)) body.creditLimit = parsed;
    updateStatus(body);
  }

  function handleResetPassword() {
    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    resetPassword({ newPassword });
  }

  /* Loading skeleton */
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="h-8 w-40 bg-slate-100 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-100 p-6 animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-50 rounded" />
            ))}
          </div>
          <div className="rounded-2xl bg-white border border-slate-100 p-6 animate-pulse space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-50 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/customers" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </Link>
        </Button>
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-dragon-dark font-medium">Không tìm thấy tài khoản</p>
          <p className="text-slate-500 text-sm mt-1">ID không hợp lệ hoặc tài khoản đã bị xóa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="mb-5">
        <Link href="/admin/customers" className="flex items-center gap-2 text-slate-600">
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User info card */}
        <Card className="lg:col-span-2 border-slate-100">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-pitaya-100 text-pitaya-600 flex items-center justify-center text-xl font-black shrink-0">
                  {user.displayName[0]?.toUpperCase()}
                </span>
                <div>
                  <CardTitle className="text-lg">{user.displayName}</CardTitle>
                  <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
                </div>
              </div>
              {user.isActive ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-cactus-600 bg-cactus-100 px-2.5 py-1 rounded-full shrink-0">
                  <UserCheck className="w-3 h-3" />
                  Hoạt động
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full shrink-0">
                  <UserX className="w-3 h-3" />
                  Đã tắt
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <InfoRow icon={Mail}     label="Email"          value={user.email} />
            <InfoRow icon={Phone}    label="Số điện thoại"  value={user.phone ?? <span className="text-slate-400 font-normal">Chưa cập nhật</span>} />
            <InfoRow icon={ShieldCheck} label="Phân quyền"  value={<Badge variant={user.role === "Admin" ? "destructive" : user.role === "Wholesaler" ? "default" : "outline"}>{ROLE_LABELS[user.role]}</Badge>} />
            <InfoRow
              icon={CreditCard}
              label="Hạn mức công nợ"
              value={
                user.creditLimit != null
                  ? user.creditLimit.toLocaleString("vi-VN") + " ₫"
                  : <span className="text-slate-400 font-normal">Chưa thiết lập</span>
              }
            />
            <InfoRow icon={Calendar} label="Ngày tạo tài khoản" value={formatDate(user.createdAtUtc)} />
          </CardContent>
        </Card>

        {/* Actions card */}
        <Card className="border-slate-100 h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Hành động</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={openRoleDialog}
            >
              <ShieldCheck className="w-4 h-4 text-pitaya-500" />
              Đổi phân quyền
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={openStatusDialog}
            >
              {user.isActive
                ? <UserX className="w-4 h-4 text-red-500" />
                : <UserCheck className="w-4 h-4 text-cactus-600" />
              }
              {user.isActive ? "Tắt / Chỉnh công nợ" : "Bật / Chỉnh công nợ"}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => { setNewPassword(""); setConfirmPassword(""); setPwDialogOpen(true); }}
            >
              <KeyRound className="w-4 h-4 text-amber-500" />
              Đặt lại mật khẩu
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Dialog: Đổi phân quyền ── */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-pitaya-500" />
              Đổi phân quyền
            </DialogTitle>
            <DialogDescription>
              Tài khoản: <span className="font-semibold text-dragon-dark">{user.displayName}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-1">
            {ALL_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                  selectedRole === role
                    ? "border-pitaya-500 bg-pitaya-50 text-pitaya-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                )}
              >
                {ROLE_LABELS[role]}
                {selectedRole === role && (
                  <span className="w-2 h-2 rounded-full bg-pitaya-500" />
                )}
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setRoleDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleUpdateRole}
              disabled={updatingRole || selectedRole === user.role}
            >
              {updatingRole ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Trạng thái & Công nợ ── */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cactus-600" />
              Trạng thái & Hạn mức công nợ
            </DialogTitle>
            <DialogDescription>
              Tài khoản: <span className="font-semibold text-dragon-dark">{user.displayName}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            {/* Active toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
              <div>
                <p className="text-sm font-medium text-dragon-dark">Trạng thái tài khoản</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isActive ? "Đang hoạt động" : "Đã tắt"}
                </p>
              </div>
              <button
                onClick={() => setIsActive((v) => !v)}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative",
                  isActive ? "bg-cactus-500" : "bg-slate-300"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                    isActive ? "translate-x-5.5" : "translate-x-0.5"
                  )}
                  style={{ transform: isActive ? "translateX(22px)" : "translateX(2px)" }}
                />
              </button>
            </div>

            {/* Credit limit */}
            <div className="space-y-1.5">
              <Label htmlFor="credit-limit">Hạn mức công nợ (₫)</Label>
              <Input
                id="credit-limit"
                type="number"
                min={0}
                placeholder="Ví dụ: 50000000"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
              />
              <p className="text-xs text-slate-400">Để trống nếu không giới hạn.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setStatusDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updatingStatus}>
              {updatingStatus ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog: Đặt lại mật khẩu ── */}
      <Dialog open={pwDialogOpen} onOpenChange={setPwDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-500" />
              Đặt lại mật khẩu
            </DialogTitle>
            <DialogDescription>
              Đặt mật khẩu mới cho <span className="font-semibold text-dragon-dark">{user.displayName}</span> mà không cần mật khẩu cũ.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="new-pw">Mật khẩu mới</Label>
              <Input
                id="new-pw"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-pw">Xác nhận mật khẩu</Label>
              <Input
                id="confirm-pw"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Mật khẩu không khớp
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setPwDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={resettingPw || !newPassword || newPassword !== confirmPassword}
            >
              {resettingPw ? "Đang đặt lại..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
