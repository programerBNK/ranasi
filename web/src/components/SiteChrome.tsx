import Link from "next/link";
import {
  extensionStoreUrl,
  isExtensionPublished,
} from "@/lib/extension";

export function installHref(): string {
  return isExtensionPublished()
    ? extensionStoreUrl()
    : "https://chromewebstore.google.com/";
}

type NavProps = {
  links?: { href: string; label: string }[];
};

const defaultLinks = [
  { href: "/#product", label: "Product" },
  { href: "/#demo", label: "Demo" },
  { href: "/#install", label: "Install" },
  { href: "/pro", label: "Pro" },
  { href: "/activate", label: "Activate" },
];

export function SiteNav({ links = defaultLinks }: NavProps) {
  return (
    <nav className="nav">
      <Link className="logo" href="/">
        <span className="logo-mark" aria-hidden>
          R
        </span>
        Ranasi
      </Link>
      <div className="nav-links">
        {links.map((l) =>
          l.href.startsWith("http") ? (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ) : (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <strong>Ranasi</strong>
        <span>Smart autofill for the browser you already use.</span>
      </div>
      <div className="site-footer-links">
        <Link href="/pro">Get Pro</Link>
        <Link href="/activate">Activate</Link>
        <Link href="/privacy">Privacy</Link>
        <a href={installHref()} target="_blank" rel="noreferrer">
          Chrome Web Store
        </a>
      </div>
    </footer>
  );
}
