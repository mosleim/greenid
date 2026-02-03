# PATH F: Strategi Viral & Influencer - Execution Plan

## Visi

Membangun gerakan viral yang menggabungkan kekuatan influencer dari berbagai spektrum untuk menciptakan tekanan publik yang tidak bisa diabaikan pemerintah, dengan **website sebagai pusat koordinasi dan transparansi**.

---

## WEBSITE: Platform Tracking & Gamifikasi

### Konsep Website

Website berfungsi sebagai:
1. **Public Dashboard** - semua orang bisa melihat progress gerakan
2. **Influencer Leaderboard** - gamifikasi siapa yang paling berimpact
3. **Politician Tracker** - rekam jejak pernyataan pejabat
4. **Evidence Repository** - kumpulkan semua bukti dan data
5. **Call to Action Hub** - tempat orang bergabung dan berkontribusi

### Nama Website (Opsi)

| Opsi | Keterangan |
|------|------------|
| **buyback.my.id** | Domain yang dipilih |
| **kemasankembali.id** | Deskriptif, bahasa Indonesia |
| **plastikbalik.id** | Catchy, clear message |
| **daurulang.id** | Lebih luas dari sekedar buyback |
| **greenid.org** | Umbrella organization |
| **sampahkita.id** | Ownership feeling |

*Domain: **buyback.my.id***

### Struktur Website

```
Homepage
├── Hero: "Indonesia Bisa Bebas Sampah Plastik"
├── Live Counter: Total dukungan, impressions, pejabat yang sudah statement
└── CTA: Dukung Sekarang

/tentang
├── Penjelasan kebijakan buyback
├── Infografis dampak
└── FAQ

/leaderboard
├── Influencer Rankings (by impact score)
├── Daerah Rankings (by participation)
└── Weekly/Monthly champions

/tracker
├── Politician Statements Timeline
├── Filter by: Pro / Netral / Kontra
├── Evidence links (video, artikel)
└── Progress kebijakan

/data
├── Volume sampah plastik Indonesia
├── Potensi ekonomi buyback
├── Perbandingan internasional
└── Research papers

/aksi
├── Download kit untuk posting
├── Template pesan ke DPR
├── Petisi online
└── Event calendar

/bergabung
├── Daftar sebagai influencer
├── Daftar sebagai volunteer
└── Donasi (jika applicable)
```

### Fitur Gamifikasi Influencer

#### Leaderboard Metrics

| Metric | Bobot | Cara Ukur |
|--------|-------|-----------|
| **Reach** | 30% | Total impressions dari konten terkait |
| **Engagement** | 25% | Likes + Comments + Shares |
| **Conversion** | 20% | Klik ke website, sign petition |
| **Quality** | 15% | Sentiment analysis, relevance |
| **Consistency** | 10% | Frekuensi posting |

#### Tiers & Badges

| Tier | Requirement | Badge |
|------|-------------|-------|
| **Bronze** | 10K impressions | 🥉 Pendukung |
| **Silver** | 100K impressions | 🥈 Pejuang Lingkungan |
| **Gold** | 1M impressions | 🥇 Duta Buyback |
| **Platinum** | 10M impressions | 💎 Champion Nasional |

#### Rewards (Non-Monetary)

- Featured di homepage website
- Exclusive webinar dengan experts
- Certificate of appreciation
- Media mention
- Access ke inner circle strategy meeting
- First to know tentang progress kebijakan

### Politician Tracker Features

```
/tracker/[nama-pejabat]

├── Profile
│   ├── Nama, jabatan, partai
│   ├── Komisi/kementerian terkait
│   └── Contact info publik

├── Statements Timeline
│   ├── [Tanggal] "Pernyataan..." - Source link
│   ├── Classification: 🟢 Pro / 🟡 Netral / 🔴 Kontra
│   └── Context & analysis

├── Voting Record (jika ada)
│   └── Posisi pada RUU terkait lingkungan

├── Engagement Score
│   └── Seberapa responsif terhadap isu ini

└── Public Pressure Meter
    └── Berapa banyak pesan yang sudah dikirim ke pejabat ini
```

### Tech Stack (Saran)

| Component | Technology | Alasan |
|-----------|------------|--------|
| Frontend | Next.js / Astro | SEO-friendly, fast |
| Backend | Supabase / Firebase | Quick setup, realtime |
| Analytics | Plausible / Umami | Privacy-friendly |
| Social tracking | Manual + API | Instagram API terbatas |
| Hosting | Vercel / Netlify | Free tier cukup |

---

## DAFTAR INFLUENCER TARGET

### Tier 1: Influencer Lingkungan (High Probability Pro-Bono)

| Nama/Akun | Platform | Followers | Kontak Approach | Pro-Bono? |
|-----------|----------|-----------|-----------------|-----------|
| **Pandawara Group** | TikTok, IG, YT | 10M+ | DM Instagram, email management | ⭐⭐⭐⭐⭐ Sangat mungkin |
| **Sungai Watch** | IG, YT | 500K+ | hello@sungai.watch | ⭐⭐⭐⭐⭐ Core mission align |
| **Gary Bencheghib** | Multi | 200K+ | Via Sungai Watch | ⭐⭐⭐⭐⭐ Activist |
| **Melati Wijsen** | Multi | 300K+ | management | ⭐⭐⭐⭐ Youth activist |
| **@ZeroWasteID** | IG | 100K+ | DM | ⭐⭐⭐⭐ Mission align |
| **Waste4Change** | Multi | 150K+ | Official email | ⭐⭐⭐⭐ CSR angle |
| **Sustaination** | IG | 80K+ | DM | ⭐⭐⭐⭐ Eco-business |
| **@GreenpeaceID** | Multi | 500K+ | Campaign team | ⭐⭐⭐⭐ Advocacy org |
| **@WALHInasional** | Multi | 100K+ | Official | ⭐⭐⭐⭐ Environmental NGO |

### Tier 2: Influencer Pro-Pemerintah (Paid atau Relationship)

| Nama/Akun | Platform | Followers | Angle | Approach |
|-----------|----------|-----------|-------|----------|
| **Ferdinand Hutahaean** | Twitter | 400K+ | Kesejahteraan rakyat kecil | Paid/relationship |
| **Denny Siregar** | Multi | 5M+ | Dukung program pemerintah | Paid, perlu framing hati-hati |
| **Eko Kuntadhi** | Twitter | 400K+ | Policy analysis | Relationship |
| **Abu Janda** | Multi | 1M+ | Populis | Paid |
| Buzzer network | Various | Varies | Mass amplification | Koordinator |

*Note: Approach harus framing "membantu pemerintah" bukan kritik*

### Tier 3: Influencer Kritis (Pressure dari sisi lain)

| Nama/Akun | Platform | Followers | Angle | Approach |
|-----------|----------|-----------|-------|----------|
| **Rocky Gerung** | YT, Twitter | 2M+ | Intellectual criticism | Relationship, pro-bono jika tertarik |
| **Faizal Assegaf** | Twitter | 300K+ | Policy critic | Pitch isu |
| **Refly Harun** | YT | 1M+ | Constitutional expert | Expert opinion angle |
| **Various political commentators** | Twitter | Varies | Accountability | Organic engagement |

*Note: Jangan terlihat berkoordinasi dengan pro-pemerintah, biarkan organik*

### Tier 4: Mass Reach Influencer

| Nama/Akun | Platform | Followers | Approach | Pro-Bono? |
|-----------|----------|-----------|----------|-----------|
| **Baim Wong** | Multi | 20M+ | Philanthropy angle | ⭐⭐⭐ Mungkin jika ada event |
| **Ria Ricis** | Multi | 30M+ | Fun challenge | ⭐⭐ Perlu bayar |
| **Raffi Ahmad** | Multi | 60M+ | Campaign sosial | ⭐⭐ Perlu bayar atau government push |
| **Jerome Polin** | YT | 15M+ | Edukasi | ⭐⭐⭐ Mungkin, smart content |
| **Gita Savitri** | YT | 1M+ | Sustainability, Jerman | ⭐⭐⭐⭐ Pro-bono possible |

### Tier 5: Media & Journalist

| Nama/Media | Platform | Reach | Approach |
|------------|----------|-------|----------|
| **Narasi TV** | YT, Multi | 5M+ | Pitch story |
| **Asumsi** | YT | 1M+ | Policy angle |
| **Kumparan** | Online | 10M+ | Press release |
| **Tempo** | Multi | 5M+ | Investigative angle |
| **Kompas** | Multi | 10M+ | Feature story |
| **Vice Indonesia** | Multi | 2M+ | Youth angle |

---

## CONTENT STRATEGY

### Content Pillars

#### Pillar 1: Data & Fakta
- Infografis volume sampah
- Perhitungan ekonomi buyback
- Perbandingan internasional

#### Pillar 2: Human Stories
- Profil pemulung
- Cerita sukses (jika ada pilot)
- Impact testimonial

#### Pillar 3: Solution-Oriented
- Penjelasan mekanisme buyback
- Best practices dari negara lain
- Langkah konkret yang bisa dilakukan

#### Pillar 4: Call to Action
- Petition
- Contact pejabat
- Share & amplify

### Content Calendar (Week 1-4 Launch)

| Week | Theme | Content |
|------|-------|---------|
| **Week 1** | Awareness | Infografis masalah, data shocking |
| **Week 2** | Solution | Penjelasan buyback, success stories luar negeri |
| **Week 3** | Human | Cerita pemulung, impact ke rakyat kecil |
| **Week 4** | Action | Petition launch, politician tracker live |

### Ready-to-Use Content Kit

Siapkan untuk influencer:
- [ ] 5 infografis siap posting
- [ ] 3 video pendek (15-60 detik)
- [ ] 10 caption templates
- [ ] Hashtag set: #BuybackIndonesia #KemasanKembali #PelukPemulung
- [ ] Talking points document
- [ ] FAQ untuk reply comments

---

## OUTREACH STRATEGY

### Phase 1: Core Coalition (Week 1-2)

**Target:** 5-10 environmental influencers yang pasti pro-bono

**Approach:**
1. Personal DM dengan context jelas
2. Share dokumen lengkap (gagasan, analisis dampak)
3. Invite ke private briefing (Zoom)
4. Ask commitment untuk launch day

**Template Message:**

```
Halo [Nama],

Kami tim dari [nama gerakan] yang sedang mendorong kebijakan buyback kemasan plastik di Indonesia - sistem di mana konsumen bisa kembalikan kemasan dan dapat uang, seperti di Jerman.

Kami sangat mengapresiasi kerja [nama] di bidang lingkungan, dan ingin mengajak kolaborasi untuk gerakan ini.

Kami sudah siapkan:
- Analisis dampak lengkap
- Website tracking progress
- Content kit siap pakai

Apakah [nama] berkenan untuk briefing singkat 30 menit minggu ini?

Terima kasih,
[Nama]
```

### Phase 2: Coordinated Launch (Week 3-4)

**D-Day Strategy:**
- Semua influencer posting dalam window 24-48 jam
- Staggered timing untuk sustain trending
- Cross-tagging dan engagement satu sama lain
- Website live dengan leaderboard

### Phase 3: Sustained Amplification (Week 5+)

- Weekly content drops
- React to current events (terkait sampah, MBG, dll)
- Leaderboard updates
- Politician response tracking

---

## MONITORING & MEASUREMENT

### Tools

| Purpose | Tool | Cost |
|---------|------|------|
| Social listening | Brand24 / Mention | $$$ |
| Hashtag tracking | Hashtagify / Manual | $ |
| Website analytics | Plausible | $ |
| Sentiment analysis | Manual + AI assist | $ |
| Influencer tracking | Manual spreadsheet | Free |

### Weekly Report Template

```
WEEKLY REPORT #[X]

Period: [Date] - [Date]

REACH METRICS
- Total impressions: [X]
- Total engagement: [X]
- Website visits: [X]
- Petition signatures: [X]

INFLUENCER LEADERBOARD
1. [Name] - [Score]
2. [Name] - [Score]
3. [Name] - [Score]

POLITICIAN TRACKER UPDATE
- New statements: [List]
- Sentiment shift: [Analysis]

MEDIA COVERAGE
- [Media 1]: [Headline] - [Link]
- [Media 2]: [Headline] - [Link]

KEY MOMENTS
- [Highlight 1]
- [Highlight 2]

NEXT WEEK PLAN
- [Action 1]
- [Action 2]
```

---

## BUDGET ESTIMATE

### Minimal Budget (Grassroots)

| Item | Cost | Note |
|------|------|------|
| Domain & hosting | Rp 11K/tahun | buyback.my.id |
| Design tools | Rp 0 | Canva free |
| Content production | Rp 0 | DIY + volunteer |
| Influencer | Rp 0 | Pro-bono only |
| **Total** | **< Rp 1 juta** | |

### Moderate Budget

| Item | Cost | Note |
|------|------|------|
| Domain & hosting | Rp 1 juta/tahun | Better hosting |
| Design | Rp 5 juta | Professional infografis |
| Video production | Rp 10 juta | 3-5 quality videos |
| Micro-influencers | Rp 10 juta | 5-10 orang |
| Paid boost | Rp 10 juta | Social media ads |
| **Total** | **Rp 36 juta** | |

### Full Campaign Budget

| Item | Cost | Note |
|------|------|------|
| Website development | Rp 20 juta | Custom platform |
| Design & branding | Rp 15 juta | Full brand kit |
| Video production | Rp 30 juta | Documentary-style |
| Influencer fees | Rp 50 juta | Mid-tier influencers |
| Paid media | Rp 30 juta | Sustained campaign |
| PR agency | Rp 25 juta | Media relations |
| Events | Rp 20 juta | Launch event, press con |
| Contingency | Rp 10 juta | Buffer |
| **Total** | **Rp 200 juta** | |

---

## IMMEDIATE NEXT STEPS

### Week 1

- [ ] Finalisasi nama website & secure domain
- [ ] Buat wireframe website
- [ ] Draft content kit (5 infografis, 3 video concept)
- [ ] List 20 influencer dengan contact info
- [ ] Draft outreach message

### Week 2

- [ ] Mulai development website (MVP)
- [ ] Reach out ke 5 core environmental influencers
- [ ] Brief designer untuk infografis
- [ ] Setup social media accounts untuk campaign

### Week 3

- [ ] Website MVP live
- [ ] First batch content ready
- [ ] Confirm 5+ influencer untuk launch
- [ ] Prepare media kit untuk press

### Week 4

- [ ] Coordinated launch
- [ ] Monitor & respond
- [ ] Iterate based on feedback

---

## RISK MANAGEMENT

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low influencer participation | Medium | High | Over-recruit, have backup list |
| Negative backlash | Low | Medium | Prepare crisis response |
| Government ignores | Medium | Medium | Escalate pressure, find champions |
| Industry counter-campaign | Medium | Medium | Preempt with industry allies |
| Burnout team | High | High | Sustainable pace, celebrate wins |
| Viral but no follow-up | Medium | High | Prepare proposals before launch |

---

## SUCCESS METRICS

### Short-term (1 month)
- [ ] Website live dengan 10K+ visitors
- [ ] 10+ influencer participating
- [ ] 100K+ social media impressions
- [ ] 1+ media coverage

### Medium-term (3 months)
- [ ] 1M+ impressions
- [ ] 50K+ petition signatures
- [ ] 5+ politician statements
- [ ] Formal meeting dengan pejabat

### Long-term (6-12 months)
- [ ] Draft regulasi dibahas
- [ ] Pilot project dimulai
- [ ] Sustained public awareness >50%
- [ ] Policy progress measurable

---

## APPENDIX

### Hashtag Strategy

**Primary:**
- #BuybackIndonesia
- #KemasanKembali

**Secondary:**
- #IndonesiaBersih
- #DaurUlangSekarang
- #PlastikBalik
- #PelukPemulung

**Trending Hook:**
- #MBGBerkelanjutan (jika ada momentum MBG)
- #[CurrentEvent]Plastik (reactive)

### Key Messages

1. "Setiap kemasan punya nilai - kembalikan dan dapat uang"
2. "Pemulung adalah pahlawan lingkungan yang pantas sejahtera"
3. "Indonesia bisa jadi pemimpin daur ulang di Asia"
4. "Buyback = win untuk konsumen, pemulung, dan lingkungan"
5. "Pemerintah yang peduli rakyat kecil, pasti dukung buyback"
