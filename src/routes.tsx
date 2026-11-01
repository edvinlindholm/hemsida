import type { ReactNode } from 'react';
import type { PageMeta } from './site';
import { Home } from './pages/Home';
import { Service, EXCEL, DIGITAL } from './pages/Service';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { NotFound } from './pages/NotFound';
import { Review } from './pages/Review';

export interface Route extends PageMeta {
  render: () => ReactNode;
}

export const ROUTES: Route[] = [
  {
    path: '/',
    title: 'Edvin Lindholm – Excelkonsult och digitalisering på distans',
    description: 'Jag bygger Excel-verktyg och digitaliserar manuella rutiner som tar onödig tid. För företag, föreningar och privatpersoner. Fast pris i offerten.',
    render: () => <Home />,
  },
  {
    path: '/excel/',
    title: 'Excelkonsult – nya verktyg och hjälp med kalkylark | Edvin Lindholm',
    description: 'Excelkonsult för företag, föreningar och privatpersoner. Budget, uppföljning, rapporter och mallar som räknar rätt. Fast pris i offerten.',
    render: () => <Service c={EXCEL} />,
  },
  {
    path: '/digitalisering/',
    title: 'Digitalisering av manuella rutiner | Edvin Lindholm',
    description: 'Från papper och mejltrådar till digitala formulär, delade listor och smarta flöden. För småföretag och föreningar, på distans i hela Sverige.',
    render: () => <Service c={DIGITAL} />,
  },
  {
    path: '/om-mig/',
    title: 'Om mig | Edvin Lindholm',
    description: 'Edvin Lindholm har en IT-utbildning, bakgrund som IT-tekniker och e-sportspelare, och bygger Excel-verktyg och digitala lösningar som gör vardagen enklare.',
    render: () => <About />,
  },
  {
    path: '/kontakt/',
    title: 'Begär en offert | Edvin Lindholm',
    description: 'Svara på några korta frågor om vad du behöver, så får du en offert med fast pris inom två arbetsdagar.',
    render: () => <Contact />,
  },
  {
    path: '/omdome/',
    title: 'Lämna ett omdöme | Edvin Lindholm',
    description: 'Lämna ett omdöme om ett uppdrag.',
    inSitemap: false,
    noindex: true,
    render: () => <Review />,
  },
  {
    path: '/integritet/',
    title: 'Integritetspolicy | Edvin Lindholm',
    description: 'Så hanteras uppgifterna du skickar via formuläret på edvinlindholm.se.',
    render: () => <Privacy />,
  },
];

export const NOT_FOUND: Route = {
  path: '/404',
  title: 'Sidan finns inte | Edvin Lindholm',
  description: 'Sidan du letar efter finns inte.',
  inSitemap: false,
  render: () => <NotFound />,
};

export function findRoute(pathname: string): Route {
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return ROUTES.find((r) => r.path === p) ?? NOT_FOUND;
}
