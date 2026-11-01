import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { ROUTES, NOT_FOUND, type Route } from './routes';
import { SITE } from './site';

export { ROUTES, NOT_FOUND };

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function head(route: Route): string {
  const url = SITE.url + (route === NOT_FOUND ? '/' : route.path);
  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="sv_SE" />`,
    `<meta property="og:site_name" content="${SITE.name}" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
  ];
  if (route === NOT_FOUND || route.noindex) tags.push('<meta name="robots" content="noindex" />');
  else tags.push(`<link rel="canonical" href="${url}" />`);
  if (route.path === '/') {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE.name,
      url: SITE.url,
      email: SITE.email,
      description: route.description,
      areaServed: 'Sverige',
      sameAs: [SITE.linkedin],
      knowsAbout: ['Microsoft Excel', 'Google Kalkylark', 'Digitalisering', 'Automatisering'],
    };
    tags.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
}

export function render(route: Route): { html: string; head: string } {
  const html = renderToString(
    <StrictMode>
      <App route={route} />
    </StrictMode>,
  );
  return { html, head: head(route) };
}
