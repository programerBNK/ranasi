import { API_BASE } from "./config";

export const LICENSE_STORAGE_KEY = "autoflow_license_v1";

export interface LicenseState {
  key: string;
  instanceId: string | null;
  email: string | null;
  status: "free" | "pro";
  expiresAt: string | null;
  lastValidatedAt: number | null;
}

export const DEFAULT_LICENSE: LicenseState = {
  key: "",
  instanceId: null,
  email: null,
  status: "free",
  expiresAt: null,
  lastValidatedAt: null,
};

const REVALIDATE_MS = 1000 * 60 * 60 * 24; // 24h

export async function loadLicense(): Promise<LicenseState> {
  const result = await chrome.storage.local.get(LICENSE_STORAGE_KEY);
  const raw = result[LICENSE_STORAGE_KEY] as LicenseState | undefined;
  if (!raw) return { ...DEFAULT_LICENSE };
  return { ...DEFAULT_LICENSE, ...raw };
}

export async function saveLicense(state: LicenseState): Promise<void> {
  await chrome.storage.local.set({ [LICENSE_STORAGE_KEY]: state });
}

export async function clearLicense(): Promise<void> {
  await chrome.storage.local.set({ [LICENSE_STORAGE_KEY]: { ...DEFAULT_LICENSE } });
}

export function isProActive(license: LicenseState): boolean {
  if (license.status !== "pro") return false;
  if (!license.expiresAt) return true;
  return new Date(license.expiresAt).getTime() > Date.now();
}

export async function isPro(): Promise<boolean> {
  const license = await ensureFreshLicense();
  return isProActive(license);
}

export async function ensureFreshLicense(): Promise<LicenseState> {
  const license = await loadLicense();
  if (!license.key) return license;

  const stale =
    !license.lastValidatedAt ||
    Date.now() - license.lastValidatedAt > REVALIDATE_MS;

  if (!stale && isProActive(license)) return license;

  try {
    return await validateLicense(license.key, license.instanceId);
  } catch {
    // Offline / API down — keep last known Pro until expiry
    return license;
  }
}

interface ActivateResponse {
  valid: boolean;
  error?: string | null;
  instanceId?: string | null;
  email?: string | null;
  expiresAt?: string | null;
  status?: string | null;
}

async function readApiJson(res: Response): Promise<ActivateResponse> {
  const text = await res.text();
  if (!text) {
    throw new Error(
      `API ไม่ตอบกลับ (HTTP ${res.status}). รัน Axum ที่ ${API_BASE}`,
    );
  }
  try {
    return JSON.parse(text) as ActivateResponse;
  } catch {
    throw new Error(
      `API ตอบไม่ใช่ JSON (HTTP ${res.status}). ตรวจ Axum ที่ ${API_BASE}`,
    );
  }
}

export async function activateLicense(key: string): Promise<LicenseState> {
  const instanceName = await buildInstanceName();
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/v1/license/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenseKey: key.trim(), instanceName }),
    });
  } catch {
    throw new Error(
      `เชื่อมต่อ ${API_BASE} ไม่ได้ — รัน cd api && cargo run`,
    );
  }

  const data = await readApiJson(res);
  if (!res.ok || !data.valid) {
    throw new Error(data.error || "Activation failed");
  }

  const next: LicenseState = {
    key: key.trim(),
    instanceId: data.instanceId ?? null,
    email: data.email ?? null,
    status: "pro",
    expiresAt: data.expiresAt ?? null,
    lastValidatedAt: Date.now(),
  };
  await saveLicense(next);
  return next;
}

export async function validateLicense(
  key: string,
  instanceId: string | null,
): Promise<LicenseState> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/v1/license/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenseKey: key, instanceId }),
    });
  } catch {
    throw new Error(`เชื่อมต่อ ${API_BASE} ไม่ได้`);
  }

  const data = await readApiJson(res);
  if (!res.ok || !data.valid) {
    const cleared: LicenseState = {
      ...DEFAULT_LICENSE,
      key,
      lastValidatedAt: Date.now(),
    };
    await saveLicense(cleared);
    return cleared;
  }

  const next: LicenseState = {
    key,
    instanceId: data.instanceId ?? instanceId,
    email: data.email ?? null,
    status: "pro",
    expiresAt: data.expiresAt ?? null,
    lastValidatedAt: Date.now(),
  };
  await saveLicense(next);
  return next;
}

export async function deactivateLicense(): Promise<void> {
  const license = await loadLicense();
  if (license.key && license.instanceId) {
    try {
      await fetch(`${API_BASE}/v1/license/deactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey: license.key,
          instanceId: license.instanceId,
        }),
      });
    } catch {
      // best-effort
    }
  }
  await clearLicense();
}

async function buildInstanceName(): Promise<string> {
  try {
    const platform = await chrome.runtime.getPlatformInfo();
    return `Ranasi-${platform.os}-${chrome.runtime.id.slice(0, 8)}`;
  } catch {
    return `Ranasi-${Date.now()}`;
  }
}
