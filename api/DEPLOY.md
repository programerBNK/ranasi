# Deploy Ranasi API (Axum) → Railway + Supabase

## 1) Supabase database

1. Open [Supabase](https://supabase.com) → Project → **Settings → Database**
2. Copy **URI** (or Session pooler URI — preferred on Railway)
3. Put it in `api/.env` locally (never commit):

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.XXXX.supabase.co:5432/postgres?sslmode=require
ALLOW_DEV_LICENSE=true
```

If the password has special characters, URL-encode them (`/` → `%2F`, `@` → `%40`, `%` → `%25`).

4. Test locally:

```bash
cd api
cp .env.example .env   # then paste DATABASE_URL
cargo run
curl http://127.0.0.1:3130/health
```

On boot, Axum runs SQL migrations (`licenses`, `license_instances`, `fill_usage`) against Supabase automatically.

## 2) Deploy Axum on Railway

### A. Create project

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** (or CLI)
2. Set **Root Directory** to `api` (important — Dockerfile lives there)

Or with CLI:

```bash
cd api
railway login
railway init
railway up
```

### B. Environment variables (Railway → Variables)

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Supabase URI + `?sslmode=require` |
| `ALLOW_DEV_LICENSE` | `false` (production) |
| `OPENAI_API_KEY` | your OpenAI key (Pro fill) |
| `OPENAI_MODEL` | `gpt-4o-mini` (optional) |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | from Lemon Squeezy webhook |
| `RUST_LOG` | `info` |
| `HOST` | `0.0.0.0` (default) |

Railway sets `PORT` automatically — the app already reads it.

### C. Public URL

1. Railway → Service → **Settings → Networking → Generate Domain**
2. Health check: `https://YOUR-APP.up.railway.app/health` → `{"ok":true,"service":"ranasi-api"}`

### D. Point the rest of the stack at Railway

**Extension** (`.env.production` at repo root):

```env
WXT_API_BASE=https://YOUR-APP.up.railway.app
```

Then `npm run zip` / publish.

**Web** (`web/.env.local` or Vercel env):

```env
NEXT_PUBLIC_API_URL=https://YOUR-APP.up.railway.app
```

**Lemon Squeezy webhook** →  
`https://YOUR-APP.up.railway.app/v1/webhooks/lemonsqueezy`

## 3) Security checklist

- [ ] `ALLOW_DEV_LICENSE=false` on Railway
- [ ] Never commit `api/.env`
- [ ] Rotate DB password if it was pasted in chat / Discord / Git
- [ ] Prefer Supabase **connection pooler** (port 6543) if you hit connection limits

## 4) Troubleshooting

| Symptom | Fix |
|---------|-----|
| `error: password authentication failed` | Re-copy password from Supabase; encode special chars |
| `SSL required` / connection reset | Ensure `?sslmode=require` on `DATABASE_URL` |
| Migrations fail | Check Supabase allows connections; use pooler URI |
| Health 502 on Railway | Check deploy logs; confirm Root Directory = `api` |
| `RN-DEV-PRO` fails in prod | Expected when `ALLOW_DEV_LICENSE=false` — use real Lemon key |
