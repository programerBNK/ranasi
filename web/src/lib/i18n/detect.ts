export function detectLocale(acceptLanguage: string | null): string {
  const preferred = acceptLanguage?.split(",")[0]?.split(";")[0]?.trim();
  const primary = preferred?.split("-")[0]?.toLowerCase();
  return primary && /^[a-z]{2,8}$/.test(primary) ? primary : "en";
}
