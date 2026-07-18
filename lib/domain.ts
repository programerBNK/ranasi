/** Extract main hostname only — no path, no query, strip www. */
export function toMainDomain(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl.includes("://") ? rawUrl : `https://${rawUrl}`);
    if (!["http:", "https:"].includes(url.protocol)) return null;

    let host = url.hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.slice(4);

    // Skip browser / extension internals (allow localhost for demos)
    if (!host || host.endsWith(".local")) return null;
    if (host === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      // allow explicit add via parseSiteInput; history still skips via caller
      return host;
    }

    return host;
  } catch {
    return null;
  }
}

/** Parse user input — keeps path, strips query/hash. */
export function parseSiteInput(raw: string): {
  id: string;
  domain: string;
  path: string;
  url: string;
  title: string;
} | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    if (!["http:", "https:"].includes(url.protocol)) return null;

    let host = url.hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.slice(4);
    if (!host) return null;

    // normalize path: keep subpaths, drop trailing slash except root
    let path = url.pathname || "/";
    if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);

    const id = path === "/" ? host : `${host}${path}`;
    const href =
      path === "/"
        ? `${url.protocol}//${host}${url.port ? `:${url.port}` : ""}`
        : `${url.protocol}//${host}${url.port ? `:${url.port}` : ""}${path}`;

    const title =
      path === "/"
        ? displayName(host)
        : displayName(host) + " · " + path.replace(/^\//, "").split("/").slice(-1)[0];

    return { id, domain: host, path, url: href, title };
  } catch {
    return null;
  }
}

export function siteUrl(domain: string): string {
  return `https://${domain}`;
}

export function faviconUrl(domain: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

export function displayName(domain: string, title?: string): string {
  if (title?.trim()) {
    const cleaned = title.replace(/\s*[-|–—].*$/, "").trim();
    if (cleaned.length > 0 && cleaned.length <= 28) return cleaned;
  }
  const base = domain.split(".")[0] ?? domain;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/** Stable id for history-tracked main-domain tiles */
export function domainId(domain: string): string {
  return domain;
}
