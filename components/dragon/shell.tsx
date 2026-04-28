"use client";

import type { ReactNode } from "react";
import { DragonAppProvider } from "./app-context";
import { CartDrawer } from "./cart-drawer";
import { Footer } from "./footer";
import { Nav, type NavActive } from "./nav";
import { QuoteModal } from "./quote-modal";
import { Toast } from "./toast";
import { TweaksPanel } from "./tweaks-panel";

export function DragonShell({
  active,
  children,
}: {
  active?: NavActive;
  children: ReactNode;
}) {
  return (
    <DragonAppProvider>
      <div className="dragon-root">
        <Nav active={active} />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <QuoteModal />
        <Toast />
        <TweaksPanel />
      </div>
    </DragonAppProvider>
  );
}
