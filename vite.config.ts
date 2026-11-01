import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Typsnittets CSS måste buntas även i förrenderingen.
  ssr: { noExternal: ['@fontsource/schibsted-grotesk'] },
  server: {
    // I lokal utveckling skickas formuläret till `wrangler dev` (se README).
    proxy: { '/api': 'http://127.0.0.1:8787' },
  },
});
