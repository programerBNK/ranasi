/** Canonical site URL for SEO (no trailing slash). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.ranasi.com";

export const SITE_NAME = "Ranasi";

export const DEFAULT_TITLE =
  "Ranasi — Autofill Chrome Extension, Auto Fill Forms & New Tab Desktop";

export const DEFAULT_DESCRIPTION =
  "Chrome extension for autofill / auto fill web forms in one click, plus a desktop-style new tab to pin websites. Free AI form filler start. Pro $10/year.";

export const PRIMARY_KEYWORDS = [
  "chrome autofill extension",
  "autofill",
  "auto fill",
  "auto fill chrome extension",
  "AI form filler",
  "chrome extension autofill",
  "chrome new tab desktop",
  "custom new tab chrome",
  "new tab dashboard",
  "pin websites new tab",
  "form autofill extension",
  "one click autofill",
] as const;
