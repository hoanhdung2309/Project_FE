import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const pathWithoutLocale = stripLocale(request.nextUrl.pathname);

  const isAdminRoute = pathWithoutLocale.startsWith("/admin");
  const isAccountRoute = pathWithoutLocale.startsWith("/account");
  const isLoginRoute = pathWithoutLocale === "/login";

  if ((isAdminRoute || isAccountRoute) && !token) {
    const url = request.nextUrl.clone();
    const locale = request.nextUrl.pathname.split("/")[1] ?? routing.defaultLocale;
    const safeLocale = routing.locales.includes(locale as (typeof routing.locales)[number])
      ? locale
      : routing.defaultLocale;
    url.pathname = `/${safeLocale}/login`;
    url.searchParams.set("from", pathWithoutLocale);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && token) {
    const locale = request.nextUrl.pathname.split("/")[1] ?? routing.defaultLocale;
    const safeLocale = routing.locales.includes(locale as (typeof routing.locales)[number])
      ? locale
      : routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${safeLocale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
