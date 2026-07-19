# SEO for Ranasi — what was built + how ranking works

## Honest expectation

**Nobody can guarantee Google #1** for 300 keywords by adding a list alone. Ranking depends on:

1. Technical SEO (done below)
2. Relevant content pages (done: `/autofill` + site copy)
3. Chrome Web Store listing going **Published** (backlinks + brand searches)
4. Google Search Console verification + time (weeks–months)
5. Backlinks / mentions from real sites
6. Competition on head terms like bare `autofill` is extremely high — long-tails rank first

The 300 phrases are your **keyword map** for content, ads, and Store listing — not a spam block to dump on one page (that can hurt rankings).

---

## Files

| File | Purpose |
|------|---------|
| `web/src/lib/seo/keywords.ts` | 300 phrases in TypeScript |
| `web/src/lib/seo/keywords.json` | Same list for export / sheets |
| `web/src/lib/seo/metadata.ts` | Shared title/description/OG helpers |
| `web/src/app/sitemap.ts` | `https://www.ranasi.com/sitemap.xml` |
| `web/src/app/robots.ts` | `https://www.ranasi.com/robots.txt` |
| `web/src/app/autofill/page.tsx` | Pillar SEO page + FAQ schema |
| `web/src/app/opengraph-image.tsx` | Social share image |

---

## Live URLs to check after deploy

- https://www.ranasi.com/sitemap.xml
- https://www.ranasi.com/robots.txt
- https://www.ranasi.com/autofill
- View source → JSON-LD (`Organization`, `WebSite`, `SoftwareApplication`, FAQ on `/autofill`)

---

## Your next steps (required for real ranking)

1. **Google Search Console** → Add property `https://www.ranasi.com` → verify DNS (Cloudflare TXT) or HTML tag  
2. Submit sitemap: `https://www.ranasi.com/sitemap.xml`  
3. **Bing Webmaster** (optional) same sitemap  
4. When Chrome Web Store is **Published**, set `NEXT_PUBLIC_EXTENSION_URL` and link Store ↔ website  
5. Use the 300 keywords for: Store description, future blog posts, YouTube titles — one topic per page, natural writing  
6. Prefer long-tails first, e.g. `chrome autofill extension one click`, `AI form filler chrome`, `job application autofill extension`

---

## Thai + English

The keyword file includes Thai queries for users in Thailand. Site UI default is English; `<html lang>` follows browser locale. Consider a Thai landing later if Thailand is a primary market.
