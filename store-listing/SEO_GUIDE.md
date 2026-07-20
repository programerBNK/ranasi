# SEO for Ranasi — ranking for real keywords

## Tested Google results (Jul 2026)

| Query | Ranasi on page 1? | Who wins |
|-------|-------------------|----------|
| `Ranasi` | Yes (brand) | ranasi.com |
| `autofill` alone | **No** | Google/Chrome docs, MDN |
| `auto fill chrome extension` | **No** | Lightning Autofill, Filliny, etc. (Store) |
| `autofill extension` | **No** | Established Store listings |
| `chrome extension` alone | **No** | Millions of results — unrealistic head term |

**Honest limit:** Code cannot force page-1 for bare `autofill` or `chrome extension`. Those are owned by Google + 10+ year Store products. What *does* move the needle:

1. **Chrome Web Store title/summary** containing `Autofill` + `Chrome Extension` (copy in `STORE_LISTING.md`)
2. Pillar pages with exact phrases (especially `/autofill-extension`)
3. GSC indexing + time + installs/reviews
4. Long-tails first (`autofill extension for chrome free`, `auto fill chrome extension one click`)

## English for “จัดหน้าเว็บเหมือน desktop”

- custom new tab / new tab page
- desktop-style new tab / new tab desktop
- new tab dashboard / browser start page
- pin websites / speed dial

Spelling: use **extension** (not “extention”). Google autocorrects the typo.

## Do NOT target OCR

Ranasi has no OCR.

## Pillar pages — request indexing after deploy

| Path | Intent |
|------|--------|
| `/autofill-extension` | autofill extension, auto fill extension |
| `/autofill` | autofill, auto fill, AI form filler |
| `/chrome-extension` | chrome extension |
| `/new-tab` | new tab desktop |
| `/` | brand |

Sitemap: `https://www.ranasi.com/sitemap.xml`

## After deploy + Store edit

1. GSC → URL Inspection → request indexing for the paths above
2. Developer Dashboard → update Title/Summary/Description → resubmit
3. Set `NEXT_PUBLIC_EXTENSION_URL` on Vercel
