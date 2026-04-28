"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";

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
import { formatDate, cn } from "@/lib/utils";
import {
  adminResetPasswordErrorMessage,
  ALL_USER_ROLES,
  parseCreditLimit,
  useAdminResetPassword,
  useAdminUserDetail,
  useUpdateUserRole,
  useUpdateUserStatus,
  USER_ROLE_BADGE_VARIANT,
  validateAdminResetPassword,
} from "@/lib/core/admin-users/use-admin-users";
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
import type { UserRole, UserSummaryResponse } from "@/types";

type DialogState =
  | { type: "none" }
  | { type: "role"; user: UserSummaryResponse }
  | { type: "status"; user: UserSummaryResponse }
  | { type: "password"; user: UserSummaryResponse };

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
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
  const t = useTranslations("admin.customers.detail");
  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading, isError } = useAdminUserDetail(userId);
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const close = () => setDialog({ type: "none" });

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
            {t("action.back")}
          </Link>
        </Button>
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-dragon-dark font-medium">{t("notFound.title")}</p>
          <p className="text-slate-500 text-sm mt-1">{t("notFound.description")}</p>
        </div>
      </div>
    );
  }

  const creditLimitValue =
    user.creditLimit != null ? (
      user.creditLimit.toLocaleString("vi-VN") + " ₫"
    ) : (
      <span className="text-slate-400 font-normal">{t("info.creditNotSet")}</span>
    );
  const phoneValue = user.phone ?? (
    <span className="text-slate-400 font-normal">{t("info.phoneNotSet")}</span>
  );

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[280px]">
        <div className="blob-pitaya animate-blob absolute -top-16 right-[6%] h-[260px] w-[260px] rounded-full" />
      </div>
      <Button variant="ghost" size="sm" asChild className="mb-5">
        <Link href="/admin/customers" className="flex items-center gap-2 text-slate-600">
          <ArrowLeft className="w-4 h-4" />
          {t("action.back")}
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
        <Card className="lg:col-span-2 border-0 shadow-card-md rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-gradient-pitaya text-white shadow-pitaya flex items-center justify-center text-xl font-black shrink-0">
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
                  {t("status.active")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full shrink-0">
                  <UserX className="w-3 h-3" />
                  {t("status.inactive")}
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <InfoRow icon={Mail} label={t("info.email")} value={user.email} />
            <InfoRow icon={Phone} label={t("info.phone")} value={phoneValue} />
            <InfoRow
              icon={ShieldCheck}
              label={t("info.role")}
              value={
                <Badge variant={USER_ROLE_BADGE_VARIANT[user.role]}>
                  {t(`role.${user.role}`)}
                </Badge>
              }
            />
            <InfoRow icon={CreditCard} label={t("info.creditLimit")} value={creditLimitValue} />
            <InfoRow
              icon={Calendar}
              label={t("info.createdAt")}
              value={formatDate(user.createdAtUtc)}
            />
          </CardContent>
        </Card>

        <Card className="border-slate-100 h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("actions.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setDialog({ type: "role", user })}
            >
              <ShieldCheck className="w-4 h-4 text-pitaya-500" />
              {t("actions.changeRole")}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setDialog({ type: "status", user })}
            >
              {user.isActive ? (
                <UserX className="w-4 h-4 text-red-500" />
              ) : (
                <UserCheck className="w-4 h-4 text-cactus-600" />
              )}
              {user.isActive ? t("actions.disableOrCredit") : t("actions.enableOrCredit")}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => setDialog({ type: "password", user })}
            >
              <KeyRound className="w-4 h-4 text-amber-500" />
              {t("actions.resetPassword")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {dialog.type === "role" && (
        <RoleDialog userId={userId} user={dialog.user} onClose={close} />
      )}
      {dialog.type === "status" && (
        <StatusDialog userId={userId} user={dialog.user} onClose={close} />
      )}
      {dialog.type === "password" && (
        <PasswordDialog userId={userId} user={dialog.user} onClose={close} />
      )}
    </div>
  );
}

function RoleDialog({
  userId,
  user,
  onClose,
}: {
  userId: string;
  user: UserSummaryResponse;
  onClose: () => void;
}) {
  const t = useTranslations("admin.customers.detail");
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const { mutate, isPending } = useUpdateUserRole(userId, {
    onSuccess: () => {
      toast.success(t("toast.roleUpdated"));
      onClose();
    },
    onError: (msg) => toast.error(msg),
  });
  const unchanged = selectedRole === user.role;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-pitaya-500" />
            {t("roleDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("roleDialog.accountLabel")} <span className="font-semibold text-dragon-dark">{user.displayName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-1">
          {ALL_USER_ROLES.map((role) => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                  isSelected
                    ? "border-pitaya-500 bg-pitaya-50 text-pitaya-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                )}
              >
                {t(`role.${role}`)}
                {isSelected && <span className="w-2 h-2 rounded-full bg-pitaya-500" />}
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            {t("action.cancel")}
          </Button>
          <Button onClick={() => mutate({ role: selectedRole })} disabled={isPending || unchanged}>
            {isPending ? t("action.saving") : t("action.update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatusDialog({
  userId,
  user,
  onClose,
}: {
  userId: string;
  user: UserSummaryResponse;
  onClose: () => void;
}) {
  const t = useTranslations("admin.customers.detail");
  const [isActive, setIsActive] = useState(user.isActive);
  const [creditLimit, setCreditLimit] = useState(
    user.creditLimit != null ? String(user.creditLimit) : "",
  );
  const { mutate, isPending } = useUpdateUserStatus(userId, {
    onSuccess: () => {
      toast.success(t("toast.statusUpdated"));
      onClose();
    },
    onError: (msg) => toast.error(msg),
  });

  function handleSubmit() {
    const parsed = parseCreditLimit(creditLimit);
    mutate({ isActive, ...(parsed !== undefined && { creditLimit: parsed }) });
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cactus-600" />
            {t("statusDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("statusDialog.accountLabel")} <span className="font-semibold text-dragon-dark">{user.displayName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
            <div>
              <p className="text-sm font-medium text-dragon-dark">{t("statusDialog.accountStatusLabel")}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {isActive ? t("statusDialog.active") : t("statusDialog.inactive")}
              </p>
            </div>
            <button
              onClick={() => setIsActive((v) => !v)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative",
                isActive ? "bg-cactus-500" : "bg-slate-300",
              )}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                style={{ transform: isActive ? "translateX(22px)" : "translateX(2px)" }}
              />
            </button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="credit-limit">{t("statusDialog.creditLabel")}</Label>
            <Input
              id="credit-limit"
              type="number"
              min={0}
              placeholder={t("statusDialog.creditPlaceholder")}
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value)}
            />
            <p className="text-xs text-slate-400">{t("statusDialog.creditHint")}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            {t("action.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? t("action.saving") : t("statusDialog.saveChanges")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PasswordDialog({
  userId,
  user,
  onClose,
}: {
  userId: string;
  user: UserSummaryResponse;
  onClose: () => void;
}) {
  const t = useTranslations("admin.customers.detail");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutate, isPending } = useAdminResetPassword(userId, {
    onSuccess: () => {
      toast.success(t("toast.passwordReset"));
      onClose();
    },
    onError: (msg) => toast.error(msg),
  });

  function handleSubmit() {
    const error = validateAdminResetPassword(newPassword, confirmPassword);
    if (error) {
      toast.error(adminResetPasswordErrorMessage(error));
      return;
    }
    mutate({ newPassword });
  }

  const mismatch = Boolean(confirmPassword) && newPassword !== confirmPassword;
  const canSubmit = Boolean(newPassword) && !mismatch;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-500" />
            {t("passwordDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("passwordDialog.descriptionPrefix")}{" "}
            <span className="font-semibold text-dragon-dark">{user.displayName}</span>
            {t("passwordDialog.descriptionSuffix")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="new-pw">{t("password.newLabel")}</Label>
            <Input
              id="new-pw"
              type="password"
              placeholder={t("password.newPlaceholder")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-pw">{t("password.confirmLabel")}</Label>
            <Input
              id="confirm-pw"
              type="password"
              placeholder={t("password.confirmPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {mismatch && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {t("password.mismatch")}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            {t("action.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !canSubmit}>
            {isPending ? t("action.resetting") : t("action.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
