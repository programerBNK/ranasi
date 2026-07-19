import { checkoutUrl, isCheckoutConfigured } from "@/lib/checkout";
import Link from "next/link";
import {
  extensionStoreUrl,
  isExtensionPublished,
} from "@/lib/extension";
import styles from "./pro.module.css";

export const metadata = {
  title: "Get Ranasi Pro — $10/year",
  description: "Pay $10/year, get a license key by email, and activate it in the extension.",
};

export default function ProPage() {
  const ready = isCheckoutConfigured();
  const payUrl = checkoutUrl();
  const storeUrl = extensionStoreUrl();
  const published = isExtensionPublished();

  return (
    <main className="shell">
      <nav className="nav">
        <Link className="logo" href="/">Ranasi</Link>
        <div className="nav-links">
          <Link href="/#free">Use Free</Link>
          <Link href="/#pro-flow">After payment</Link>
          <Link href="/activate">Activate</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Ranasi Pro</p>
        <h1>Pay $10/year → Get a key by email → Activate Pro</h1>
        <p className={styles.lead}>
          Install from the Chrome Web Store and paste your license key into
          Extension Options. No project download is required.
        </p>
      </section>

      <section className={styles.payCard}>
        <div className={styles.priceRow}>
          <div>
            <h2>Pro annual</h2>
            <p className={styles.muted}>Billed yearly · License key delivered by email</p>
          </div>
          <div className={styles.price}>$10<span>/year</span></div>
        </div>
        <ul className={styles.perks}>
          <li>Server AI Auto-Fill</li>
          <li>Up to 5 profiles</li>
          <li>12 premium themes with Noir Gold by default</li>
          <li>Unlimited desktop websites</li>
          <li>Export and import</li>
        </ul>
        {ready ? (
          <>
            <a className="btn btn-primary" href={payUrl} target="_blank" rel="noreferrer">
              Pay with Lemon Squeezy — $10/year
            </a>
            <p className={styles.hint}>
              After payment, check your email for the license key and follow the steps below.
            </p>
          </>
        ) : (
          <div className={styles.setupBox}>
            <strong>Checkout is not available on this site yet</strong>
            <p>The store owner must configure Lemon Squeezy before customers can pay.</p>
            <div className="cta-row" style={{ marginTop: 18 }}>
              <Link className="btn btn-ghost" href="/activate">Developers: test with RN-DEV-PRO</Link>
            </div>
          </div>
        )}
      </section>

      <p className={styles.hint}>
        Local development: use <code>RN-DEV-PRO</code>. The legacy{" "}
        <code>AF-DEV-PRO</code> key also works when dev licenses are enabled.
      </p>

      <section className="section" id="after-pay">
        <h2>Activate Pro after receiving your key</h2>
        <ol className="guide-list numbered">
          <li>
            <strong>Open the Lemon Squeezy email</strong>
            <span>Copy the complete license key. Check spam if you cannot find the message.</span>
          </li>
          <li>
            <strong>Install Ranasi if needed</strong>
            <span>
              {published ? (
                <>Install it from the <a href={storeUrl} target="_blank" rel="noreferrer">Chrome Web Store</a>.</>
              ) : (
                <>Install it from the Chrome Web Store when published. Regular users never need Load unpacked.</>
              )}
            </span>
          </li>
          <li>
            <strong>Open Extension Options</strong>
            <span>In Chrome, open Extensions → Ranasi → Options.</span>
          </li>
          <li>
            <strong>Open License, paste the key, and select Activate</strong>
            <span>The plan status should change to Pro. Use the Activate page to validate the key if needed.</span>
          </li>
          <li>
            <strong>Use Pro</strong>
            <span>Open a new tab, choose a premium theme, add unlimited websites, and use Server AI Auto-Fill.</span>
          </li>
        </ol>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/activate">Validate a license key</Link>
          <Link className="btn btn-ghost" href="/#free">Use Free first</Link>
        </div>
      </section>
    </main>
  );
}
