# edvinlindholm.se

Konsulthemsida för Edvin Lindholm: Excel, digitalisering och AI.

- **Frontend:** React 19 + TypeScript, byggd med Vite. Varje sida förrenderas till statisk HTML vid bygget (bra för SEO och snabb laddning) och hydreras sedan i webbläsaren.
- **Hosting:** Cloudflare Workers med statiska filer (Workers Static Assets). Cloudflare rekommenderar Workers framför Pages för nya projekt, och samma Worker kan både servera sidorna och ta emot kontaktformuläret.
- **Kontaktformulär:** `POST /api/kontakt` i Workern. Validerar indata, stoppar spam (Cloudflare Turnstile, dolt honeypot-fält, minsta ifyllnadstid, storleksgräns, ursprungskontroll) och skickar mejlet via Resend till `hej@edvinlindholm.se` med kundens adress som svarsadress. Inga mejl skickas från webbläsaren och inga nycklar finns i koden.

## Struktur

```
src/
  pages/            Sidorna (Start, tjänstesidor, Om mig, Kontakt, Integritet, 404)
  components/       Layout, kontaktformulär, kalkylarket i hero
  routes.tsx        Alla sidor med titel och beskrivning (för SEO)
  entry-client.tsx  Startar React i webbläsaren
  entry-server.tsx  Används vid bygget för att förrendera HTML
  styles/global.css
shared/contact.ts   Validering som används av både formuläret och Workern
worker/index.ts     Cloudflare Worker: API för formuläret + statiska filer
scripts/prerender.mjs  Skriver ut HTML per sida och sitemap.xml
wrangler.jsonc      Cloudflare-konfiguration
```

## Utveckling

Kräver Node 20 eller senare.

```bash
npm install
cp .dev.vars.example .dev.vars   # lokala, ofarliga testvärden
npm run preview                  # bygger och kör allt (sidor + formulär) på http://localhost:8787
```

`npm run dev` ger snabb omladdning av sidorna på http://localhost:5173. Kör då `npx wrangler dev` i en annan terminal om du vill testa formuläret.

Lokalt används Turnstiles testnycklar och mejlet loggas i terminalen i stället för att skickas (så länge `RESEND_API_KEY` är tom i `.dev.vars`).

## Ändra innehåll

- Texter på tjänstesidorna: `src/pages/Service.tsx`
- Startsidan: `src/pages/Home.tsx`
- Sidtitlar och beskrivningar för Google: `src/routes.tsx`
- Ny sida: skapa en komponent i `src/pages/`, lägg till den i `ROUTES` i `src/routes.tsx` och i menyn i `src/site.ts`.

Gör ändringen på en egen gren, pusha och öppna en pull request. Cloudflare bygger en förhandsversion med egen adress. När allt ser bra ut slår du ihop till `main`, och då publiceras ändringen på edvinlindholm.se.

## Publicering (Cloudflare)

Workern heter `hemsida` och är kopplad till det här repot via Workers Builds.

| Inställning | Värde |
|---|---|
| Produktionsgren | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Deploy för andra grenar | `npx wrangler versions upload` (ger en förhandsadress per gren) |

### Hemligheter (sätts i Cloudflare, aldrig i repot)

Under **Workers & Pages → hemsida → Settings → Variables and Secrets**, typ *Secret*:

- `TURNSTILE_SECRET_KEY`: från Cloudflare Turnstile
- `RESEND_API_KEY`: från Resend

Turnstiles *site key* är publik och ligger i `.env.production`.

### Domän och DNS

DNS för edvinlindholm.se ligger hos Cloudflare (namnservrarna pekar dit från Loopia, där domänen fortfarande är registrerad och förnyas).

- `edvinlindholm.se` och `www.edvinlindholm.se` är kopplade som *Custom Domains* på Workern. Cloudflare skapar DNS-posterna själv. `www` skickas vidare till huvuddomänen av Workern.
- Mejl (Google Workspace): MX `smtp.google.com`, TXT SPF `v=spf1 include:_spf.google.com ~all`, TXT `google._domainkey` (DKIM) och Googles verifierings-TXT. Rör inte dessa.
- Formulärmejl (Resend): domänen `mail.edvinlindholm.se` verifieras i Resend, som visar vilka DNS-poster som ska läggas till. De ligger på underdomänen och påverkar inte Google-mejlen.

### Kostnader

| Tjänst | Plan | Kostnad |
|---|---|---|
| Cloudflare Workers | Free: statiska filer obegränsat, 100 000 API-anrop per dag | 0 kr |
| Cloudflare Turnstile | Free | 0 kr |
| Resend | Free: 3 000 mejl per månad, 100 per dag | 0 kr |
| Domän | Loopia | Årsavgift |
