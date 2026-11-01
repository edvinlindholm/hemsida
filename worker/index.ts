import { validateAll, type ContactRequest } from '../shared/contact';
import { validateReview, type ReviewRequest } from '../shared/review';

interface Env {
  ASSETS: Fetcher;
  CONTACT_TO: string;
  CONTACT_FROM: string;
  ALLOWED_ORIGINS: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

/** Fält som båda formulären har för spamskydd. */
interface Protected {
  website?: unknown;
  startedAt?: unknown;
  turnstileToken?: unknown;
}

interface Mail {
  subject: string;
  replyTo: string;
  rows: [string, string][];
}

interface FormConfig<T> {
  tag: string;
  validate: (d: T) => Record<string, string | undefined>;
  mail: (d: T) => Mail;
}

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 4_000;

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

const oneLine = (s: string) => s.trim().replace(/[\r\n]+/g, ' ');

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

function renderMail(rows: [string, string][]) {
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const html =
    '<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">' +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#56636F;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td>` +
          `<td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
      )
      .join('') +
    '</table>';
  return { text, html };
}

const CONTACT: FormConfig<ContactRequest> = {
  tag: 'kontakt',
  validate: (d) => validateAll(d),
  mail: (d) => ({
    subject: `Ny förfrågan: ${oneLine(d.name)}`,
    replyTo: d.email.trim(),
    rows: [
      ['Kundtyp', d.customerType],
      ['Behov', d.needs.join(', ')],
      ['Beskrivning', d.description.trim()],
      ['Tid idag', d.timeSpent],
      ['Tidsplan', d.timeline],
      ['Verktyg', d.tools],
      ['Namn', d.name.trim()],
      ['Mejl', d.email.trim()],
      ['Telefon', d.phone.trim() || '–'],
      ['Företag/förening', d.organization.trim() || '–'],
      ['Ort', d.city.trim() || '–'],
    ],
  }),
};

const REVIEW: FormConfig<ReviewRequest> = {
  tag: 'omdome',
  validate: (d) => validateReview(d),
  mail: (d) => ({
    subject: `Nytt omdöme: ${oneLine(d.name)} (${d.rating}/5)`,
    replyTo: d.email.trim(),
    rows: [
      ['Namn', d.name.trim()],
      ['Visas som', d.title.trim() || '–'],
      ['Kundtyp', d.customerType],
      ['Betyg', `${d.rating} av 5`],
      ['Omdöme', d.text.trim()],
      ['Mejl (visas inte)', d.email.trim()],
      ['Får publiceras', d.publishConsent ? 'Ja' : 'Nej'],
    ],
  }),
};

async function handleForm<T extends Protected>(request: Request, env: Env, cfg: FormConfig<T>): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' });

  // Tillåt samma ursprung (produktion och preview-adresser) samt uttryckligen listade ursprung (lokal utveckling).
  const origin = request.headers.get('origin');
  const allowed = env.ALLOWED_ORIGINS.split(',').map((s) => s.trim());
  if (!origin || (origin !== new URL(request.url).origin && !allowed.includes(origin)))
    return json(403, { ok: false, error: 'origin_not_allowed' });

  if (!(request.headers.get('content-type') ?? '').includes('application/json'))
    return json(415, { ok: false, error: 'unsupported_media_type' });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { ok: false, error: 'too_large' });

  let d: T;
  try {
    d = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: 'invalid_json' });
  }
  if (!d || typeof d !== 'object') return json(400, { ok: false, error: 'invalid_json' });

  // Honeypot och för snabbt ifyllt: låtsas att allt gick bra så att robotar inte lär sig något.
  if ((typeof d.website === 'string' && d.website !== '') || typeof d.startedAt !== 'number' || Date.now() - d.startedAt < MIN_FILL_MS) {
    return json(200, { ok: true });
  }

  const errors = cfg.validate(d);
  if (Object.keys(errors).length > 0) return json(422, { ok: false, error: 'validation', fields: errors });

  if (!env.TURNSTILE_SECRET_KEY) return json(500, { ok: false, error: 'not_configured' });
  let human = false;
  try {
    human = await verifyTurnstile(String(d.turnstileToken ?? ''), env.TURNSTILE_SECRET_KEY, request.headers.get('cf-connecting-ip'));
  } catch (err) {
    console.error(`[${cfg.tag}] Turnstile kunde inte nås`, err);
    return json(502, { ok: false, error: 'verify_unavailable' });
  }
  if (!human) return json(403, { ok: false, error: 'turnstile_failed' });

  const mail = cfg.mail(d);
  const { text, html } = renderMail(mail.rows);

  if (!env.RESEND_API_KEY) {
    // Lokal utveckling utan nyckel: logga i stället för att skicka.
    console.log(`[${cfg.tag}] RESEND_API_KEY saknas – mejlet skickades inte:\n${mail.subject}\n${text}`);
    return json(200, { ok: true, dev: true });
  }

  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        reply_to: mail.replyTo,
        subject: mail.subject,
        text,
        html,
      }),
    });
  } catch (err) {
    console.error(`[${cfg.tag}] Resend kunde inte nås`, err);
    return json(502, { ok: false, error: 'send_failed' });
  }
  if (!res.ok) {
    console.error(`[${cfg.tag}] Resend svarade`, res.status, await res.text());
    return json(502, { ok: false, error: 'send_failed' });
  }
  return json(200, { ok: true });
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    // Samla all trafik på huvuddomänen.
    if (url.hostname === 'www.edvinlindholm.se') {
      url.hostname = 'edvinlindholm.se';
      return Response.redirect(url.toString(), 301);
    }
    // Tjänsten är borttagen; skicka gamla länkar till startsidan.
    if (url.pathname.startsWith('/ai-och-automation')) return Response.redirect(`${url.origin}/`, 301);
    if (url.pathname === '/api/kontakt') return handleForm(request, env, CONTACT);
    if (url.pathname === '/api/omdome') return handleForm(request, env, REVIEW);
    if (url.pathname.startsWith('/api/')) return json(404, { ok: false, error: 'not_found' });
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
