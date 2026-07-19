import { checkoutUrl, isCheckoutConfigured } from "@/lib/checkout";
import {
  SiteFooter,
  SiteNav,
  installHref,
} from "@/components/SiteChrome";

export default function HomePage() {
  const ready = isCheckoutConfigured();
  const payHref = ready ? checkoutUrl() : "/pro";
  const store = installHref();

  return (
    <main className="shell">
      <SiteNav />

      <header className="hero-stage">
        <div className="hero-copy">
          <h1 className="hero-brand">Ranasi</h1>
          <p className="hero-line">Fill once. Browse faster.</p>
          <p className="hero-support">
            A polished new-tab desktop and one-click autofill from your local
            profile. Free to start. Pro from $10/year.
          </p>
          <div className="cta-row">
            <a
              className="btn btn-primary"
              href={store}
              target="_blank"
              rel="noreferrer"
            >
              Install free
            </a>
            <a className="btn btn-ghost" href={payHref}>
              Get Pro
            </a>
          </div>
        </div>
      </header>

      <section className="section" id="install">
        <p className="section-label">Get started</p>
        <h2>Install from the Chrome Web Store</h2>
        <p className="section-lead">
          Add Ranasi to Chrome in one click, then set your profile and start
          filling forms.
        </p>
        <ol className="guide-list numbered">
          <li>
            <strong>Add to Chrome</strong>
            <span>
              Open the{" "}
              <a href={store} target="_blank" rel="noreferrer">
                Chrome Web Store
              </a>{" "}
              listing and select Add to Chrome.
            </span>
          </li>
          <li>
            <strong>Create your profile</strong>
            <span>
              Open Ranasi Options and save your details on your device.
            </span>
          </li>
          <li>
            <strong>Use your new tab</strong>
            <span>Pin sites, pick a theme, and launch your day from one place.</span>
          </li>
          <li>
            <strong>Auto-Fill forms</strong>
            <span>
              On any form page, select Auto-Fill with AI to fill from your
              profile.
            </span>
          </li>
        </ol>
        <div className="cta-row">
          <a
            className="btn btn-primary"
            href={store}
            target="_blank"
            rel="noreferrer"
          >
            Open Chrome Web Store
          </a>
        </div>
      </section>

      <section className="section" id="features">
        <p className="section-label">Product</p>
        <h2>Built for everyday browsing</h2>
        <p className="section-lead">
          Keep your information private on your device. Upgrade when you need
          more power.
        </p>
        <div className="split">
          <div className="rail">
            <div className="rail-item">
              <strong>New-tab desktop</strong>
              <span>Pin, rename, and rearrange the sites you use most.</span>
            </div>
            <div className="rail-item">
              <strong>One-click autofill</strong>
              <span>Fill forms from a single local profile without retyping.</span>
            </div>
            <div className="rail-item">
              <strong>Private by default</strong>
              <span>Free fill runs on your device. You control what you save.</span>
            </div>
          </div>
          <div className="rail">
            <div className="rail-item">
              <strong>Free</strong>
              <span>
                1 profile, Mint &amp; Slate themes, local Auto-Fill, up to 10
                desktop sites.
              </span>
            </div>
            <div className="rail-item">
              <strong>Pro</strong>
              <span>
                Server AI fill, 5 profiles, 12 themes, unlimited sites, export
                &amp; import.
              </span>
            </div>
            <div className="rail-item">
              <strong>Simple licensing</strong>
              <span>
                Pay once a year, receive a key by email, activate in Options.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="pro-flow">
        <p className="section-label">Pro</p>
        <h2>After you purchase</h2>
        <p className="section-lead">
          Activate Pro in the extension with the license key from your email.
        </p>
        <ol className="guide-list numbered">
          <li>
            <strong>Complete checkout</strong>
            <span>
              Purchase on the <a href="/pro">Get Pro</a> page.
            </span>
          </li>
          <li>
            <strong>Copy your license key</strong>
            <span>Find it in your confirmation email. Check spam if needed.</span>
          </li>
          <li>
            <strong>Activate in Ranasi</strong>
            <span>
              Options → License → paste the key → Activate. You can also{" "}
              <a href="/activate">validate the key here</a> first.
            </span>
          </li>
          <li>
            <strong>Enjoy Pro</strong>
            <span>
              Unlock Noir Gold, Server AI, five profiles, and unlimited sites.
            </span>
          </li>
        </ol>
        <div className="cta-row">
          <a className="btn btn-primary" href={payHref}>
            Get Pro — $10/year
          </a>
          <a className="btn btn-ghost" href="/activate">
            Validate a key
          </a>
        </div>
      </section>

      <section className="section" id="pricing">
        <p className="section-label">Pricing</p>
        <h2>Simple plans</h2>
        <p className="section-lead">
          Start free. Upgrade when you need Server AI and unlimited sites.
        </p>
        <div className="pricing">
          <div className="price-card">
            <h3>Free</h3>
            <div className="price">
              $0 <small>forever</small>
            </div>
            <ul>
              <li>Chrome Web Store install</li>
              <li>New-tab desktop</li>
              <li>1 profile · local Auto-Fill</li>
              <li>Mint &amp; Slate themes</li>
              <li>Up to 10 desktop sites</li>
            </ul>
            <a
              className="btn btn-ghost"
              href={store}
              target="_blank"
              rel="noreferrer"
            >
              Install free
            </a>
          </div>
          <div className="price-card featured">
            <h3>Pro</h3>
            <div className="price">
              $10 <small>/ year</small>
            </div>
            <ul>
              <li>License key by email</li>
              <li>Server AI Auto-Fill</li>
              <li>Up to 5 profiles</li>
              <li>12 premium themes</li>
              <li>Unlimited sites · export / import</li>
            </ul>
            <a className="btn btn-primary" href={payHref}>
              Get Pro
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
