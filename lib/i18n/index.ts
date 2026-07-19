import { en, type TranslationKey } from "./locales/en";

export type { Locale } from "./types";
export type { TranslationKey } from "./locales/en";

type Catalog = Record<TranslationKey, string>;

const catalogs: Record<string, Catalog> = { en };

export function detectLocale(): string {
  if (typeof navigator === "undefined") return "en";
  return navigator.languages?.[0] || navigator.language || "en";
}

export function t(
  key: TranslationKey,
  values: Record<string, string | number> = {},
): string {
  const locale = detectLocale().toLowerCase();
  const catalog = catalogs[locale] || catalogs[locale.split("-")[0]] || en;
  const message = catalog[key] ?? en[key];

  return message.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in values ? String(values[name]) : placeholder,
  );
}
