CREATE TYPE "public"."activity_type" AS ENUM('donation', 'tag', 'note', 'follow', 'achievement');--> statement-breakpoint
CREATE TYPE "public"."user_level" AS ENUM('Beginner', 'Contributor', 'Supporter', 'Champion');--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"icon" text NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"criteria" text,
	"points" integer DEFAULT 10
);
--> statement-breakpoint
CREATE TABLE "cached_donations" (
	"id" serial PRIMARY KEY NOT NULL,
	"tx_hash" varchar(66),
	"donor_address" varchar(42) NOT NULL,
	"project_id" varchar(100) NOT NULL,
	"amount" numeric(20, 0) NOT NULL,
	"token_address" varchar(42),
	"donated_at" timestamp DEFAULT now(),
	CONSTRAINT "cached_donations_tx_hash_unique" UNIQUE("tx_hash")
);
--> statement-breakpoint
CREATE TABLE "cached_projects" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"creator_address" varchar(42) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"image_url" text,
	"funding_goal" numeric(20, 0),
	"current_funding" numeric(20, 0) DEFAULT '0',
	"start_time" timestamp,
	"end_time" timestamp,
	"funding_model" integer,
	"is_active" boolean DEFAULT true,
	"last_sync" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"icon" text,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "community_note_votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"note_id" integer,
	"user_id" integer,
	"is_upvote" boolean NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" varchar(100) NOT NULL,
	"author_id" integer,
	"text" text NOT NULL,
	"tags" text[],
	"upvotes" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" varchar(100) NOT NULL,
	"user_id" integer,
	"text" varchar(100) NOT NULL,
	"count" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_metadata" (
	"project_id" varchar(100) PRIMARY KEY NOT NULL,
	"category" varchar(50) NOT NULL,
	"tags" text[],
	"sponsor_boosted" boolean DEFAULT false,
	"views_count" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"achievement_id" integer NOT NULL,
	"unlocked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"activity_type" "activity_type",
	"project_id" varchar(100),
	"tx_hash" varchar(66),
	"points_earned" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_id" integer,
	"following_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"currency" varchar(10) DEFAULT 'CENTS',
	"language" varchar(5) DEFAULT 'en',
	"region" varchar(5) DEFAULT 'US',
	"default_donation_amount" numeric(10, 6) DEFAULT '0.01',
	"auto_batch" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_address" varchar(42) NOT NULL,
	"username" varchar(100),
	"avatar_url" text,
	"reputation" integer DEFAULT 0,
	"streak" integer DEFAULT 0,
	"level" "user_level" DEFAULT 'Beginner',
	"created_at" timestamp DEFAULT now(),
	"last_active" timestamp DEFAULT now(),
	"is_public_profile" boolean DEFAULT true,
	CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
ALTER TABLE "community_note_votes" ADD CONSTRAINT "community_note_votes_note_id_community_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."community_notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_note_votes" ADD CONSTRAINT "community_note_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_notes" ADD CONSTRAINT "community_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_tags" ADD CONSTRAINT "community_tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_connections" ADD CONSTRAINT "user_connections_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_connections" ADD CONSTRAINT "user_connections_following_id_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;