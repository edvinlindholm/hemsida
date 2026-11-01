import { CtaBand } from '../components/Layout';
import { SITE } from '../site';

export function About() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap narrow">
          <h1>Om mig</h1>
          <p className="lede">
            Jag heter Edvin Lindholm och är utbildad inom dator- och kommunikationsteknik. Jag har jobbat med IT-support,
            digitalisering och effektivisering, och jag gillar att bygga system som gör vardagen enklare.
          </p>
          <a className="btn btn-ghost" href={SITE.linkedin} rel="noopener noreferrer" target="_blank">Se min profil på LinkedIn</a>
        </div>
      </section>
      <section className="section tight-top">
        <div className="wrap narrow prose">
          <p>
            Senast arbetade jag som produktions- och IT-tekniker inom industrin, där jag ansvarade för IT, digitalisering
            och projektledning i produktionen. Där drev jag kostnadsbesparande initiativ och tog fram tekniska lösningar
            som effektiviserade arbetet. Innan dess jobbade jag med IT-support och gick ett traineeprogram inom
            IT-support, systemadministration och drift.
          </p>
          <p>
            Innan IT-yrket var jag professionell e-sportspelare i Fortnite och spelade för lag som GODSENT och Luck
            Equation. Jag har också varit coach inom e-sport. Där lärde jag mig att analysera, hitta det som går att göra
            bättre och jobba strukturerat mot ett mål. Samma sätt att tänka använder jag i mina uppdrag.
          </p>
          <dl className="facts">
            <div><dt>Utbildning</dt><dd>El- och energiprogrammet, dator- och kommunikationsteknik</dd></div>
            <div><dt>Erfarenhet</dt><dd>Produktions- och IT-tekniker, IT-support, IT-trainee</dd></div>
            <div><dt>Bakgrund</dt><dd>Professionell e-sportspelare och coach</dd></div>
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
