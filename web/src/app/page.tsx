import { checkoutUrl, isCheckoutConfigured } from "@/lib/checkout";
import {
  SiteFooter,
  SiteNav,
  installHref,
} from "@/components/SiteChrome";
import {
  DesktopPreview,
  OptionsPreview,
} from "@/components/ProductShowcase";
import { AutoFillDemo } from "@/components/AutoFillDemo";

export default function HomePage() {
  const ready = isCheckoutConfigured();
  const payHref = ready ? checkoutUrl() : "/pro";
  const store = installHref();

  return (
    <main className="shell shell-home">
      <SiteNav />

      <header className="hero-bleed">
        <div className="hero-bleed-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">Chrome extension</p>
            <h1 className="hero-brand">Ranasi</h1>
            <p className="hero-line">Your browser, elevated.</p>
            <p className="hero-support">
              A dimensional new-tab desktop and one-click autofill — built for
              everyday work, not demos.
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
                Get Pro — $10/year
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <DesktopPreview />
          </div>
        </div>
      </header>

      <section className="section" id="product">
        <p className="section-label">The product</p>
        <h2>Exactly what you use every day</h2>
        <p className="section-lead">
          Pro Desktop themes, profile setup, and Auto-Fill — designed as one
          coherent system.
        </p>
        <div className="showcase-row">
          <div className="showcase-copy">
            <h3>Pro Desktop</h3>
            <p>
              Open a new tab into a rich, themed workspace. Pin unlimited sites
              on Pro, switch among 12 premium looks, and launch everything from
              one calm surface.
            </p>
            <ul className="bullet-clean">
              <li>Noir Gold, Ember, Ocean, Aurora, and more</li>
              <li>Dimensional tiles with depth and light</li>
              <li>Export and import your layout</li>
            </ul>
          </div>
          <DesktopPreview />
        </div>
        <div className="showcase-row reverse">
          <div className="showcase-copy">
            <h3>Profile &amp; Auto-Fill</h3>
            <p>
              Save your details once in Options. On any form, start Auto-Fill
              and Ranasi writes the fields for you — locally on Free, with
              Server AI on Pro.
            </p>
            <ul className="bullet-clean">
              <li>Up to 5 profiles on Pro</li>
              <li>License activation by email key</li>
              <li>Private defaults on your device</li>
            </ul>
          </div>
          <OptionsPreview />
        </div>
      </section>

      <section className="section" id="demo">
        <p className="section-label">See it work</p>
        <h2>Empty form. One click. Done.</h2>
        <p className="section-lead">
          A short interactive preview — the same idea as Ranasi on a real page.
        </p>
        <AutoFillDemo />
      </section>

      <section className="section" id="install">
        <p className="section-label">Get started</p>
        <h2>Install from the Chrome Web Store</h2>
        <p className="section-lead">
          Add Ranasi to Chrome, set your profile, and start filling forms in
          minutes.
        </p>
        <ol className="guide-list numbered">
          <li>
            <strong>Add to Chrome</strong>
            <span>
              Open the{" "}
              <a href={store} target="_blank" rel="noreferrer">
                Chrome Web Store
              </a>{" "}
              and select Add to Chrome.
            </span>
          </li>
          <li>
            <strong>Create your profile</strong>
            <span>Open Options → Profile and save your details on-device.</span>
          </li>
          <li>
            <strong>Open a new tab</strong>
            <span>Meet your Pro Desktop — pin sites and pick a theme.</span>
          </li>
          <li>
            <strong>Auto-Fill</strong>
            <span>
              On a form page, select Auto-Fill with AI and watch fields fill.
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
        <p className="section-label">Plans</p>
        <h2>Free to start. Pro when you are ready.</h2>
        <p className="section-lead">
          The same craft in every plan — more power when you upgrade.
        </p>
        <div className="pricing">
          <div className="price-card">
            <h3>Free</h3>
            <div className="price">
              $0 <small>forever</small>
            </div>
            <ul>
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

      <section className="section" id="pro-flow">
        <p className="section-label">After purchase</p>
        <h2>Unlock Pro in four steps</h2>
        <ol className="guide-list numbered">
          <li>
            <strong>Checkout</strong>
            <span>
              Pay on <a href="/pro">Get Pro</a>.
            </span>
          </li>
          <li>
            <strong>Email key</strong>
            <span>Copy the license key from your confirmation email.</span>
          </li>
          <li>
            <strong>Activate</strong>
            <span>
              Options → License → Activate. Or{" "}
              <a href="/activate">validate here</a> first.
            </span>
          </li>
          <li>
            <strong>Enjoy</strong>
            <span>Noir Gold, Server AI, five profiles, unlimited sites.</span>
          </li>
        </ol>
      </section>

      <SiteFooter />
    </main>
  );
}
