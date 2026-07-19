import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav, installHref } from "@/components/SiteChrome";
import {
  JsonLd,
  faqJsonLd,
  organizationJsonLd,
  softwareAppJsonLd,
} from "@/components/JsonLd";
import { AutoFillDemo } from "@/components/AutoFillDemo";
import { buildMetadata } from "@/lib/seo/metadata";
import { SEO_KEYWORDS } from "@/lib/seo/keywords";

export const metadata: Metadata = buildMetadata({
  title: "Chrome Autofill Extension & AI Form Filler — Ranasi",
  description:
    "Fill web forms in one click with Ranasi, a Chrome autofill extension with AI form fill, local profiles, and a Pro new-tab desktop. Free to start.",
  path: "/autofill",
  keywords: SEO_KEYWORDS.slice(0, 40),
});

const FAQS = [
  {
    question: "What is the best Chrome autofill extension for forms?",
    answer:
      "Ranasi is a Chrome autofill extension that fills forms in one click from a local profile. Free includes local autofill; Pro adds Server AI fill, more profiles, and unlimited desktop sites.",
  },
  {
    question: "How does one-click autofill work in Chrome?",
    answer:
      "Install Ranasi from the Chrome Web Store, save your profile in Options, open any form page, and press Auto-Fill with AI. Ranasi maps fields such as name, email, phone, and address.",
  },
  {
    question: "Is Ranasi better than built-in Chrome autofill?",
    answer:
      "Built-in Chrome autofill is basic. Ranasi adds a dedicated profile workspace, one-click fill on more form layouts, optional AI filling on Pro, and a themed new-tab desktop for your pinned sites.",
  },
  {
    question: "Can I autofill job applications and checkout forms?",
    answer:
      "Yes. Ranasi is designed for common web forms including job applications, account signup, and checkout-style fields. Try the interactive demo on this site, then install the extension for real pages.",
  },
  {
    question: "Does Ranasi store my data on a server?",
    answer:
      "Free autofill runs from a profile stored on your device. Pro license checks and optional Server AI fill use Ranasi API endpoints. See the Privacy Policy for details.",
  },
  {
    question: "How much does Ranasi Pro cost?",
    answer:
      "Ranasi Free is $0 forever. Ranasi Pro is $10 per year and includes Server AI Auto-Fill, up to 5 profiles, 12 premium themes, and unlimited desktop websites.",
  },
  {
    question: "Where do I get the Ranasi Chrome extension?",
    answer:
      "Install Ranasi from the Chrome Web Store when the listing is live. After install, open Options to create your profile and start autofilling forms.",
  },
  {
    question: "What is the Ranasi new tab desktop?",
    answer:
      "Every new tab opens a dimensional desktop where you can pin websites, switch themes, and launch your day. Pro unlocks 12 premium themes and unlimited sites.",
  },
];

export default function AutofillSeoPage() {
  const store = installHref();

  return (
    <main className="shell">
      <JsonLd
        data={[
          organizationJsonLd(),
          softwareAppJsonLd(),
          faqJsonLd(FAQS),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Chrome Autofill Extension & AI Form Filler — Ranasi",
            url: "https://www.ranasi.com/autofill",
            description:
              "Learn how Ranasi autofills Chrome forms with one click and optional AI fill.",
          },
        ]}
      />

      <SiteNav
        links={[
          { href: "/#demo", label: "Demo" },
          { href: "/pro", label: "Pro" },
          { href: "/activate", label: "Activate" },
        ]}
      />

      <article className="section seo-article" style={{ marginTop: 12 }}>
        <p className="section-label">Chrome autofill</p>
        <h1 className="seo-h1">
          Chrome autofill extension for one-click form fill
        </h1>
        <p className="section-lead">
          Ranasi helps you auto fill web forms in Chrome — name, email, phone,
          address, and more — with a single Auto-Fill action. Start free, upgrade
          to Pro for AI-assisted filling and a premium new-tab desktop.
        </p>

        <div className="cta-row" style={{ marginBottom: 36 }}>
          <a
            className="btn btn-primary"
            href={store}
            target="_blank"
            rel="noreferrer"
          >
            Install Chrome autofill free
          </a>
          <Link className="btn btn-ghost" href="/#demo">
            Try the autofill demo
          </Link>
        </div>

        <h2>Why people search for autofill and auto fill tools</h2>
        <p className="seo-p">
          Typing the same details into job applications, signups, and checkout
          forms wastes time. A dedicated{" "}
          <strong>Chrome autofill extension</strong> keeps a profile you control
          and fills fields on demand — faster than retyping, and more flexible
          than the browser&apos;s basic autofill suggestions.
        </p>

        <h2>What Ranasi autofills</h2>
        <ul className="bullet-clean seo-list">
          <li>Full name, email, phone, and company fields</li>
          <li>Job title and about / bio text areas</li>
          <li>Street address, city, and country</li>
          <li>Common signup and application form layouts</li>
        </ul>

        <h2>AI form filler for harder pages</h2>
        <p className="seo-p">
          Free mode uses on-device heuristics.{" "}
          <Link href="/pro">Ranasi Pro</Link> adds{" "}
          <strong>Server AI Auto-Fill</strong> for messier forms — still started
          with one click from the same Auto-Fill with AI control.
        </p>

        <h2>New tab desktop + profiles</h2>
        <p className="seo-p">
          Beyond form fill, Ranasi replaces the empty new tab with a dimensional
          desktop: pin sites, switch themes, and keep work links close. Pro
          unlocks twelve premium themes and unlimited websites.
        </p>

        <h2>Try autofill in the browser</h2>
        <p className="seo-p">
          Use the interactive demo below — the form starts empty; press Auto-Fill
          with AI to watch every field fill. Then install Ranasi for real sites.
        </p>
        <AutoFillDemo />

        <h2>How to start</h2>
        <ol className="guide-list numbered">
          <li>
            <strong>Install Ranasi</strong>
            <span>
              Get the extension from the{" "}
              <a href={store} target="_blank" rel="noreferrer">
                Chrome Web Store
              </a>
              .
            </span>
          </li>
          <li>
            <strong>Save a profile</strong>
            <span>Open Options and enter the details you reuse most.</span>
          </li>
          <li>
            <strong>Open a form</strong>
            <span>Press Auto-Fill with AI in the bottom-right corner.</span>
          </li>
          <li>
            <strong>Go Pro when ready</strong>
            <span>
              Unlock AI fill and unlimited desktop sites for{" "}
              <Link href="/pro">$10/year</Link>.
            </span>
          </li>
        </ol>

        <h2>Frequently asked questions</h2>
        <div className="seo-faq">
          {FAQS.map((f) => (
            <details key={f.question} className="seo-faq-item">
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>

        <p className="seo-p" style={{ marginTop: 36 }}>
          Related: <Link href="/">Ranasi home</Link> ·{" "}
          <Link href="/pro">Get Pro</Link> ·{" "}
          <Link href="/privacy">Privacy</Link> ·{" "}
          <Link href="/activate">Activate license</Link>
        </p>
      </article>

      <SiteFooter />
    </main>
  );
}
