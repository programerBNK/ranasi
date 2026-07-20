import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION } from "@/lib/seo/site";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    sameAs: [
      "https://chromewebstore.google.com/detail/ranasi/jhnkiofckjnbekegndfoaafeialceplb",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "bnatharuch@gmail.com",
      contactType: "customer support",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@type": "Organization", name: SITE_NAME },
    inLanguage: "en",
  };
}

export function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    alternateName: [
      "Ranasi Autofill Chrome Extension",
      "Ranasi autofill extension",
      "Ranasi auto fill",
    ],
    applicationCategory: "BrowserApplication",
    applicationSubCategory: "Autofill Chrome Extension",
    operatingSystem: "Chrome",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        name: "Ranasi Free",
      },
      {
        "@type": "Offer",
        price: "10",
        priceCurrency: "USD",
        name: "Ranasi Pro (annual)",
      },
    ],
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    downloadUrl:
      "https://chromewebstore.google.com/detail/ranasi/jhnkiofckjnbekegndfoaafeialceplb",
    installUrl:
      "https://chromewebstore.google.com/detail/ranasi/jhnkiofckjnbekegndfoaafeialceplb",
    featureList: [
      "Autofill extension for Chrome",
      "Auto fill web forms in one click",
      "AI form filling on Pro",
      "Local autofill profiles",
      "New tab desktop / start page",
      "Pin websites on new tab",
    ],
    keywords:
      "autofill, auto fill, autofill extension, chrome extension, chrome autofill extension, auto fill chrome extension",
  };
}

export function faqJsonLd(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
