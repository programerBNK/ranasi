/** API base for license + Pro AI fill (Axum). */
export const API_BASE =
  import.meta.env.WXT_API_BASE?.replace(/\/$/, "") || "http://localhost:3130";

export const CHECKOUT_URL =
  import.meta.env.WXT_CHECKOUT_URL || "http://localhost:3120/pro";

export const PRO_PRICE_LABEL = "$10/year";
