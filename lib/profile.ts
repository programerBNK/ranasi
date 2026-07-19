import { t } from "./i18n";

export const PROFILE_STORAGE_KEY = "autoflow_profiles_v1";
export const SETTINGS_STORAGE_KEY = "autoflow_settings_v1";

export const FREE_PROFILE_LIMIT = 1;
export const PRO_PROFILE_LIMIT = 5;

export interface UserProfile {
  id: string;
  label: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  company: string;
  jobTitle: string;
  linkedin: string;
  website: string;
  summary: string;
  /** Optional — stored only on-device; never sent to server fill */
  cardName: string;
  cardNumber: string;
  cardExp: string;
  cardCvc: string;
}

export interface ProfileStore {
  activeId: string;
  profiles: UserProfile[];
}

export interface AppSettings {
  /** Optional Free advanced: user-owned OpenAI key (Pro uses server) */
  openaiApiKey: string;
  useAiFill: boolean;
  onboardingDone: boolean;
}

export function emptyProfile(label = "Personal"): UserProfile {
  return {
    id: crypto.randomUUID(),
    label,
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    company: "",
    jobTitle: "",
    linkedin: "",
    website: "",
    summary: "",
    cardName: "",
    cardNumber: "",
    cardExp: "",
    cardCvc: "",
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  openaiApiKey: "",
  useAiFill: false,
  onboardingDone: false,
};

function normalizeStore(raw: unknown): ProfileStore {
  // Migrate legacy single-profile shape
  if (raw && typeof raw === "object" && "profiles" in (raw as object)) {
    const s = raw as ProfileStore;
    if (Array.isArray(s.profiles) && s.profiles.length > 0) {
      return {
        activeId: s.activeId || s.profiles[0].id,
        profiles: s.profiles,
      };
    }
  }

  if (raw && typeof raw === "object" && "email" in (raw as object)) {
    const legacy = raw as Partial<UserProfile>;
    const p = { ...emptyProfile("Personal"), ...legacy, id: crypto.randomUUID() };
    return { activeId: p.id, profiles: [p] };
  }

  const p = emptyProfile("Personal");
  return { activeId: p.id, profiles: [p] };
}

export async function loadProfileStore(): Promise<ProfileStore> {
  const result = await chrome.storage.local.get(PROFILE_STORAGE_KEY);
  return normalizeStore(result[PROFILE_STORAGE_KEY]);
}

export async function saveProfileStore(store: ProfileStore): Promise<void> {
  await chrome.storage.local.set({ [PROFILE_STORAGE_KEY]: store });
}

export async function loadProfile(): Promise<UserProfile> {
  const store = await loadProfileStore();
  return store.profiles.find((p) => p.id === store.activeId) ?? store.profiles[0];
}

export async function saveActiveProfile(profile: UserProfile): Promise<void> {
  const next = { ...profile };
  if (!next.fullName.trim() && (next.firstName || next.lastName)) {
    next.fullName = [next.firstName, next.lastName].filter(Boolean).join(" ");
  }
  if (next.fullName.trim() && !next.firstName && !next.lastName) {
    const parts = next.fullName.trim().split(/\s+/);
    next.firstName = parts[0] ?? "";
    next.lastName = parts.slice(1).join(" ");
  }

  const store = await loadProfileStore();
  const profiles = store.profiles.map((p) => (p.id === next.id ? next : p));
  if (!profiles.some((p) => p.id === next.id)) {
    profiles.push(next);
  }
  await saveProfileStore({ ...store, activeId: next.id, profiles });
}

export async function setActiveProfile(id: string): Promise<ProfileStore> {
  const store = await loadProfileStore();
  if (!store.profiles.some((p) => p.id === id)) return store;
  const next = { ...store, activeId: id };
  await saveProfileStore(next);
  return next;
}

export async function addProfile(isPro: boolean): Promise<ProfileStore> {
  const store = await loadProfileStore();
  const limit = isPro ? PRO_PROFILE_LIMIT : FREE_PROFILE_LIMIT;
  if (store.profiles.length >= limit) {
    throw new Error(
      isPro
        ? t("profile.proLimit", { limit: PRO_PROFILE_LIMIT })
        : t("profile.freeLimit"),
    );
  }
  const p = emptyProfile(`Profile ${store.profiles.length + 1}`);
  const next = {
    activeId: p.id,
    profiles: [...store.profiles, p],
  };
  await saveProfileStore(next);
  return next;
}

export async function deleteProfile(id: string): Promise<ProfileStore> {
  const store = await loadProfileStore();
  if (store.profiles.length <= 1) {
    throw new Error(t("profile.keepOne"));
  }
  const profiles = store.profiles.filter((p) => p.id !== id);
  const activeId =
    store.activeId === id ? profiles[0].id : store.activeId;
  const next = { activeId, profiles };
  await saveProfileStore(next);
  return next;
}

export async function loadSettings(): Promise<AppSettings> {
  const result = await chrome.storage.local.get(SETTINGS_STORAGE_KEY);
  const raw = result[SETTINGS_STORAGE_KEY] as AppSettings | undefined;
  return { ...DEFAULT_SETTINGS, ...raw };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await chrome.storage.local.set({ [SETTINGS_STORAGE_KEY]: settings });
}

export function profileCompleteness(profile: UserProfile): number {
  const keys: (keyof UserProfile)[] = [
    "fullName",
    "email",
    "phone",
    "address1",
    "city",
    "country",
  ];
  const filled = keys.filter((k) => String(profile[k] ?? "").trim()).length;
  return Math.round((filled / keys.length) * 100);
}

/** Profile JSON for server fill — strips payment fields */
export function profileForServer(profile: UserProfile): Record<string, string> {
  const {
    cardName: _cn,
    cardNumber: _cnum,
    cardExp: _ce,
    cardCvc: _cvc,
    id: _id,
    label: _label,
    ...safe
  } = profile;
  return Object.fromEntries(
    Object.entries(safe).filter(([, v]) => String(v).trim().length > 0),
  ) as Record<string, string>;
}

export function exportProfilesJson(store: ProfileStore): string {
  return JSON.stringify(store, null, 2);
}

export function importProfilesJson(raw: string): ProfileStore {
  const parsed = JSON.parse(raw) as unknown;
  const store = normalizeStore(parsed);
  if (!store.profiles.length) throw new Error("Invalid profile file");
  return store;
}
