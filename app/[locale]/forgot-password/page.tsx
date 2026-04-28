"use client";

import { useState, type FormEvent } from "react";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Mail, KeyRound, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import {
  validateForgotPasswordEmail,
  validateResetPasswordForm,
  type ResetPasswordFormErrors,
} from "@/lib/core/auth/validation";
import { getApiErrorMessage } from "@/lib/core/shared/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ForgotPasswordRequest, ResetPasswordWithOtpRequest } from "@/types";

type Step = "request" | "reset" | "done";

/* ── Step 1: Nhập email để nhận OTP ── */
function RequestOtpStep({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const t = useTranslations("auth.forgotPassword");
  const tv = useTranslations();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationError = validateForgotPasswordEmail({ email });
    if (validationError) {
      setError(tv(validationError.key, validationError.params));
      return;
    }
    setError(undefined);
    setIsLoading(true);
    try {
      const body: ForgotPasswordRequest = { email };
      await apiClient.post("/api/auth/forgot-password", body);
      toast.success(t("otpSentToast"));
      onSuccess(email);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, t("otpErrorToast")));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle>{t("requestTitle")}</CardTitle>
        <CardDescription>
          {t("requestDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                disabled={isLoading}
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t("sendingOtp")}
              </span>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                {t("sendOtp")}
              </>
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          <Link href="/login" className="inline-flex items-center gap-1 text-pitaya-600 font-semibold hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("backToLogin")}
          </Link>
        </p>
      </CardContent>
    </>
  );
}

/* ── Step 2: Nhập OTP + mật khẩu mới ── */
function ResetPasswordStep({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess: () => void;
}) {
  const t = useTranslations("auth.forgotPassword");
  const tv = useTranslations();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validateResetPasswordForm({ otp, newPassword, confirmPassword });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setIsLoading(true);
    try {
      const body: ResetPasswordWithOtpRequest = { email, otp, newPassword };
      await apiClient.post("/api/auth/reset-password", body);
      onSuccess();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, t("otpInvalidToast")));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle>{t("resetTitle")}</CardTitle>
        <CardDescription>
          {t("resetDescriptionPrefix")}{" "}
          <span className="font-semibold text-pitaya-600">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* OTP */}
          <div className="space-y-1.5">
            <Label htmlFor="otp">{t("otpLabel")}</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder={t("otpPlaceholder")}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                error={errors.otp ? tv(errors.otp.key, errors.otp.params) : undefined}
                disabled={isLoading}
                className="pl-9 tracking-widest font-mono text-center text-lg"
                maxLength={6}
              />
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">{t("newPasswordLabel")}</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
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
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-dragon-dark transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
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
                {t("resetting")}
              </span>
            ) : (
              t("resetSubmit")
            )}
          </Button>
        </form>
      </CardContent>
    </>
  );
}

/* ── Step 3: Thành công ── */
function DoneStep() {
  const t = useTranslations("auth.forgotPassword");
  return (
    <>
      <CardHeader>
        <CardTitle>{t("doneTitle")}</CardTitle>
        <CardDescription>{t("doneDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-5 py-4">
        <div className="w-16 h-16 rounded-full bg-cactus-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-cactus-500" />
        </div>
        <p className="text-sm text-slate-500 text-center">
          {t("doneHelper")}
        </p>
        <Button asChild className="w-full" size="lg">
          <Link href="/login">{t("loginNow")}</Link>
        </Button>
      </CardContent>
    </>
  );
}

/* ── Page ── */
export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");

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
          <p className="mt-2 text-sm text-slate-500">{t("tagline")}</p>
        </div>

        {/* Step indicator */}
        {step !== "done" && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {(["request", "reset"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    s === step
                      ? "bg-pitaya-500 text-white"
                      : step === "reset" && s === "request"
                      ? "bg-cactus-500 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {step === "reset" && s === "request" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i === 0 && <div className={`w-10 h-0.5 ${step === "reset" ? "bg-cactus-400" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>
        )}

        <Card className="shadow-card-lg border-0 backdrop-blur-sm bg-white/95">
          {step === "request" && (
            <RequestOtpStep
              onSuccess={(e) => {
                setEmail(e);
                setStep("reset");
              }}
            />
          )}
          {step === "reset" && (
            <ResetPasswordStep
              email={email}
              onSuccess={() => {
                toast.success(t("resetSuccessToast"));
                setStep("done");
              }}
            />
          )}
          {step === "done" && <DoneStep />}
        </Card>

        <p className="text-center text-xs text-slate-400 mt-6">
          {t("copyright")}
        </p>
      </div>
    </div>
  );
}
