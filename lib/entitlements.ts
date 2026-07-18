import { isPro } from "./license";
import type { DesktopState, ThemeId } from "./types";
import { PRO_DEFAULT_THEME } from "./types";
import { FREE_THEME_LIST, PRO_THEME_LIST } from "./themes";

export const FREE_THEMES = FREE_THEME_LIST.map((t) => t.id);
export const PRO_THEMES = PRO_THEME_LIST.map((t) => t.id);

/** Free desktop: max 10 visible websites. Pro: unlimited. */
export const FREE_SITE_LIMIT = 10;

export function countVisibleSites(state: DesktopState): number {
  return state.sites.filter((s) => !s.hidden).length;
}

/**
 * Can add a new site or unhide one.
 * Updating an already-visible site always allowed.
 */
export function canAddOrUnhideSite(
  state: DesktopState,
  pro: boolean,
  siteId?: string,
): boolean {
  if (pro) return true;
  const existing = siteId
    ? state.sites.find((s) => s.id === siteId)
    : undefined;
  if (existing && !existing.hidden) return true;
  return countVisibleSites(state) < FREE_SITE_LIMIT;
}

export function effectiveTheme(themeId: ThemeId, pro: boolean): ThemeId {
  if (pro) return themeId;
  if ((FREE_THEMES as string[]).includes(themeId)) return themeId;
  return FREE_THEMES[0];
}

export async function canUseTheme(themeId: string): Promise<boolean> {
  if ((FREE_THEMES as string[]).includes(themeId)) return true;
  if ((PRO_THEMES as string[]).includes(themeId)) return isPro();
  return true;
}

export async function canExportProfiles(): Promise<boolean> {
  return isPro();
}

export { PRO_DEFAULT_THEME };
