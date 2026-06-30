import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swap USDT ↔ USDC",
  description: "Fast non-custodial stablecoin swap MVP",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
