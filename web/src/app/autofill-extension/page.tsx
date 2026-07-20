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

export const metadata: Metadata = buildMetadata({
  title: "Autofill Extension for Chrome — Auto Fill Forms Free | Ranasi",
  description:
    "Looking for an autofill extension or auto fill Chrome extension? Ranasi autofills web forms in one click from your local profile. Free Chrome extension. Pro adds AI fill.",
  path: "/autofill-extension",
  keywords: [
    "autofill extension",
    "auto fill extension",
    "autofill chrome extension",
    "auto fill chrome extension",
    "chrome autofill extension",
    "chrome extension autofill",
    "autofill",
    "auto fill",
    "chrome extension",
    "form filler extension",
  ],
});

const FAQS = [
  {
    question: "What is an autofill extension?",
    answer:
      "An autofill extension (also called an auto fill Chrome extension) is a browser add-on that fills web forms for you — name, email, phone, address, and more — so you do not retype the same details on every site.",
  },
  {
    question: "Is Ranasi a free autofill extension for Chrome?",
    answer:
      "Yes. Ranasi is a free Chrome autofill extension for one-click form fill from a local profile. Pro ($10/year) adds Server AI Auto-Fill, more profiles, and unlimited new-tab desktop sites.",
  },
  {
    question: "Autofill vs auto fill — which spelling should I search?",
    answer:
      "Both mean the same thing. People search autofill, auto fill, autofill extension, and auto fill chrome extension. Ranasi matches all of these intents.",
  },
  {
    question: "How is this different from built-in Chrome autofill?",
    answer:
      "Built-in Chrome autofill helps with basic fields. Ranasi is a dedicated autofill extension with a profile workspace, a one-click Auto-Fill button, optional AI fill on Pro, and a desktop-style new tab.",
  },
  {
    question: "Where do I get the Chrome extension?",
    answer:
      "Install Ranasi from the Chrome Web Store. Then open Options, save your profile, and use Auto-Fill with AI on any form page.",
  },
];

export default function AutofillExtensionPage() {
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
            name: "Autofill Extension for Chrome — Auto Fill Forms | Ranasi",
            url: "https://www.ranasi.com/autofill-extension",
            description:
              "Free autofill extension for Chrome. Auto fill web forms in one click.",
          },
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to use the Ranasi autofill extension",
            description:
              "Install the Chrome autofill extension and auto fill a web form in one click.",
            step: [
              {
                "@type": "HowToStep",
                name: "Install the Chrome extension",
                text: "Add Ranasi from the Chrome Web Store.",
              },
              {
                "@type": "HowToStep",
                name: "Save your autofill profile",
                text: "Open Options and enter name, email, phone, and address.",
              },
              {
                "@type": "HowToStep",
                name: "Auto fill the form",
                text: "Open any web form and press Auto-Fill with AI.",
              },
            ],
          },
        ]}
      />

      <SiteNav
        links={[
          { href: "/autofill", label: "Autofill" },
          { href: "/chrome-extension", label: "Extension" },
          { href: "/new-tab", label: "New Tab" },
          { href: "/pro", label: "Pro" },
        ]}
      />

      <article className="section seo-article" style={{ marginTop: 12 }}>
        <p className="section-label">Autofill extension</p>
        <h1 className="seo-h1">
          Autofill extension for Chrome — auto fill forms in one click
        </h1>
        <p className="section-lead">
          Searching for an <strong>autofill extension</strong>,{" "}
          <strong>auto fill extension</strong>, or{" "}
          <strong>Chrome autofill extension</strong>? Ranasi is a free{" "}
          <strong>Chrome extension</strong> that autofills / auto fills web forms
          from a profile you control — then opens every new tab as a desktop-style
          start page.
        </p>

        <div className="cta-row" style={{ marginBottom: 36 }}>
          <a
            className="btn btn-primary"
            href={store}
            target="_blank"
            rel="noreferrer"
          >
            Get the autofill extension free
          </a>
          <Link className="btn btn-ghost" href="/#demo">
            Try auto fill demo
          </Link>
        </div>

        <h2>Autofill · auto fill · Chrome extension</h2>
        <p className="seo-p">
          These searches all point to the same need: stop typing the same name,
          email, and address into job applications, signups, and checkout forms.
          An <strong>autofill Chrome extension</strong> keeps that data once and
          fills fields on demand. Ranasi is built for that job.
        </p>

        <h2>What this autofill extension fills</h2>
        <ul className="bullet-clean seo-list">
          <li>Name, email, phone, company, and job title</li>
          <li>Address, city, country, and about / bio text</li>
          <li>Common signup, checkout, and application layouts</li>
          <li>Harder pages with Server AI Auto-Fill on Pro</li>
        </ul>

        <h2>Try auto fill here</h2>
        <p className="seo-p">
          The demo form starts empty. Press Auto-Fill with AI — the same idea as
          the Chrome extension on a real page.
        </p>
        <AutoFillDemo />

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
          More guides: <Link href="/autofill">Autofill deep dive</Link> ·{" "}
          <Link href="/chrome-extension">Chrome extension overview</Link> ·{" "}
          <Link href="/new-tab">New tab desktop</Link> ·{" "}
          <Link href="/pro">Get Pro</Link>
        </p>
      </article>

      <SiteFooter />
    </main>
  );
}
