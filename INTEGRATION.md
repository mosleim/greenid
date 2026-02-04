# Dokumentasi Integrasi - Buyback Indonesia Platform

## 1. Turso Database

### Deskripsi
Turso adalah database SQLite edge yang digunakan untuk menyimpan data supporters, influencers, politicians, dan statements.

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

## 2. Cloudflare Pages

### Deskripsi
Cloudflare Pages digunakan untuk hosting static website dengan edge deployment.

### Konfigurasi yang Dibutuhkan
- Cloudflare account
- Connected GitHub repository

### Cara Setup

1. **Buat Account Cloudflare** (jika belum ada)
   - Kunjungi https://dash.cloudflare.com/sign-up
   - Verifikasi email

2. **Setup Cloudflare Pages**
   - Di dashboard Cloudflare, klik "Workers & Pages"
   - Klik "Create application" > "Pages"
   - Pilih "Connect to Git"
   - Authorize Cloudflare untuk akses GitHub
   - Pilih repository `greenid`

3. **Configure Build Settings**
   - Framework preset: `Astro`
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Root directory: `website`

4. **Set Environment Variables**
   - Di settings project, tambahkan:
     - `TURSO_DATABASE_URL`
     - `TURSO_AUTH_TOKEN`

5. **Deploy**
   - Klik "Save and Deploy"
   - Tunggu build selesai

### Custom Domain
1. Di project settings > "Custom domains"
2. Add domain: `buyback.my.id`
3. Ikuti instruksi DNS setup

---

## 3. Cloudflare R2 Storage

### Deskripsi
R2 digunakan untuk caching stats JSON yang di-generate oleh cron worker, menghindari database calls berlebihan.

### Konfigurasi yang Dibutuhkan
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_ENDPOINT`

### Cara Setup

1. **Enable R2**
   - Di dashboard Cloudflare, klik "R2" di sidebar
   - Accept terms dan enable R2

2. **Create Bucket**
   - Klik "Create bucket"
   - Nama: `buyback-cache`
   - Location: Automatic (atau pilih Asia Pacific)

3. **Generate API Token**
   - Di halaman R2, klik "Manage R2 API Tokens"
   - Klik "Create API token"
   - Permission: "Object Read & Write"
   - Bucket scope: Pilih `buyback-cache`
   - Klik "Create API Token"
   - Copy Access Key ID dan Secret Access Key

4. **Get Endpoint URL**
   - Di bucket settings, lihat "S3 API" endpoint
   - Format: `https://[account-id].r2.cloudflarestorage.com`

### Environment Variables
```env
R2_ACCESS_KEY_ID=abc123...
R2_SECRET_ACCESS_KEY=xyz789...
R2_BUCKET_NAME=buyback-cache
R2_ENDPOINT=https://123abc.r2.cloudflarestorage.com
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

### 3. Run Development Server
```bash
pnpm dev
# Buka http://localhost:4321
```

### 4. Build untuk Production
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
