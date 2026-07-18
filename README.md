# AutoFlow

Smart AI Browser Assistant — desktop new tab + local profiles + Pro AI fill via **Axum + PostgreSQL**.

## Architecture

| Piece | Tech | Port | Role |
|-------|------|------|------|
| Extension | WXT + React | 3121 (dev) | New Tab, Profile, Auto-Fill, Pro gates |
| Web | Next.js (`web/`) | 3120 | Landing, pricing, activate UI |
| API | Axum + sqlx (`api/`) | **3130** | License + Pro server AI fill |
| DB | Postgres 16 | **5433** | Licenses, instances, fill usage |
| Payments | Lemon Squeezy | — | $10/year + license email |

## Free vs Pro

| | Free | Pro ($10/yr) |
|--|------|----------------|
| Auto-Fill | Heuristic (on-device) | + **Server AI** (your OpenAI key on API) |
| Profiles | 1 | Up to 5 |
| Themes | Mint, Slate | + Ember |
| Export / Import | No | Yes |

## 3-click magic

1. Install extension → Options  
2. Save **Profile** once  
3. Open a form → **Auto-Fill with AI**

Demo form: http://localhost:3120/demo-form.html

## Local development

```bash
# 0) Postgres
npm run dev:db
# or: cd api && docker compose up -d

# 1) Axum API (needs Rust + Docker Postgres)
cp api/.env.example api/.env   # set OPENAI_API_KEY for real AI
npm run dev:api

# 2) Marketing site
npm run dev:web

# 3) Extension
npm run dev:ext
```

Load unpacked: `.output/chrome-mv3-dev`

Activate Pro locally: license key `AF-DEV-PRO` (API must be on :3130)

| URL | Purpose |
|-----|---------|
| http://localhost:3130/health | API health |
| http://localhost:3120 | Landing |
| http://localhost:3120/pro | **Buy Pro** (Lemon Squeezy pay path) |
| http://localhost:3120/success | After payment |
| http://localhost:3120/activate | Validate key via Axum |
| Extension Options | Profile + License |

### Connect real payments

1. Create Lemon Squeezy product **AutoFlow Pro** · **$10/year** · enable License Keys  
2. Copy checkout URL into `web/.env.local`:

```env
NEXT_PUBLIC_CHECKOUT_URL=https://YOUR_STORE.lemonsqueezy.com/checkout/buy/VARIANT_ID
```

3. Restart `npm run dev:web` — `/pro` shows **Pay with Lemon Squeezy**  
4. Webhook → `https://YOUR_API/v1/webhooks/lemonsqueezy`

### Webhook (production)

Point Lemon Squeezy to:

`https://YOUR_API_DOMAIN/v1/webhooks/lemonsqueezy`

## Production notes

1. Deploy `api/` (Fly/Railway) with Postgres + `OPENAI_API_KEY`  
2. Deploy `web/` to Vercel (`NEXT_PUBLIC_API_URL` → Axum)  
3. Set `.env.production` `WXT_API_BASE` → Axum URL, then `npm run zip` → Chrome Web Store  

## Scripts

```bash
npm run dev:db
npm run dev:api
npm run dev:web
npm run dev:ext
npm run build:ext
npm run build:web
npm run build:api
```
