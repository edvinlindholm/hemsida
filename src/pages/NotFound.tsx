export function NotFound() {
  return (
    <section className="page-hero">
      <div className="wrap narrow">
        <h1>Sidan finns inte</h1>
        <p className="lede">Adressen kan vara felstavad, eller så har sidan flyttats.</p>
        <div className="btn-row">
          <a className="btn" href="/">Till startsidan</a>
          <a className="btn btn-ghost" href="/kontakt/">Begär en offert</a>
        </div>
      </div>
    </section>
  );
}
