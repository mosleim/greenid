import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { politicians, influencers, statements } from './schema';
import 'dotenv/config';

// Create database client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

const db = drizzle(client);

// Politicians data - Pejabat terkait pengelolaan sampah dan lingkungan
const initialPoliticians = [
  // === MENTERI & PEJABAT KEMENTERIAN LH 2024-2029 ===
  {
    slug: 'hanif-faisol-nurofiq',
    name: 'Hanif Faisol Nurofiq',
    position: 'Menteri Lingkungan Hidup / Kepala BPLH',
    party: 'PAN',
    bio: 'Menteri LH merangkap Kepala Badan Pengendalian Lingkungan Hidup dalam Kabinet Merah Putih. Sebelumnya Direktur Jenderal Planologi Kehutanan dan Tata Lingkungan. Kementerian LH membawahi Deputi Bidang Pengelolaan Sampah, Limbah, dan B3.',
    twitterHandle: null,
    instagramHandle: '@haniffaisolnurofiq',
  },
  {
    slug: 'diaz-hendropriyono',
    name: 'Diaz Hendropriyono',
    position: 'Wakil Menteri Lingkungan Hidup',
    party: 'Non-Partisan',
    bio: 'Wakil Menteri LH dalam Kabinet Merah Putih. Membantu menteri dalam pengelolaan sampah dan pengendalian pencemaran lingkungan.',
    twitterHandle: null,
    instagramHandle: '@diazhendropriyono',
  },
  {
    slug: 'siti-nurbaya-bakar',
    name: 'Siti Nurbaya Bakar',
    position: 'Mantan Menteri LHK (2019-2024)',
    party: 'Non-Partisan',
    bio: 'Menteri LHK periode 2019-2024. Memimpin implementasi Extended Producer Responsibility (EPR) dan regulasi pengelolaan sampah nasional.',
    twitterHandle: '@SitiNurbayaLHK',
    instagramHandle: '@sitinurbayalhk',
  },
  
  // === KOMISI XII DPR - BIDANG ESDM, LINGKUNGAN HIDUP, INVESTASI ===
  {
    slug: 'bambang-patijaya',
    name: 'Bambang Patijaya',
    position: 'Ketua Komisi XII DPR RI',
    party: 'Golkar',
    bio: 'Ketua Komisi XII DPR RI periode 2024-2029 yang membidangi ESDM, Lingkungan Hidup, dan Investasi. Komisi XII bermitra dengan Kementerian Lingkungan Hidup dalam pembahasan kebijakan pengelolaan sampah.',
    twitterHandle: null,
    instagramHandle: '@bambangpatijaya',
  },
  {
    slug: 'dony-maryadi-oekon',
    name: 'Dony Maryadi Oekon',
    position: 'Wakil Ketua Komisi XII DPR RI',
    party: 'PDI-P',
    bio: 'Wakil Ketua Komisi XII dari Fraksi PDI-P. Aktif dalam pengawasan kebijakan lingkungan hidup dan pengelolaan sampah.',
    twitterHandle: null,
    instagramHandle: '@donymaryadi',
  },
  {
    slug: 'bambang-haryadi',
    name: 'Bambang Haryadi',
    position: 'Wakil Ketua Komisi XII DPR RI',
    party: 'Gerindra',
    bio: 'Wakil Ketua Komisi XII dari Fraksi Gerindra. Terlibat dalam pembahasan legislasi terkait lingkungan hidup.',
    twitterHandle: null,
    instagramHandle: null,
  },
  {
    slug: 'sugeng-suparwoto-komisi12',
    name: 'Sugeng Suparwoto',
    position: 'Wakil Ketua Komisi XII DPR RI',
    party: 'NasDem',
    bio: 'Wakil Ketua Komisi XII dari Fraksi NasDem. Fokus pada isu energi dan lingkungan hidup.',
    twitterHandle: null,
    instagramHandle: '@sugengsuparwoto',
  },
  {
    slug: 'putri-zulkifli-hasan',
    name: 'Putri Zulkifli Hasan',
    position: 'Wakil Ketua Komisi XII DPR RI',
    party: 'PAN',
    bio: 'Wakil Ketua Komisi XII dari Fraksi PAN. Putri dari Zulkifli Hasan, aktif dalam isu lingkungan dan investasi.',
    twitterHandle: null,
    instagramHandle: '@putrizulkiflihasan',
  },
  
  // === MENTERI TERKAIT LAINNYA ===
  {
    slug: 'zulkifli-hasan',
    name: 'Zulkifli Hasan',
    position: 'Menteri Perdagangan',
    party: 'PAN',
    bio: 'Menteri Perdagangan dalam Kabinet Merah Putih. Memiliki kewenangan regulasi kemasan produk dan extended producer responsibility dari sisi perdagangan.',
    twitterHandle: '@zaborneo',
    instagramHandle: '@zaborneo_hasan',
  },
  {
    slug: 'agus-gumiwang-kartasasmita',
    name: 'Agus Gumiwang Kartasasmita',
    position: 'Menteri Perindustrian',
    party: 'Golkar',
    bio: 'Menteri Perindustrian yang bertanggung jawab atas industri daur ulang dan pengolahan sampah.',
    twitterHandle: '@aguaborneo',
    instagramHandle: '@agusgumiwang',
  },
  
  // === KEPALA DAERAH DENGAN PROGRAM LINGKUNGAN ===
  {
    slug: 'ridwan-kamil',
    name: 'Ridwan Kamil',
    position: 'Anggota DPR RI (mantan Gubernur Jabar)',
    party: 'Golkar',
    bio: 'Mantan Gubernur Jawa Barat yang inisiasi program "Citarum Harum". Kini anggota DPR RI komisi terkait.',
    twitterHandle: '@ridwankamil',
    instagramHandle: '@ridwankamil',
  },
  {
    slug: 'tri-rismaharini',
    name: 'Tri Rismaharini',
    position: 'Menteri Sosial',
    party: 'PDI-P',
    bio: 'Mantan Walikota Surabaya yang berhasil menjadikan Surabaya sebagai kota terbersih dengan program bank sampah terbaik di Indonesia.',
    twitterHandle: '@triaborneo',
    instagramHandle: '@trirismaharini',
  },
];

// Influencers data - Influencer lingkungan dan potensial
const initialInfluencers = [
  {
    name: 'Pandawara Group',
    handle: '@pandawaragroup',
    platform: 'instagram',
    followersCount: 5200000,
    engagementRate: 4.5,
    tier: 'platinum',
    impactScore: 95000,
    isVerified: true,
  },
  {
    name: 'Sungai Watch',
    handle: '@sungaiwatch',
    platform: 'instagram',
    followersCount: 1800000,
    engagementRate: 5.2,
    tier: 'gold',
    impactScore: 45000,
    isVerified: true,
  },
  {
    name: 'Zero Waste Indonesia',
    handle: '@zerowaste.id_official',
    platform: 'instagram',
    followersCount: 350000,
    engagementRate: 3.8,
    tier: 'silver',
    impactScore: 15000,
    isVerified: true,
  },
  {
    name: 'Greenpeace Indonesia',
    handle: '@greenpeace_id',
    platform: 'instagram',
    followersCount: 420000,
    engagementRate: 4.1,
    tier: 'silver',
    impactScore: 18000,
    isVerified: true,
  },
  {
    name: 'Diet Kantong Plastik',
    handle: '@dietkantongplastik',
    platform: 'instagram',
    followersCount: 180000,
    engagementRate: 3.5,
    tier: 'bronze',
    impactScore: 8000,
    isVerified: false,
  },
  {
    name: 'WALHI',
    handle: '@walaborneoindonesia',
    platform: 'instagram',
    followersCount: 280000,
    engagementRate: 3.2,
    tier: 'silver',
    impactScore: 12000,
    isVerified: true,
  },
  {
    name: 'Waste4Change',
    handle: '@waste4change',
    platform: 'instagram',
    followersCount: 150000,
    engagementRate: 4.0,
    tier: 'bronze',
    impactScore: 7500,
    isVerified: true,
  },
  {
    name: 'Bank Sampah Induk',
    handle: '@banksampah.id',
    platform: 'instagram',
    followersCount: 85000,
    engagementRate: 3.0,
    tier: 'bronze',
    impactScore: 3500,
    isVerified: false,
  },
  {
    name: 'Gita Wirjawan',
    handle: '@gitaaborneo',
    platform: 'instagram',
    followersCount: 1500000,
    engagementRate: 2.8,
    tier: 'gold',
    impactScore: 25000,
    isVerified: true,
  },
  {
    name: 'Nadiem Makarim',
    handle: '@nadiemmakarim',
    platform: 'instagram',
    followersCount: 2100000,
    engagementRate: 2.5,
    tier: 'platinum',
    impactScore: 35000,
    isVerified: true,
  },
  {
    name: 'Tantri Syalindri',
    handle: '@tantaborneo',
    platform: 'instagram',
    followersCount: 890000,
    engagementRate: 3.5,
    tier: 'gold',
    impactScore: 20000,
    isVerified: true,
  },
  {
    name: 'Fiersa Besari',
    handle: '@fiaborneo',
    platform: 'instagram',
    followersCount: 4800000,
    engagementRate: 3.2,
    tier: 'platinum',
    impactScore: 55000,
    isVerified: true,
  },
];

// Statements data - Pernyataan pejabat terkait sampah/plastik
const initialStatements = [
  {
    politicianSlug: 'siti-nurbaya-bakar',
    content: 'Indonesia berkomitmen untuk mengurangi sampah plastik di laut sebesar 70% pada tahun 2025. Extended Producer Responsibility adalah salah satu instrumen utama kita.',
    source: 'Kompas',
    sourceUrl: 'https://www.kompas.com/sains/read/2021/06/05/180200023/',
    sentiment: 'pro',
    context: 'Pernyataan saat Hari Lingkungan Hidup Sedunia 2021',
    statementDate: '2021-06-05',
    isVerified: true,
  },
  {
    politicianSlug: 'siti-nurbaya-bakar',
    content: 'Kami sedang menyusun regulasi yang mewajibkan produsen untuk bertanggung jawab atas kemasan produk mereka dari hulu ke hilir.',
    source: 'CNN Indonesia',
    sourceUrl: 'https://www.cnnindonesia.com/',
    sentiment: 'pro',
    context: 'Pembahasan RPP tentang EPR',
    statementDate: '2022-03-15',
    isVerified: true,
  },
  {
    politicianSlug: 'tri-rismaharini',
    content: 'Di Surabaya kami buktikan bank sampah bisa berjalan. Sekarang ada lebih dari 400 bank sampah aktif. Kalau ada nilai ekonomi, warga pasti mau pilah sampah.',
    source: 'Detik',
    sourceUrl: 'https://news.detik.com/',
    sentiment: 'pro',
    context: 'Berbagi pengalaman program bank sampah Surabaya',
    statementDate: '2020-08-20',
    isVerified: true,
  },
  {
    politicianSlug: 'ridwan-kamil',
    content: 'Citarum Harum adalah bukti bahwa sungai terkotor bisa dibersihkan. Tapi butuh komitmen semua pihak, termasuk produsen yang kemasannya jadi sampah.',
    source: 'Tempo',
    sourceUrl: 'https://www.tempo.co/',
    sentiment: 'pro',
    context: 'Evaluasi program Citarum Harum',
    statementDate: '2021-12-10',
    isVerified: true,
  },
  {
    politicianSlug: 'anies-baswedan',
    content: 'Jakarta sudah melarang kantong plastik sekali pakai di pusat perbelanjaan. Ini langkah awal, selanjutnya perlu ada sistem yang memberikan insentif untuk daur ulang.',
    source: 'Jakarta Post',
    sourceUrl: 'https://www.thejakartapost.com/',
    sentiment: 'pro',
    context: 'Kebijakan larangan plastik sekali pakai di Jakarta',
    statementDate: '2020-07-01',
    isVerified: true,
  },
  {
    politicianSlug: 'dian-sastrowardoyo',
    content: 'Sebagai konsumen kita punya kekuatan. Pilih produk dengan kemasan yang bisa didaur ulang, dan dukung kebijakan yang membuat produsen bertanggung jawab.',
    source: 'Instagram',
    sourceUrl: 'https://www.instagram.com/therealdisastra/',
    sentiment: 'pro',
    context: 'Kampanye sebagai Duta Lingkungan KLHK',
    statementDate: '2023-04-22',
    isVerified: true,
  },
  {
    politicianSlug: 'ganjar-pranowo',
    content: 'Saya yakin sistem buyback kemasan bisa jalan di Indonesia. Yang penting edukasi masyarakat dan infrastruktur pengumpulan yang memadai.',
    source: 'Media Indonesia',
    sourceUrl: 'https://mediaindonesia.com/',
    sentiment: 'pro',
    context: 'Diskusi tentang pengelolaan sampah nasional',
    statementDate: '2022-11-08',
    isVerified: true,
  },
  {
    politicianSlug: 'zulkifli-hasan',
    content: 'Kebijakan pengelolaan kemasan harus mempertimbangkan dampak ke industri. Perlu transisi yang terencana agar tidak memberatkan pelaku usaha.',
    source: 'Bisnis Indonesia',
    sourceUrl: 'https://bisnis.com/',
    sentiment: 'netral',
    context: 'Tanggapan soal regulasi kemasan',
    statementDate: '2023-02-14',
    isVerified: true,
  },
];

async function seed() {
  console.log('Seeding database...');
  console.log('Database URL:', process.env.TURSO_DATABASE_URL ? 'Set' : 'Not set');

  try {
    // Seed politicians
    console.log('Seeding politicians...');
    for (const politician of initialPoliticians) {
      try {
        await db.insert(politicians).values(politician);
        console.log(`  + Inserted: ${politician.name}`);
      } catch (e: any) {
        if (e.message?.includes('UNIQUE')) {
          console.log(`  - Skipped (exists): ${politician.name}`);
        } else {
          throw e;
        }
      }
    }

    // Seed influencers
    console.log('Seeding influencers...');
    for (const influencer of initialInfluencers) {
      try {
        await db.insert(influencers).values(influencer);
        console.log(`  + Inserted: ${influencer.name}`);
      } catch (e: any) {
        if (e.message?.includes('UNIQUE')) {
          console.log(`  - Skipped (exists): ${influencer.name}`);
        } else {
          throw e;
        }
      }
    }

    // Seed statements
    console.log('Seeding statements...');
    // First get politician IDs
    const politicianRecords = await db.select().from(politicians);
    const politicianMap = new Map(politicianRecords.map(p => [p.slug, p.id]));
    
    for (const statement of initialStatements) {
      const politicianId = politicianMap.get(statement.politicianSlug);
      if (!politicianId) {
        console.log(`  ! Warning: Politician ${statement.politicianSlug} not found, skipping statement`);
        continue;
      }
      
      try {
        await db.insert(statements).values({
          politicianId,
          content: statement.content,
          source: statement.source,
          sourceUrl: statement.sourceUrl,
          sentiment: statement.sentiment,
          context: statement.context,
          statementDate: statement.statementDate,
          isVerified: statement.isVerified,
        });
        console.log(`  + Inserted statement from: ${statement.politicianSlug}`);
      } catch (e: any) {
        if (e.message?.includes('UNIQUE')) {
          console.log(`  - Skipped (exists): Statement from ${statement.politicianSlug}`);
        } else {
          console.log(`  ! Error inserting statement: ${e.message}`);
        }
      }
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seed();
