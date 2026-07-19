import type { Metadata } from "next";
import { headers } from "next/headers";
import { detectLocale } from "@/lib/i18n/detect";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ranasi — Smart AI Browser Assistant",
  description:
    "Desktop new tab + one-click autofill. Free to start. Pro $10/year via license key.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = detectLocale((await headers()).get("accept-language"));

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
