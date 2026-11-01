import type { ReactNode } from 'react';
import type { PageMeta } from './site';
import { Home } from './pages/Home';
import { Service, EXCEL, DIGITAL, AI } from './pages/Service';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { NotFound } from './pages/NotFound';

export interface Route extends PageMeta {
  render: () => ReactNode;
}

export const ROUTES: Route[] = [
  {
    path: '/',
    title: 'Edvin Lindholm – Excelkonsult, digitalisering och AI i Skåne',
    description: 'Jag bygger Excel-verktyg, digitaliserar manuella rutiner och hjälper dig komma igång med AI. För företag, föreningar och privatpersoner. Fast pris i offerten.',
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
    description: 'Från papper och mejltrådar till digitala formulär, delade listor och smarta flöden. För småföretag och föreningar i Skåne och på distans.',
    render: () => <Service c={DIGITAL} />,
  },
  {
    path: '/ai-och-automation/',
    title: 'AI och automation för småföretag och föreningar | Edvin Lindholm',
    description: 'Kom igång med AI på riktigt. Jag sätter upp AI-verktyg, kopplar dem till mejl och dokument och automatiserar återkommande uppgifter.',
    render: () => <Service c={AI} />,
  },
  {
    path: '/om-mig/',
    title: 'Om mig | Edvin Lindholm',
    description: 'Edvin Lindholm från Örkelljunga bygger Excel-verktyg och digitala lösningar för företag, föreningar och privatpersoner.',
    render: () => <About />,
  },
  {
    path: '/kontakt/',
    title: 'Begär en offert | Edvin Lindholm',
    description: 'Svara på några korta frågor om vad du behöver, så får du en offert med fast pris inom två arbetsdagar.',
    render: () => <Contact />,
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
