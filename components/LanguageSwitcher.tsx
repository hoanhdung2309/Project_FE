"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LANG_META: Record<Locale, { label: string; flag: string }> = {
  vi: { label: "Tiếng Việt", flag: "🇻🇳" },
  en: { label: "English", flag: "🇬🇧" },
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      // @ts-expect-error -- params type depends on current route
      router.replace({ pathname, params }, { locale: next });
    });
  }

  const current = LANG_META[locale];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className="flex items-center gap-1.5 p-2 rounded-full hover:bg-slate-100 transition-colors text-dragon-dark disabled:opacity-60"
        aria-label="Language"
      >
        <span className="text-lg leading-none">{current.flag}</span>
        <span className="hidden sm:inline text-sm font-medium uppercase">{locale}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-lg border border-slate-100 py-1 text-sm font-medium overflow-hidden z-50">
          {routing.locales.map((l) => {
            const meta = LANG_META[l];
            const isActive = l === locale;
            return (
              <button
                key={l}
                type="button"
                onClick={() => switchTo(l)}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                  isActive
                    ? "bg-pitaya-50 text-pitaya-600 font-bold"
                    : "hover:bg-slate-50 text-dragon-dark"
                }`}
              >
                <span className="text-lg leading-none">{meta.flag}</span>
                {meta.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
