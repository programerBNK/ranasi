import type { Metadata } from "next";
import { headers } from "next/headers";
import { detectLocale } from "@/lib/i18n/detect";
import {
  JsonLd,
  organizationJsonLd,
  softwareAppJsonLd,
  websiteJsonLd,
} from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { SEO_KEYWORDS } from "@/lib/seo/keywords";
import "./globals.css";

export const metadata: Metadata = buildMetadata({
  path: "/",
  keywords: [
    ...SEO_KEYWORDS.slice(0, 24),
    "Ranasi",
    "Ranasi autofill",
    "Ranasi Chrome extension",
  ],
});

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
      <body>
        <JsonLd
          data={[organizationJsonLd(), websiteJsonLd(), softwareAppJsonLd()]}
        />
        {children}
      </body>
    </html>
  );
}
