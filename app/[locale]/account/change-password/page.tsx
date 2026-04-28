"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { Eye, EyeOff, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import {
  validateChangePasswordForm,
  type ChangePasswordFormErrors,
} from "@/lib/core/auth/validation";
import { getApiErrorMessage } from "@/lib/core/shared/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ChangePasswordRequest } from "@/types";

export default function ChangePasswordPage() {
  const t = useTranslations("account.changePassword");
  const tv = useTranslations();
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<ChangePasswordFormErrors>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateChangePasswordForm({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setIsLoading(true);
    try {
      const body: ChangePasswordRequest = { currentPassword, newPassword };
      await apiClient.post("/api/auth/change-password", body);
      setDone(true);
      toast.success(t("toastSuccess"));
    } catch (err: unknown) {
      toast.error(
        getApiErrorMessage(err, t("toastError")),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-10">
      {/* Background decoration */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-pitaya-100 opacity-50 blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-cactus-100 opacity-40 blur-3xl animate-blob" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
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

        <Card className="shadow-card-lg border-0 backdrop-blur-sm bg-white/95">
          {done ? (
            /* ── Success state ── */
            <>
              <CardHeader>
                <CardTitle>{t("doneTitle")}</CardTitle>
                <CardDescription>{t("doneDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-5 py-4">
                <div className="w-16 h-16 rounded-full bg-cactus-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-cactus-500" />
                </div>
                {user && (
                  <p className="text-sm text-slate-500 text-center">
                    {t("doneAccountPrefix")}{" "}
                    <span className="font-semibold text-dragon-dark">{user.email}</span>{" "}
                    {t("doneAccountSuffix")}
                  </p>
                )}
                <Button asChild className="w-full" size="lg">
                  <Link href="/shop">{t("backToShop")}</Link>
                </Button>
              </CardContent>
            </>
          ) : (
            /* ── Form ── */
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-pitaya-500" />
                  {t("title")}
                </CardTitle>
                <CardDescription>
                  {user
                    ? <>{t("accountLabel")}: <span className="font-semibold text-dragon-dark">{user.email}</span></>
                    : t("description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Mật khẩu hiện tại */}
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPassword">{t("currentPasswordLabel")}</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrent ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        error={errors.currentPassword ? tv(errors.currentPassword.key, errors.currentPassword.params) : undefined}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-dragon-dark transition-colors"
                        tabIndex={-1}
                      >
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Mật khẩu mới */}
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">{t("newPasswordLabel")}</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNew ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder={t("newPasswordPlaceholder")}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={errors.newPassword ? tv(errors.newPassword.key, errors.newPassword.params) : undefined}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-dragon-dark transition-colors"
                        tabIndex={-1}
                      >
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Xác nhận mật khẩu mới */}
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
                    <Input
                      id="confirmPassword"
                      type={showNew ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder={t("confirmPasswordPlaceholder")}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={errors.confirmPassword ? tv(errors.confirmPassword.key, errors.confirmPassword.params) : undefined}
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t("submitting")}
                      </span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        {t("submit")}
                      </>
                    )}
                  </Button>
                </form>

                <p className="mt-5 text-center">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-pitaya-600 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {t("backToShop")}
                  </Link>
                </p>
              </CardContent>
            </>
          )}
        </Card>

        <p className="text-center text-xs text-slate-400 mt-6">
          {t("copyright")}
        </p>
      </div>
    </div>
  );
}
