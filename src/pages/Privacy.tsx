import { SITE } from '../site';

export function Privacy() {
  return (
    <section className="page-hero">
      <div className="wrap narrow prose">
        <h1>Integritetspolicy</h1>
        <p className="lede">Så här hanterar jag uppgifterna du skickar via formuläret på {SITE.url.replace('https://', '')}.</p>

        <h2>Vem ansvarar för uppgifterna?</h2>
        <p>Edvin Lindholm är personuppgiftsansvarig. Du når mig på <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>

        <h2>Vilka uppgifter sparas?</h2>
        <p>Det du själv fyller i: namn, mejladress och, om du vill, telefonnummer, organisation och ort, samt det du skriver om ditt behov.</p>

        <h2>Omdömen</h2>
        <p>Lämnar du ett omdöme via sidan för omdömen visas bara det du har godkänt: omdömet, namnet du skrivit och eventuell roll eller organisation. Mejladressen visas aldrig. Mejla mig om du vill att ett omdöme ändras eller tas bort.</p>

        <h2>Varför?</h2>
        <p>För att kunna svara på din förfrågan och skicka en offert. Om vi sedan gör affärer används uppgifterna för att genomföra uppdraget och fakturera. Uppgifterna används inte för marknadsföring och säljs aldrig vidare.</p>

        <h2>Hur länge?</h2>
        <p>Förfrågningar som inte leder till ett uppdrag raderas senast tolv månader efter senaste kontakt. Uppgifter som behövs för bokföring sparas så länge lagen kräver.</p>

        <h2>Vilka tjänster används?</h2>
        <p>Sidan drivs av Cloudflare. Formulären skickas som mejl via tjänsten Web3Forms till min e-post hos Google Workspace. Fakturering sker via Coolcompany. Sidan använder inga cookies för spårning eller annonser.</p>

        <h2>Dina rättigheter</h2>
        <p>Du kan när som helst be att få se, rätta eller radera dina uppgifter genom att mejla mig. Är du missnöjd med hur dina uppgifter hanteras kan du kontakta Integritetsskyddsmyndigheten (IMY).</p>
      </div>
    </section>
  );
}
