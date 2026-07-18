import type { ThemeId } from "./types";

export type ThemeMeta = {
  id: ThemeId;
  label: string;
  pro?: boolean;
  /** Swatch gradient for picker */
  swatch: string;
};

export const FREE_THEME_LIST: ThemeMeta[] = [
  {
    id: "mint-night",
    label: "Mint",
    swatch: "linear-gradient(135deg,#071a1c,#1b4f4a)",
  },
  {
    id: "slate-dawn",
    label: "Slate",
    swatch: "linear-gradient(135deg,#12151c,#3a5068)",
  },
];

/** 12 Pro-only themes — noir-gold is the Pro default */
export const PRO_THEME_LIST: ThemeMeta[] = [
  {
    id: "noir-gold",
    label: "Noir Gold",
    pro: true,
    swatch: "linear-gradient(135deg,#050507,#d4af7a)",
  },
  {
    id: "ember-glass",
    label: "Ember",
    pro: true,
    swatch: "linear-gradient(135deg,#1a1210,#ffb86b)",
  },
  {
    id: "arctic-glass",
    label: "Arctic",
    pro: true,
    swatch: "linear-gradient(135deg,#0a1218,#a8d4ff)",
  },
  {
    id: "ocean-ink",
    label: "Ocean",
    pro: true,
    swatch: "linear-gradient(135deg,#061018,#2dd4bf)",
  },
  {
    id: "forest-depth",
    label: "Forest",
    pro: true,
    swatch: "linear-gradient(135deg,#07140c,#6ee7a8)",
  },
  {
    id: "rose-metal",
    label: "Rose",
    pro: true,
    swatch: "linear-gradient(135deg,#1a1014,#f0a8c0)",
  },
  {
    id: "graphite-pro",
    label: "Graphite",
    pro: true,
    swatch: "linear-gradient(135deg,#0c0c0e,#c8c8d0)",
  },
  {
    id: "sandstone",
    label: "Sand",
    pro: true,
    swatch: "linear-gradient(135deg,#1a1610,#e8c89a)",
  },
  {
    id: "aurora-veil",
    label: "Aurora",
    pro: true,
    swatch: "linear-gradient(135deg,#0c1020,#7dd3c0 40%,#c4b5fd)",
  },
  {
    id: "copper-loom",
    label: "Copper",
    pro: true,
    swatch: "linear-gradient(135deg,#140c08,#e8a070)",
  },
  {
    id: "ivory-night",
    label: "Ivory",
    pro: true,
    swatch: "linear-gradient(135deg,#0a0a0c,#f5efe6)",
  },
  {
    id: "midnight-azure",
    label: "Azure",
    pro: true,
    swatch: "linear-gradient(135deg,#060a18,#60a5fa)",
  },
];

export const ALL_THEMES: ThemeMeta[] = [...FREE_THEME_LIST, ...PRO_THEME_LIST];
