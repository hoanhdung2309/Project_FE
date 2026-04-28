"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const t = useTranslations("header");
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.shop"), href: "/shop" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ] as const;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full bg-pitaya-500 flex items-center justify-center">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5" aria-hidden="true">
              <ellipse cx="16" cy="17" rx="9" ry="11" fill="white" opacity=".9" />
              <ellipse cx="16" cy="17" rx="6" ry="8" fill="#e8196f" />
              <path d="M16 6 C14 2 10 3 11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 6 C18 2 22 3 21 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 6 C16 2 16 4 16 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-xl font-black text-pitaya-600 tracking-tight">PITAYA</span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden md:flex items-center gap-7 font-medium text-sm text-dragon-dark">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-colors duration-200 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:bg-pitaya-500 after:transition-all ${
                  isActive
                    ? "text-pitaya-600 font-bold after:w-full"
                    : "hover:text-pitaya-500 after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* ── Right: Language + Cart + Account + Mobile toggle ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 p-2 rounded-full hover:bg-slate-100 transition-colors text-dragon-dark"
            aria-label={t("cart")}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-pitaya-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <div className="relative" ref={dropdownRef}>
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 border border-slate-200 rounded-full px-3 py-1.5 text-sm font-medium hover:border-pitaya-300 hover:bg-pitaya-50 transition-all"
                >
                  <span className="w-6 h-6 rounded-full bg-pitaya-100 text-pitaya-600 flex items-center justify-center text-xs font-bold">
                    {user.displayName[0].toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">{t("greeting", { name: user.displayName })}</span>
                  <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-slate-100 py-1 text-sm font-medium overflow-hidden">
                    {[
                      { label: t("menu.profile"), icon: "👤", href: "/account/profile", showForAdmin: true },
                      { label: t("menu.orders"), icon: "📦", href: "#", showForAdmin: false },
                      { label: t("menu.changePassword"), icon: "🔑", href: "/account/change-password", showForAdmin: true },
                    ]
                      .filter((item) => item.showForAdmin || !isAdmin)
                      .map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-pitaya-50 hover:text-pitaya-600 transition-colors"
                        >
                          <span>{item.icon}</span> {item.label}
                        </Link>
                      ))}
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 hover:bg-pitaya-50 hover:text-pitaya-600 transition-colors">
                        <span>⚙️</span> {t("menu.admin")}
                      </Link>
                    )}
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={async () => {
                        await logout();
                        router.push("/login");
                        toast.success(t("loggedOut"));
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <span>🚪</span> {t("menu.logout")}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="bg-pitaya-500 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-pitaya-600 transition-colors shadow-sm"
              >
                {t("login")}
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label={t("openMenu")}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Mobile Nav Drawer ── */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 pb-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className={`py-3 font-medium border-b border-slate-50 last:border-0 transition-colors ${
                  isActive
                    ? "text-pitaya-600 font-bold underline underline-offset-4 decoration-pitaya-500"
                    : "text-dragon-dark hover:text-pitaya-500"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
