import { CtaBand, Faq } from '../components/Layout';

export interface ServiceContent {
  h1: string;
  lede: string;
  offers: { h: string; p: string }[];
  examples: string[];
  fits: string[];
  faq: { q: string; a: string }[];
}

export function Service({ c }: { c: ServiceContent }) {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Brödsmulor"><a href="/">Start</a><span aria-hidden="true">/</span><span>{c.h1}</span></nav>
          <h1>{c.h1}</h1>
          <p className="lede">{c.lede}</p>
          <a className="btn btn-large" href="/kontakt/">Jag är intresserad</a>
        </div>
      </section>

      <section className="section" aria-labelledby="erbjud-rubrik">
        <div className="wrap">
          <h2 id="erbjud-rubrik">Det här kan jag hjälpa till med</h2>
          <div className="offers">
            {c.offers.map((o) => (
              <div key={o.h} className="offer">
                <h3>{o.h}</h3>
                <p>{o.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap two-col">
          <div>
            <h2>Exempel på uppdrag</h2>
            <ul className="checklist">{c.examples.map((e) => <li key={e}>{e}</li>)}</ul>
          </div>
          <div>
            <h2>Passar dig som</h2>
            <ul className="checklist">{c.fits.map((e) => <li key={e}>{e}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-rubrik">
        <div className="wrap narrow">
          <h2 id="faq-rubrik">Vanliga frågor</h2>
          <Faq items={c.faq} />
        </div>
      </section>

      <CtaBand title="Vill du veta vad det skulle kosta?" text="Svara på några frågor, så skickar jag en offert med fast pris inom två arbetsdagar." />
    </>
  );
}

const COMMON_FAQ = [
  {
    q: 'Vad kostar det?',
    a: 'Varje uppdrag får ett fast pris i offerten, baserat på vad du behöver. Du vet alltså exakt vad det kostar innan jag börjar, och det kostar inget att be om en offert.',
  },
  {
    q: 'Hur fakturerar du?',
    a: 'Jag fakturerar via Coolcompany. Du får en vanlig faktura med moms när arbetet är levererat.',
  },
  {
    q: 'Jobbar du på distans?',
    a: 'Ja. De flesta uppdrag går att göra helt på distans. Bor du i nordvästra Skåne kan vi också ses.',
  },
];

export const EXCEL: ServiceContent = {
  h1: 'Excelkonsult för företag, föreningar och privatpersoner',
  lede: 'Jag bygger nya Excel-verktyg och städar upp kalkylark som har vuxit sig för stora. Resultatet är ark som räknar rätt, är lätta att fylla i och visar det du behöver se.',
  offers: [
    { h: 'Nya verktyg från grunden', p: 'Budget, uppföljning, offertmallar, tidrapporter, lager och register byggda för just ditt sätt att jobba.' },
    { h: 'Förbättra befintliga ark', p: 'Jag rensar, rättar formler, lägger till kontroller som stoppar felinmatning och gör arket tydligare.' },
    { h: 'Automatiska sammanställningar', p: 'Rapporter och översikter som uppdateras av sig själva i stället för att klistras ihop varje månad.' },
    { h: 'Översikter och diagram', p: 'En flik som visar läget på några sekunder: försäljning mot mål, budget mot utfall eller närvaro över säsongen.' },
    { h: 'Mallar som alla kan använda', p: 'Tydliga inmatningsfält och instruktioner så att kollegor och styrelsemedlemmar kan använda arket utan att något går sönder.' },
    { h: 'Excel eller Google Kalkylark', p: 'Jag bygger i det verktyg du redan har, och kan flytta ett ark mellan dem om du vill byta.' },
  ],
  examples: [
    'Säljuppföljning med veckomål och provisionsberäkning',
    'Statistik och topplista för ett idrottslag',
    'Budget och utfall för en förening',
    'Planeringsverktyg för innehåll, försäljning och lager',
    'Habit tracker och privat budget',
  ],
  fits: [
    'Har ett kalkylark som ingen längre förstår',
    'Gör samma sammanställning för hand varje vecka eller månad',
    'Vill ha bättre koll men saknar tid att bygga själv',
    'Driver en förening och vill göra det lättare för nästa styrelse',
  ],
  faq: [
    { q: 'Kan du ändra i ett ark jag redan har?', a: 'Ja. Skicka med en kopia när du får offerten, så tittar jag på vad som behöver göras. Originalet rör jag inte förrän du har godkänt.' },
    ...COMMON_FAQ,
  ],
};

export const DIGITAL: ServiceContent = {
  h1: 'Digitalisering av manuella rutiner',
  lede: 'Pappersblanketter, mejltrådar och listor som förs för hand tar tid och blir fel. Jag hittar var tiden försvinner och föreslår det enklaste som fungerar.',
  offers: [
    { h: 'Formulär och anmälningar', p: 'Digitala formulär där svaren hamnar direkt i ett kalkylark, i stället för mejl och papperslappar.' },
    { h: 'Delade listor och kalendrar', p: 'Schema, bokningar och ansvarslistor som alla ser och som alltid är uppdaterade.' },
    { h: 'Google Workspace och Microsoft 365', p: 'Jag sätter upp e-post på egen domän, delade mappar och behörigheter så att rätt person ser rätt sak.' },
    { h: 'Rutiner för föreningen', p: 'Medlemslistor, avgifter, materialbeställningar och påminnelser som sköter sig mer av sig själva.' },
    { h: 'Från papper till digitalt', p: 'Jag går igenom hur ni jobbar idag och föreslår vad som är värt att digitalisera först.' },
    { h: 'Dokumentation', p: 'Du får en kort beskrivning av hur allt hänger ihop, så att det fungerar även när någon ny tar över.' },
  ],
  examples: [
    'Anmälningsformulär för träningar och arrangemang',
    'Gemensam beställning av utrustning till ett lag',
    'Mejl på egen domän med delad kalender',
    'Digital närvaro- och medlemslista',
  ],
  fits: [
    'Lägger mycket tid på administration',
    'Har information utspridd i mejl, papper och olika filer',
    'Vill att det ska vara lätt för nästa person att ta över',
  ],
  faq: [
    { q: 'Måste jag byta system?', a: 'Nästan aldrig. Jag utgår från det du redan använder och bygger vidare på det.' },
    ...COMMON_FAQ,
  ],
};

