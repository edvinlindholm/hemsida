import type { ReactNode } from 'react';
import { NAV, SITE } from '../site';

function Logo() {
  return (
    <a className="logo" href="/" aria-label="Edvin Lindholm, till startsidan">
      <span className="logo-mark" aria-hidden="true" />
      Edvin Lindholm
    </a>
  );
}

export function Header({ path }: { path: string }) {
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Logo />
        <nav aria-label="Huvudmeny" className="nav-desktop">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} aria-current={path === n.href ? 'page' : undefined}>
              {n.label}
            </a>
          ))}
          <a className="btn btn-small" href="/kontakt/">
            Jag är intresserad
          </a>
        </nav>
        <details className="nav-mobile">
          <summary aria-label="Öppna menyn">Meny</summary>
          <nav aria-label="Mobilmeny">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} aria-current={path === n.href ? 'page' : undefined}>
                {n.label}
              </a>
            ))}
            <a className="btn" href="/kontakt/">
              Jag är intresserad
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Logo />
          <p className="muted-on-dark">
            Excel och digitalisering för företag, föreningar och privatpersoner. Baserad i {SITE.city}, {SITE.region}.
          </p>
        </div>
        <div>
          <h2 className="footer-h">Tjänster</h2>
          <ul>
            <li><a href="/excel/">Excel och kalkylark</a></li>
            <li><a href="/digitalisering/">Digitalisering</a></li>
          </ul>
        </div>
        <div>
          <h2 className="footer-h">Kontakt</h2>
          <ul>
            <li><a href="/kontakt/">Begär en offert</a></li>
            <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li><a href="/integritet/">Integritetspolicy</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <span>Fakturering sker via Coolcompany</span>
      </div>
    </footer>
  );
}

export function Layout({ path, children }: { path: string; children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#innehall">Hoppa till innehållet</a>
      <Header path={path} />
      <main id="innehall">{children}</main>
      <Footer />
    </>
  );
}

export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <section className="cta-band" aria-labelledby="cta-rubrik">
      <div className="wrap cta-inner">
        <div>
          <h2 id="cta-rubrik">{title}</h2>
          <p>{text}</p>
        </div>
        <a className="btn btn-large" href="/kontakt/">Jag är intresserad</a>
      </div>
    </section>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((it) => (
        <details key={it.q}>
          <summary>{it.q}</summary>
          <p>{it.a}</p>
        </details>
      ))}
    </div>
  );
}
