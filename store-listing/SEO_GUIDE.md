# SEO for Ranasi — ranking for real keywords

## What Google shows today (tested)

| Query | Result |
|-------|--------|
| `Ranasi` | Site found (brand search works) |
| `autofill` / `auto fill` alone | Dominated by Chrome + big Store extensions — Ranasi will not appear soon |
| Exact long-tail matching `/autofill` title | `www.ranasi.com/autofill` can appear |
| `chrome new tab dashboard` | Competitive Store listings; need `/new-tab` + Store SEO |

**Rule:** Rank for *intent phrases* first (`chrome autofill extension`, `custom new tab chrome`, `auto fill chrome extension`). Head terms like bare `autofill` take months + Store traction + links.

## English for “จัดหน้าเว็บเหมือน desktop”

Use these on Store + pages (Ranasi already targets them on `/new-tab`):

- **custom new tab** / **new tab page (NTP)**
- **desktop-style new tab** / **new tab desktop**
- **new tab dashboard** / **browser start page**
- **pin websites** / **speed dial**

## Do NOT target OCR

Ranasi does **not** do OCR (image text scanning). Claiming OCR hurts trust and rankings. FAQ on `/chrome-extension` states this clearly.

## Pillar pages (index these in GSC)

| Path | Intent |
|------|--------|
| `/autofill` | autofill, auto fill, AI form filler |
| `/new-tab` | new tab desktop, custom start page, pin sites |
| `/chrome-extension` | chrome extension + install funnel |
| `/` | brand + product overview |

Sitemap: `https://www.ranasi.com/sitemap.xml`

## After every deploy

1. Google Search Console → **URL Inspection** → request indexing for `/`, `/autofill`, `/new-tab`, `/chrome-extension`
2. Confirm sitemap still **Success**
3. Set Vercel `NEXT_PUBLIC_EXTENSION_URL` to the live Store URL (site also falls back to the published listing ID)
4. Optimize **Chrome Web Store** title/description with the same phrases (Store search ≠ Google web search, but both matter)

## Honest timeline

- Brand (`Ranasi`): days–weeks once indexed
- Mid-tail (`chrome autofill extension one click`): weeks–months
- Head (`autofill`): unlikely without major authority; aim for Store category + long-tails instead
