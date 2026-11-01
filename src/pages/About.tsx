import { CtaBand } from '../components/Layout';
import { SITE } from '../site';

export function About() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap narrow">
          <h1>Om mig</h1>
          <p className="lede">
            Jag heter Edvin Lindholm. Jag har en utbildning inom IT, har jobbat som IT-tekniker och som produktions- och
            IT-tekniker, och jag gillar att bygga system som gör vardagen enklare.
          </p>
          <a className="btn btn-ghost" href={SITE.linkedin} rel="noopener noreferrer" target="_blank">Se min profil på LinkedIn</a>
        </div>
      </section>
      <section className="section tight-top">
        <div className="wrap narrow prose">
          <p>
            Innan IT-yrket tävlade jag i e-sport på professionell nivå. Där lärde jag mig att analysera, hitta det som går
            att göra bättre och jobba strukturerat mot ett mål. Samma sätt att tänka använder jag när jag tar mig an ett
            krångligt kalkylark eller en rutin som tar för lång tid.
          </p>
          <p>
            Jag har alltid byggt verktyg som underlättar, både på jobbet och vid sidan av: statistik för ett innebandylag,
            planering för ett klädmärke och trackers för vanor och ekonomi. Oftast är det enklaste alternativet det bästa,
            ett bättre kalkylark eller ett formulär snarare än ett nytt dyrt system.
          </p>
          <dl className="facts">
            <div><dt>Utbildning</dt><dd>IT</dd></div>
            <div><dt>Erfarenhet</dt><dd>IT-tekniker, produktions- och IT-tekniker</dd></div>
            <div><dt>Bakgrund</dt><dd>Professionell e-sportspelare</dd></div>
          </dl>
          <h2>Så jobbar jag</h2>
          <ul className="checklist">
            <li>Fast pris i offerten, så att du vet vad det kostar innan jag börjar.</li>
            <li>Du ser utkast under arbetet och kan säga till om ändringar.</li>
            <li>Allt du får är ditt. Inga licenser eller låsningar till mig.</li>
            <li>Jag visar hur det fungerar, så att du klarar dig själv efteråt.</li>
          </ul>
          <dl className="facts">
            <div><dt>Arbetssätt</dt><dd>På distans, hela Sverige</dd></div>
            <div><dt>Kunder</dt><dd>Företag, föreningar och privatpersoner</dd></div>
            <div><dt>Fakturering</dt><dd>Via Coolcompany, med moms</dd></div>
          </dl>
        </div>
      </section>
      <CtaBand title="Har du något du vill få löst?" text="Berätta vad du behöver, så får du en offert med fast pris." />
    </>
  );
}
