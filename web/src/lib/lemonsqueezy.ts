const LS_BASE = "https://api.lemonsqueezy.com/v1/licenses";

export interface LicenseResult {
  valid: boolean;
  error: string | null;
  instanceId: string | null;
  email: string | null;
  expiresAt: string | null;
  status: string | null;
}

function formBody(data: Record<string, string>): string {
  return new URLSearchParams(data).toString();
}

async function lsPost(
  path: "activate" | "validate" | "deactivate",
  fields: Record<string, string>,
): Promise<Record<string, unknown>> {
  const res = await fetch(`${LS_BASE}/${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody(fields),
  });

  const json = (await res.json()) as Record<string, unknown>;
  return json;
}

function mapLicense(json: Record<string, unknown>, okFlag: string): LicenseResult {
  const licenseKey = json.license_key as
    | { status?: string; expires_at?: string | null }
    | undefined;
  const instance = json.instance as { id?: string } | null | undefined;
  const meta = json.meta as { customer_email?: string } | undefined;
  const ok = Boolean(json[okFlag]);

  return {
    valid: ok,
    error: (json.error as string | null) ?? (ok ? null : "License invalid"),
    instanceId: instance?.id ?? null,
    email: meta?.customer_email ?? null,
    expiresAt: licenseKey?.expires_at ?? null,
    status: licenseKey?.status ?? null,
  };
}

/** Local/dev shortcut — RN-DEV-PRO, with AF-DEV-PRO kept for compatibility. */
export function tryMockLicense(licenseKey: string): LicenseResult | null {
  const allowMock =
    process.env.ALLOW_DEV_LICENSE === "true" ||
    process.env.NODE_ENV === "development";

  if (!allowMock) return null;
  const key = licenseKey.trim().toUpperCase();
  if (key !== "RN-DEV-PRO" && key !== "AF-DEV-PRO") return null;

  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  return {
    valid: true,
    error: null,
    instanceId: "dev-instance",
    email: "dev@ranasi.local",
    expiresAt: expires.toISOString(),
    status: "active",
  };
}

export async function activateLicenseKey(
  licenseKey: string,
  instanceName: string,
): Promise<LicenseResult> {
  const mock = tryMockLicense(licenseKey);
  if (mock) return { ...mock, instanceId: `dev-${Date.now()}` };

  const json = await lsPost("activate", {
    license_key: licenseKey,
    instance_name: instanceName,
  });
  return mapLicense(json, "activated");
}

export async function validateLicenseKey(
  licenseKey: string,
  instanceId?: string | null,
): Promise<LicenseResult> {
  const mock = tryMockLicense(licenseKey);
  if (mock) return mock;

  const fields: Record<string, string> = { license_key: licenseKey };
  if (instanceId) fields.instance_id = instanceId;

  const json = await lsPost("validate", fields);
  return mapLicense(json, "valid");
}

export async function deactivateLicenseKey(
  licenseKey: string,
  instanceId: string,
): Promise<LicenseResult> {
  if (tryMockLicense(licenseKey)) {
    return {
      valid: true,
      error: null,
      instanceId,
      email: null,
      expiresAt: null,
      status: "inactive",
    };
  }

  const json = await lsPost("deactivate", {
    license_key: licenseKey,
    instance_id: instanceId,
  });
  return mapLicense(json, "deactivated");
}

export { checkoutUrl, isCheckoutConfigured } from "./checkout";
