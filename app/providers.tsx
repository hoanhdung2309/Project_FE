"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

export default function Providers({ children }: { children: ReactNode }) {
  /* Create QueryClient per component instance to avoid shared state between requests */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,        // 30s before refetch
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster
          position="top-right"
          richColors
          expand
          toastOptions={{
            style: { fontFamily: "var(--font-sans)" },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
