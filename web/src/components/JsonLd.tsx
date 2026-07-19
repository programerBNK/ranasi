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
    sameAs: [],
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
    applicationCategory: "BrowserApplication",
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
    featureList: [
      "One-click Chrome autofill",
      "AI form filling",
      "Local profiles",
      "New tab desktop",
      "Premium themes",
    ],
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
