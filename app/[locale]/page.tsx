import { setRequestLocale } from "next-intl/server";
import { DragonShell } from "@/components/dragon/shell";
import {
  Certifications,
  CtaBand,
  FarmMap,
  Featured,
  Hero,
} from "@/components/dragon/home";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <DragonShell active="home">
      <Hero />
      <Featured />
      <Certifications />
      <FarmMap />
      <CtaBand />
    </DragonShell>
  );
}
