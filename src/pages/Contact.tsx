import { ContactForm } from '../components/ContactForm';
import { SITE } from '../site';

export function Contact() {
  return (
    <section className="page-hero">
      <div className="wrap contact-grid">
        <div>
          <h1>Berätta vad du behöver</h1>
          <p className="lede">Svara på några korta frågor, så skickar jag en offert med fast pris till din mejl. Det kostar inget och du binder dig inte till något.</p>
          <h2 className="small-h">Det här händer sedan</h2>
          <ol className="mini-steps">
            <li>Jag läser igenom dina svar.</li>
            <li>Inom två arbetsdagar får du en offert, eller några frågor om jag behöver veta mer.</li>
            <li>Säger du ja börjar jag bygga.</li>
          </ol>
          <p className="muted">Hellre mejla direkt? Skriv till <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
