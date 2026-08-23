# Noatun website

Marketing and early-access site for [Noatun](https://noatun.app).

- Stack: Vite, React, Tailwind CSS, and TypeScript
- Hosting: GitHub Pages from `GetNoatun/noatun-site`
- Production domain: `noatun.app`
- Deployment path: `/`

## Local development

```bash
npm ci
npm run dev          # http://localhost:5173
npm run build        # outputs dist/
npm run preview
```

## Deployment

A push to `main` builds and deploys `dist/` through `.github/workflows/pages.yml`.
`public/CNAME` configures GitHub Pages to serve the repository at `https://noatun.app/`.

In Cloudflare DNS, point the production hostname to GitHub Pages:

| Type | Name | Target |
| --- | --- | --- |
| CNAME | `@` | `getnoatun.github.io` |

Cloudflare flattens the apex CNAME. Keep the record DNS-only until GitHub has issued the TLS certificate; proxying can be enabled afterward if desired.

The GitHub Pages deployment cannot execute `functions/api/waitlist.ts`, so forms use the prepared-email fallback. Deploy to a backend-enabled host to restore persistent waitlist submissions.
