/**
 * Where end users get the Chrome extension.
 * Production: Chrome Web Store listing URL.
 * Until published, the site explains “coming soon” and never asks users for a folder.
 */
export function extensionStoreUrl(): string {
  return (process.env.NEXT_PUBLIC_EXTENSION_URL || "").trim();
}

export function isExtensionPublished(): boolean {
  const url = extensionStoreUrl();
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.includes("chrome.google.com");
  } catch {
    return false;
  }
}
