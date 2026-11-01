import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  CUSTOMER_TYPES, LIMITS, NEEDS, TIMELINES, TIME_SPENT, TOOLS,
  validateStep, type ContactRequest, type FieldErrors,
} from '../../shared/contact';
import { SITE } from '../site';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

const CUSTOMER_HINTS: Record<string, string> = {
  Företag: 'Du driver eller jobbar på ett företag',
  Förening: 'Idrottsförening, bostadsrättsförening eller liknande',
  Privatperson: 'Något för dig själv eller hushållet',
};
const NEED_HINTS: Record<string, string> = {
  'Excel och kalkylark': 'Bygga nytt, fixa ett befintligt ark eller göra en mall',
  Digitalisering: 'Få bort papper, dubbelarbete och manuella rutiner',
  'Vet inte riktigt': 'Du har ett problem men inte en lösning, och det är helt okej',
};

type Step = 1 | 2 | 3 | 4;
type Status = 'idle' | 'sending' | 'done';

const EMPTY: Omit<ContactRequest, 'startedAt' | 'turnstileToken'> = {
  customerType: '', needs: [], description: '',
  timeSpent: TIME_SPENT[0], timeline: TIMELINES[0], tools: TOOLS[0],
  name: '', email: '', phone: '', organization: '', city: '', consent: false, website: '',
};

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
  return new Promise((resolve, reject) => {
    const s = existing ?? document.createElement('script');
    s.addEventListener('load', () => resolve());
    s.addEventListener('error', () => reject(new Error('turnstile')));
    if (!existing) {
      s.src = TURNSTILE_SRC;
      s.async = true;
      document.head.appendChild(s);
    }
  });
}

function Err({ id, msg }: { id: string; msg?: string }) {
  return <p id={id} className="field-error" role={msg ? 'alert' : undefined}>{msg ?? ''}</p>;
}

export function ContactForm() {
  const [step, setStep] = useState<Step>(1);
  const [d, setD] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [token, setToken] = useState('');
  const startedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tsBox = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | undefined>(undefined);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus();
  }, [step, status]);

  // Ladda Turnstile i sista steget.
  useEffect(() => {
    if (step !== 4 || status === 'done') return;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !tsBox.current || !window.turnstile || tsId.current) return;
        tsId.current = window.turnstile.render(tsBox.current, {
          sitekey: SITE_KEY,
          language: 'sv',
          callback: (t: string) => setToken(t),
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        });
      })
      .catch(() => setFormError('Spamskyddet kunde inte laddas. Ladda om sidan, eller mejla mig direkt.'));
    return () => {
      cancelled = true;
      if (tsId.current && window.turnstile) window.turnstile.remove(tsId.current);
      tsId.current = undefined;
      setToken('');
    };
  }, [step, status]);

  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const toggleNeed = (n: string) =>
    set('needs', d.needs.includes(n) ? d.needs.filter((x) => x !== n) : [...d.needs, n]);

  function next() {
    const e = validateStep(step, d);
    setErrors(e);
    if (Object.keys(e).length) return false;
    if (step < 4) setStep((step + 1) as Step);
    return true;
  }

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    setFormError('');
    if (step < 4) { next(); return; }
    if (!next()) return;
    if (!token) { setFormError('Vänta tills spamkontrollen nedan är klar och försök igen.'); return; }

    setStatus('sending');
    try {
      const res = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...d, startedAt: startedAt.current, turnstileToken: token }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: FieldErrors };
      if (res.ok && body.ok) { setStatus('done'); return; }

      setStatus('idle');
      if (body.error === 'validation' && body.fields) {
        setErrors(body.fields);
        setFormError('Något i formuläret behöver rättas. Gå tillbaka och kontrollera de markerade fälten.');
      } else if (body.error === 'turnstile_failed') {
        setFormError('Spamkontrollen gick inte igenom. Gör om kontrollen och skicka igen.');
      } else {
        setFormError(`Förfrågan kunde inte skickas just nu. Försök igen om en stund, eller mejla ${SITE.email}.`);
      }
      if (tsId.current) window.turnstile?.reset(tsId.current);
      setToken('');
    } catch {
      setStatus('idle');
      setFormError(`Ingen anslutning. Kontrollera internet och försök igen, eller mejla ${SITE.email}.`);
    }
  }

  if (status === 'done') {
    return (
      <div className="form-card done" aria-live="polite">
        <div className="done-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5l5 5L20 6.5" /></svg>
        </div>
        <h2 ref={headingRef} tabIndex={-1}>Tack, förfrågan är skickad</h2>
        <p>
          Jag går igenom dina svar och hör av mig till <strong>{d.email.trim()}</strong> inom två arbetsdagar.
        </p>
        <a className="btn" href="/">Till startsidan</a>
      </div>
    );
  }

  const titles: Record<Step, string> = {
    1: 'Vem är du?',
    2: 'Vad behöver du hjälp med?',
    3: 'Berätta lite mer',
    4: 'Vart ska offerten skickas?',
  };

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <div className="progress" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => <span key={n} className={n <= step ? 'on' : ''} />)}
      </div>
      <p className="step-count">Steg {step} av 4</p>
      <h2 ref={headingRef} tabIndex={-1}>{titles[step]}</h2>

      {/* Honeypot: dolt för människor, robotar fyller ofta i det. */}
      <div className="hp" aria-hidden="true">
        <label>Webbplats<input tabIndex={-1} autoComplete="off" value={d.website} onChange={(e) => set('website', e.target.value)} /></label>
      </div>

      {step === 1 && (
        <fieldset className="opts" aria-describedby="err-type">
          <legend className="sr-only">Vem är du?</legend>
          {CUSTOMER_TYPES.map((t) => (
            <label key={t} className="opt">
              <input type="radio" name="customerType" value={t} checked={d.customerType === t} onChange={() => set('customerType', t)} />
              <span className="box" />
              <span><b>{t}</b><small>{CUSTOMER_HINTS[t]}</small></span>
            </label>
          ))}
          <Err id="err-type" msg={errors.customerType} />
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="opts" aria-describedby="err-needs">
          <legend className="hint">Välj allt som passar.</legend>
          {NEEDS.map((n) => (
            <label key={n} className="opt">
              <input type="checkbox" checked={d.needs.includes(n)} onChange={() => toggleNeed(n)} />
              <span className="box" />
              <span><b>{n}</b><small>{NEED_HINTS[n]}</small></span>
            </label>
          ))}
          <Err id="err-needs" msg={errors.needs} />
        </fieldset>
      )}

      {step === 3 && (
        <div>
          <p className="hint">Ju mer du skriver, desto träffsäkrare blir offerten.</p>
          <label className="fld">
            <span>Vad vill du lösa?</span>
            <textarea
              value={d.description}
              maxLength={LIMITS.description}
              aria-invalid={!!errors.description}
              aria-describedby="err-desc"
              placeholder="T.ex. Vi för in alla anmälningar för hand i ett Excel-ark och skickar påminnelser manuellt. Vi vill att det sköter sig mer automatiskt."
              onChange={(e) => set('description', e.target.value)}
            />
          </label>
          <Err id="err-desc" msg={errors.description} />
          <div className="row2">
            <label className="fld">
              <span>Tid det tar idag <em>(ungefär)</em></span>
              <select value={d.timeSpent} onChange={(e) => set('timeSpent', e.target.value)}>
                {TIME_SPENT.map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
            <label className="fld">
              <span>När ska det vara klart?</span>
              <select value={d.timeline} onChange={(e) => set('timeline', e.target.value)}>
                {TIMELINES.map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
          </div>
          <label className="fld">
            <span>Vad använder ni idag?</span>
            <select value={d.tools} onChange={(e) => set('tools', e.target.value)}>
              {TOOLS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
        </div>
      )}

      {step === 4 && (
        <div>
          <div className="row2">
            <label className="fld">
              <span>Namn</span>
              <input value={d.name} maxLength={LIMITS.name} autoComplete="name" aria-invalid={!!errors.name} aria-describedby="err-name" onChange={(e) => set('name', e.target.value)} />
              <Err id="err-name" msg={errors.name} />
            </label>
            <label className="fld">
              <span>Mejl</span>
              <input type="email" value={d.email} maxLength={LIMITS.email} autoComplete="email" aria-invalid={!!errors.email} aria-describedby="err-email" onChange={(e) => set('email', e.target.value)} />
              <Err id="err-email" msg={errors.email} />
            </label>
            <label className="fld">
              <span>Telefon <em>(valfritt)</em></span>
              <input type="tel" value={d.phone} maxLength={LIMITS.phone} autoComplete="tel" onChange={(e) => set('phone', e.target.value)} />
            </label>
            <label className="fld">
              <span>Företag eller förening <em>(valfritt)</em></span>
              <input value={d.organization} maxLength={LIMITS.organization} autoComplete="organization" onChange={(e) => set('organization', e.target.value)} />
            </label>
          </div>
          <label className="fld">
            <span>Ort <em>(valfritt)</em></span>
            <input value={d.city} maxLength={LIMITS.city} autoComplete="address-level2" onChange={(e) => set('city', e.target.value)} />
          </label>
          <label className="consent">
            <input type="checkbox" checked={d.consent} aria-describedby="err-consent" onChange={(e) => set('consent', e.target.checked)} />
            <span>Jag godkänner att mina uppgifter sparas för att kunna få svar på förfrågan. Läs mer i <a href="/integritet/">integritetspolicyn</a>.</span>
          </label>
          <Err id="err-consent" msg={errors.consent} />
          <div className="turnstile" ref={tsBox} />
        </div>
      )}

      {formError && <p className="form-error" role="alert">{formError}</p>}

      <div className="form-foot">
        {step > 1 ? (
          <button type="button" className="btn btn-ghost" onClick={() => { setErrors({}); setFormError(''); setStep((step - 1) as Step); }}>
            Tillbaka
          </button>
        ) : <span />}
        <button type="submit" className="btn" disabled={status === 'sending'}>
          {step < 4 ? 'Nästa' : status === 'sending' ? 'Skickar…' : 'Skicka förfrågan'}
        </button>
      </div>
    </form>
  );
}
