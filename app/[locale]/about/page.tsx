import { setRequestLocale } from "next-intl/server";
import { DragonShell } from "@/components/dragon/shell";
import { AboutPage } from "@/components/dragon/about-page";

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <DragonShell active="about">
      <AboutPage />
    </DragonShell>
  );
}
