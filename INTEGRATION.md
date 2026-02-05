# Dokumentasi Integrasi - Buyback Indonesia Platform

## 1. Turso Database

### Deskripsi
Turso adalah database SQLite edge yang digunakan untuk menyimpan data supporters, influencers, politicians, dan statements.

### Database Schema
Project ini menggunakan Drizzle ORM dengan tabel-tabel berikut:

| Tabel | Deskripsi |
|-------|-----------|
| `supporters` | Pendukung kebijakan buyback |
| `influencers` | Influencer yang mendukung kampanye |
| `influencer_posts` | Konten yang dibuat influencer |
| `politicians` | Pejabat yang dipantau |
| `statements` | Pernyataan pejabat |
| `volunteers` | Relawan kampanye |
| `organizations` | Organisasi mitra |
| `statement_reports` | Laporan pernyataan dari publik |
| `stats_cache` | Cache statistik |

### Konfigurasi yang Dibutuhkan
- `TURSO_DATABASE_URL` - URL database Turso
- `TURSO_AUTH_TOKEN` - Token autentikasi

### Cara Mendapatkan Konfigurasi

1. **Buat Account Turso**
   - Kunjungi https://turso.tech
   - Klik "Get Started" atau "Sign Up"
   - Bisa sign up dengan GitHub, Google, atau email

2. **Install Turso CLI** (opsional, untuk management)
   ```bash
   brew install tursodatabase/tap/turso  # macOS
   # atau
   curl -sSfL https://get.tur.so/install.sh | bash  # Linux
   ```

3. **Buat Database**
   - Login ke https://turso.tech/app
   - Klik "Create Database"
   - Nama: `buyback-db`
   - Region: Pilih `sin` (Singapore) untuk latency terbaik ke Indonesia
   - Klik "Create"

4. **Generate Auth Token**
   - Di dashboard Turso, pilih database `buyback-db`
   - Klik tab "Settings" > "Generate Token"
   - Copy token yang muncul
   - Token hanya ditampilkan sekali, simpan dengan aman

5. **Copy Database URL**
   - Di dashboard database, lihat bagian "Connect"
   - Copy URL yang format-nya: `libsql://buyback-db-[username].turso.io`

6. **Push Schema ke Database**
   ```bash
   cd website
   pnpm db:push
   ```

### Environment Variables
```env
TURSO_DATABASE_URL=libsql://buyback-db-yourname.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### Free Tier Limits
- 9 GB total storage
- 1 Billion row reads/month
- Unlimited databases
- 3 locations

---

## 2. Cloudflare Pages (via GitHub Actions)

### Deskripsi
Cloudflare Pages digunakan untuk hosting static website dengan edge deployment. Deploy dilakukan via GitHub Actions.

### Setup GitHub Secrets

1. Buka repository di GitHub > Settings > Secrets and variables > Actions
2. Tambahkan secrets berikut:

| Secret Name | Cara Mendapatkan |
|-------------|------------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard > My Profile > API Tokens > Create Token > "Edit Cloudflare Workers" template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard > klik domain > Overview > lihat "Account ID" di sidebar kanan |
| `TURSO_DATABASE_URL` | Turso Dashboard > database > Connect |
| `TURSO_AUTH_TOKEN` | Turso Dashboard > database > Settings > Generate Token |
| `PUBLIC_STATS_URL` | URL public R2: `https://cache.buyback.my.id/stats.json` |

### Membuat Cloudflare API Token

1. Buka https://dash.cloudflare.com/profile/api-tokens
2. Klik "Create Token"
3. Pilih template "Edit Cloudflare Workers"
4. Di "Account Resources", pilih akun kamu
5. Di "Zone Resources", pilih "All zones" atau zone spesifik
6. Klik "Continue to summary" > "Create Token"
7. Copy token (hanya ditampilkan sekali)

**Trigger Deploy:**
- Push ke branch `main` dengan perubahan di folder `website/`
- Atau manual trigger di GitHub Actions > "Deploy to Cloudflare Pages" > "Run workflow"

### Custom Domain
1. Di project settings > "Custom domains"
2. Klik "Set up a custom domain"
3. Masukkan: `buyback.my.id`
4. Cloudflare akan otomatis setup DNS records
5. Tunggu SSL certificate ter-issue (beberapa menit)

---

## 3. Cloudflare R2 Storage

### Deskripsi
R2 digunakan untuk caching stats JSON yang di-generate oleh cron worker, menghindari database calls berlebihan.

### Konfigurasi yang Dibutuhkan
- `R2_BUCKET_NAME` - Nama bucket
- Public access via custom domain (tidak perlu API credentials untuk read)

### Cara Setup

1. **Enable R2**
   - Di dashboard Cloudflare, klik "R2" di sidebar
   - Accept terms dan enable R2

2. **Create Bucket**
   - Klik "Create bucket"
   - Nama: `buyback-cache`
   - Location: Automatic (atau pilih Asia Pacific)

3. **Enable Public Access**
   - Di bucket settings, klik "Settings"
   - Di bagian "Public access", klik "Connect Domain"
   - Gunakan subdomain: `cache.buyback.my.id`
   - Atau enable R2.dev subdomain (gratis)

4. **Akses Public**
   - Dengan custom domain: `https://cache.buyback.my.id/stats.json`
   - Dengan R2.dev: `https://pub-[hash].r2.dev/stats.json`

5. **API Token untuk Write (Cron Worker)**
   - Di halaman R2, klik "Manage R2 API Tokens"
   - Klik "Create API token"
   - Permission: "Object Read & Write"
   - Bucket scope: Pilih `buyback-cache`
   - Token hanya diperlukan untuk Worker yang menulis stats

### Environment Variables (untuk Cron Worker)
```env
# Hanya diperlukan di Cloudflare Worker untuk write
R2_BUCKET_NAME=buyback-cache
```

Catatan: Di Cloudflare Workers, R2 binding sudah otomatis tersedia via `env.R2_BUCKET` tanpa credentials terpisah.

### Public URL
```
# Via custom domain (recommended)
https://cache.buyback.my.id/stats.json

# Via R2.dev subdomain (free)
https://pub-abc123.r2.dev/stats.json
```

### Free Tier Limits
- 10 GB storage/month
- 10 million Class A operations/month (PUT, POST)
- 10 million Class B operations/month (GET)
- No egress fees

---

## 4. Domain (buyback.my.id)

### Konfigurasi yang Dibutuhkan
- Domain buyback.my.id dari registrar

### Cara Setup

1. **Beli Domain**
   - Registrar recommended: Niagahoster, Rumahweb, atau Domainesia
   - Cari domain `buyback.my.id`
   - Harga: ~Rp 11.000/tahun

2. **Setup DNS di Cloudflare**
   - Add site di Cloudflare dengan domain `buyback.my.id`
   - Ganti nameservers di registrar ke Cloudflare nameservers
   - Tunggu propagasi DNS (bisa sampai 24 jam)

3. **Connect ke Cloudflare Pages**
   - Di Cloudflare Pages project > Custom domains
   - Add `buyback.my.id`
   - DNS records akan otomatis ditambahkan

---

## 5. API Endpoints

### Available Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/support` | POST | Submit dukungan supporter |
| `/api/stats` | GET | Get statistik platform |
| `/api/volunteer` | POST | Submit pendaftaran volunteer |
| `/api/organization` | POST | Submit kemitraan organisasi |
| `/api/report-statement` | POST | Laporkan pernyataan pejabat |

### POST /api/support
Submit dukungan supporter.

**Request Body:**
```json
{
  "name": "Nama Lengkap",
  "email": "email@example.com",
  "city": "Jakarta",
  "message": "Pesan dukungan...",
  "isPublic": true
}
```

**Response:**
```json
{
  "success": true,
  "data": { "id": 1 }
}
```

### GET /api/stats
Get statistik platform.

**Response:**
```json
{
  "supporters": 100,
  "influencers": 10,
  "totalFollowersReach": 500000,
  "estimatedImpressions": 50000,
  "politicians": 5,
  "statements": {
    "total": 3,
    "pro": 1,
    "kontra": 0,
    "netral": 2
  },
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/volunteer
Submit pendaftaran volunteer.

**Request Body:**
```json
{
  "name": "Nama",
  "email": "email@example.com",
  "whatsapp": "08123456789",
  "role": "Content Creator",
  "portfolioUrl": "https://...",
  "availability": "3-5",
  "motivation": "..."
}
```

### POST /api/organization
Submit kemitraan organisasi.

**Request Body:**
```json
{
  "orgName": "Nama Organisasi",
  "orgType": "ngo",
  "picName": "Nama PIC",
  "picEmail": "pic@org.com",
  "website": "https://...",
  "partnershipType": "..."
}
```

### POST /api/report-statement
Laporkan pernyataan pejabat.

**Request Body:**
```json
{
  "politicianName": "Nama Pejabat",
  "sourceUrl": "https://...",
  "quote": "Kutipan pernyataan...",
  "reporterEmail": "reporter@email.com"
}
```

---

## 6. Cloudflare Worker (Stats Cron)

### Deskripsi
Worker yang berjalan setiap 5 menit untuk mengupdate statistik dari database Turso ke R2 cache.

### Arsitektur
```
[Cron Trigger] → [Worker] → [Query Turso] → [Save to R2]
                              ↓
[Frontend] → [/api/stats] → [Read from R2 cache]
                              ↓ (fallback)
                           [Query Turso directly]
```

### Konfigurasi yang Dibutuhkan

**Secrets (set via Wrangler atau Dashboard):**
- `TURSO_DATABASE_URL` - URL database Turso
- `TURSO_AUTH_TOKEN` - Token autentikasi Turso

**R2 Binding (di wrangler.toml):**
- `BUYBACK_CACHE` - binding ke bucket `buyback-cache`

### Cara Deploy Worker

1. **Masuk ke folder worker**
   ```bash
   cd workers/stats-cron
   pnpm install
   ```

2. **Login ke Cloudflare (jika belum)**
   ```bash
   npx wrangler login
   ```

3. **Set Secrets**
   ```bash
   npx wrangler secret put TURSO_DATABASE_URL
   # Paste URL database

   npx wrangler secret put TURSO_AUTH_TOKEN
   # Paste auth token
   ```

4. **Deploy Worker**
   ```bash
   pnpm deploy
   # atau
   npx wrangler deploy
   ```

5. **Verifikasi Cron**
   - Buka https://dash.cloudflare.com
   - Workers & Pages > buyback-stats-cron
   - Klik tab "Triggers"
   - Pastikan cron `*/5 * * * *` tercantum

### Testing Manual
```bash
# Refresh stats (tanpa menunggu cron)
curl https://buyback-stats-cron.YOUR_SUBDOMAIN.workers.dev/refresh

# Get cached stats
curl https://buyback-stats-cron.YOUR_SUBDOMAIN.workers.dev/stats
```

### Monitoring
- Lihat logs di Cloudflare Dashboard > Workers > Logs
- Stats otomatis diupdate setiap 5 menit
- R2 akan menyimpan file `stats.json` di bucket

---

## Quick Start

### 1. Clone dan Install
```bash
git clone https://github.com/yourrepo/greenid.git
cd greenid/website
pnpm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env dengan credentials dari langkah-langkah di atas
```

### 3. Push Database Schema
```bash
pnpm db:push
```

### 4. Run Development Server
```bash
pnpm dev
# Buka http://localhost:4321
```

### 5. Build untuk Production
```bash
pnpm build
```

---

## Troubleshooting

### Error: "Cannot connect to Turso database"
- Pastikan TURSO_DATABASE_URL dan TURSO_AUTH_TOKEN sudah benar
- Pastikan token belum expired
- Cek apakah database sudah dibuat

### Error: "R2 access denied"
- Pastikan API token punya permission yang benar
- Pastikan bucket name sesuai
- Cek apakah token sudah di-scope ke bucket yang benar

### Build Error di Cloudflare Pages
- Pastikan root directory diset ke `website`
- Pastikan environment variables sudah ditambahkan di Pages settings
- Cek build logs untuk detail error

---

## Contacts

Untuk pertanyaan teknis, buat issue di repository atau hubungi maintainer.
