CREATE TABLE `admin_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `admin_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'admin',
	`last_login_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_username_unique` ON `admin_users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `influencer_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`influencer_id` integer NOT NULL,
	`platform` text NOT NULL,
	`post_url` text NOT NULL,
	`post_type` text,
	`likes` integer DEFAULT 0,
	`comments` integer DEFAULT 0,
	`shares` integer DEFAULT 0,
	`views` integer DEFAULT 0,
	`estimated_reach` integer DEFAULT 0,
	`posted_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`influencer_id`) REFERENCES `influencers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `influencers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`handle` text NOT NULL,
	`platform` text NOT NULL,
	`followers_count` integer DEFAULT 0,
	`engagement_rate` real DEFAULT 0,
	`tier` text DEFAULT 'bronze',
	`impact_score` integer DEFAULT 0,
	`photo_url` text,
	`is_verified` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`pic_name` text NOT NULL,
	`pic_email` text NOT NULL,
	`website` text,
	`partnership_type` text,
	`logo_url` text,
	`status` text DEFAULT 'pending',
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `politicians` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`position` text NOT NULL,
	`party` text,
	`photo_url` text,
	`bio` text,
	`twitter_handle` text,
	`instagram_handle` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `politicians_slug_unique` ON `politicians` (`slug`);--> statement-breakpoint
CREATE TABLE `statement_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`politician_name` text NOT NULL,
	`source_url` text NOT NULL,
	`quote` text NOT NULL,
	`reporter_email` text,
	`status` text DEFAULT 'pending',
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `statements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`politician_id` integer NOT NULL,
	`content` text NOT NULL,
	`source` text NOT NULL,
	`source_url` text NOT NULL,
	`sentiment` text DEFAULT 'netral' NOT NULL,
	`context` text,
	`statement_date` text NOT NULL,
	`is_verified` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`politician_id`) REFERENCES `politicians`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stats_cache` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stats_cache_key_unique` ON `stats_cache` (`key`);--> statement-breakpoint
CREATE TABLE `supporters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`city` text,
	`message` text,
	`is_public` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `supporters_email_unique` ON `supporters` (`email`);--> statement-breakpoint
CREATE TABLE `volunteers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`whatsapp` text,
	`role` text NOT NULL,
	`portfolio_url` text,
	`availability` text,
	`motivation` text,
	`status` text DEFAULT 'pending',
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `volunteers_email_unique` ON `volunteers` (`email`);