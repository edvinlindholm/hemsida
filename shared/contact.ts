// Delad validering för kontaktformuläret. Används både i webbläsaren och i Workern,
// så att samma regler gäller på båda ställena.

export const CUSTOMER_TYPES = ['Företag', 'Förening', 'Privatperson'] as const;
export const NEEDS = ['Excel och kalkylark', 'Digitalisering', 'Vet inte riktigt'] as const;
export const PRIVATE_NEEDS = ['Habit tracker', 'Budget och ekonomi', 'Träningslogg', 'Planering och att göra-listor', 'Något annat'] as const;

/** Vilka behov som går att välja beror på vem kunden är. */
export function needsFor(customerType: string | undefined): readonly string[] {
  return customerType === 'Privatperson' ? PRIVATE_NEEDS : NEEDS;
}
export const TIME_SPENT = ['Vet inte', 'Mindre än 1 timme i veckan', '1–5 timmar i veckan', 'Mer än 5 timmar i veckan'] as const;
export const TIMELINES = ['Ingen brådska', 'Så snart som möjligt', 'Inom en månad', 'Inom några månader'] as const;
export const TOOLS = ['Vet inte / inget särskilt', 'Microsoft (Excel, Outlook, Teams)', 'Google (Kalkylark, Gmail, Drive)', 'Både och', 'Annat'] as const;

export interface ContactRequest {
  customerType: string;
  needs: string[];
  description: string;
  timeSpent: string;
  timeline: string;
  tools: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  city: string;
  consent: boolean;
  /** Honeypot – ska alltid vara tomt. */
  website: string;
  /** Tidpunkt (ms) när formuläret öppnades, för att stoppa robotar som fyller i direkt. */
  startedAt: number;
  turnstileToken: string;
}

export const LIMITS = { description: 3000, name: 100, email: 200, phone: 40, organization: 150, city: 80 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type FieldErrors = Partial<Record<keyof ContactRequest, string>>;

function oneOf(list: readonly string[], v: unknown): v is string {
  return typeof v === 'string' && list.includes(v);
}
function text(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length <= max ? t : null;
}

/** Validerar ett steg eller hela formuläret. Returnerar fel per fält (tomt objekt = giltigt). */
export function validateStep(step: 1 | 2 | 3 | 4, d: Partial<ContactRequest>): FieldErrors {
  const e: FieldErrors = {};
  if (step === 1 && !oneOf(CUSTOMER_TYPES, d.customerType)) e.customerType = 'Välj ett alternativ för att gå vidare.';
  if (step === 2 && (!Array.isArray(d.needs) || d.needs.length === 0 || !d.needs.every((n) => oneOf(needsFor(d.customerType), n))))
    e.needs = 'Välj minst ett alternativ.';
  if (step === 3) {
    const desc = text(d.description, LIMITS.description);
    if (desc === null) e.description = `Beskrivningen får vara högst ${LIMITS.description} tecken.`;
    else if (desc.length < 10) e.description = 'Skriv några ord om vad du vill lösa.';
    if (!oneOf(TIME_SPENT, d.timeSpent)) e.timeSpent = 'Välj ett alternativ.';
    if (!oneOf(TIMELINES, d.timeline)) e.timeline = 'Välj ett alternativ.';
    if (!oneOf(TOOLS, d.tools)) e.tools = 'Välj ett alternativ.';
  }
  if (step === 4) {
    const name = text(d.name, LIMITS.name);
    if (!name) e.name = 'Fyll i ditt namn.';
    const email = text(d.email, LIMITS.email);
    if (!email || !EMAIL_RE.test(email)) e.email = 'Fyll i en mejladress som ser ut som namn@exempel.se.';
    if (text(d.phone ?? '', LIMITS.phone) === null) e.phone = 'Telefonnumret är för långt.';
    if (text(d.organization ?? '', LIMITS.organization) === null) e.organization = 'Namnet är för långt.';
    if (text(d.city ?? '', LIMITS.city) === null) e.city = 'Orten är för lång.';
    if (d.consent !== true) e.consent = 'Du behöver godkänna att jag sparar uppgifterna för att kunna svara.';
  }
  return e;
}

export function validateAll(d: Partial<ContactRequest>): FieldErrors {
  return { ...validateStep(1, d), ...validateStep(2, d), ...validateStep(3, d), ...validateStep(4, d) };
}
