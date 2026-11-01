export const SITE = {
  name: 'Edvin Lindholm',
  url: 'https://edvinlindholm.se',
  email: 'hej@edvinlindholm.se',
  linkedin: 'https://se.linkedin.com/in/edvin-lindholm-1001b41b7',
} as const;

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  /** Visas i sitemap. 404 tas inte med. */
  inSitemap?: boolean;
  /** Ska inte indexeras av sökmotorer. */
  noindex?: boolean;
}

export const NAV = [
  { href: '/excel/', label: 'Excel' },
  { href: '/digitalisering/', label: 'Digitalisering' },
  { href: '/om-mig/', label: 'Om mig' },
] as const;
