"use client";

import { useState } from "react";
import Link from "next/link";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3130").replace(
  /\/$/,
  "",
);

export default function ActivatePage() {
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`${API}/v1/license/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: key.trim(), instanceName: "Ranasi-Web" }),
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
          ? `This key is valid until ${new Date(data.expiresAt).toLocaleDateString()}. Next, paste the same key into Extension Options → License → Activate.`
          : "This key is valid. Next, paste the same key into Extension Options → License → Activate.",
      });
    } catch {
      setMsg({
        type: "err",
        text: `Could not connect to the server (${API}). Try again later or paste the key directly into the extension.`,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="logo" href="/">Ranasi</Link>
        <div className="nav-links">
          <Link href="/#pro-flow">After payment</Link>
          <Link href="/pro">Get Pro</Link>
        </div>
      </nav>

      <section className="section" style={{ marginTop: 0 }}>
        <h2>Activate a license key</h2>
        <p>Validate the key from your payment email here, then paste it into the extension to unlock Pro.</p>
      </section>

      <ol className="guide-list numbered" style={{ marginBottom: 28 }}>
        <li><strong>Copy the license key from your email</strong><span>Lemon Squeezy sends it after successful payment.</span></li>
        <li><strong>Optionally validate it here</strong><span>Paste it below and select Validate key.</span></li>
        <li><strong>Unlock the extension</strong><span>Open Chrome → Extensions → Ranasi → Options → License, paste the key, and select Activate.</span></li>
        <li><strong>Start using Pro</strong><span>Open a new tab and use Auto-Fill on any form.</span></li>
      </ol>

      <form className="panel" onSubmit={onSubmit} style={{ marginTop: 0 }}>
        <h1>Paste your license key</h1>
        <p>This page only validates the key. Activation happens in Extension Options.</p>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Paste license key here"
          spellCheck={false}
          autoComplete="off"
        />
        <button className="btn btn-primary" type="submit" disabled={busy || !key}>
          {busy ? "Validating…" : "Validate key"}
        </button>
        {msg && <p className={`msg ${msg.type}`}>{msg.text}</p>}
        <p className="meta" style={{ marginTop: 14 }}>
          Local development: use <code>RN-DEV-PRO</code>. The legacy{" "}
          <code>AF-DEV-PRO</code> key also works when dev licenses are enabled.
        </p>
      </form>

      <div className="callout" style={{ marginTop: 28 }}>
        <strong>Do not have the extension yet?</strong>
        <p>Install it from the Chrome Web Store first. Regular users do not need the project folder.</p>
      </div>
    </main>
  );
}
