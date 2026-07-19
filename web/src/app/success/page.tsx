import {
  extensionStoreUrl,
  isExtensionPublished,
} from "@/lib/extension";
import Link from "next/link";

export const metadata = {
  title: "Payment successful — Ranasi Pro",
};

export default function SuccessPage() {
  const storeUrl = extensionStoreUrl();
  const published = isExtensionPublished();

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="logo" href="/">Ranasi</Link>
        <div className="nav-links">
          <Link href="/activate">Activate</Link>
          <Link href="/#pro-flow">After-payment guide</Link>
        </div>
      </nav>

      <div className="panel" style={{ width: "min(560px, 100%)" }}>
        <h1>Payment successful</h1>
        <p>
          Thank you for upgrading to <strong>Ranasi Pro</strong>. Complete the
          steps below to activate Pro.
        </p>
        <ol className="ol">
          <li>
            Open the <strong>Lemon Squeezy</strong> email and copy your{" "}
            <strong>License Key</strong>.
            <br />
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              Check spam if you cannot find it.
            </span>
          </li>
          <li>
            Install Ranasi from the Chrome Web Store if needed.
            <br />
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              No project download is required.
            </span>
          </li>
          <li>Open Chrome → Extensions → <strong>Ranasi</strong> → Options.</li>
          <li>Open <strong>License</strong>, paste the key, and select <strong>Activate</strong>.</li>
          <li>Open a new tab and use Auto-Fill — Pro is now active.</li>
        </ol>
        <div className="cta-row" style={{ marginTop: 22 }}>
          <Link className="btn btn-primary" href="/activate">Validate your key</Link>
          {published ? (
            <a className="btn btn-ghost" href={storeUrl} target="_blank" rel="noreferrer">
              Open the Chrome Web Store
            </a>
          ) : (
            <Link className="btn btn-ghost" href="/#install">View installation guide</Link>
          )}
        </div>
      </div>
    </main>
  );
}
