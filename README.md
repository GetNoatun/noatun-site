# noatun-site — noatun.app

Waitlist + marketing site for **Noatun personal cloud** — hosted on **Cloudflare Pages**.

- Stack: Vite + React + Tailwind v4 + TypeScript + Cloudflare Pages Functions
- Domain: `noatun.app` (HSTS) on Cloudflare
- Repo: `GetNoatun/noatun-site`

## Local dev

```bash
npm ci
npm run dev          # http://localhost:5173
npm run build        # -> dist/
npm run preview
```

## Cloudflare Pages — deploy

**Connect Git:** Dash → Pages → Create → Connect `GetNoatun/noatun-site` → Build `npm run build` → Output `dist`.

**KV for waitlist:** Dash → Workers & Pages → KV → Create namespace `WAITLIST` → Pages → Settings → Functions → KV bindings → `WAITLIST` → `WAITLIST`.

`POST /api/waitlist` stores `{email, current, interest, source}` → `{referralCode, referralUrl}`. `?ref=CODE` increments referrer. Demo mode works before KV is bound.

## Design

Harbor-dark canvas (`#09090b` zinc-950) + amber beacon (`#f59e0b`), borders-only elevation, 4px rhythm, Inter + JetBrains Mono. See `.interface-design` parity with `fifthsegment/noatun`.

## Serial

`fifthsegment/clouddrive#23` Waitlist + referral landing. Copy from `docs/marketing-ideas.md` — hero `Private Google that fits a $5 VPS`.
