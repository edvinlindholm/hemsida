import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
  return new Promise((resolve, reject) => {
    const s = existing ?? document.createElement('script');
    s.addEventListener('load', () => resolve());
    s.addEventListener('error', () => reject(new Error('turnstile')));
    if (!existing) {
      s.src = TURNSTILE_SRC;
      s.async = true;
      document.head.appendChild(s);
    }
  });
}

/**
 * Visar Cloudflare Turnstile (spamskydd) i elementet `ref` när `active` är sant.
 * Returnerar token att skicka med formuläret och en funktion för att göra om kontrollen.
 */
export function useTurnstile(active: boolean, onLoadError: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useRef<string | undefined>(undefined);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile || id.current) return;
        id.current = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          language: 'sv',
          callback: (t: string) => setToken(t),
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        });
      })
      .catch(onLoadError);
    return () => {
      cancelled = true;
      if (id.current && window.turnstile) window.turnstile.remove(id.current);
      id.current = undefined;
      setToken('');
    };
    // onLoadError ska inte starta om widgeten.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const reset = () => {
    if (id.current) window.turnstile?.reset(id.current);
    setToken('');
  };

  return { ref, token, reset };
}
