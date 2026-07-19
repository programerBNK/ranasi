/** Canonical site URL for SEO (no trailing slash). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.ranasi.com";

export const SITE_NAME = "Ranasi";

export const DEFAULT_TITLE =
  "Ranasi — Chrome Autofill Extension & AI Form Filler | New Tab Desktop";

export const DEFAULT_DESCRIPTION =
  "Ranasi is a Chrome autofill extension with one-click AI form fill, local profiles, and a dimensional new-tab desktop. Free to start. Pro from $10/year.";

export const PRIMARY_KEYWORDS = [
  "chrome autofill extension",
  "auto fill chrome",
  "autofill forms",
  "AI form filler",
  "one click autofill",
  "browser autofill",
  "chrome new tab desktop",
  "form autofill extension",
] as const;
