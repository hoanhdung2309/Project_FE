import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | PITAYA – Đại Lý Thanh Long VietGAP",
    default: "PITAYA – Thanh Long Sỉ & Lẻ Chính Gốc VietGAP",
  },
  description:
    "Đại lý thanh long ruột đỏ, ruột trắng chất lượng VietGAP. Giá sỉ tốt nhất, giao hàng toàn quốc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
