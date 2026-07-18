import {
  DEFAULT_STATE,
  STORAGE_KEY,
  type DesktopState,
  type SiteEntry,
  type ThemeId,
} from "./types";
import {
  displayName,
  domainId,
  faviconUrl,
  parseSiteInput,
  siteUrl,
  toMainDomain,
} from "./domain";

function browserStorage() {
  return chrome.storage.local;
}

function normalizeSite(raw: SiteEntry): SiteEntry {
  const id = raw.id || raw.domain;
  const path = raw.path || "/";
  return {
    ...raw,
    id,
    path,
    url: raw.url || siteUrl(raw.domain),
  };
}

export async function loadDesktopState(): Promise<DesktopState> {
  const result = await browserStorage().get(STORAGE_KEY);
  const raw = result[STORAGE_KEY] as DesktopState | undefined;
  if (!raw) return structuredClone(DEFAULT_STATE);
  return {
    ...DEFAULT_STATE,
    ...raw,
    sites: Array.isArray(raw.sites) ? raw.sites.map(normalizeSite) : [],
  };
}

export async function saveDesktopState(state: DesktopState): Promise<void> {
  await browserStorage().set({ [STORAGE_KEY]: state });
}

export async function updateDesktopState(
  updater: (prev: DesktopState) => DesktopState,
): Promise<DesktopState> {
  const prev = await loadDesktopState();
  const next = updater(prev);
  await saveDesktopState(next);
  return next;
}

/** Record a visit — main domain only (no auto path clutter). */
export async function recordVisit(rawUrl: string, title?: string): Promise<void> {
  const domain = toMainDomain(rawUrl);
  if (!domain || domain === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
    return;
  }

  const id = domainId(domain);

  await updateDesktopState((prev) => {
    const existing = prev.sites.find((s) => s.id === id);
    const now = Date.now();

    if (existing) {
      if (existing.hidden) return prev;
      return {
        ...prev,
        sites: prev.sites.map((s) =>
          s.id === id
            ? {
                ...s,
                visitCount: s.visitCount + 1,
                lastVisited: now,
                title: displayName(domain, title) || s.title,
              }
            : s,
        ),
      };
    }

    const maxOrder = prev.sites.reduce((m, s) => Math.max(m, s.order), -1);
    const entry: SiteEntry = {
      id,
      domain,
      path: "/",
      title: displayName(domain, title),
      url: siteUrl(domain),
      favicon: faviconUrl(domain),
      visitCount: 1,
      lastVisited: now,
      pinned: false,
      order: maxOrder + 1,
      hidden: false,
    };

    return { ...prev, sites: [...prev.sites, entry] };
  });
}

export async function setPinned(id: string, pinned: boolean): Promise<DesktopState> {
  return updateDesktopState((prev) => ({
    ...prev,
    sites: prev.sites.map((s) => (s.id === id ? { ...s, pinned } : s)),
  }));
}

export async function removeSite(id: string): Promise<DesktopState> {
  return updateDesktopState((prev) => ({
    ...prev,
    sites: prev.sites.map((s) =>
      s.id === id ? { ...s, hidden: true, pinned: false } : s,
    ),
  }));
}

export async function reorderSites(orderedIds: string[]): Promise<DesktopState> {
  return updateDesktopState((prev) => {
    const orderMap = new Map(orderedIds.map((d, i) => [d, i]));
    return {
      ...prev,
      sites: prev.sites.map((s) =>
        orderMap.has(s.id) ? { ...s, order: orderMap.get(s.id)! } : s,
      ),
    };
  });
}

/** Manual add — supports path เช่น github.com/login */
export async function addCustomSite(input: string): Promise<DesktopState> {
  const parsed = parseSiteInput(input);
  if (!parsed) throw new Error("Invalid URL");

  return updateDesktopState((prev) => {
    const existing = prev.sites.find((s) => s.id === parsed.id);
    if (existing) {
      return {
        ...prev,
        sites: prev.sites.map((s) =>
          s.id === parsed.id
            ? {
                ...s,
                hidden: false,
                pinned: true,
                url: parsed.url,
                path: parsed.path,
                title: s.title || parsed.title,
              }
            : s,
        ),
      };
    }

    const maxOrder = prev.sites.reduce((m, s) => Math.max(m, s.order), -1);
    const entry: SiteEntry = {
      id: parsed.id,
      domain: parsed.domain,
      path: parsed.path,
      title: parsed.title,
      url: parsed.url,
      favicon: faviconUrl(parsed.domain),
      visitCount: 0,
      lastVisited: Date.now(),
      pinned: true,
      order: maxOrder + 1,
      hidden: false,
    };
    return { ...prev, sites: [...prev.sites, entry] };
  });
}

export async function setTheme(theme: ThemeId): Promise<DesktopState> {
  return updateDesktopState((prev) => ({ ...prev, theme }));
}

export async function setWallpaper(wallpaper: string | null): Promise<DesktopState> {
  return updateDesktopState((prev) => ({ ...prev, wallpaper }));
}

/** Visible desktop icons: pinned first (by order), then recent unpinned. */
export function visibleSites(state: DesktopState): SiteEntry[] {
  const visible = state.sites.filter((s) => !s.hidden);
  const pinned = visible
    .filter((s) => s.pinned)
    .sort((a, b) => a.order - b.order);
  const recent = visible
    .filter((s) => !s.pinned)
    .sort((a, b) => b.lastVisited - a.lastVisited)
    .slice(0, 24);
  return [...pinned, ...recent];
}
