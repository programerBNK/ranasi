/** Canonical site URL for SEO (no trailing slash). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.ranasi.com";

export const SITE_NAME = "Ranasi";

export const DEFAULT_TITLE =
  "Autofill Extension for Chrome — Auto Fill Forms | Ranasi";

export const DEFAULT_DESCRIPTION =
  "Free autofill extension & auto fill Chrome extension. Fill web forms in one click, plus a desktop-style new tab. AI form filler on Pro — $10/year.";

export const PRIMARY_KEYWORDS = [
  "autofill extension",
  "auto fill extension",
  "autofill",
  "auto fill",
  "chrome extension",
  "chrome autofill extension",
  "auto fill chrome extension",
  "autofill chrome extension",
  "chrome extension autofill",
  "AI form filler",
  "form autofill extension",
  "chrome new tab desktop",
] as const;
