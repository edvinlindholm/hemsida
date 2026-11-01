import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { findRoute } from './routes';

const el = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App route={findRoute(window.location.pathname)} />
  </StrictMode>
);

// I produktion är sidan förrenderad och hydreras. I `npm run dev` finns ingen förrendering.
if (el.hasChildNodes()) hydrateRoot(el, app);
else createRoot(el).render(app);
