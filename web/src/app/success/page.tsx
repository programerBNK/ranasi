import Link from "next/link";
import { SiteFooter, SiteNav, installHref } from "@/components/SiteChrome";

export const metadata = {
  title: "Payment successful — Ranasi Pro",
};

export default function SuccessPage() {
  const store = installHref();

  return (
    <main className="shell">
      <SiteNav
        links={[
          { href: "/activate", label: "Activate" },
          { href: "/#pro-flow", label: "Guide" },
        ]}
      />

      <section className="section" style={{ marginTop: 12 }}>
        <p className="section-label">Thank you</p>
        <h2>Payment successful</h2>
        <p className="section-lead">
          Complete the steps below to unlock Ranasi Pro in your browser.
        </p>
      </section>

      <div className="panel" style={{ width: "min(560px, 100%)" }}>
        <h1>Activate your purchase</h1>
        <ol className="ol">
          <li>
            Open your confirmation email and copy the{" "}
            <strong>license key</strong>. Check spam if needed.
          </li>
          <li>
            Install Ranasi from the{" "}
            <a href={store} target="_blank" rel="noreferrer">
              Chrome Web Store
            </a>{" "}
            if you have not already.
          </li>
          <li>
            Open Chrome → Extensions → <strong>Ranasi</strong> → Options.
          </li>
          <li>
            Open <strong>License</strong>, paste the key, and select{" "}
            <strong>Activate</strong>.
          </li>
          <li>Open a new tab and start using Pro Auto-Fill.</li>
        </ol>
        <div className="cta-row" style={{ marginTop: 24 }}>
          <Link className="btn btn-primary" href="/activate">
            Validate your key
          </Link>
          <a
            className="btn btn-ghost"
            href={store}
            target="_blank"
            rel="noreferrer"
          >
            Chrome Web Store
          </a>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
