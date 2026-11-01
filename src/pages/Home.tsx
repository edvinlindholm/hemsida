import { CtaBand } from '../components/Layout';
import { SheetDemo } from '../components/SheetDemo';

const SERVICES = [
  {
    href: '/excel/',
    title: 'Excel och kalkylark',
    more: 'Läs mer om Excel-tjänster',
    text: 'Nya verktyg eller uppstädning av det du redan har. Budget, uppföljning, rapporter och mallar som räknar rätt.',
  },
  {
    href: '/digitalisering/',
    title: 'Digitalisering',
    more: 'Läs mer om digitalisering',
    text: 'Papper, mejltrådar och dubbelarbete blir digitala rutiner. Formulär, delade listor och smarta flöden.',
  },
];

const PAINS = [
  'Samma siffror förs in på flera ställen.',
  'Kalkylarket har vuxit sig så stort att ingen vågar ändra i det.',
  'Anmälningar, listor och påminnelser sköts för hand.',
  'Varje månad tar rapporten en halv dag att sätta ihop.',
];

const STEPS = [
  { h: 'Berätta vad du behöver', p: 'Svara på några frågor i formuläret. Det tar ett par minuter.' },
  { h: 'Offert till din mejl', p: 'Inom två arbetsdagar får du ett förslag med fast pris. Kan jag inte hjälpa till meddelar jag dig, och ingen offert skickas.' },
  { h: 'Jag bygger', p: 'Du ser utkast under arbetet och säger till om ändringar.' },
  { h: 'Överlämning', p: 'Jag visar hur allt fungerar så att du klarar dig själv.' },
];

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Excel och digitalisering som sparar dig tid.</h1>
            <p className="lede">
              Jag hjälper småföretag, föreningar och privatpersoner att bygga smarta kalkylark, få bort manuellt
              dubbelarbete. Du får alltid ett fast pris innan jag börjar.
            </p>
            <div className="btn-row">
              <a className="btn btn-large" href="/kontakt/">Jag är intresserad</a>
              <a className="btn btn-large btn-ghost" href="#tjanster">Se tjänsterna</a>
            </div>
            <ul className="facts-inline">
              <li>Fast pris i offerten</li>
              <li>Svar inom två arbetsdagar</li>
              <li>Arbetet sker på distans</li>
            </ul>
          </div>
          <SheetDemo />
        </div>
      </section>

      <section id="tjanster" className="section" aria-labelledby="tj-rubrik">
        <div className="wrap">
          <h2 id="tj-rubrik">Det här kan jag hjälpa dig med</h2>
          <div className="cards cards-2">
            {SERVICES.map((s) => (
              <a key={s.href} className="card card-link" href={s.href}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="card-more">{s.more}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="kanner-rubrik">
        <div className="wrap split">
          <div>
            <h2 id="kanner-rubrik">Känner du igen dig?</h2>
            <p className="muted">
              Det mesta som tar tid i onödan går att lösa med verktyg du redan har. Ofta räcker ett bättre kalkylark
              eller ett formulär för att spara flera timmar i veckan.
            </p>
          </div>
          <ul className="checklist">
            {PAINS.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="steg-rubrik">
        <div className="wrap">
          <h2 id="steg-rubrik">Så går det till</h2>
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.h}>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="om-rubrik">
        <div className="wrap split">
          <h2 id="om-rubrik">Hej, jag heter Edvin</h2>
          <div>
            <p>
              Jag har en utbildning inom IT, har jobbat som IT-tekniker och gillar att bygga system som gör vardagen enklare.
              Det bästa jag vet är när något som tog en timme i veckan plötsligt tar två minuter.
            </p>
            <a className="text-link" href="/om-mig/">Mer om mig</a>
          </div>
        </div>
      </section>

      <CtaBand
        title="Vad vill du slippa göra för hand?"
        text="Berätta kort vad du behöver, så får du en offert med fast pris till din mejl."
      />
    </>
  );
}
