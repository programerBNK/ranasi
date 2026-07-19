import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Ranasi",
  description:
    "How Ranasi handles profile data, license validation, and optional AI fill.",
};

export default function PrivacyPage() {
  return (
    <main className="shell">
      <nav className="nav">
        <Link className="logo" href="/">
          Ranasi
        </Link>
        <div className="nav-links">
          <Link href="/pro">Get Pro</Link>
          <Link href="/activate">Activate</Link>
        </div>
      </nav>

      <section className="section" style={{ marginTop: 0 }}>
        <h2>Privacy Policy</h2>
        <p>Last updated: July 19, 2026 · Applies to the Ranasi Chrome extension and website.</p>
      </section>

      <div className="panel" style={{ display: "grid", gap: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Summary</h1>
          <p className="meta" style={{ margin: 0 }}>
            Ranasi helps you autofill web forms from a profile you manage on your
            device. Free autofill stays local in your browser. Pro license checks
            and optional server AI fill use our API at{" "}
            <code>https://api.ranasi.com</code>. We do not sell your data.
          </p>
        </div>

        <div>
          <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Data stored on your device</h1>
          <p className="meta" style={{ margin: 0 }}>
            Profiles (name, email, phone, address, and other fields you enter),
            theme/settings, desktop site shortcuts, and a cached license status
            are stored with Chrome extension storage on your computer. Card or
            payment fields you put in a local profile stay on your device for
            free fill and are not sent to Ranasi Pro server fill.
          </p>
        </div>

        <div>
          <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Data we process on our servers</h1>
          <p className="meta" style={{ margin: 0 }}>
            When you activate or validate a Pro license, we receive your license
            key and a generated instance name/id so we can enforce activation
            limits. When you use Pro server AI fill, we receive the license key,
            instance id, form field metadata, and non-card profile fields needed
            to suggest values. We use this only to provide the feature and
            related rate limits.
          </p>
        </div>

        <div>
          <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Optional third-party AI</h1>
          <p className="meta" style={{ margin: 0 }}>
            If you enable “use my OpenAI key” in Settings, form and profile data
            for that request are sent to OpenAI under your own API key and their
            policies. This path is optional and separate from Ranasi Pro server
            fill.
          </p>
        </div>

        <div>
          <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Website</h1>
          <p className="meta" style={{ margin: 0 }}>
            The website at{" "}
            <a href="https://www.ranasi.com">https://www.ranasi.com</a> may
            process license validation requests you submit on the Activate page
            through the same API. Checkout for Pro is handled by our payment
            provider (e.g. Lemon Squeezy) under their privacy terms.
          </p>
        </div>

        <div>
          <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Permissions</h1>
          <p className="meta" style={{ margin: 0 }}>
            Ranasi may use storage, tabs, history, and host access so it can save
            your profile, detect the active page, rank frequently visited desktop
            sites for the new tab, and fill forms on websites you visit. We do
            not sell browsing history.
          </p>
        </div>

        <div>
          <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>Contact</h1>
          <p className="meta" style={{ margin: 0 }}>
            Questions about privacy:{" "}
            <a href="mailto:bnatharuch@gmail.com">bnatharuch@gmail.com</a>
            {" · "}
            <a href="https://www.ranasi.com">www.ranasi.com</a>
          </p>
        </div>
      </div>
    </main>
  );
}
