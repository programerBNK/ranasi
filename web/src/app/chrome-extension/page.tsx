import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav, installHref } from "@/components/SiteChrome";
import {
  JsonLd,
  faqJsonLd,
  organizationJsonLd,
  softwareAppJsonLd,
} from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { SEO_KEYWORDS } from "@/lib/seo/keywords";

export const metadata: Metadata = buildMetadata({
  title: "Ranasi Chrome Extension — Autofill Forms & New Tab Desktop",
  description:
    "Ranasi is a free Chrome extension for autofill / auto fill web forms and a desktop-style new tab. AI form fill on Pro. Install from the Chrome Web Store.",
  path: "/chrome-extension",
  keywords: [
    "chrome extension",
    "chrome autofill extension",
    "chrome extension autofill forms",
    "chrome new tab extension",
    "auto fill chrome extension",
    "chrome form filler",
    "best chrome autofill extension",
    ...SEO_KEYWORDS.slice(60, 100),
  ],
});

const FAQS = [
  {
    question: "What is the Ranasi Chrome extension?",
    answer:
      "Ranasi is a Chrome extension that combines one-click autofill (auto fill forms from a local profile) with a dimensional new-tab desktop where you pin websites and themes.",
  },
  {
    question: "How do I install the Ranasi Chrome extension?",
    answer:
      "Open the Chrome Web Store listing, click Add to Chrome, then open a new tab to see the desktop and use Options to save your autofill profile.",
  },
  {
    question: "Does Ranasi replace built-in Chrome autofill?",
    answer:
      "You can use both. Ranasi is a dedicated form filler with profiles and an Auto-Fill button for pages where built-in suggestions are limited. Pro adds Server AI fill for harder forms.",
  },
  {
    question: "Is Ranasi free?",
    answer:
      "Yes. Ranasi Free includes local autofill and a new-tab desktop with a site limit. Ranasi Pro is $10/year for Server AI Auto-Fill, up to 5 profiles, 12 themes, and unlimited desktop sites.",
  },
  {
    question: "Where can I download the Chrome autofill extension?",
    answer:
      "Install Ranasi from the Chrome Web Store. The official site is ranasi.com — use it for Pro checkout, license activation, and product guides.",
  },
  {
    question: "Does Ranasi include OCR?",
    answer:
      "No. Ranasi focuses on autofill from saved profiles and a custom new tab desktop. It does not scan images with OCR. For form fill and new-tab pins, use the features described on this site.",
  },
];

export default function ChromeExtensionSeoPage() {
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
            name: "Ranasi Chrome Extension — Autofill & New Tab",
            url: "https://www.ranasi.com/chrome-extension",
            description:
              "Install the Ranasi Chrome extension for autofill and a desktop-style new tab.",
          },
        ]}
      />

      <SiteNav
        links={[
          { href: "/autofill", label: "Autofill" },
          { href: "/new-tab", label: "New Tab" },
          { href: "/pro", label: "Pro" },
          { href: "/activate", label: "Activate" },
        ]}
      />

      <article className="section seo-article" style={{ marginTop: 12 }}>
        <p className="section-label">Chrome extension</p>
        <h1 className="seo-h1">
          Chrome extension for autofill and a desktop new tab
        </h1>
        <p className="section-lead">
          Searching for a <strong>Chrome extension</strong> that can{" "}
          <strong>autofill</strong> / <strong>auto fill</strong> forms and give you
          a better <strong>new tab</strong>? Ranasi is built for both — install
          once, fill forms in one click, and open every new tab into a themed
          desktop.
        </p>

        <div className="cta-row" style={{ marginBottom: 36 }}>
          <a
            className="btn btn-primary"
            href={store}
            target="_blank"
            rel="noreferrer"
          >
            Add to Chrome — free
          </a>
          <Link className="btn btn-ghost" href="/#demo">
            Try autofill demo
          </Link>
        </div>

        <h2>Two jobs, one Chrome extension</h2>
        <ul className="bullet-clean seo-list">
          <li>
            <Link href="/autofill">
              <strong>Autofill / auto fill</strong>
            </Link>{" "}
            — save a profile, press Auto-Fill with AI on web forms
          </li>
          <li>
            <Link href="/new-tab">
              <strong>New tab desktop</strong>
            </Link>{" "}
            — pin websites, themes, start-page layout like a desktop
          </li>
          <li>
            <strong>Pro</strong> — Server AI fill, more profiles, unlimited pins
          </li>
        </ul>

        <h2>Keywords this extension matches</h2>
        <p className="seo-p">
          People find tools like Ranasi by searching phrases such as chrome
          autofill extension, auto fill chrome extension free, chrome form filler,
          AI form filler, chrome new tab extension, custom new tab chrome, and pin
          websites new tab. This page and the guides below are written for those
          intents — not for OCR or unrelated scanner apps.
        </p>

        <h2>Install in under a minute</h2>
        <ol className="guide-list numbered">
          <li>
            <strong>Open the Chrome Web Store</strong>
            <span>
              Go to the{" "}
              <a href={store} target="_blank" rel="noreferrer">
                Ranasi listing
              </a>{" "}
              and click Add to Chrome.
            </span>
          </li>
          <li>
            <strong>Confirm permissions</strong>
            <span>Allow the extension so it can fill forms and replace new tab.</span>
          </li>
          <li>
            <strong>Set up your profile</strong>
            <span>Open Options → enter name, email, phone, address, and more.</span>
          </li>
          <li>
            <strong>Use it daily</strong>
            <span>
              New tab → desktop pins. Form page → Auto-Fill with AI.
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
          Related: <Link href="/">Home</Link> ·{" "}
          <Link href="/autofill">Autofill guide</Link> ·{" "}
          <Link href="/new-tab">New tab desktop</Link> ·{" "}
          <Link href="/pro">Get Pro</Link> ·{" "}
          <Link href="/privacy">Privacy</Link>
        </p>
      </article>

      <SiteFooter />
    </main>
  );
}
