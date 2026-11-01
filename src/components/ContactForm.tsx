import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  CUSTOMER_TYPES, LIMITS, needsFor, TIMELINES, TIME_SPENT, TOOLS,
  validateStep, type ContactRequest, type FieldErrors,
} from '../../shared/contact';
import { SITE } from '../site';
import { useTurnstile } from './turnstile';
import { FORM_BACKEND, oneLine, submitForm } from '../submit';

const CUSTOMER_HINTS: Record<string, string> = {
  Företag: 'Du driver eller jobbar på ett företag',
  Förening: 'Idrottsförening, bostadsrättsförening eller liknande',
  Privatperson: 'Något för dig själv eller hushållet',
};
const NEED_HINTS: Record<string, string> = {
  'Excel och kalkylark': 'Bygga nytt, fixa ett befintligt ark eller göra en mall',
  Digitalisering: 'Få bort papper, dubbelarbete och manuella rutiner',
  'Vet inte riktigt': 'Du har ett problem men inte en lösning, och det är helt okej',
  'Habit tracker': 'Följ dina vanor dag för dag och se hur det går över tid',
  'Budget och ekonomi': 'Koll på inkomster, utgifter, sparande eller lån',
  Träningslogg: 'Pass, vikter, löpning eller annat du vill följa upp',
  'Planering och att göra-listor': 'Veckoplanering, projekt eller hushållets listor',
  'Något annat': 'Beskriv vad du vill ha i nästa steg',
};

type Step = 1 | 2 | 3 | 4;
type Status = 'idle' | 'sending' | 'done';

const EMPTY: Omit<ContactRequest, 'startedAt' | 'turnstileToken'> = {
  customerType: '', needs: [], description: '',
  timeSpent: TIME_SPENT[0], timeline: TIMELINES[0], tools: TOOLS[0],
  name: '', email: '', phone: '', organization: '', city: '', consent: false, website: '',
};

function Err({ id, msg }: { id: string; msg?: string }) {
  return <p id={id} className="field-error" role={msg ? 'alert' : undefined}>{msg ?? ''}</p>;
}

export function ContactForm() {
  const [step, setStep] = useState<Step>(1);
  const [d, setD] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const startedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const ts = useTurnstile(FORM_BACKEND === 'worker' && step === 4 && status !== 'done', () =>
    setFormError('Spamskyddet kunde inte laddas. Ladda om sidan, eller mejla mig direkt.'),
  );
  const token = ts.token;

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    headingRef.current?.focus();
  }, [step, status]);


  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const isPrivate = d.customerType === 'Privatperson';

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
    if (FORM_BACKEND === 'worker' && !token) { setFormError('Vänta tills spamkontrollen nedan är klar och försök igen.'); return; }

    setStatus('sending');
    const r = await submitForm(
      '/api/kontakt',
      { ...d, startedAt: startedAt.current, turnstileToken: token },
      {
        subject: `Ny förfrågan: ${oneLine(d.name)}`,
        replyTo: d.email.trim(),
        rows: [
          ['Kundtyp', d.customerType],
          ['Behov', d.needs.join(', ')],
          ['Beskrivning', d.description.trim()],
          ...(isPrivate ? [] : [['Tid idag', d.timeSpent] as [string, string]]),
          ['Tidsplan', d.timeline],
          ['Verktyg', d.tools],
          ['Namn', d.name.trim()],
          ['Mejl', d.email.trim()],
          ['Telefon', d.phone.trim() || '–'],
          ...(isPrivate ? [] : [['Företag/förening', d.organization.trim() || '–'] as [string, string]]),
          ['Ort', d.city.trim() || '–'],
        ],
      },
    );
    if (r.ok) { setStatus('done'); return; }
    setStatus('idle');
    if (r.error === 'validation') {
      setErrors(r.fields);
      setFormError('Något i formuläret behöver rättas. Gå tillbaka och kontrollera de markerade fälten.');
    } else if (r.error === 'turnstile_failed') {
      setFormError('Spamkontrollen gick inte igenom. Gör om kontrollen och skicka igen.');
    } else if (r.error === 'network') {
      setFormError(`Ingen anslutning. Kontrollera internet och försök igen, eller mejla ${SITE.email}.`);
    } else {
      setFormError(`Förfrågan kunde inte skickas just nu. Försök igen om en stund, eller mejla ${SITE.email}.`);
    }
    ts.reset();
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
              <input type="radio" name="customerType" value={t} checked={d.customerType === t} onChange={() => { set('customerType', t); set('needs', d.needs.filter((n) => needsFor(t).includes(n))); }} />
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
          {needsFor(d.customerType).map((n) => (
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
              placeholder={isPrivate
                ? 'T.ex. Jag vill ha en enkel budget där jag ser vad pengarna går till varje månad och hur mycket jag sparar.'
                : 'T.ex. Vi för in alla anmälningar för hand i ett Excel-ark och skickar påminnelser manuellt. Vi vill att det sköter sig mer automatiskt.'}
              onChange={(e) => set('description', e.target.value)}
            />
          </label>
          <Err id="err-desc" msg={errors.description} />
          <div className="row2">
            {!isPrivate && (
              <label className="fld">
                <span>Tid det tar idag <em>(ungefär)</em></span>
                <select value={d.timeSpent} onChange={(e) => set('timeSpent', e.target.value)}>
                  {TIME_SPENT.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
            )}
            <label className="fld">
              <span>När ska det vara klart?</span>
              <select value={d.timeline} onChange={(e) => set('timeline', e.target.value)}>
                {TIMELINES.map((o) => <option key={o}>{o}</option>)}
              </select>
            </label>
          </div>
          <label className="fld">
            <span>{isPrivate ? 'Vad använder du idag?' : 'Vad använder ni idag?'}</span>
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
            {!isPrivate && (
              <label className="fld">
                <span>Företag eller förening <em>(valfritt)</em></span>
                <input value={d.organization} maxLength={LIMITS.organization} autoComplete="organization" onChange={(e) => set('organization', e.target.value)} />
              </label>
            )}
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
          {FORM_BACKEND === 'worker' && <div className="turnstile" ref={ts.ref} />}
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
