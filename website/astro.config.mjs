// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [tailwind()],
  site: 'https://buyback.my.id',
  vite: {
    // Make env vars available in SSR/prerender context via process.env
    define: {
      'import.meta.env.TURSO_DATABASE_URL': JSON.stringify(process.env.TURSO_DATABASE_URL || ''),
      'import.meta.env.TURSO_AUTH_TOKEN': JSON.stringify(process.env.TURSO_AUTH_TOKEN || ''),
    },
  }
});
