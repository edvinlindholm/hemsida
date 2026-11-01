// Delad validering för omdömesformuläret (/omdome), används i webbläsaren och i Workern.

export const REVIEW_CUSTOMER_TYPES = ['Företag', 'Förening', 'Privatperson'] as const;

export interface ReviewRequest {
  name: string;
  /** Hur kunden vill presenteras, t.ex. "Ekonomiansvarig på ett byggföretag". Valfritt. */
  title: string;
  customerType: string;
  rating: number;
  text: string;
  email: string;
  publishConsent: boolean;
  website: string;
  startedAt: number;
  turnstileToken: string;
}

export const REVIEW_LIMITS = { name: 80, title: 120, text: 1500, email: 200 } as const;

export type ReviewErrors = Partial<Record<keyof ReviewRequest, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateReview(d: Partial<ReviewRequest>): ReviewErrors {
  const e: ReviewErrors = {};
  const name = typeof d.name === 'string' ? d.name.trim() : '';
  if (!name) e.name = 'Fyll i ditt namn.';
  else if (name.length > REVIEW_LIMITS.name) e.name = 'Namnet är för långt.';
  if (typeof d.title !== 'string' || d.title.trim().length > REVIEW_LIMITS.title) e.title = 'Texten är för lång.';
  if (typeof d.customerType !== 'string' || !(REVIEW_CUSTOMER_TYPES as readonly string[]).includes(d.customerType))
    e.customerType = 'Välj ett alternativ.';
  if (typeof d.rating !== 'number' || !Number.isInteger(d.rating) || d.rating < 1 || d.rating > 5) e.rating = 'Välj ett betyg.';
  const text = typeof d.text === 'string' ? d.text.trim() : '';
  if (text.length < 10) e.text = 'Skriv några ord om hur det gick.';
  else if (text.length > REVIEW_LIMITS.text) e.text = `Omdömet får vara högst ${REVIEW_LIMITS.text} tecken.`;
  const email = typeof d.email === 'string' ? d.email.trim() : '';
  if (!email || email.length > REVIEW_LIMITS.email || !EMAIL_RE.test(email))
    e.email = 'Fyll i en mejladress som ser ut som namn@exempel.se.';
  if (d.publishConsent !== true) e.publishConsent = 'Du behöver godkänna att omdömet får visas på hemsidan.';
  return e;
}
