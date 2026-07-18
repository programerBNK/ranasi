import { useEffect, useRef, useState } from "react";
import { CHECKOUT_URL, PRO_PRICE_LABEL } from "../../lib/config";
import {
  activateLicense,
  deactivateLicense,
  ensureFreshLicense,
  isProActive,
  type LicenseState,
} from "../../lib/license";
import {
  FREE_PROFILE_LIMIT,
  PRO_PROFILE_LIMIT,
  addProfile,
  deleteProfile,
  emptyProfile,
  exportProfilesJson,
  importProfilesJson,
  loadProfileStore,
  loadSettings,
  profileCompleteness,
  saveActiveProfile,
  saveProfileStore,
  saveSettings,
  setActiveProfile,
  type AppSettings,
  type ProfileStore,
  type UserProfile,
} from "../../lib/profile";

type Tab = "profile" | "ai" | "license";

export function OptionsApp() {
  const [tab, setTab] = useState<Tab>("profile");
  const [store, setStore] = useState<ProfileStore | null>(null);
  const [profile, setProfile] = useState<UserProfile>(emptyProfile());
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [license, setLicense] = useState<LicenseState | null>(null);
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const pro = license ? isProActive(license) : false;

  useEffect(() => {
    void (async () => {
      const s = await loadProfileStore();
      setStore(s);
      setProfile(s.profiles.find((p) => p.id === s.activeId) ?? s.profiles[0]);
      setSettings(await loadSettings());
      const l = await ensureFreshLicense();
      setLicense(l);
      if (l.key) setKey(l.key);
    })();
  }, []);

  const completeness = profileCompleteness(profile);

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await saveActiveProfile(profile);
      const s = await loadProfileStore();
      setStore(s);
      if (settings) {
        await saveSettings({ ...settings, onboardingDone: true });
        setSettings({ ...settings, onboardingDone: true });
      }
      setMsg({ type: "ok", text: "บันทึก Profile แล้ว (เก็บในเครื่องคุณเท่านั้น)" });
    } catch {
      setMsg({ type: "err", text: "บันทึกไม่สำเร็จ" });
    } finally {
      setBusy(false);
    }
  }

  async function onSwitchProfile(id: string) {
    const s = await setActiveProfile(id);
    setStore(s);
    setProfile(s.profiles.find((p) => p.id === id) ?? s.profiles[0]);
    setMsg(null);
  }

  async function onAddProfile() {
    setBusy(true);
    setMsg(null);
    try {
      const s = await addProfile(pro);
      setStore(s);
      setProfile(s.profiles.find((p) => p.id === s.activeId)!);
      setMsg({ type: "ok", text: "เพิ่มโปรไฟล์แล้ว" });
    } catch (err) {
      setMsg({
        type: "err",
        text: err instanceof Error ? err.message : "เพิ่มไม่ได้",
      });
    } finally {
      setBusy(false);
    }
  }

  async function onDeleteProfile() {
    if (!store || store.profiles.length <= 1) return;
    setBusy(true);
    try {
      const s = await deleteProfile(profile.id);
      setStore(s);
      setProfile(s.profiles.find((p) => p.id === s.activeId)!);
      setMsg({ type: "ok", text: "ลบโปรไฟล์แล้ว" });
    } catch (err) {
      setMsg({
        type: "err",
        text: err instanceof Error ? err.message : "ลบไม่ได้",
      });
    } finally {
      setBusy(false);
    }
  }

  function onExport() {
    if (!pro) {
      setMsg({ type: "err", text: `Export เป็นฟีเจอร์ Pro (${PRO_PRICE_LABEL})` });
      return;
    }
    if (!store) return;
    const blob = new Blob([exportProfilesJson(store)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ranasi-profiles.json";
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ type: "ok", text: "Export แล้ว" });
  }

  async function onImportFile(file: File) {
    if (!pro) {
      setMsg({ type: "err", text: `Import เป็นฟีเจอร์ Pro (${PRO_PRICE_LABEL})` });
      return;
    }
    try {
      const text = await file.text();
      const imported = importProfilesJson(text);
      if (imported.profiles.length > PRO_PROFILE_LIMIT) {
        imported.profiles = imported.profiles.slice(0, PRO_PROFILE_LIMIT);
      }
      await saveProfileStore(imported);
      setStore(imported);
      setProfile(
        imported.profiles.find((p) => p.id === imported.activeId) ??
          imported.profiles[0],
      );
      setMsg({ type: "ok", text: "Import โปรไฟล์สำเร็จ" });
    } catch {
      setMsg({ type: "err", text: "ไฟล์ไม่ถูกต้อง" });
    }
  }

  async function onSaveAi(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setBusy(true);
    setMsg(null);
    try {
      await saveSettings(settings);
      setMsg({ type: "ok", text: "บันทึกการตั้งค่า AI แล้ว" });
    } catch {
      setMsg({ type: "err", text: "บันทึกไม่สำเร็จ" });
    } finally {
      setBusy(false);
    }
  }

  async function onActivate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const next = await activateLicense(key);
      setLicense(next);
      setMsg({ type: "ok", text: "Pro activated — Server AI fill พร้อมใช้" });
    } catch (err) {
      setMsg({
        type: "err",
        text: err instanceof Error ? err.message : "Activation failed",
      });
    } finally {
      setBusy(false);
    }
  }

  async function onDeactivate() {
    setBusy(true);
    setMsg(null);
    try {
      await deactivateLicense();
      setLicense(await ensureFreshLicense());
      setKey("");
      setMsg({ type: "ok", text: "License removed. Back to Free." });
    } catch {
      setMsg({ type: "err", text: "Could not deactivate" });
    } finally {
      setBusy(false);
    }
  }

  function field(
    label: string,
    k: keyof UserProfile,
    opts?: { type?: string; placeholder?: string; full?: boolean },
  ) {
    if (k === "id" || k === "label") return null;
    return (
      <label className={`field${opts?.full ? " full" : ""}`}>
        <span>{label}</span>
        {k === "summary" ? (
          <textarea
            value={String(profile[k])}
            onChange={(e) => setProfile({ ...profile, [k]: e.target.value })}
            placeholder={opts?.placeholder}
            rows={3}
          />
        ) : (
          <input
            type={opts?.type || "text"}
            value={String(profile[k])}
            onChange={(e) => setProfile({ ...profile, [k]: e.target.value })}
            placeholder={opts?.placeholder}
            autoComplete="off"
          />
        )}
      </label>
    );
  }

  return (
    <div className="wrap">
      <h1>Ranasi</h1>
      <p className="lead">
        ตั้งค่า Profile ครั้งเดียว → กด Auto-Fill ได้ทันที · Free ใช้ในเครื่อง · Pro
        ได้คีย์จากอีเมลหลังจ่ายเงิน
      </p>

      <div className="tabs">
        {(
          [
            ["profile", "Profile"],
            ["ai", "AI"],
            ["license", "License"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? "tab active" : "tab"}
            onClick={() => {
              setTab(id);
              setMsg(null);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "profile" && store && (
        <form className="card" onSubmit={onSaveProfile}>
          <h2>Profile Setup</h2>
          <p className="meta">
            ความครบถ้วน {completeness}% ·{" "}
            {pro
              ? `Pro: ได้ถึง ${PRO_PROFILE_LIMIT} โปรไฟล์`
              : `Free: ${FREE_PROFILE_LIMIT} โปรไฟล์`}
          </p>

          <div className="row" style={{ marginBottom: 12 }}>
            {store.profiles.map((p) => (
              <button
                key={p.id}
                type="button"
                className={p.id === profile.id ? "tab active" : "tab"}
                onClick={() => void onSwitchProfile(p.id)}
              >
                {p.label || "Profile"}
              </button>
            ))}
            <button type="button" className="ghost" onClick={onAddProfile}>
              + Profile
            </button>
          </div>

          <label className="field full">
            <span>Profile name</span>
            <input
              value={profile.label}
              onChange={(e) => setProfile({ ...profile, label: e.target.value })}
            />
          </label>

          <div className="grid">
            {field("Full name", "fullName", { placeholder: "Nat Haruch" })}
            {field("Email", "email", { type: "email" })}
            {field("Phone", "phone", { type: "tel" })}
            {field("Company", "company")}
            {field("Job title", "jobTitle")}
            {field("Address", "address1", { full: true })}
            {field("Address 2", "address2", { full: true })}
            {field("City", "city")}
            {field("State / Province", "state")}
            {field("Postal code", "postalCode")}
            {field("Country", "country")}
            {field("LinkedIn", "linkedin", { full: true })}
            {field("Website", "website", { full: true })}
            {field("Summary / Bio", "summary", { full: true })}
          </div>

          <h2 style={{ marginTop: 22 }}>Payment (local only — ไม่ส่งขึ้นเซิร์ฟเวอร์)</h2>
          <div className="grid">
            {field("Name on card", "cardName")}
            {field("Card number", "cardNumber")}
            {field("Expiry", "cardExp", { placeholder: "MM/YY" })}
            {field("CVC", "cardCvc")}
          </div>

          <div className="row" style={{ marginTop: 16 }}>
            <button className="primary" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save profile"}
            </button>
            <button type="button" className="ghost" onClick={onExport}>
              Export
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => fileRef.current?.click()}
            >
              Import
            </button>
            {store.profiles.length > 1 && (
              <button type="button" className="danger" onClick={onDeleteProfile}>
                Delete profile
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onImportFile(f);
              e.target.value = "";
            }}
          />
          {msg && tab === "profile" && (
            <p className={`msg ${msg.type}`}>{msg.text}</p>
          )}
        </form>
      )}

      {tab === "ai" && settings && (
        <form className="card" onSubmit={onSaveAi}>
          <h2>AI Engine</h2>
          {pro ? (
            <p className="meta">
              คุณเป็น Pro — Auto-Fill ใช้ Server AI อัตโนมัติ (ไม่ต้องใส่ key)
            </p>
          ) : (
            <>
              <p className="meta">
                Free ใช้ heuristic ในเครื่อง · อยากทดลอง AI เองใส่ OpenAI key ได้
                หรืออัปเกรด Pro ให้เซิร์ฟเวอร์จัดการให้
              </p>
              <label className="field full">
                <span>OpenAI API Key (optional)</span>
                <input
                  type="password"
                  value={settings.openaiApiKey}
                  onChange={(e) =>
                    setSettings({ ...settings, openaiApiKey: e.target.value })
                  }
                  placeholder="sk-..."
                  autoComplete="off"
                />
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={settings.useAiFill}
                  onChange={(e) =>
                    setSettings({ ...settings, useAiFill: e.target.checked })
                  }
                />
                ใช้ AI เมื่อมี API key (Free)
              </label>
              <div className="row" style={{ marginTop: 16 }}>
                <button className="primary" type="submit" disabled={busy}>
                  Save AI settings
                </button>
                <a
                  className="ghost"
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderRadius: 999,
                    textDecoration: "none",
                  }}
                >
                  Get Pro — {PRO_PRICE_LABEL}
                </a>
              </div>
            </>
          )}
          {msg && tab === "ai" && <p className={`msg ${msg.type}`}>{msg.text}</p>}
        </form>
      )}

      {tab === "license" && (
        <>
          <div className="card">
            <h2>Plan status</h2>
            <div className={`badge ${pro ? "pro" : "free"}`}>
              {pro ? "Pro" : "Free"}
            </div>
            {pro ? (
              <>
                {license?.email && (
                  <p className="meta">Licensed to {license.email}</p>
                )}
                <p className="meta">
                  {license?.expiresAt
                    ? `Expires ${new Date(license.expiresAt).toLocaleDateString()}`
                    : "Active"}
                  {" · "}Server AI + multi-profile + export
                </p>
                <button
                  type="button"
                  className="danger"
                  disabled={busy}
                  onClick={onDeactivate}
                >
                  Remove license
                </button>
              </>
            ) : (
              <p className="meta">
                Free: 1 profile · ธีม 2 แบบ · Desktop สูงสุด 10 เว็บ · Pro (
                {PRO_PRICE_LABEL}): Server AI · {PRO_PROFILE_LIMIT} profiles ·
                12 ธีม · เว็บไม่จำกัด · export/import
              </p>
            )}
          </div>

          <form className="card" onSubmit={onActivate}>
            <h2>License key</h2>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Paste license key"
              spellCheck={false}
              autoComplete="off"
            />
            <div className="row">
              <button className="primary" type="submit" disabled={busy || !key}>
                {busy ? "Working…" : "Activate"}
              </button>
              <a
                className="ghost"
                href={CHECKOUT_URL}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "10px 16px",
                  borderRadius: 999,
                  textDecoration: "none",
                }}
              >
                Buy Pro — {PRO_PRICE_LABEL}
              </a>
            </div>
            {msg && tab === "license" && (
              <p className={`msg ${msg.type}`}>{msg.text}</p>
            )}
            <p className="meta" style={{ marginTop: 14 }}>
              ได้คีย์จากอีเมลหลังจ่ายเงินที่เว็บ Ranasi → วางที่นี่ → Activate ·
              ไม่ต้องโหลดโฟลเดอร์ใดๆ
            </p>
          </form>
        </>
      )}
    </div>
  );
}
