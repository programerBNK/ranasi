import type { Metadata } from "next";
import { checkoutUrl, isCheckoutConfigured } from "@/lib/checkout";
import Link from "next/link";
import { SiteFooter, SiteNav, installHref } from "@/components/SiteChrome";
import { buildMetadata } from "@/lib/seo/metadata";
import styles from "./pro.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Ranasi Pro — AI Autofill & Unlimited Desktop · $10/year",
  description:
    "Upgrade to Ranasi Pro for Server AI form autofill, 5 profiles, 12 premium themes, and unlimited new-tab websites. $10/year with license key by email.",
  path: "/pro",
  keywords: [
    "Ranasi Pro",
    "AI form filler",
    "chrome autofill pro",
    "server AI autofill",
    "unlimited new tab sites",
  ],
});

export default function ProPage() {
  const ready = isCheckoutConfigured();
  const payUrl = checkoutUrl();
  const store = installHref();

  return (
    <main className="shell">
      <SiteNav
        links={[
          { href: "/#features", label: "Features" },
          { href: "/#pro-flow", label: "After payment" },
          { href: "/activate", label: "Activate" },
        ]}
      />

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Ranasi Pro</p>
        <h1>One payment. A year of smarter autofill.</h1>
        <p className={styles.lead}>
          Install from the Chrome Web Store, pay securely, then activate with
          the license key emailed to you.
        </p>
      </section>

      <section className={styles.payCard}>
        <div className={styles.priceRow}>
          <div>
            <h2>Pro annual</h2>
            <p className={styles.muted}>
              Billed yearly · License key delivered by email
            </p>
          </div>
          <div className={styles.price}>
            $10<span>/year</span>
          </div>
        </div>
        <ul className={styles.perks}>
          <li>Server AI Auto-Fill</li>
          <li>Up to 5 profiles</li>
          <li>12 premium themes · Noir Gold by default</li>
          <li>Unlimited desktop websites</li>
          <li>Export and import</li>
        </ul>
        {ready ? (
          <>
            <a
              className="btn btn-primary"
              href={payUrl}
              target="_blank"
              rel="noreferrer"
            >
              Continue to checkout — $10/year
            </a>
            <p className={styles.hint}>
              After payment, check your email for the license key and follow the
              steps below.
            </p>
          </>
        ) : (
          <p className={styles.hint}>
            Checkout is temporarily unavailable. Please try again shortly or
            contact support via the site footer.
          </p>
        )}
      </section>

      <section className="section" id="after-pay">
        <p className="section-label">Next steps</p>
        <h2>Activate Pro after checkout</h2>
        <ol className="guide-list numbered">
          <li>
            <strong>Open your confirmation email</strong>
            <span>Copy the full license key. Check spam if you do not see it.</span>
          </li>
          <li>
            <strong>Install Ranasi</strong>
            <span>
              Get it from the{" "}
              <a href={store} target="_blank" rel="noreferrer">
                Chrome Web Store
              </a>{" "}
              if you have not already.
            </span>
          </li>
          <li>
            <strong>Open Extension Options</strong>
            <span>Chrome → Extensions → Ranasi → Options.</span>
          </li>
          <li>
            <strong>Activate your key</strong>
            <span>
              License → paste → Activate. Optionally{" "}
              <Link href="/activate">validate it on the website</Link> first.
            </span>
          </li>
          <li>
            <strong>Start using Pro</strong>
            <span>
              Open a new tab for Noir Gold, unlimited sites, and Server AI
              Auto-Fill.
            </span>
          </li>
        </ol>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/activate">
            Validate a license key
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
      </section>

      <SiteFooter />
    </main>
  );
}
