import Link from "next/link";
import { extensionStoreUrl } from "@/lib/extension";

export function installHref(): string {
  return extensionStoreUrl();
}

type NavProps = {
  links?: { href: string; label: string }[];
};

const defaultLinks = [
  { href: "/#product", label: "Product" },
  { href: "/#demo", label: "Demo" },
  { href: "/autofill", label: "Autofill" },
  { href: "/new-tab", label: "New Tab" },
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
        <Link href="/autofill">Autofill</Link>
        <Link href="/new-tab">New Tab</Link>
        <Link href="/chrome-extension">Extension</Link>
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
