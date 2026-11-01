// Hur formulären skickas.
//
//  'web3forms' – webbläsaren skickar direkt till Web3Forms, som mejlar till hej@edvinlindholm.se.
//                Gratis, ingen server-setup. Spamskydd: dolt honeypot-fält + minsta ifyllnadstid.
//  'worker'    – skickas via Workern (/api/...) med Turnstile och Resend. Kräver nycklarna
//                TURNSTILE_SECRET_KEY och RESEND_API_KEY i Cloudflare samt site key i .env.production.
export const FORM_BACKEND: 'web3forms' | 'worker' = 'web3forms';

// Web3Forms-nyckeln är gjord för att ligga publikt i sidans kod.
const WEB3FORMS_KEY = '368a6667-a3a0-48a0-a30b-11ca3184c76c';
const MIN_FILL_MS = 4_000;

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: 'validation'; fields: Record<string, string> }
  | { ok: false; error: 'turnstile_failed' | 'network' | 'failed' };

interface Payload {
  website: string;
  startedAt: number;
  turnstileToken?: string;
}

/**
 * Skickar ett formulär. `mail` används bara för Web3Forms: ämnesrad, svarsadress och fälten som ska stå i mejlet.
 */
export async function submitForm(
  endpoint: '/api/kontakt' | '/api/omdome',
  data: Payload & Record<string, unknown>,
  mail: { subject: string; replyTo: string; rows: [string, string][] },
): Promise<SubmitResult> {
  try {
    if (FORM_BACKEND === 'worker') {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string> };
      if (res.ok && body.ok) return { ok: true };
      if (body.error === 'validation' && body.fields) return { ok: false, error: 'validation', fields: body.fields };
      if (body.error === 'turnstile_failed') return { ok: false, error: 'turnstile_failed' };
      return { ok: false, error: 'failed' };
    }

    // Robotar fyller i det dolda fältet eller skickar direkt. Låtsas att det gick bra.
    if (data.website !== '' || Date.now() - data.startedAt < MIN_FILL_MS) return { ok: true };

    const body: Record<string, unknown> = {
      access_key: WEB3FORMS_KEY,
      subject: mail.subject,
      from_name: 'edvinlindholm.se',
      email: mail.replyTo,
      botcheck: false,
    };
    for (const [k, v] of mail.rows) body[k] = v;

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean };
    return res.ok && json.success ? { ok: true } : { ok: false, error: 'failed' };
  } catch {
    return { ok: false, error: 'network' };
  }
}

export const oneLine = (s: string) => s.trim().replace(/[\r\n]+/g, ' ');
