"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteFooter, SiteNav, installHref } from "@/components/SiteChrome";

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
  const store = installHref();

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
          instanceName: "Ranasi-Web",
        }),
      });
      const data = (await res.json()) as {
        valid?: boolean;
        error?: string;
        expiresAt?: string | null;
      };
      if (!res.ok || !data.valid) {
        setMsg({ type: "err", text: data.error || "This key could not be validated." });
        return;
      }
      setMsg({
        type: "ok",
        text: data.expiresAt
          ? `This key is valid until ${new Date(data.expiresAt).toLocaleDateString()}. Next, paste the same key in Extension Options → License → Activate.`
          : "This key is valid. Next, paste the same key in Extension Options → License → Activate.",
      });
    } catch {
      setMsg({
        type: "err",
        text: "Could not reach Ranasi right now. Try again shortly, or paste the key directly in the extension.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <SiteNav
        links={[
          { href: "/#pro-flow", label: "After payment" },
          { href: "/pro", label: "Get Pro" },
        ]}
      />

      <section className="section" style={{ marginTop: 12 }}>
        <p className="section-label">License</p>
        <h2>Validate your license key</h2>
        <p className="section-lead">
          Confirm the key from your purchase email, then activate it in the
          Ranasi extension to unlock Pro.
        </p>
      </section>

      <ol className="guide-list numbered" style={{ marginBottom: 32 }}>
        <li>
          <strong>Copy the key from your email</strong>
          <span>Sent after a successful Pro purchase.</span>
        </li>
        <li>
          <strong>Validate here (optional)</strong>
          <span>Paste below to confirm the key works.</span>
        </li>
        <li>
          <strong>Activate in the extension</strong>
          <span>
            Chrome → Extensions → Ranasi → Options → License → Activate.
          </span>
        </li>
        <li>
          <strong>Start using Pro</strong>
          <span>Open a new tab and use Auto-Fill on any form.</span>
        </li>
      </ol>

      <form className="panel" onSubmit={onSubmit}>
        <h1>License key</h1>
        <p>
          This page only validates your key. Pro unlocks when you activate it
          in Extension Options.
        </p>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Paste license key"
          spellCheck={false}
          autoComplete="off"
        />
        <button
          className="btn btn-primary"
          type="submit"
          disabled={busy || !key.trim()}
        >
          {busy ? "Validating…" : "Validate key"}
        </button>
        {msg && <p className={`msg ${msg.type}`}>{msg.text}</p>}
      </form>

      <p className="meta" style={{ marginTop: 28 }}>
        Need the extension?{" "}
        <a href={store} target="_blank" rel="noreferrer">
          Install from the Chrome Web Store
        </a>
        .{" "}
        <Link href="/pro">Get Pro</Link> if you do not have a key yet.
      </p>

      <SiteFooter />
    </main>
  );
}
