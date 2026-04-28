import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { DragonShell } from "@/components/dragon/shell";
import { AuthPage } from "@/components/dragon/auth-page";

export default async function Login({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <DragonShell>
      <Suspense fallback={null}>
        <AuthPage mode="login" />
      </Suspense>
    </DragonShell>
  );
}
