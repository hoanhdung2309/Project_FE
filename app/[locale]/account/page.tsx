import { setRequestLocale } from "next-intl/server";
import { DragonShell } from "@/components/dragon/shell";
import { AccountPage } from "@/components/dragon/account-page";

export default async function Account({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <DragonShell active="account">
      <AccountPage />
    </DragonShell>
  );
}
