/**
 * Lemon Squeezy checkout link for Ranasi Pro ($10/year).
 * Set NEXT_PUBLIC_CHECKOUT_URL to your shareable checkout URL, e.g.
 * https://YOUR_STORE.lemonsqueezy.com/checkout/buy/VARIANT_UUID
 * Append ?checkout[success_url]=https://YOUR_DOMAIN/success for post-pay redirect.
 */

export function rawCheckoutUrl(): string {
  return (
    process.env.NEXT_PUBLIC_CHECKOUT_URL ||
    process.env.LEMONSQUEEZY_CHECKOUT_URL ||
    ""
  ).trim();
}

export function isCheckoutConfigured(): boolean {
  const url = rawCheckoutUrl();
  if (!url) return false;
  if (url.startsWith("#")) return false;
  if (url.includes("/#pricing")) return false;
  // Local placeholder that only scrolls to pricing
  if (url.includes("localhost") && url.includes("#")) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** Checkout URL with success redirect when possible. */
export function checkoutUrl(): string {
  const base = rawCheckoutUrl();
  if (!isCheckoutConfigured()) return "/pro";

  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3120"
  ).replace(/\/$/, "");

  try {
    const u = new URL(base);
    if (!u.searchParams.has("checkout[success_url]")) {
      u.searchParams.set("checkout[success_url]", `${appUrl}/success`);
    }
    return u.toString();
  } catch {
    return base;
  }
}
