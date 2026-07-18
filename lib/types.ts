/** Free: mint-night, slate-dawn · Pro: 12 premium themes */
export type ThemeId =
  | "mint-night"
  | "slate-dawn"
  | "noir-gold"
  | "ember-glass"
  | "arctic-glass"
  | "ocean-ink"
  | "forest-depth"
  | "rose-metal"
  | "graphite-pro"
  | "sandstone"
  | "aurora-veil"
  | "copper-loom"
  | "ivory-night"
  | "midnight-azure";

export interface SiteEntry {
  /** Unique key: "github.com" or "github.com/login" */
  id: string;
  /** Hostname for favicon, e.g. "github.com" */
  domain: string;
  /** Path including leading slash, or "/" */
  path: string;
  title: string;
  url: string;
  favicon: string;
  visitCount: number;
  lastVisited: number;
  pinned: boolean;
  /** Order among pinned / desktop icons */
  order: number;
  /** Soft-deleted from desktop (still trackable later) */
  hidden: boolean;
}

export interface DesktopState {
  sites: SiteEntry[];
  theme: ThemeId;
  wallpaper: string | null;
}

export const STORAGE_KEY = "ranasi_desktop_v1";
export const LEGACY_STORAGE_KEY = "autoflow_desktop_v1";

/** Free users start here; Pro unlock switches to noir-gold */
export const DEFAULT_STATE: DesktopState = {
  sites: [],
  theme: "mint-night",
  wallpaper: null,
};

export const PRO_DEFAULT_THEME: ThemeId = "noir-gold";
