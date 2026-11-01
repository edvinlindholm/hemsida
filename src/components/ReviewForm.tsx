import { useRef, useState, type FormEvent } from 'react';
import { REVIEW_CUSTOMER_TYPES, REVIEW_LIMITS, validateReview, type ReviewErrors, type ReviewRequest } from '../../shared/review';
import { SITE } from '../site';
import { useTurnstile } from './turnstile';

type Status = 'idle' | 'sending' | 'done';

const EMPTY: Omit<ReviewRequest, 'startedAt' | 'turnstileToken'> = {
  name: '', title: '', customerType: '', rating: 0, text: '', email: '', publishConsent: false, website: '',
};

function Err({ id, msg }: { id: string; msg?: string }) {
  return <p id={id} className="field-error" role={msg ? 'alert' : undefined}>{msg ?? ''}</p>;
}

export function ReviewForm() {
  const [d, setD] = useState(EMPTY);
  const [errors, setErrors] = useState<ReviewErrors>({});
  const [formError, setFormError] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const startedAt = useRef(Date.now());
  const ts = useTurnstile(status !== 'done', () =>
    setFormError(`Spamskyddet kunde inte laddas. Ladda om sidan, eller mejla ${SITE.email}.`),
  );

  const set = <K extends keyof typeof d>(k: K, v: (typeof d)[K]) => {
    setD((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    setFormError('');
    const e = validateReview(d);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (!ts.token) { setFormError('Vänta tills spamkontrollen nedan är klar och försök igen.'); return; }

    setStatus('sending');
    try {
      const res = await fetch('/api/omdome', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...d, startedAt: startedAt.current, turnstileToken: ts.token }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: ReviewErrors };
      if (res.ok && body.ok) { setStatus('done'); return; }
      setStatus('idle');
      if (body.error === 'validation' && body.fields) setErrors(body.fields);
      else if (body.error === 'turnstile_failed') setFormError('Spamkontrollen gick inte igenom. Gör om kontrollen och skicka igen.');
      else setFormError(`Omdömet kunde inte skickas just nu. Försök igen om en stund, eller mejla ${SITE.email}.`);
      ts.reset();
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
        <h2>Tack för ditt omdöme!</h2>
        <p>Det betyder mycket. Jag går igenom det innan det läggs upp på hemsidan.</p>
        <a className="btn" href="/">Till startsidan</a>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <div className="hp" aria-hidden="true">
        <label>Webbplats<input tabIndex={-1} autoComplete="off" value={d.website} onChange={(e) => set('website', e.target.value)} /></label>
      </div>

      <fieldset className="rating" aria-describedby="err-rating">
        <legend>Hur nöjd är du?</legend>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={n <= d.rating ? 'on' : ''}>
              <input type="radio" name="rating" value={n} checked={d.rating === n} onChange={() => set('rating', n)} />
              <span aria-hidden="true">★</span>
              <span className="sr-only">{n} av 5</span>
            </label>
          ))}
        </div>
        <Err id="err-rating" msg={errors.rating} />
      </fieldset>

      <label className="fld">
        <span>Ditt omdöme</span>
        <textarea
          value={d.text}
          maxLength={REVIEW_LIMITS.text}
          aria-invalid={!!errors.text}
          aria-describedby="err-text"
          placeholder="Vad hjälpte jag dig med, och hur blev resultatet?"
          onChange={(e) => set('text', e.target.value)}
        />
      </label>
      <Err id="err-text" msg={errors.text} />

      <div className="row2">
        <label className="fld">
          <span>Namn <em>(som det ska visas)</em></span>
          <input value={d.name} maxLength={REVIEW_LIMITS.name} placeholder="T.ex. Anna S." autoComplete="name" aria-invalid={!!errors.name} aria-describedby="err-rname" onChange={(e) => set('name', e.target.value)} />
          <Err id="err-rname" msg={errors.name} />
        </label>
        <label className="fld">
          <span>Jag är</span>
          <select value={d.customerType} aria-invalid={!!errors.customerType} aria-describedby="err-rtype" onChange={(e) => set('customerType', e.target.value)}>
            <option value="" disabled>Välj</option>
            {REVIEW_CUSTOMER_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <Err id="err-rtype" msg={errors.customerType} />
        </label>
      </div>
      <label className="fld">
        <span>Roll eller organisation <em>(valfritt, visas under ditt namn)</em></span>
        <input value={d.title} maxLength={REVIEW_LIMITS.title} placeholder="T.ex. Kassör i en idrottsförening" onChange={(e) => set('title', e.target.value)} />
      </label>
      <label className="fld">
        <span>Mejl <em>(visas inte, bara om jag behöver fråga något)</em></span>
        <input type="email" value={d.email} maxLength={REVIEW_LIMITS.email} autoComplete="email" aria-invalid={!!errors.email} aria-describedby="err-remail" onChange={(e) => set('email', e.target.value)} />
        <Err id="err-remail" msg={errors.email} />
      </label>

      <label className="consent">
        <input type="checkbox" checked={d.publishConsent} aria-describedby="err-consent" onChange={(e) => set('publishConsent', e.target.checked)} />
        <span>Jag godkänner att omdömet, namnet och det jag skrivit om roll eller organisation visas på edvinlindholm.se. Jag kan när som helst be om att det tas bort.</span>
      </label>
      <Err id="err-consent" msg={errors.publishConsent} />

      <div className="turnstile" ref={ts.ref} />
      {formError && <p className="form-error" role="alert">{formError}</p>}

      <div className="form-foot">
        <span />
        <button type="submit" className="btn" disabled={status === 'sending'}>
          {status === 'sending' ? 'Skickar…' : 'Skicka omdöme'}
        </button>
      </div>
    </form>
  );
}
