import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable, real } from 'drizzle-orm/sqlite-core';

// Supporters - orang yang mendukung kebijakan buyback
export const supporters = sqliteTable('supporters', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  city: text('city'),
  message: text('message'),
  isPublic: integer('is_public', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Influencers - influencer yang mendukung kampanye
export const influencers = sqliteTable('influencers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  handle: text('handle').notNull(), // @username
  platform: text('platform').notNull(), // instagram, tiktok, twitter, youtube
  followersCount: integer('followers_count').default(0),
  engagementRate: real('engagement_rate').default(0), // 0-100
  tier: text('tier').default('bronze'), // bronze, silver, gold, platinum
  impactScore: integer('impact_score').default(0),
  photoUrl: text('photo_url'),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Influencer posts - konten yang dibuat influencer terkait kampanye
export const influencerPosts = sqliteTable('influencer_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  influencerId: integer('influencer_id').notNull().references(() => influencers.id),
  platform: text('platform').notNull(),
  postUrl: text('post_url').notNull(),
  postType: text('post_type'), // post, story, reel, video
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  shares: integer('shares').default(0),
  views: integer('views').default(0),
  estimatedReach: integer('estimated_reach').default(0),
  postedAt: text('posted_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Politicians - pejabat yang dipantau
export const politicians = sqliteTable('politicians', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  position: text('position').notNull(),
  party: text('party'),
  photoUrl: text('photo_url'),
  bio: text('bio'),
  twitterHandle: text('twitter_handle'),
  instagramHandle: text('instagram_handle'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Statements - pernyataan pejabat
export const statements = sqliteTable('statements', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  politicianId: integer('politician_id').notNull().references(() => politicians.id),
  content: text('content').notNull(),
  source: text('source').notNull(), // nama media/platform
  sourceUrl: text('source_url').notNull(),
  sentiment: text('sentiment').notNull().default('netral'), // pro, kontra, netral
  context: text('context'), // konteks tambahan
  statementDate: text('statement_date').notNull(),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Volunteers - relawan
export const volunteers = sqliteTable('volunteers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  whatsapp: text('whatsapp'),
  role: text('role').notNull(), // content_creator, social_media, research, developer, organizer
  portfolioUrl: text('portfolio_url'),
  availability: text('availability'), // 1-2, 3-5, 5-10, 10+
  motivation: text('motivation'),
  status: text('status').default('pending'), // pending, active, inactive
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Organizations - organisasi mitra
export const organizations = sqliteTable('organizations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').notNull(), // ngo, community, company, government, academic, media
  picName: text('pic_name').notNull(),
  picEmail: text('pic_email').notNull(),
  website: text('website'),
  partnershipType: text('partnership_type'),
  logoUrl: text('logo_url'),
  status: text('status').default('pending'), // pending, active, inactive
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Statement reports - laporan pernyataan dari publik
export const statementReports = sqliteTable('statement_reports', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  politicianName: text('politician_name').notNull(),
  sourceUrl: text('source_url').notNull(),
  quote: text('quote').notNull(),
  reporterEmail: text('reporter_email'),
  status: text('status').default('pending'), // pending, verified, rejected
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Stats cache - untuk backup jika R2 tidak available
export const statsCache = sqliteTable('stats_cache', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(), // JSON string
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Admin users - untuk akses admin panel
export const adminUsers = sqliteTable('admin_users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('admin'), // admin, superadmin
  lastLoginAt: text('last_login_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Admin sessions - untuk session management
export const adminSessions = sqliteTable('admin_sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => adminUsers.id),
  expiresAt: integer('expires_at').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Types for TypeScript
export type Supporter = typeof supporters.$inferSelect;
export type NewSupporter = typeof supporters.$inferInsert;

export type Influencer = typeof influencers.$inferSelect;
export type NewInfluencer = typeof influencers.$inferInsert;

export type InfluencerPost = typeof influencerPosts.$inferSelect;
export type NewInfluencerPost = typeof influencerPosts.$inferInsert;

export type Politician = typeof politicians.$inferSelect;
export type NewPolitician = typeof politicians.$inferInsert;

export type Statement = typeof statements.$inferSelect;
export type NewStatement = typeof statements.$inferInsert;

export type Volunteer = typeof volunteers.$inferSelect;
export type NewVolunteer = typeof volunteers.$inferInsert;

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type StatementReport = typeof statementReports.$inferSelect;
export type NewStatementReport = typeof statementReports.$inferInsert;
