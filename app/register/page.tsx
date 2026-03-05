"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  function validate() {
    const e: typeof errors = {};
    if (!displayName.trim()) e.displayName = "Vui lòng nhập họ tên";
    if (!email.trim()) e.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Email không hợp lệ";
    if (!password) e.password = "Vui lòng nhập mật khẩu";
    else if (password.length < 6) e.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (confirmPassword !== password) e.confirmPassword = "Mật khẩu xác nhận không khớp";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({
        email,
        password,
        displayName,
        phone: phone.trim() || undefined,
      });
      toast.success("Đăng ký thành công! Chào mừng bạn đến với PITAYA.");
      router.push("/shop");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

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
          <p className="mt-2 text-sm text-slate-500">Hệ thống quản lý đại lý Thanh Long</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Tạo tài khoản</CardTitle>
            <CardDescription>Điền thông tin bên dưới để đăng ký</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Họ tên */}
              <div className="space-y-1.5">
                <Label htmlFor="displayName">Họ và tên <span className="text-pitaya-500">*</span></Label>
                <Input
                  id="displayName"
                  type="text"
                  autoComplete="name"
                  placeholder="Nguyễn Văn A"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  error={errors.displayName}
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email <span className="text-pitaya-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  disabled={isLoading}
                />
              </div>

              {/* Số điện thoại */}
              <div className="space-y-1.5">
                <Label htmlFor="phone">
                  Số điện thoại{" "}
                  <span className="text-slate-400 font-normal text-xs">(tùy chọn)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="0901 234 567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Mật khẩu */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Mật khẩu <span className="text-pitaya-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
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
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu <span className="text-pitaya-500">*</span></Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang đăng ký...
                  </span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Đăng ký
                  </>
                )}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-pitaya-600 font-semibold hover:underline">
                Đăng nhập
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2025 PITAYA. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dragon-base flex items-center justify-center"><div className="animate-spin w-8 h-8 rounded-full border-2 border-pitaya-500 border-t-transparent" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
