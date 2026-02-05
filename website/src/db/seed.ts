import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { politicians, influencers } from './schema';
import 'dotenv/config';

// Create database client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

const db = drizzle(client);

// Initial politicians data
const initialPoliticians = [
  {
    slug: 'siti-nurbaya-bakar',
    name: 'Siti Nurbaya Bakar',
    position: 'Menteri Lingkungan Hidup dan Kehutanan',
    party: 'Non-Partisan',
    bio: 'Menteri LHK periode 2019-2024, aktif dalam kebijakan lingkungan dan pengelolaan hutan.',
    twitterHandle: '@SitiNurbayaLHK',
    instagramHandle: '@sitinurbayalhk',
  },
  {
    slug: 'hanif-dhakiri',
    name: 'Hanif Dhakiri',
    position: 'Menteri Ketenagakerjaan',
    party: 'PKB',
    bio: 'Menteri Ketenagakerjaan dalam Kabinet Merah Putih, fokus pada penciptaan lapangan kerja.',
    twitterHandle: '@hanaborneo',
    instagramHandle: '@hanifdhakiri',
  },
  {
    slug: 'maudy-ayunda',
    name: 'Maudy Ayunda',
    position: 'Juru Bicara Presidensi G20',
    party: 'Non-Partisan',
    bio: 'Aktris, penyanyi, dan aktivis lingkungan. Pernah menjadi juru bicara presidensi G20 Indonesia.',
    twitterHandle: '@maborneo',
    instagramHandle: '@maborneo',
  },
];

// Initial influencers data  
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
    handle: '@sikiwatch',
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
    handle: '@greenaborneo_id',
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
        console.log(`  - Inserted: ${politician.name}`);
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
        console.log(`  - Inserted: ${influencer.name}`);
      } catch (e: any) {
        if (e.message?.includes('UNIQUE')) {
          console.log(`  - Skipped (exists): ${influencer.name}`);
        } else {
          throw e;
        }
      }
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seed();
