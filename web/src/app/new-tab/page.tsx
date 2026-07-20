import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav, installHref } from "@/components/SiteChrome";
import {
  JsonLd,
  faqJsonLd,
  organizationJsonLd,
  softwareAppJsonLd,
} from "@/components/JsonLd";
import { DesktopPreview } from "@/components/ProductShowcase";
import { buildMetadata } from "@/lib/seo/metadata";
import { SEO_KEYWORDS } from "@/lib/seo/keywords";

export const metadata: Metadata = buildMetadata({
  title: "Chrome New Tab Desktop — Custom Start Page & Pin Websites | Ranasi",
  description:
    "Replace Chrome’s empty new tab with a desktop-style start page. Pin websites, switch themes, and launch work from one new tab dashboard. Free Chrome extension.",
  path: "/new-tab",
  keywords: [
    "chrome new tab desktop",
    "custom new tab chrome",
    "new tab dashboard",
    "desktop-style new tab",
    "chrome start page",
    "pin websites new tab",
    "new tab speed dial",
    "replace chrome new tab",
    ...SEO_KEYWORDS.slice(134, 160),
  ],
});

const FAQS = [
  {
    question: "What is a Chrome new tab desktop?",
    answer:
      "A new tab desktop (also called a custom new tab page, start page, or new tab dashboard) replaces Chrome’s blank new tab with a layout that feels like a desktop: pinned websites, themes, and quick launch tiles.",
  },
  {
    question: "How do I customize the Chrome new tab page?",
    answer:
      "Install Ranasi from the Chrome Web Store. Every new tab opens Ranasi’s dimensional desktop. Pin your favorite sites, pick a theme, and use it as your browser start page.",
  },
  {
    question: "Is Ranasi a new tab dashboard or a speed dial?",
    answer:
      "Both ideas apply. Ranasi is a desktop-style new tab with pin tiles (like a visual speed dial) plus premium themes on Pro — not just a wallpaper and clock.",
  },
  {
    question: "Can I pin unlimited websites on the new tab?",
    answer:
      "Free includes a limited number of desktop sites. Ranasi Pro unlocks unlimited pinned websites, 12 premium themes, and export/import of your layout.",
  },
  {
    question: "What English words mean “จัดหน้าเว็บเหมือน desktop”?",
    answer:
      "Common search terms are: custom new tab, new tab page (NTP), desktop-style new tab, new tab dashboard, browser start page, pin websites on new tab, and speed dial.",
  },
  {
    question: "Does the new tab work with autofill?",
    answer:
      "Yes. Ranasi combines a new-tab desktop with one-click autofill. Pin sites from the desktop, then auto fill forms on those sites from your saved profile.",
  },
];

export default function NewTabSeoPage() {
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
            name: "Chrome New Tab Desktop — Custom Start Page | Ranasi",
            url: "https://www.ranasi.com/new-tab",
            description:
              "Custom Chrome new tab desktop: pin websites, themes, and a start-page dashboard.",
          },
        ]}
      />

      <SiteNav
        links={[
          { href: "/autofill", label: "Autofill" },
          { href: "/chrome-extension", label: "Extension" },
          { href: "/pro", label: "Pro" },
          { href: "/activate", label: "Activate" },
        ]}
      />

      <article className="section seo-article" style={{ marginTop: 12 }}>
        <p className="section-label">New tab desktop</p>
        <h1 className="seo-h1">
          Chrome new tab desktop — pin websites like a start page
        </h1>
        <p className="section-lead">
          Tired of Chrome’s empty new tab? Ranasi turns every new tab into a{" "}
          <strong>desktop-style start page</strong>: pin favorite websites, switch
          themes, and launch work from one calm surface — a custom new tab
          dashboard built for daily browsing.
        </p>

        <div className="cta-row" style={{ marginBottom: 36 }}>
          <a
            className="btn btn-primary"
            href={store}
            target="_blank"
            rel="noreferrer"
          >
            Install new tab free
          </a>
          <Link className="btn btn-ghost" href="/#product">
            See the desktop preview
          </Link>
        </div>

        <div style={{ marginBottom: 40 }}>
          <DesktopPreview />
        </div>

        <h2>Words people use for “หน้าแท็บใหม่เหมือน desktop”</h2>
        <p className="seo-p">
          If you searched in Thai for arranging the browser like a desktop, these
          English phrases match the same intent:
        </p>
        <ul className="bullet-clean seo-list">
          <li>
            <strong>Custom new tab</strong> / <strong>new tab page (NTP)</strong>
          </li>
          <li>
            <strong>Desktop-style new tab</strong> /{" "}
            <strong>new tab desktop</strong>
          </li>
          <li>
            <strong>New tab dashboard</strong> / <strong>browser start page</strong>
          </li>
          <li>
            <strong>Pin websites</strong> / <strong>speed dial</strong> / visual
            bookmarks grid
          </li>
        </ul>

        <h2>Why replace the default Chrome new tab?</h2>
        <p className="seo-p">
          The default page wastes the first second of every session. A{" "}
          <strong>productivity new tab</strong> puts your sites in reach — Gmail,
          Notion, job boards, dashboards — without digging through bookmarks.
          Ranasi is built as a dimensional desktop, not a cluttered widget wall.
        </p>

        <h2>What you get on every new tab</h2>
        <ul className="bullet-clean seo-list">
          <li>Pin and launch websites from a desktop-like grid</li>
          <li>Theme the start page (12 premium looks on Pro)</li>
          <li>Export / import layout so your pins travel with you</li>
          <li>
            Pair with{" "}
            <Link href="/autofill">one-click autofill</Link> when you land on forms
          </li>
        </ul>

        <h2>How to set Ranasi as your new tab</h2>
        <ol className="guide-list numbered">
          <li>
            <strong>Install the Chrome extension</strong>
            <span>
              Add Ranasi from the{" "}
              <a href={store} target="_blank" rel="noreferrer">
                Chrome Web Store
              </a>
              .
            </span>
          </li>
          <li>
            <strong>Open a new tab</strong>
            <span>
              Chrome loads the Ranasi desktop automatically as your custom new tab
              page.
            </span>
          </li>
          <li>
            <strong>Pin your sites</strong>
            <span>Add the sites you open every day — your personal start page.</span>
          </li>
          <li>
            <strong>Optional: Go Pro</strong>
            <span>
              Unlock unlimited pins and premium themes for{" "}
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
          Related: <Link href="/">Home</Link> ·{" "}
          <Link href="/autofill">Chrome autofill</Link> ·{" "}
          <Link href="/chrome-extension">Chrome extension</Link> ·{" "}
          <Link href="/pro">Get Pro</Link>
        </p>
      </article>

      <SiteFooter />
    </main>
  );
}
