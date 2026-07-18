import { isPro } from "./license";

/** Free themes always available; Ember is Pro soft-gate demo. */
export const FREE_THEMES = ["mint-night", "slate-dawn"] as const;
export const PRO_THEMES = ["ember-glass"] as const;

export async function canUseTheme(themeId: string): Promise<boolean> {
  if ((FREE_THEMES as readonly string[]).includes(themeId)) return true;
  if ((PRO_THEMES as readonly string[]).includes(themeId)) return isPro();
  return true;
}

export async function canExportProfiles(): Promise<boolean> {
  return isPro();
}
