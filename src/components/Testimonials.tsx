import { TESTIMONIALS } from '../data/testimonials';

/** Visar kundomdömen. Renderar ingenting förrän det finns minst ett publicerat omdöme. */
export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <section className="section section-alt" aria-labelledby="omdomen-rubrik">
      <div className="wrap">
        <h2 id="omdomen-rubrik">Det här säger mina kunder</h2>
        <div className="cards">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name + t.text.slice(0, 20)} className="card quote">
              <div className="quote-stars" aria-label={`${t.rating} av 5`}>
                {'★'.repeat(t.rating)}<span aria-hidden="true">{'★'.repeat(5 - t.rating)}</span>
              </div>
              <blockquote>{t.text}</blockquote>
              <figcaption>
                <b>{t.name}</b>
                {t.title && <span>{t.title}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
