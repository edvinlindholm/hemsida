import { CtaBand } from '../components/Layout';

export function About() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap narrow">
          <h1>Om mig</h1>
          <p className="lede">
            Jag heter Edvin Lindholm och bor i Örkelljunga i Skåne. Jag hjälper företag, föreningar och privatpersoner
            att lägga mindre tid på det som går att automatisera.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap narrow prose">
          <p>
            Många av verktygen jag bygger åt andra har jag först behövt själv. Som tränare och styrelseledamot i
            Örkelljunga IF har jag byggt statistik och planering för laget, och som grundare av klädmärket CAVI har jag
            byggt verktyg för försäljning, innehåll och lager.
          </p>
          <p>
            Jag gillar att förstå hur någon faktiskt jobbar innan jag föreslår en lösning. Oftast är det enklaste
            alternativet det bästa: ett bättre kalkylark, ett formulär eller en automatisk påminnelse, snarare än ett
            nytt dyrt system.
          </p>
          <h2>Så jobbar jag</h2>
          <ul className="checklist">
            <li>Fast pris i offerten, så att du vet vad det kostar innan jag börjar.</li>
            <li>Du ser utkast under arbetet och kan säga till om ändringar.</li>
            <li>Allt du får är ditt. Inga licenser eller låsningar till mig.</li>
            <li>Jag visar hur det fungerar, så att du klarar dig själv efteråt.</li>
          </ul>
          <dl className="facts">
            <div><dt>Område</dt><dd>Hela Sverige, på distans</dd></div>
            <div><dt>Kunder</dt><dd>Företag, föreningar och privatpersoner</dd></div>
            <div><dt>Fakturering</dt><dd>Via Coolcompany, med moms</dd></div>
          </dl>
        </div>
      </section>
      <CtaBand title="Har du något du vill få löst?" text="Berätta vad du behöver, så får du en offert med fast pris." />
    </>
  );
}
