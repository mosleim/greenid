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
    build: {
      rollupOptions: {
        external: [
          '@node-rs/argon2-wasm32-wasi',
          '@node-rs/argon2-android-arm-eabi',
          '@node-rs/argon2-android-arm64',
          '@node-rs/argon2-darwin-arm64',
          '@node-rs/argon2-darwin-x64',
          '@node-rs/argon2-freebsd-x64',
          '@node-rs/argon2-linux-arm-gnueabihf',
          '@node-rs/argon2-linux-arm64-gnu',
          '@node-rs/argon2-linux-arm64-musl',
          '@node-rs/argon2-linux-x64-gnu',
          '@node-rs/argon2-linux-x64-musl',
          '@node-rs/argon2-win32-arm64-msvc',
          '@node-rs/argon2-win32-ia32-msvc',
          '@node-rs/argon2-win32-x64-msvc',
        ],
      },
    },
  }
});
