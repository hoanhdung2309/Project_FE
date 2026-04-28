import { setRequestLocale } from "next-intl/server";
import { DragonShell } from "@/components/dragon/shell";
import { ContactPage } from "@/components/dragon/contact-page";

export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <DragonShell active="contact">
      <ContactPage />
    </DragonShell>
  );
}
