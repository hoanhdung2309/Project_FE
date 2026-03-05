"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Chuyển hướng /account → /account/profile */
export default function AccountPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account/profile");
  }, [router]);

  return (
    <div className="min-h-screen bg-dragon-base flex items-center justify-center">
      <p className="text-slate-500 text-sm">Đang chuyển đến hồ sơ cá nhân...</p>
    </div>
  );
}
