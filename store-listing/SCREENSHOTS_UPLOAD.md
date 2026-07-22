# Chrome Web Store Screenshots — Upload Guide

**Red Nickel fix:** Old `screenshot-1` / `screenshot-2` showed fake Chrome Web Store chrome (Featured badge + star ratings). Those pixels are replaced with clean product-only desktop UI. Do **not** re-upload any old Featured/star-rating images.

Prefer **JPEG** for store uploads (smaller files, no alpha channel issues). Use PNG only if you need lossless.

## Before you upload — DELETE old screenshots

In the Chrome Web Store Developer Dashboard:

1. Open your Ranasi listing → **Store listing** → Screenshots
2. **Delete every existing screenshot** that shows Featured, star ratings, review counts, or fake CWS UI chrome
3. Also remove any stale Localized/Global slots that still use the old mock listing images
4. Only after deletion, upload the **new clean** files below

If you leave old Featured/star screenshots in place, review can reject again even when repo files are fixed.

## Localized screenshots

Upload under each **language/locale** listing (e.g. English, Thai). Prefer JPEG:

| Slot | File (prefer JPEG) | Theme |
|------|--------------------|-------|
| 1 | `localized-1-1280x800.jpg` **and/or** `screenshot-1-1280x800.jpg` | Aurora / Mint |
| 2 | `localized-2-1280x800.jpg` **and/or** `screenshot-2-1280x800.jpg` | Mint / Ocean |
| 3 | `localized-3-1280x800.jpg` | Ocean |

Use only clean product UI. Do **not** re-upload old bad `screenshot-1`/`screenshot-2` if they still show Featured or stars on disk or in the Dashboard.

## Global (default) screenshots

Upload under the **default / global** store listing (not per-locale). Prefer:

| File | Theme |
|------|-------|
| `desktop-aurora-1280x800.jpg` | Aurora |
| `desktop-mint-1280x800.jpg` | Mint |
| `desktop-ocean-1280x800.jpg` | Ocean |
| `desktop-noir-1280x800.jpg` | Noir |

You may also use the new clean `screenshot-1-1280x800.jpg` and `screenshot-2-1280x800.jpg` (Mint / Ocean product UI) in Global slots.

## Specs

- Size: **1280×800** (exactly)
- Color: **RGB**, no alpha
- Format: JPEG preferred (quality ~92); PNG allowed if RGB-only
- Content: **product UI only** — no Featured badge, no star ratings, no fake store chrome

## Localized vs Global

- **Localized**: shown to users browsing the store in that language. Use `localized-*.jpg` and/or the new clean `screenshot-*.jpg`.
- **Global**: fallback / primary listing assets. Use `desktop-*.jpg` and/or the new clean screenshot JPEGs.

Do not mix alpha PNGs — the Web Store rejects or mishandles transparency.
