# Ranasi

Smart AI Browser Assistant — desktop new tab + local profiles + Pro AI fill via **Axum + PostgreSQL**.

## Architecture

| Piece | Tech | Port | Role |
|-------|------|------|------|
| Extension | WXT + React | 3121 (dev) | New Tab, profiles, Auto-Fill, Pro entitlements |
| Web | Next.js (`web/`) | 3120 | Landing, pricing, activate UI |
| API | Axum + sqlx (`api/`) | **3130** | License + Pro server AI fill |
| DB | Postgres 16 | **5433** | Licenses, instances, fill usage |
| Payments | Lemon Squeezy | — | Ranasi Pro ($10/year) + license email |

## Free vs Pro

| | Free | Pro ($10/yr) |
|--|------|----------------|
| Auto-Fill | Heuristic (on-device) | + **Server AI** (your OpenAI key on API) |
| Profiles | 1 | Up to 5 |
| Themes | Mint, Slate | **12 Pro themes** (default Noir Gold) |
| Desktop sites | Max **10** | **Unlimited** |
| Export / Import | No | Yes |

## Quick start

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

Developers can load `.output/chrome-mv3-dev` as an unpacked extension. Production
users install Ranasi from the Chrome Web Store; they do not download or load
project folders.

Activate Pro locally with `RN-DEV-PRO` (primary). The legacy `AF-DEV-PRO` key
also works while `ALLOW_DEV_LICENSE=true`. The Axum API must be running on port
3130.

| URL | Purpose |
|-----|---------|
| http://localhost:3130/health | API health |
| http://localhost:3120 | Landing |
| http://localhost:3120/pro | **Buy Pro** (Lemon Squeezy pay path) |
| http://localhost:3120/success | After payment |
| http://localhost:3120/activate | Validate key via Axum |
| Extension Options | Profile + License |

### Connect real payments

1. Create Lemon Squeezy product **Ranasi Pro** · **$10/year** · enable License Keys
2. Copy checkout URL into `web/.env.local`:

```env
NEXT_PUBLIC_CHECKOUT_URL=https://YOUR_STORE.lemonsqueezy.com/checkout/buy/VARIANT_ID
```

3. Restart `npm run dev:web` — `/pro` shows **Pay with Lemon Squeezy**  
4. Point the webhook at the Axum API: `https://YOUR_API/v1/webhooks/lemonsqueezy`

### Webhook (production)

Point Lemon Squeezy to:

`https://YOUR_API_DOMAIN/v1/webhooks/lemonsqueezy`

Do not use the Next.js `/api/webhooks/lemonsqueezy` route; it is deprecated and
does not process license state.

## Production notes

**Supabase + Railway:** see full guide → [`api/DEPLOY.md`](api/DEPLOY.md)

1. Set `DATABASE_URL` to your Supabase Postgres URI (`?sslmode=require`)  
2. Deploy `api/` to Railway (Root Directory = `api`, Dockerfile included); custom domain `https://api.ranasi.com`  
3. Deploy `web/` to Vercel (`NEXT_PUBLIC_API_URL=https://api.ranasi.com`, `NEXT_PUBLIC_APP_URL=https://www.ranasi.com`)  
4. Set `.env.production` `WXT_API_BASE=https://api.ranasi.com`, then `npm run zip` → Chrome Web Store  
5. Lemon webhook → `https://api.ranasi.com/v1/webhooks/lemonsqueezy`  
6. Production: `ALLOW_DEV_LICENSE=false`

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
