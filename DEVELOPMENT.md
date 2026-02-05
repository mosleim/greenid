# Pedoman Development - Buyback Indonesia Platform

## 🎯 Tech Stack yang Disepakati

### WAJIB DIGUNAKAN

| Layer | Technology | Deskripsi |
|-------|------------|-----------|
| **Frontend** | Astro 5.x | Static Site Generator dengan Islands Architecture |
| **Styling** | Tailwind CSS 3.x | Utility-first CSS framework |
| **Interactivity** | Alpine.js 3.x | Lightweight JS framework untuk interactivity |
| **Database** | Turso (LibSQL) | SQLite edge database |
| **ORM** | Drizzle ORM | Type-safe SQL query builder |
| **Hosting** | Cloudflare Pages | Static site hosting + edge functions |
| **Storage** | Cloudflare R2 | Object storage untuk caching |
| **Workers** | Cloudflare Workers | Serverless functions untuk cron jobs |
| **CI/CD** | GitHub Actions | Automated deployment |

### DILARANG MENGGUNAKAN

| Technology | Alasan |
|------------|--------|
| React/Vue/Svelte sebagai full SPA | Overkill untuk kebutuhan static site |
| NextJS/NuxtJS | Overhead tidak perlu |
| Prisma | Tidak kompatibel dengan edge runtime |
| PostgreSQL/MySQL | Turso sudah dipilih |
| Vercel/Netlify | Cloudflare sudah dipilih |
| Express/Fastify | Tidak perlu, gunakan Astro API routes |
| jQuery | Gunakan Alpine.js |

---

## 📁 Struktur Folder

```
greenid/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD workflow
├── website/                     # Astro project
│   ├── src/
│   │   ├── components/         # Astro/Alpine components
│   │   ├── layouts/            # Page layouts
│   │   ├── pages/              # Routes (*.astro)
│   │   │   └── api/            # Server endpoints
│   │   └── db/                 # Database schema & connection
│   ├── public/                 # Static assets
│   ├── astro.config.mjs
│   ├── tailwind.config.mjs
│   └── drizzle.config.ts
├── workers/                     # Cloudflare Workers
│   └── stats-cron/             # Stats cron job worker
├── docs/                        # Strategy documents
│   ├── gagasan-*.md
│   ├── planning-*.md
│   └── path-*.md
├── INTEGRATION.md              # Third-party integration docs
├── TODO.md                     # Task tracker
└── DEVELOPMENT.md              # This file
```

---

## 🔧 Environment Variables

### Website (.env)
```env
# Turso Database (WAJIB)
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token

# Cloudflare R2 (untuk cache)
R2_BUCKET_NAME=buyback-cache
PUBLIC_STATS_URL=https://cache.buyback.my.id/stats.json

# Site
PUBLIC_SITE_URL=https://buyback.my.id
```

### Workers (wrangler.toml + secrets)
```toml
# Secrets (set via wrangler secret put)
# TURSO_DATABASE_URL
# TURSO_AUTH_TOKEN

# R2 binding
[[r2_buckets]]
binding = "BUYBACK_CACHE"
bucket_name = "buyback-cache"
```

### GitHub Secrets (untuk CI/CD)
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `PUBLIC_STATS_URL`

---

## 🏗️ Arsitektur Data Flow

### Static Pages (Build Time)
```
[Build Process] → [Query Turso] → [Generate HTML] → [Deploy to CF Pages]
```

Halaman yang di-prerender saat build:
- `/leaderboard` - Data influencers
- `/tracker` - Data politicians
- `/tracker/[slug]` - Detail politician

### Dynamic API (Runtime)
```
[Client] → [/api/stats] → [Fetch R2 Cache] → [Return JSON]
                              ↓ (if cache miss)
                         [Query Turso]
```

### Stats Cron (Every 5 minutes)
```
[Cron Trigger] → [Worker] → [Query Turso] → [Aggregate Stats] → [Save to R2]
```

---

## 📝 Coding Conventions

### Astro Pages
```astro
---
// 1. Imports
import BaseLayout from '../layouts/BaseLayout.astro';
import { db, tableName } from '../db';

// 2. Data fetching (build time)
const data = await db.select().from(tableName);

// 3. Helper functions
function formatNumber(num: number) { ... }

// 4. Type definitions (jika perlu)
interface DisplayType { ... }
---

<!-- 5. HTML Template -->
<BaseLayout title="Page Title">
  <!-- Content -->
</BaseLayout>
```

### API Routes
```typescript
import type { APIRoute } from 'astro';

export const prerender = false; // WAJIB untuk API routes

export const GET: APIRoute = async ({ request }) => {
  try {
    // Logic
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### Database Queries
```typescript
// BENAR - Simple select
const data = await db.select().from(tableName);

// BENAR - With conditions
const data = await db.select()
  .from(tableName)
  .where(eq(tableName.id, 1));

// HINDARI - Custom select fields di Cloudflare (bisa error)
// const data = await db.select({ id: tableName.id }).from(tableName);
```

### Alpine.js Components
```html
<div x-data="{ 
  value: 0,
  async fetchData() {
    const res = await fetch('/api/endpoint');
    const data = await res.json();
    this.value = data.value;
  }
}" x-init="fetchData()">
  <span x-text="value"></span>
</div>
```

---

## ✅ Checklist Sebelum Commit

- [ ] `pnpm build` sukses tanpa error
- [ ] Tidak ada TypeScript error (`pnpm typecheck` jika ada)
- [ ] Tidak menggunakan technology di luar stack yang disepakati
- [ ] API routes memiliki `export const prerender = false`
- [ ] Environment variables sudah didokumentasikan
- [ ] Jika ada integrasi baru, update `INTEGRATION.md`
- [ ] Update `TODO.md` jika menyelesaikan task

---

## 🚀 Deployment

### Website (otomatis via GitHub Actions)
```bash
git push origin main
# GitHub Actions akan auto-deploy ke Cloudflare Pages
```

### Worker (manual pertama kali)
```bash
cd workers/stats-cron
pnpm install
npx wrangler secret put TURSO_DATABASE_URL
npx wrangler secret put TURSO_AUTH_TOKEN
pnpm deploy
```

---

## 🐛 Troubleshooting

### Build Error: "Cannot convert undefined or null to object"
- Biasanya karena `db.select({ custom: table.field })` tidak kompatibel dengan Cloudflare
- Gunakan `db.select().from(table)` dan map hasilnya di JavaScript

### Build Error: Environment variable undefined
- Pastikan `.env` ada dan berisi credentials yang benar
- Pastikan `astro.config.mjs` memiliki vite.define untuk inject env vars

### Worker tidak jalan
- Cek apakah secrets sudah diset: `npx wrangler secret list`
- Cek logs di Cloudflare Dashboard > Workers > Logs

### R2 access denied
- Pastikan R2 binding sudah benar di wrangler.toml
- Untuk public access, aktifkan R2 public access di dashboard

---

## 📚 References

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Alpine.js](https://alpinejs.dev/start-here)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Turso](https://docs.turso.tech)
- [Cloudflare Workers](https://developers.cloudflare.com/workers)
- [Cloudflare R2](https://developers.cloudflare.com/r2)
