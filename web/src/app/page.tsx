import { checkoutUrl, isCheckoutConfigured } from "@/lib/checkout";
import {
  extensionStoreUrl,
  isExtensionPublished,
} from "@/lib/extension";

export default function HomePage() {
  const ready = isCheckoutConfigured();
  const payHref = ready ? checkoutUrl() : "/pro";
  const storeUrl = extensionStoreUrl();
  const published = isExtensionPublished();

  return (
    <main className="shell">
      <nav className="nav">
        <div className="logo">Ranasi</div>
        <div className="nav-links">
          <a href="#install">Install</a>
          <a href="#free">Free</a>
          <a href="#whats-new">Why Pro?</a>
          <a href="#pro-flow">After payment</a>
          <a href="#pricing">Pricing</a>
          <a href="/activate">Activate</a>
        </div>
      </nav>

      <section className="hero">
        <h1>Ranasi</h1>
        <p>
          A smarter new-tab desktop and one-click form filling. Start free or
          upgrade to Pro for $10/year.
        </p>
        <div className="cta-row">
          {published ? (
            <a className="btn btn-primary" href={storeUrl} target="_blank" rel="noreferrer">
              Install from the Chrome Web Store — Free
            </a>
          ) : (
            <a className="btn btn-primary" href="#install">
              View installation guide
            </a>
          )}
          <a className="btn btn-ghost" href="/pro">
            Get Pro — $10/year
          </a>
        </div>
      </section>

      <section className="section" id="install">
        <h2>Where do I get Ranasi?</h2>
        <p>
          Regular users <strong>do not download a project folder</strong> or
          get files from GitHub.
        </p>
        <div className="callout">
          <strong>For regular users</strong>
          <p>
            Install from the <strong>Chrome Web Store</strong>, select Add to
            Chrome, and start using Ranasi immediately.
          </p>
          {published ? (
            <a className="btn btn-primary" href={storeUrl} target="_blank" rel="noreferrer">
              Open the Chrome Web Store
            </a>
          ) : (
            <p className="note">
              The store listing is not live yet. Once published, this button
              will link directly to it.
            </p>
          )}
        </div>
        <div className="callout callout-muted">
          <strong>Developers only</strong>
          <p>
            During development, use <code>Load unpacked</code> with a build
            folder such as <code>.output/chrome-mv3-dev</code>. Customers do
            not need to do this.
          </p>
        </div>
      </section>

      <section className="section" id="free">
        <h2>How to use Ranasi for free</h2>
        <p>Free forever — no license key or payment required.</p>
        <ol className="guide-list">
          <li>
            <strong>Install Ranasi</strong>
            <span>Install it from the Chrome Web Store and approve the requested permissions.</span>
          </li>
          <li>
            <strong>Set up your profile once</strong>
            <span>Open Extension Options, enter your details, and save. Your profile stays on your device.</span>
          </li>
          <li>
            <strong>Use the new-tab desktop</strong>
            <span>Open a new tab to pin, reorder, and launch websites.</span>
          </li>
          <li>
            <strong>Auto-fill forms</strong>
            <span>Open a form and select <em>Auto-Fill with AI</em>. Free mode uses local heuristics.</span>
          </li>
        </ol>
        <div className="feature-grid">
          <div className="feature">
            <strong>Included with Free</strong>
            <ul>
              <li>New-tab desktop</li>
              <li>1 profile</li>
              <li>Local Auto-Fill</li>
              <li>Mint and Slate themes</li>
              <li>Up to 10 desktop websites</li>
            </ul>
          </div>
          <div className="feature">
            <strong>Included with Pro</strong>
            <ul>
              <li>Smarter Server AI filling</li>
              <li>Up to 5 profiles</li>
              <li>12 premium themes</li>
              <li>Unlimited websites</li>
              <li>Export and import</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="whats-new">
        <h2>What makes Pro different?</h2>
        <p>Pro expands your desktop and adds smarter, server-powered form filling.</p>
        <ol className="guide-list numbered">
          <li>
            <strong>Noir Gold by default</strong>
            <span>A premium theme with layered depth, shadows, and icon highlights.</span>
          </li>
          <li>
            <strong>12 Pro themes</strong>
            <span>Noir Gold, Ember, Arctic, Ocean, Forest, Rose, Graphite, Sand, Aurora, Copper, Ivory, and Azure.</span>
          </li>
          <li>
            <strong>Unlimited desktop websites</strong>
            <span>Pin and arrange as many websites as you need.</span>
          </li>
          <li>
            <strong>Server AI, 5 profiles, and export</strong>
            <span>Fill more intelligently and manage multiple sets of profile details.</span>
          </li>
        </ol>
      </section>

      <section className="section" id="pro-flow">
        <h2>What to do after payment</h2>
        <p>Follow these steps to activate Pro.</p>
        <ol className="guide-list numbered">
          <li><strong>Pay $10/year</strong><span>Visit <a href="/pro">Get Pro</a> and complete checkout with Lemon Squeezy.</span></li>
          <li><strong>Get your license key</strong><span>Copy the license key from your Lemon Squeezy email.</span></li>
          <li><strong>Install the extension</strong><span>Install Ranasi from the Chrome Web Store if you have not already.</span></li>
          <li><strong>Paste the key</strong><span>Open Ranasi Options → License, paste the key, and select Activate.</span></li>
          <li><strong>Start using Pro</strong><span>Your new tab switches to Noir Gold and unlocks Server AI, 5 profiles, and unlimited websites.</span></li>
        </ol>
        <div className="cta-row">
          <a className="btn btn-primary" href={payHref}>{ready ? "Pay for Pro" : "View Get Pro"}</a>
          <a className="btn btn-ghost" href="/activate">Validate a key</a>
        </div>
        <div className="callout" style={{ marginTop: 24 }}>
          <strong>Cannot find the email?</strong>
          <p>Check spam and promotions, then search for Lemon Squeezy or Ranasi.</p>
        </div>
      </section>

      <section className="section" id="pricing">
        <h2>Pricing</h2>
        <p>Your profile stays on your device. Pro AI runs on Ranasi servers.</p>
        <div className="pricing">
          <div className="price-card">
            <h3>Free</h3>
            <div className="price">$0 <small>forever</small></div>
            <ul>
              <li>Chrome Web Store installation</li>
              <li>Desktop and 1 profile</li>
              <li>Local Auto-Fill</li>
              <li>Mint and Slate themes</li>
              <li>Up to 10 websites</li>
            </ul>
            <a className="btn btn-ghost" href="#free">How Free works</a>
          </div>
          <div className="price-card featured">
            <h3>Pro</h3>
            <div className="price">$10 <small>/ year</small></div>
            <ul>
              <li>License key delivered by email</li>
              <li>Server AI Auto-Fill</li>
              <li>Up to 5 profiles</li>
              <li>12 premium themes</li>
              <li>Unlimited websites</li>
              <li>Export and import</li>
            </ul>
            <a className="btn btn-primary" href={payHref}>{ready ? "Pay $10/year" : "Get Pro"}</a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <strong>Ranasi</strong>
        <span>Install from the Chrome Web Store. Pro keys arrive by email after payment.</span>
      </footer>
    </main>
  );
}
