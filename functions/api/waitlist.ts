// @ts-nocheck
// Cloudflare Pages Function — POST /api/waitlist, GET /api/waitlist?code=CODE
// Bind a KV namespace as WAITLIST in Pages → Settings → Functions → KV bindings

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

function makeCode(email: string) {
  let h = 0
  for (let i = 0; i < email.length; i++) h = (Math.imul(31, h) + email.charCodeAt(i)) | 0
  const base = Math.abs(h).toString(36).padStart(6, '0').slice(0, 6).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 4).toUpperCase().replace(/[^A-Z0-9]/g, 'X')
  return `${base}${rand}`.slice(0, 8)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function onRequestPost(context: any) {
  const { request, env } = context as { request: Request; env: any }
  let body: any
  try { body = await request.json() } catch { return json({ error: 'Invalid JSON' }, 400) }

  const rawEmail = String(body.email ?? '').trim().toLowerCase()
  if (!EMAIL_RE.test(rawEmail)) return json({ error: 'Enter a valid email' }, 400)

  const email = rawEmail
  const current = body.current ? String(body.current).slice(0, 60) : null
  const interest = body.interest ? String(body.interest).slice(0, 24) : null
  const source = body.source ? String(body.source).slice(0, 32) : null
  const audience = body.audience ? String(body.audience).slice(0, 20) : 'personal'
  const organization = body.organization ? String(body.organization).trim().slice(0, 120) : null
  const teamSize = body.teamSize ? String(body.teamSize).slice(0, 20) : null
  const message = body.message ? String(body.message).trim().slice(0, 500) : null
  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? '0.0.0.0'
  const ua = request.headers.get('user-agent')?.slice(0, 200) ?? null

  // KV not bound → demo mode (no persistence, still returns a code so UI works locally)
  if (!env?.WAITLIST) {
    const code = makeCode(email)
    const url = new URL(request.url)
    return json({
      email,
      referralCode: code,
      referralUrl: `${url.origin}?ref=${encodeURIComponent(code)}`,
      referralCount: 0,
      demo: true,
      message: 'KV WAITLIST not bound — demo mode. Bind KV in Pages Settings to persist.',
    })
  }

  const kv: any = env.WAITLIST

  const existingRaw = (await kv.get(`email:${email}`, { type: 'json' })) as any
  if (existingRaw?.code) {
    return json({
      email,
      referralCode: existingRaw.code,
      referralUrl: `${new URL(request.url).origin}?ref=${encodeURIComponent(existingRaw.code)}`,
      referralCount: existingRaw.referralCount ?? 0,
      existing: true,
    })
  }

  // Rate limit: 20 / hour per IP
  const rlKey = `rl:${ip}`
  let rl: any = await kv.get(rlKey, { type: 'json' })
  if (!rl || Date.now() > rl.reset) rl = { count: 0, reset: Date.now() + 3600_000 }
  if (rl.count >= 20) return json({ error: 'Too many requests. Try again later.' }, 429)
  rl.count += 1
  await kv.put(rlKey, JSON.stringify(rl), { expirationTtl: 3600 })

  let code = makeCode(email)
  for (let i = 0; i < 3; i++) {
    const clash = await kv.get(`code:${code}`)
    if (!clash) break
    code = makeCode(email + Math.random().toString(36))
  }

  const now = new Date().toISOString()
  const record = { email, code, audience, organization, teamSize, current, interest, message, source, ip, ua, createdAt: now, referralCount: 0 }
  await kv.put(`email:${email}`, JSON.stringify(record))
  await kv.put(`code:${code}`, email)
  await kv.put(`entry:${code}`, JSON.stringify(record))

  // Referral increment
  if (source) {
    const refEmail = await kv.get(`code:${source}`)
    if (refEmail) {
      const refRaw: any = await kv.get(`email:${refEmail}`, { type: 'json' })
      if (refRaw) {
        refRaw.referralCount = (refRaw.referralCount ?? 0) + 1
        await kv.put(`email:${refEmail}`, JSON.stringify(refRaw))
        await kv.put(`entry:${refRaw.code}`, JSON.stringify(refRaw))
      }
    }
  }

  const origin = new URL(request.url).origin
  return json({ email, referralCode: code, referralUrl: `${origin}?ref=${encodeURIComponent(code)}`, referralCount: 0 })
}

export async function onRequestGet(context: any) {
  const { request, env } = context as { request: Request; env: any }
  const url = new URL(request.url)
  const code = url.searchParams.get('code') ?? url.searchParams.get('ref')
  if (!code) return json({ error: 'code required' }, 400)
  if (!env?.WAITLIST) return json({ code, referralCount: 0, demo: true })
  const kv: any = env.WAITLIST
  const email = await kv.get(`code:${code}`)
  if (!email) return json({ error: 'Not found' }, 404)
  const rec: any = await kv.get(`email:${email}`, { type: 'json' })
  return json({ code, email: rec?.email, referralCount: rec?.referralCount ?? 0 })
}
