"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const SOCIAL = [
  {
    name: "Zalo",
    href: "#",
    icon: (
      <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm3.95 20.3c-1.02.27-2.05.4-3.1.4-5.26 0-9.54-3.76-9.54-8.7 0-4.94 4.28-8.7 9.54-8.7 5.26 0 9.54 3.76 9.54 8.7 0 2.76-1.4 5.22-3.62 6.88l.5 2.5-3.32-1.08zM12 14.5h1.5v4H12v-4zm4 0h1.5v4H16v-4zm-2-2.5a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 7.015 5.146 12.836 11.875 13.854V20.08h-3.574V16h3.574v-3.097c0-3.524 2.1-5.472 5.314-5.472 1.54 0 3.15.275 3.15.275v3.463h-1.775c-1.748 0-2.293 1.085-2.293 2.198V16h3.906l-.625 4.08h-3.281v9.774C24.854 28.836 30 23.015 30 16 30 8.268 23.732 2 16 2z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: (
      <svg viewBox="0 0 32 32" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm5.6 12.8a4.8 4.8 0 01-4.8-4.8v-.8h-2.4v9.6a2.4 2.4 0 11-2.4-2.4v-2.4a4.8 4.8 0 104.8 4.8V14.4a7.15 7.15 0 004.2 1.36v-2.4a4.83 4.83 0 01-.6-.56 4.8 4.8 0 00-3.6-1.6h.8c.35.71.8 1.28 1.36 1.68a4.8 4.8 0 002.64.88v.04z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const t = useTranslations("footer");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const quickLinks = [
    { label: t("links.about"), href: "/about" as const },
    { label: t("links.wholesalePolicy"), href: "#" as const },
    { label: t("links.faq"), href: "#" as const },
    { label: t("links.contact"), href: "#contact" as const },
  ];

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <footer id="contact" className="bg-dragon-dark text-slate-300 mt-12 relative overflow-hidden">
      {/* Decorative map-like SVG background (Bình Thuận coastline shape) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {/* Stylised coastline / terrain blobs */}
          <ellipse cx="600" cy="200" rx="280" ry="180" fill="white" />
          <ellipse cx="650" cy="280" rx="200" ry="120" fill="white" />
          <ellipse cx="500" cy="150" rx="160" ry="100" fill="white" />
          <ellipse cx="700" cy="100" rx="120" ry="80"  fill="white" />
          {/* Grid lines like a map */}
          {[0,80,160,240,320,400].map(y => (
            <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="white" strokeWidth="0.5" />
          ))}
          {[0,100,200,300,400,500,600,700,800].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="400" stroke="white" strokeWidth="0.5" />
          ))}
          {/* Location pin */}
          <circle cx="600" cy="190" r="8" fill="white" opacity=".6" />
          <circle cx="600" cy="190" r="3" fill="white" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand info */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-pitaya-500 flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5" aria-hidden="true">
                  <ellipse cx="16" cy="20" rx="9" ry="10" fill="white" opacity=".85" />
                  <ellipse cx="16" cy="21" rx="6" ry="7" fill="#e8196f" />
                  <line x1="16" y1="11" x2="12" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="16" y1="11" x2="20" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="16" y1="11" x2="16" y2="2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-xl font-black text-pitaya-400 tracking-tight">PITAYA</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{t("tagline")}</p>
            <div className="space-y-1.5 text-sm">
              <p className="flex items-center gap-2 text-slate-400">
                <span className="text-pitaya-400">📍</span>
                {t("address")}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-pitaya-400">📞</span>
                <a href="tel:0901234567" className="text-slate-400 hover:text-pitaya-400 transition-colors">090 123 4567</a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-pitaya-400">✉️</span>
                <a href="mailto:hello@pitaya.vn" className="text-slate-400 hover:text-pitaya-400 transition-colors">hello@pitaya.vn</a>
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">{t("quickLinks")}</h4>
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm text-slate-400 hover:text-pitaya-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">{t("social")}</h4>
            <div className="flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-pitaya-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <a
              href="#"
              className="flex items-center justify-center gap-2 w-full bg-cactus-500 hover:bg-cactus-600 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95 shadow-md"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              {t("chatZalo")}
            </a>
          </div>

          {/* Email subscription */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">{t("subscribeTitle")}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{t("subscribeDesc")}</p>
            {submitted ? (
              <div className="flex items-center gap-2 text-cactus-400 text-sm font-semibold bg-cactus-500/10 border border-cactus-500/20 rounded-xl px-3 py-2.5">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t("subscribed")}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  required
                  className="w-full bg-white/8 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-pitaya-500 focus:bg-white/12 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <button
                  type="submit"
                  className="w-full bg-pitaya-500 hover:bg-pitaya-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95"
                >
                  {t("subscribeBtn")}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>{t("copyright")}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">{t("privacy")}</a>
            <a href="#" className="hover:text-slate-300 transition-colors">{t("terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
