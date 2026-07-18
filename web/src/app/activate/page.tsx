"use client";

import { useState } from "react";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3130").replace(
  /\/$/,
  "",
);

export default function ActivatePage() {
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`${API}/v1/license/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey: key.trim(),
          instanceName: "AutoFlow-Web",
        }),
      });
      const data = (await res.json()) as {
        valid?: boolean;
        error?: string;
        expiresAt?: string | null;
      };

      if (!res.ok || !data.valid) {
        setMsg({ type: "err", text: data.error || "Activation failed" });
        return;
      }

      setMsg({
        type: "ok",
        text: data.expiresAt
          ? `Valid Pro until ${new Date(data.expiresAt).toLocaleDateString()}. Paste the same key in the Extension.`
          : "Valid Pro license. Paste the same key in the Extension to unlock.",
      });
    } catch {
      setMsg({
        type: "err",
        text: `เชื่อมต่อ API ไม่ได้ — รัน Axum ที่ ${API}`,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <form className="panel" onSubmit={onSubmit}>
        <h1>Activate license</h1>
        <p>
          วางคีย์จากอีเมล Lemon Squeezy · ทดสอบ local ใช้ <code>AF-DEV-PRO</code>
        </p>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="xxxx-xxxx-xxxx-xxxx"
          spellCheck={false}
          autoComplete="off"
        />
        <button className="btn btn-primary" type="submit" disabled={busy || !key}>
          {busy ? "Checking…" : "Validate key"}
        </button>
        {msg && <p className={`msg ${msg.type}`}>{msg.text}</p>}
        <p className="msg" style={{ color: "var(--muted)", marginTop: 18 }}>
          ปลดล็อกจริงใน Extension Options → License
        </p>
      </form>
    </main>
  );
}
