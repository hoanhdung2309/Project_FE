"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tag,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSignalR } from "@/hooks/useSignalR";
import { Button } from "@/components/ui/button";
import type { ReceivedChatMessage } from "@/types";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",            icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders",     icon: ShoppingBag,     label: "Đơn hàng" },
  { href: "/admin/inventory",  icon: Package,         label: "Tồn kho (FEFO)" },
  { href: "/admin/products",   icon: Tag,             label: "Sản phẩm" },
  { href: "/admin/customers",  icon: Users,            label: "Khách hàng" },
];

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all",
        active
          ? "bg-pitaya-500 text-white shadow-sm"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatNotifications, setChatNotifications] = useState<ReceivedChatMessage[]>([]);

  /* Real-time: receive chat messages via SignalR "ReceiveChat" event */
  useSignalR({
    token,
    onReceiveChat: (msg) => {
      setChatNotifications((prev) => [msg, ...prev].slice(0, 10));
      toast.info(`Tin nhắn mới từ ${msg.senderId}`, {
        description: msg.message.slice(0, 80),
        duration: 6000,
      });
    },
  });

  function handleLogout() {
    logout();
    toast.success("Đã đăng xuất.");
    router.push("/login");
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4 mb-4">
        <span className="w-8 h-8 rounded-full bg-pitaya-500 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
            <ellipse cx="16" cy="20" rx="9" ry="10" fill="white" opacity=".85" />
            <ellipse cx="16" cy="21" rx="6" ry="7" fill="#e91e63" />
            <line x1="16" y1="11" x2="12" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="11" x2="20" y2="3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="11" x2="16" y2="2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <div>
          <p className="text-white font-black text-base tracking-tight">PITAYA</p>
          <p className="text-slate-500 text-xs">Admin Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1 px-2">
        {NAV.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
            }
            onClick={() => setSidebarOpen(false)}
          />
        ))}
      </nav>

      {/* Chat notification badge */}
      {chatNotifications.length > 0 && (
        <div className="mx-2 mb-3 bg-pitaya-500/10 border border-pitaya-500/20 rounded-xl p-3">
          <div className="flex items-center gap-2 text-pitaya-400 text-xs font-semibold mb-1">
            <Bell className="w-3 h-3" />
            {chatNotifications.length} tin nhắn mới
          </div>
          <p className="text-slate-500 text-xs truncate">
            {chatNotifications[0]?.message.slice(0, 50)}
          </p>
        </div>
      )}

      {/* User + Logout */}
      <div className="border-t border-slate-800 mx-2 mt-2 pt-4 pb-4">
        <div className="flex items-center gap-2 px-2 mb-3">
          <span className="w-8 h-8 rounded-full bg-pitaya-500/20 text-pitaya-400 flex items-center justify-center text-sm font-bold shrink-0">
            {user?.displayName?.[0] ?? "A"}
          </span>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.displayName ?? "Admin"}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900 border-r border-slate-800 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 z-50 lg:hidden flex flex-col">
            <button
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-white font-bold text-sm">PITAYA Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto bg-dragon-base">
          {children}
        </main>
      </div>
    </div>
  );
}
