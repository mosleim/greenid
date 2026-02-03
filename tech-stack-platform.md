# Tech Stack: Platform Buyback Indonesia

## Prinsip Utama

1. **Minimal Cost** - Maksimalkan free tier dan open source
2. **Secure by Default** - Pilih stack yang secure secara native
3. **Fast to Build** - Bisa launch MVP dalam 1-2 minggu
4. **Easy to Maintain** - Tidak butuh dedicated devops
5. **Scalable** - Bisa handle viral traffic tanpa crash

---

## Recommended Stack

### Frontend

| Layer | Technology | Cost |
|-------|------------|------|
| **Framework** | Astro | Free |
| **UI Components** | Tailwind CSS | Free |
| **Interactivity** | Alpine.js | Free |
| **Charts** | Chart.js | Free |

### Backend & Database

| Layer | Technology | Cost |
|-------|------------|------|
| **Database** | Turso (SQLite edge) | Free tier: 9GB, 1B reads/month |
| **ORM** | Drizzle ORM | Free |
| **Auth** | Lucia Auth | Free |

### Hosting

| Layer | Technology | Cost |
|-------|------------|------|
| **Static Hosting** | Cloudflare Pages | Free (unlimited bandwidth) |
| **Domain** | buyback.my.id | Rp 11K/tahun |

### API & Serverless Functions

| Layer | Technology | Cost |
|-------|------------|------|
| **Functions** | Cloudflare Workers | Free (100K req/day) |

---

## Optimasi: Static Stats dengan R2 Cache

### Konsep

Daripada query database setiap kali ada request untuk statistik (leaderboard, counter), kita:
1. Generate JSON statis ke R2 setiap 5 menit via Cron Trigger
2. Frontend fetch langsung dari R2 (gratis, unlimited bandwidth)
3. Database hanya di-hit saat update data atau admin action

### Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                     WRITE PATH (Rare)                                │
│                                                                      │
│  Admin Update ───> Cloudflare Worker ───> Turso Database            │
│                           │                                          │
│                           ▼                                          │
│              Trigger Stats Regeneration                              │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                     READ PATH (Frequent)                             │
│                                                                      │
│  User Visit ───> Cloudflare Pages ───> Fetch from R2                │
│                                              │                       │
│                                              ▼                       │
│                                    Static JSON Files                 │
│                                    - leaderboard.json                │
│                                    - stats.json                      │
│                                    - politicians.json                │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                     CRON JOB (Every 5 min)                           │
│                                                                      │
│  Cron Trigger ───> Worker ───> Query Turso ───> Write to R2         │
│                                                                      │
│  Files generated:                                                    │
│  - /stats/leaderboard.json                                          │
│  - /stats/counter.json                                              │
│  - /stats/politicians.json                                          │
│  - /stats/timeline.json                                             │
└──────────────────────────────────────────────────────────────────────┘
```

### Cost Comparison

| Approach | 100K visits/day | 1M visits/day | 10M visits/day |
|----------|-----------------|---------------|----------------|
| **Direct DB Query** | ~100K Turso reads | ~1M reads | ~10M reads |
| **R2 Static Cache** | ~288 Turso reads* | ~288 reads* | ~288 reads* |

*288 = 24 hours × 12 updates/hour (setiap 5 menit)

### Savings

| Traffic | Tanpa R2 Cache | Dengan R2 Cache | Savings |
|---------|----------------|-----------------|---------|
| 100K/day | Free | Free | - |
| 1M/day | ~$5/month | Free | 100% |
| 10M/day | ~$50/month | Free | 100% |

### Implementation

```typescript
// functions/cron-stats.ts (Cloudflare Worker dengan Cron Trigger)
export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Query aggregated stats from Turso
    const leaderboard = await getLeaderboardFromDB(env);
    const counter = await getCounterFromDB(env);
    const politicians = await getPoliticiansFromDB(env);

    // Write to R2 as JSON
    await env.R2_BUCKET.put('stats/leaderboard.json', JSON.stringify(leaderboard), {
      httpMetadata: { contentType: 'application/json' },
    });
    
    await env.R2_BUCKET.put('stats/counter.json', JSON.stringify(counter), {
      httpMetadata: { contentType: 'application/json' },
    });
    
    await env.R2_BUCKET.put('stats/politicians.json', JSON.stringify(politicians), {
      httpMetadata: { contentType: 'application/json' },
    });

    console.log('Stats regenerated at', new Date().toISOString());
  },
};
```

```toml
# wrangler.toml
[triggers]
crons = ["*/5 * * * *"]  # Every 5 minutes
```

### R2 Public Access

```typescript
// Serve R2 files via custom domain atau Cloudflare Pages
// File akan accessible di: https://stats.buyback.my.id/leaderboard.json
```

### Frontend Fetch

```typescript
// src/components/Leaderboard.astro
---
// At build time atau client-side fetch
const leaderboard = await fetch('https://stats.buyback.my.id/leaderboard.json')
  .then(r => r.json());
---

<div class="leaderboard">
  {leaderboard.map(item => (
    <div class="leaderboard-item">
      <span>{item.name}</span>
      <span>{item.impactScore}</span>
    </div>
  ))}
</div>
```

### Benefits

1. **Near-zero database cost** - hanya 288 queries/day bukan jutaan
2. **Unlimited bandwidth** - R2 gratis untuk egress
3. **Ultra-fast** - JSON di edge, no database latency
4. **Resilient** - jika database down, stats tetap tersedia
5. **Simple** - no complex caching logic

### Content Management

| Layer | Technology | Cost |
|-------|------------|------|
| **CMS** | Markdown files + Git | Free |
| **Media** | Cloudflare R2 | Free tier: 10GB |

---

## Final Stack Summary

| Layer | Choice | Status |
|-------|--------|--------|
| Framework | Astro | ✅ Final |
| Styling | Tailwind CSS | ✅ Final |
| Interactivity | Alpine.js | ✅ Final |
| Charts | Chart.js | ✅ Final |
| Database | Turso | ✅ Final |
| ORM | Drizzle | ✅ Final |
| Auth | Lucia Auth | ✅ Final |
| Hosting | Cloudflare Pages | ✅ Final |
| Functions | Cloudflare Workers | ✅ Final |
| Storage | Cloudflare R2 | ✅ Final |
| Domain | buyback.my.id | ✅ Final |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Cloudflare Pages                       │  │
│  │            (Static HTML/CSS/JS from Astro)               │  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │  │
│  │  │  Homepage   │  │ Leaderboard │  │   Tracker   │     │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Cloudflare Workers (API)                     │  │
│  │  - Submit support form                                    │  │
│  │  - Fetch leaderboard data                                │  │
│  │  - Track politician statements                           │  │
│  │  - Connect to Turso via libsql                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Cloudflare R2 (Media Storage)                │  │
│  │  - Infografis, video thumbnails                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                          TURSO                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    SQLite Database                        │  │
│  │              (Edge-replicated globally)                   │  │
│  │                                                          │  │
│  │  Tables:                                                 │  │
│  │  - supporters (email, name, joined_at)                  │  │
│  │  - influencers (name, platform, score, impressions)     │  │
│  │  - politicians (name, position, party)                  │  │
│  │  - statements (politician_id, content, date, sentiment) │  │
│  │  - content_submissions (url, platform, verified)        │  │
│  │  - sessions (for Lucia Auth)                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Features:                                                      │
│  - Embedded replicas (bisa local dev tanpa network)            │
│  - Multi-region reads (ultra-fast globally)                    │
│  - Automatic backups                                           │
│  - SQL interface via libsql                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

```sql
-- Schema untuk Turso (SQLite)

-- Supporters (orang yang dukung gerakan)
CREATE TABLE supporters (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  city TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Influencers yang participating
CREATE TABLE influencers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  platform TEXT NOT NULL, -- instagram, twitter, tiktok, youtube
  profile_url TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'bronze', -- bronze, silver, gold, platinum
  total_impressions INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  impact_score REAL DEFAULT 0,
  is_verified INTEGER DEFAULT 0,
  joined_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Content submissions dari influencer
CREATE TABLE content_submissions (
  id TEXT PRIMARY KEY,
  influencer_id TEXT REFERENCES influencers(id),
  platform TEXT NOT NULL,
  content_url TEXT NOT NULL,
  content_type TEXT, -- post, video, story, thread
  impressions INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  posted_at TEXT,
  verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Politicians tracking
CREATE TABLE politicians (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT, -- Menteri, Anggota DPR, Gubernur, etc
  party TEXT,
  ministry TEXT,
  commission TEXT, -- Komisi VII, etc
  photo_url TEXT,
  twitter_handle TEXT,
  instagram_handle TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Politician statements
CREATE TABLE politician_statements (
  id TEXT PRIMARY KEY,
  politician_id TEXT REFERENCES politicians(id),
  statement_text TEXT NOT NULL,
  sentiment TEXT NOT NULL, -- pro, netral, kontra
  source_url TEXT,
  source_type TEXT, -- media, twitter, official, interview
  statement_date TEXT NOT NULL,
  context TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Site stats for live counter
CREATE TABLE site_stats (
  id TEXT PRIMARY KEY,
  value INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Sessions table for Lucia Auth
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);

-- Admin users for Lucia Auth
CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX idx_influencers_platform ON influencers(platform);
CREATE INDEX idx_influencers_impact ON influencers(impact_score DESC);
CREATE INDEX idx_statements_politician ON politician_statements(politician_id);
CREATE INDEX idx_statements_date ON politician_statements(statement_date DESC);
CREATE INDEX idx_content_influencer ON content_submissions(influencer_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
```

---

## Security Considerations

### Built-in Security (Zero Config)

| Layer | Security Feature | Provider |
|-------|------------------|----------|
| **DDoS Protection** | Automatic mitigation | Cloudflare |
| **SSL/TLS** | Free certificates, auto-renew | Cloudflare |
| **SQL Injection** | Parameterized queries via Drizzle | Drizzle ORM |
| **Auth** | Secure sessions, password hashing | Lucia Auth |
| **CORS** | Configurable | Cloudflare Workers |
| **Rate Limiting** | Built-in | Cloudflare |
| **Database Security** | Token-based access | Turso |

### Additional Security (Easy Setup)

| Measure | Implementation |
|---------|----------------|
| **Input Validation** | Zod schema validation |
| **CSP Headers** | Cloudflare Page Rules |
| **Bot Protection** | Cloudflare Turnstile (free CAPTCHA) |
| **Admin Auth** | Lucia Auth dengan password hashing (Argon2) |

### Admin Access

- Lucia Auth untuk admin dashboard
- Password hashing dengan Argon2
- Session-based authentication
- Simple role check di middleware

### Turso Security

- Database access via auth token
- Read replicas are read-only by default
- Connection string tidak exposed ke client
- All queries via server-side Cloudflare Workers

---

## Cost Breakdown

### Monthly Cost (Free Tier)

| Service | Free Tier Limit | Expected Usage | Cost |
|---------|-----------------|----------------|------|
| Cloudflare Pages | Unlimited bandwidth | Any | Rp 0 |
| Cloudflare Workers | 100K req/day | ~50K | Rp 0 |
| Cloudflare R2 | 10GB storage | ~1GB | Rp 0 |
| **Turso** | **9GB DB, 1B reads/month** | ~100MB | **Rp 0** |
| Domain (buyback.my.id) | - | 1 domain | Rp 11K/tahun |
| **Total** | | | **~Rp 1K/bulan** |

### If Viral (Scaling Cost)

Dengan R2 caching, database hanya di-query ~288 kali/hari (setiap 5 menit), **bukan per visitor**.

| Scenario | Traffic | DB Queries/day | Monthly Cost |
|----------|---------|----------------|--------------|
| Normal | 10K visits/month | ~288 | ~Rp 1K |
| Growing | 100K visits/month | ~288 | ~Rp 1K |
| Viral | 1M visits/month | ~288 | ~Rp 1K |
| Mega Viral | 10M visits/month | ~288 | ~Rp 1K |

**Semua traffic level = cost sama** karena:
- Cloudflare Pages: unlimited bandwidth (free)
- Cloudflare R2: unlimited egress (free)
- Turso: hanya cron job yang query, bukan visitors

---

## Development Timeline

### Week 1: Foundation

```
Day 1-2:
- Setup Cloudflare account
- Setup Turso database
- Initialize Astro project
- Configure deployment pipeline

Day 3-4:
- Design system (Tailwind config)
- Homepage layout
- Navigation structure
- Basic components

Day 5-7:
- Database schema implementation
- Basic API endpoints
- Content pages (tentang, data)
```

### Week 2: Core Features

```
Day 8-9:
- Leaderboard page
- Influencer data entry
- Impact score calculation

Day 10-11:
- Politician tracker page
- Statement timeline
- Sentiment display

Day 12-13:
- Support form
- Live counter
- Social sharing

Day 14:
- Testing
- Content population
- Launch
```

---

## Folder Structure

```
buyback-website/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Counter.astro
│   │   ├── LeaderboardCard.astro
│   │   ├── PoliticianCard.astro
│   │   ├── StatementTimeline.astro
│   │   └── SupportForm.astro
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── tentang.astro
│   │   ├── leaderboard.astro
│   │   ├── tracker/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── data.astro
│   │   ├── aksi.astro
│   │   └── bergabung.astro
│   │
│   ├── content/
│   │   ├── infografis/
│   │   └── articles/
│   │
│   ├── lib/
│   │   ├── db.ts           # Turso/Drizzle connection
│   │   ├── auth.ts         # Lucia Auth setup
│   │   ├── schema.ts       # Drizzle schema
│   │   └── utils.ts
│   │
│   └── styles/
│       └── global.css
│
├── public/
│   ├── images/
│   ├── videos/
│   └── favicon.ico
│
├── functions/  (Cloudflare Workers)
│   ├── api/
│   │   ├── support.ts
│   │   ├── leaderboard.ts
│   │   └── stats.ts
│   └── _middleware.ts
│
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── wrangler.toml  (Cloudflare config)
```

---

## Quick Start Commands

```bash
# Create project
npm create astro@latest buyback-website
cd buyback-website

# Add integrations
npx astro add tailwind
npx astro add cloudflare

# Install dependencies
npm install @libsql/client drizzle-orm lucia @lucia-auth/adapter-sqlite

# Dev dependencies
npm install -D drizzle-kit

# Turso CLI (install globally)
brew install tursodatabase/tap/turso  # macOS
# atau curl untuk Linux

# Login Turso
turso auth login

# Create database
turso db create buyback-db

# Get connection URL
turso db show buyback-db --url

# Get auth token
turso db tokens create buyback-db

# Development
npm run dev

# Build
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist
```

---

## Environment Variables

```env
# .env (local development)
TURSO_DATABASE_URL=libsql://buyback-db-[username].turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...

# Cloudflare Pages Environment Variables (set di dashboard)
# Same as above
```

---

## Drizzle Schema Example

```typescript
// src/lib/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const influencers = sqliteTable('influencers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  handle: text('handle').notNull(),
  platform: text('platform').notNull(),
  profileUrl: text('profile_url'),
  avatarUrl: text('avatar_url'),
  tier: text('tier').default('bronze'),
  totalImpressions: integer('total_impressions').default(0),
  totalEngagement: integer('total_engagement').default(0),
  impactScore: real('impact_score').default(0),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  joinedAt: text('joined_at'),
  updatedAt: text('updated_at'),
});

export const politicians = sqliteTable('politicians', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  position: text('position'),
  party: text('party'),
  ministry: text('ministry'),
  commission: text('commission'),
  photoUrl: text('photo_url'),
  twitterHandle: text('twitter_handle'),
  instagramHandle: text('instagram_handle'),
  createdAt: text('created_at'),
});

export const politicianStatements = sqliteTable('politician_statements', {
  id: text('id').primaryKey(),
  politicianId: text('politician_id').references(() => politicians.id),
  statementText: text('statement_text').notNull(),
  sentiment: text('sentiment').notNull(), // pro, netral, kontra
  sourceUrl: text('source_url'),
  sourceType: text('source_type'),
  statementDate: text('statement_date').notNull(),
  context: text('context'),
  createdAt: text('created_at'),
});
```

---

## Turso Connection Example

```typescript
// src/lib/db.ts
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: import.meta.env.TURSO_DATABASE_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
```

---

## Monitoring & Analytics

| Purpose | Tool | Cost |
|---------|------|------|
| Web Analytics | Cloudflare Web Analytics | Free |
| Error Tracking | Sentry (free tier) | Free |
| Uptime | Better Uptime (free tier) | Free |
| Database | Turso CLI / Dashboard | Free |

---

## Summary

**Total Setup Cost: < Rp 500K**
- Domain: Rp 11K/tahun
- Everything else: Free tier

**Monthly Running Cost: ~Rp 1K**
- Domain Rp 11K/tahun = ~Rp 1K/bulan

**Time to MVP: 2 minggu**

**Viral-proof: Ya**
- Cloudflare unlimited bandwidth
- Turso edge replicas globally
- Static-first architecture
- CDN global

**Secure by Default: Ya**
- Cloudflare DDoS protection
- Turso token-based access
- Drizzle parameterized queries
- Lucia Auth secure sessions
- No server to manage
- Automatic SSL

Stack ini bisa handle jutaan visitors dengan biaya minimal dan security enterprise-grade.
