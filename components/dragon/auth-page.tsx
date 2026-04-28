"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { useApp } from "./app-context";
import { Icon, PitayaMark } from "./primitives";
import { Link } from "@/i18n/navigation";
import { useLoginForm } from "@/lib/core/auth/use-login-form";
import { useRegisterForm } from "@/lib/core/auth/use-register-form";
import type { ValidationError } from "@/lib/core/auth/validation";

type AuthMode = "login" | "register";

interface AuthPageProps {
  mode: AuthMode;
}

export function AuthPage({ mode }: AuthPageProps) {
  return (
    <section className="auth-shell">
      <div className="wrap">
        <div className="auth-grid">
          <BrandPanel />
          <Suspense fallback={<AuthCardSkeleton />}>
            {mode === "login" ? <LoginCard /> : <RegisterCard />}
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function AuthCardSkeleton() {
  return <div className="auth-card" aria-busy="true" />;
}

function BrandPanel() {
  const { t } = useApp();
  return (
    <div className="auth-brand">
      <div>
        <div className="eyebrow auth-brand-eyebrow">{t("auth_eyebrow")}</div>
        <h1 className="auth-brand-title">{t("auth_brand_title")}</h1>
        <p className="auth-brand-sub">{t("auth_brand_sub")}</p>
      </div>
      <div className="auth-brand-foot">
        <span>{t("auth_brand_signature")}</span>
        <span>10.7769° N · 106.7009° E</span>
      </div>
      <div className="auth-brand-mark">
        <PitayaMark size={320} />
      </div>
    </div>
  );
}

function AuthTabs({ active }: { active: AuthMode }) {
  const { t } = useApp();
  return (
    <div className="auth-tabs" role="tablist">
      <Link
        href="/login"
        className={`auth-tab${active === "login" ? " active" : ""}`}
        role="tab"
      >
        {t("auth_tab_login")}
      </Link>
      <Link
        href="/register"
        className={`auth-tab${active === "register" ? " active" : ""}`}
        role="tab"
      >
        {t("auth_tab_register")}
      </Link>
    </div>
  );
}

function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  const { t } = useApp();
  return (
    <button
      type="button"
      className="toggle"
      onClick={onToggle}
      aria-label={visible ? t("auth_hide_password") : t("auth_show_password")}
      tabIndex={-1}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
        {visible && (
          <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  const { t } = useApp();
  return (
    <button
      type="submit"
      className="btn btn-primary auth-submit"
      disabled={loading}
    >
      {loading ? (
        <>
          <Spinner /> {t("auth_submitting")}
        </>
      ) : (
        <>
          {label} <Icon name="arrow" size={16} />
        </>
      )}
    </button>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: "2px solid currentColor",
        borderTopColor: "transparent",
        display: "inline-block",
        animation: "dragon-spin 0.8s linear infinite",
      }}
    />
  );
}

function FieldError({ error }: { error?: ValidationError }) {
  const tv = useTranslations();
  if (!error) return null;
  return <div className="err">{tv(error.key, error.params)}</div>;
}

function HintRequired() {
  const { t } = useApp();
  return <span className="hint required">{t("auth_required")}</span>;
}

function HintOptional() {
  const { t } = useApp();
  return <span className="hint">{t("auth_optional")}</span>;
}

function AuthCardHead({
  title,
  sub,
  active,
}: {
  title: string;
  sub: string;
  active: AuthMode;
}) {
  return (
    <>
      <AuthTabs active={active} />
      <div>
        <h2 className="auth-title">{title}</h2>
        <p className="auth-sub">{sub}</p>
      </div>
    </>
  );
}

function AuthCardFoot({
  prompt,
  linkLabel,
  linkHref,
}: {
  prompt: string;
  linkLabel: string;
  linkHref: "/login" | "/register";
}) {
  const { t } = useApp();
  return (
    <>
      <div className="auth-foot">
        {prompt} <Link href={linkHref}>{linkLabel}</Link>
      </div>
      <p className="auth-terms">
        {t("auth_terms_prefix")}{" "}
        <a href="#" onClick={(e) => e.preventDefault()}>
          {t("auth_terms_link")}
        </a>{" "}
        {t("auth_terms_suffix")}
      </p>
    </>
  );
}

function LoginCard() {
  const { t } = useApp();
  const { state, actions } = useLoginForm({
    successMessage: t("auth_toast_login_success"),
    errorMessage: t("auth_toast_login_error"),
  });

  return (
    <div className="auth-card">
      <AuthCardHead
        active="login"
        title={t("auth_login_title")}
        sub={t("auth_login_sub")}
      />

      <form className="auth-form" onSubmit={actions.handleSubmit} noValidate>
        <div className={`auth-row${state.errors.email ? " has-error" : ""}`}>
          <label htmlFor="email">{t("auth_label_email")}</label>
          <div className="field-body">
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="partner@company.com"
              value={state.email}
              onChange={(e) => actions.setEmail(e.target.value)}
              disabled={state.isLoading}
            />
          </div>
          <FieldError error={state.errors.email} />
        </div>

        <div className={`auth-row${state.errors.password ? " has-error" : ""}`}>
          <div className="field-head">
            <label htmlFor="password">{t("auth_label_password")}</label>
            <Link href="/forgot-password" className="hint" style={{ color: "var(--magenta)" }}>
              {t("auth_forgot")}
            </Link>
          </div>
          <div className="field-body">
            <input
              id="password"
              type={state.showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={state.password}
              onChange={(e) => actions.setPassword(e.target.value)}
              disabled={state.isLoading}
              style={{ paddingRight: 36 }}
            />
            <PasswordToggle
              visible={state.showPassword}
              onToggle={actions.togglePasswordVisibility}
            />
          </div>
          <FieldError error={state.errors.password} />
        </div>

        <SubmitButton loading={state.isLoading} label={t("auth_submit_login")} />
      </form>

      <AuthCardFoot
        prompt={t("auth_no_account")}
        linkLabel={t("auth_link_register")}
        linkHref="/register"
      />
    </div>
  );
}

function RegisterCard() {
  const { t } = useApp();
  const { state, actions } = useRegisterForm({
    successMessage: t("auth_toast_register_success"),
    errorMessage: t("auth_toast_register_error"),
  });

  return (
    <div className="auth-card">
      <AuthCardHead
        active="register"
        title={t("auth_register_title")}
        sub={t("auth_register_sub")}
      />

      <form className="auth-form" onSubmit={actions.handleSubmit} noValidate>
        <div className={`auth-row${state.errors.displayName ? " has-error" : ""}`}>
          <div className="field-head">
            <label htmlFor="displayName">{t("auth_label_name")}</label>
            <HintRequired />
          </div>
          <div className="field-body">
            <input
              id="displayName"
              type="text"
              autoComplete="name"
              placeholder="Nguyen Van A"
              value={state.displayName}
              onChange={(e) => actions.setDisplayName(e.target.value)}
              disabled={state.isLoading}
            />
          </div>
          <FieldError error={state.errors.displayName} />
        </div>

        <div className={`auth-row${state.errors.email ? " has-error" : ""}`}>
          <div className="field-head">
            <label htmlFor="email">{t("auth_label_email")}</label>
            <HintRequired />
          </div>
          <div className="field-body">
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="partner@company.com"
              value={state.email}
              onChange={(e) => actions.setEmail(e.target.value)}
              disabled={state.isLoading}
            />
          </div>
          <FieldError error={state.errors.email} />
        </div>

        <div className="auth-row">
          <div className="field-head">
            <label htmlFor="phone">{t("auth_label_phone")}</label>
            <HintOptional />
          </div>
          <div className="field-body">
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+84 901 234 567"
              value={state.phone}
              onChange={(e) => actions.setPhone(e.target.value)}
              disabled={state.isLoading}
            />
          </div>
        </div>

        <div className={`auth-row${state.errors.password ? " has-error" : ""}`}>
          <div className="field-head">
            <label htmlFor="password">{t("auth_label_password")}</label>
            <HintRequired />
          </div>
          <div className="field-body">
            <input
              id="password"
              type={state.showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="•••••••• (min. 6)"
              value={state.password}
              onChange={(e) => actions.setPassword(e.target.value)}
              disabled={state.isLoading}
              style={{ paddingRight: 36 }}
            />
            <PasswordToggle
              visible={state.showPassword}
              onToggle={actions.togglePasswordVisibility}
            />
          </div>
          <FieldError error={state.errors.password} />
        </div>

        <div className={`auth-row${state.errors.confirmPassword ? " has-error" : ""}`}>
          <div className="field-head">
            <label htmlFor="confirmPassword">{t("auth_label_confirm")}</label>
            <HintRequired />
          </div>
          <div className="field-body">
            <input
              id="confirmPassword"
              type={state.showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={state.confirmPassword}
              onChange={(e) => actions.setConfirmPassword(e.target.value)}
              disabled={state.isLoading}
            />
          </div>
          <FieldError error={state.errors.confirmPassword} />
        </div>

        <SubmitButton loading={state.isLoading} label={t("auth_submit_register")} />
      </form>

      <AuthCardFoot
        prompt={t("auth_have_account")}
        linkLabel={t("auth_link_login")}
        linkHref="/login"
      />
    </div>
  );
}
