# TODO List - Project Buyback Indonesia

## Status Legend
- [ ] Belum dikerjakan
- [x] Selesai
- 🔄 Sedang dikerjakan

---

## Phase 0: Persiapan Dokumen & Planning

### Dokumen Kebijakan
- [x] Gagasan kebijakan buyback kemasan (`gagasan-kebijakan-buyback-kemasan.md`)
- [x] Analisis layer dampak kebijakan (`layer-dampak-kebijakan-buyback.md`)
- [x] Planning jalur kebijakan (`planning-jalur-kebijakan-buyback.md`)
- [x] Path F: Strategi viral & influencer (`path-f-viral-influencer-strategy.md`)
- [x] Tech stack platform (`tech-stack-platform.md`)

### Keputusan Final
- [x] Pilih jalur: Path F (Viral & Influencer)
- [x] Pilih domain: buyback.my.id
- [x] Pilih tech stack: Astro + Turso + Cloudflare

---

## Phase 1: Setup Infrastructure

### Domain & DNS
- [x] Beli domain buyback.my.id
- [x] Setup DNS di Cloudflare
- [x] Verify domain ownership

### Cloudflare Setup
- [x] Create Cloudflare account (jika belum)
- [x] Setup Cloudflare Pages project
- [x] Setup Cloudflare R2 bucket
- [x] Setup GitHub Actions untuk deploy
- [ ] Configure Workers (untuk cron stats)

### Database Setup
- [x] Create Turso account
- [x] Create database `buyback-db`
- [x] Generate auth token
- [ ] Run schema migrations
- [ ] Seed initial data (jika ada)

---

## Phase 2: Website Development

### Project Setup
- [x] Initialize Astro project
- [x] Configure Tailwind CSS
- [x] Setup Alpine.js integration
- [ ] Setup Chart.js
- [ ] Configure Drizzle ORM dengan Turso
- [ ] Setup Lucia Auth (untuk admin)
- [ ] Setup environment variables

### Core Pages
- [x] Homepage (`/`)
  - [x] Hero section dengan tagline
  - [x] Live counter (supporters, impressions)
  - [x] CTA buttons
  - [x] Brief explanation

- [x] Tentang (`/tentang`)
  - [x] Penjelasan kebijakan buyback
  - [x] Infografis dampak
  - [x] FAQ section

- [x] Leaderboard (`/leaderboard`)
  - [x] Influencer rankings
  - [x] Impact score display
  - [x] Tier badges
  - [x] Filter by platform

- [x] Politician Tracker (`/tracker`)
  - [x] List politicians
  - [x] Statement timeline
  - [x] Sentiment indicators (pro/netral/kontra)
  - [x] Individual politician page (`/tracker/[slug]`)

- [x] Data & Riset (`/data`)
  - [x] Volume sampah plastik Indonesia
  - [x] Potensi ekonomi
  - [x] Perbandingan internasional
  - [ ] Download research papers

- [x] Aksi (`/aksi`)
  - [x] Download kit untuk posting
  - [x] Template pesan ke DPR
  - [ ] Link petisi
  - [ ] Event calendar

- [x] Bergabung (`/bergabung`)
  - [x] Form daftar sebagai supporter
  - [x] Form daftar sebagai influencer
  - [x] Form kemitraan organisasi

### Admin Panel (Simple)
- [ ] Admin login page
- [ ] Add/edit influencer
- [ ] Add/edit politician
- [ ] Add/edit statement
- [ ] View supporters list

### API & Workers
- [ ] POST `/api/support` - submit supporter form
- [ ] GET `/api/stats` - get current stats (fallback)
- [ ] Cron worker untuk regenerate stats ke R2

### Components
- [x] Header (navigation)
- [x] Footer
- [x] Counter component
- [x] Leaderboard card
- [x] Politician card
- [x] Statement timeline item
- [x] Support form
- [x] Social share buttons
- [ ] Chart components

---

## Phase 3: Content Preparation

### Visual Assets
- [ ] Logo buyback.my.id
- [ ] Favicon
- [ ] Open Graph images
- [ ] Infografis: Volume sampah plastik
- [ ] Infografis: Mekanisme buyback
- [ ] Infografis: Dampak ke pemulung
- [ ] Infografis: Perbandingan negara lain

### Written Content
- [ ] Homepage copy
- [ ] Tentang page content
- [ ] FAQ items (minimal 10)
- [ ] Data & statistics dengan sources
- [ ] Meta descriptions untuk SEO

### Social Media Kit
- [ ] 5 ready-to-post infografis
- [ ] 10 caption templates
- [ ] Hashtag set
- [ ] Talking points document

---

## Phase 4: Data Population

### Politicians
- [ ] Research dan list pejabat terkait
  - [ ] Menteri LHK
  - [ ] Anggota Komisi VII DPR
  - [ ] Gubernur daerah potensial
  - [ ] Kepala daerah progressive
- [ ] Collect foto dan social handles
- [ ] Input ke database

### Influencers (Initial Seed)
- [ ] List influencer lingkungan
- [ ] List influencer potensial lainnya
- [ ] Input placeholder data
- [ ] Prepare for outreach

### Statements (Initial)
- [ ] Research existing statements terkait sampah/plastik
- [ ] Input dengan sentiment classification

---

## Phase 5: Testing & Launch

### Testing
- [x] Test all pages load correctly
- [ ] Test forms submission
- [ ] Test admin panel
- [x] Test responsive design (mobile)
- [ ] Test SEO meta tags
- [ ] Test social sharing preview
- [ ] Test R2 stats caching
- [ ] Load testing (optional)

### Pre-Launch
- [ ] Final content review
- [ ] Proofread semua teks
- [ ] Check semua links
- [ ] Setup analytics (Cloudflare Web Analytics)
- [ ] Setup error tracking (Sentry)

### Launch
- [x] Deploy ke production
- [x] Verify SSL working
- [x] Test production site
- [ ] Announce soft launch ke inner circle

---

## Phase 6: Outreach Campaign

### Influencer Outreach
- [ ] Prepare outreach message templates
- [ ] Tier 1: Environmental influencers (pro-bono targets)
  - [ ] Pandawara Group
  - [ ] Sungai Watch
  - [ ] ZeroWasteID
  - [ ] Greenpeace ID
  - [ ] WALHI
- [ ] Tier 2: Mass reach (relationship building)
- [ ] Track outreach status
- [ ] Follow up

### Media Outreach
- [ ] Prepare press release
- [ ] List target media
- [ ] Pitch to journalists

### Coordinated Launch
- [ ] Set launch date
- [ ] Coordinate with committed influencers
- [ ] Prepare rapid response for viral moment

---

## Phase 7: Monitoring & Iteration

### Daily Monitoring
- [ ] Check website uptime
- [ ] Monitor social mentions
- [ ] Update leaderboard scores
- [ ] Add new politician statements

### Weekly Tasks
- [ ] Generate weekly report
- [ ] Update stats dan data
- [ ] Plan next week content
- [ ] Outreach follow-ups

### Iteration
- [ ] Collect feedback
- [ ] Fix bugs
- [ ] Add requested features
- [ ] Improve based on data

---

## Parking Lot (Future Ideas)
- [ ] Gamification: badges untuk supporters
- [ ] Map visualization: coverage per daerah
- [ ] API untuk third-party integration
- [ ] Mobile app (jika needed)
- [ ] Multi-language support
- [ ] Integration dengan petition platform
- [ ] Ambassador program

---

## Notes

### Prioritas Saat Ini
1. **Setup infrastructure** (domain, Cloudflare, Turso)
2. **Build MVP website** (homepage, leaderboard, tracker)
3. **Prepare content** (infografis, copy)
4. **Outreach influencers** (start conversations)

### Blockers
- (tambahkan jika ada)

### Decisions Needed
- (tambahkan jika ada keputusan yang pending)
