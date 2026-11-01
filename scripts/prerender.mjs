// Förrenderar varje sida till statisk HTML efter `vite build`, så att sökmotorer
// och besökare får färdigt innehåll direkt. React hydrerar sedan sidan i webbläsaren.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');
const SITE_URL = 'https://edvinlindholm.se';

const template = await readFile(join(dist, 'index.html'), 'utf8');
const { render, ROUTES, NOT_FOUND } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);

async function write(file, route) {
  const { html, head } = render(route);
  const page = template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page);
}

for (const route of ROUTES) {
  await write(join(dist, route.path, 'index.html'), route);
  console.log('  förrenderad', route.path);
}
await write(join(dist, '404.html'), NOT_FOUND);
console.log('  förrenderad /404.html');

const today = new Date().toISOString().slice(0, 10);
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  ROUTES.filter((r) => r.inSitemap !== false)
    .map((r) => `  <url><loc>${SITE_URL}${r.path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n') +
  '\n</urlset>\n';
await writeFile(join(dist, 'sitemap.xml'), sitemap);
console.log('  skrev sitemap.xml');

await rm(ssrDir, { recursive: true, force: true });
