/**
 * Where end users get the Chrome extension.
 * Prefer NEXT_PUBLIC_EXTENSION_URL; fall back to the published listing ID.
 */
export const DEFAULT_EXTENSION_STORE_URL =
  "https://chromewebstore.google.com/detail/ranasi/jhnkiofckjnbekegndfoaafeialceplb";

export function extensionStoreUrl(): string {
  return (
    process.env.NEXT_PUBLIC_EXTENSION_URL?.trim() || DEFAULT_EXTENSION_STORE_URL
  );
}

export function isExtensionPublished(): boolean {
  const url = extensionStoreUrl();
  if (!url) return false;
  try {
    const u = new URL(url);
    // chromewebstore.google.com does NOT contain the substring "chrome.google.com"
    return (
      u.protocol === "https:" &&
      (u.hostname === "chromewebstore.google.com" ||
        u.hostname.endsWith(".chrome.google.com") ||
        u.hostname === "chrome.google.com")
    );
  } catch {
    return false;
  }
}
