import { ReviewForm } from '../components/ReviewForm';

export function Review() {
  return (
    <section className="page-hero">
      <div className="wrap contact-grid">
        <div>
          <h1>Lämna ett omdöme</h1>
          <p className="lede">
            Tack för att jag fick hjälpa dig. Ett par rader om hur det gick hjälper andra att våga höra av sig, och mig att
            bli bättre.
          </p>
          <p className="muted">Det tar ungefär en minut. Jag läser igenom alla omdömen innan de visas på hemsidan.</p>
        </div>
        <ReviewForm />
      </div>
    </section>
  );
}
