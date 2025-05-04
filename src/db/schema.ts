import { pgTable, serial, varchar, timestamp, text, integer, boolean, pgEnum, numeric } from 'drizzle-orm/pg-core';

// Enums
export const userLevelEnum = pgEnum('user_level', ['Beginner', 'Contributor', 'Supporter', 'Champion']);
export const activityTypeEnum = pgEnum('activity_type', ['donation', 'tag', 'note', 'follow', 'achievement']);

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  walletAddress: varchar('wallet_address', { length: 42 }).notNull().unique(),
  username: varchar('username', { length: 100 }),
  avatarUrl: text('avatar_url'),
  reputation: integer('reputation').default(0),
  streak: integer('streak').default(0),
  level: userLevelEnum('level').default('Beginner'),
  createdAt: timestamp('created_at').defaultNow(),
  lastActive: timestamp('last_active').defaultNow(),
  isPublicProfile: boolean('is_public_profile').default(true),
});

// User Settings
export const userSettings = pgTable('user_settings', {
  userId: integer('user_id').primaryKey().references(() => users.id),
  currency: varchar('currency', { length: 10 }).default('CENTS'),
  language: varchar('language', { length: 5 }).default('en'),
  region: varchar('region', { length: 5 }).default('US'),
  defaultDonationAmount: numeric('default_donation_amount', { precision: 10, scale: 6 }).default('0.01'),
  autoBatch: boolean('auto_batch').default(true),
});

// Achievements
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  icon: text('icon').notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description').notNull(),
  criteria: text('criteria'),
  points: integer('points').default(10),
});

// User Achievements
export const userAchievements = pgTable('user_achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  achievementId: integer('achievement_id').notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow(),
});

// Project Metadata
export const projectMetadata = pgTable('project_metadata', {
  projectId: varchar('project_id', { length: 100 }).primaryKey(),
  category: varchar('category', { length: 50 }).notNull(),
  tags: text('tags').array(),
  sponsorBoosted: boolean('sponsor_boosted').default(false),
  viewsCount: integer('views_count').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  isActive: boolean('is_active').default(true),
});

// Community Tags
export const communityTags = pgTable('community_tags', {
  id: serial('id').primaryKey(),
  projectId: varchar('project_id', { length: 100 }).notNull(),
  userId: integer('user_id').references(() => users.id),
  text: varchar('text', { length: 100 }).notNull(),
  count: integer('count').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

// Community Notes
export const communityNotes = pgTable('community_notes', {
  id: serial('id').primaryKey(),
  projectId: varchar('project_id', { length: 100 }).notNull(),
  authorId: integer('author_id').references(() => users.id),
  text: text('text').notNull(),
  tags: text('tags').array(),
  upvotes: integer('upvotes').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Community Note Votes
export const communityNoteVotes = pgTable('community_note_votes', {
  id: serial('id').primaryKey(),
  noteId: integer('note_id').references(() => communityNotes.id),
  userId: integer('user_id').references(() => users.id),
  isUpvote: boolean('is_upvote').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// User Connections
export const userConnections = pgTable('user_connections', {
  id: serial('id').primaryKey(),
  followerId: integer('follower_id').references(() => users.id),
  followingId: integer('following_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// User Activities
export const userActivities = pgTable('user_activities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  activityType: activityTypeEnum('activity_type'),
  projectId: varchar('project_id', { length: 100 }),
  txHash: varchar('tx_hash', { length: 66 }),
  pointsEarned: integer('points_earned').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Cached Projects
export const cachedProjects = pgTable('cached_projects', {
  id: varchar('id', { length: 100 }).primaryKey(),
  creatorAddress: varchar('creator_address', { length: 42 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  fundingGoal: numeric('funding_goal', { precision: 20, scale: 0 }),
  currentFunding: numeric('current_funding', { precision: 20, scale: 0 }).default('0'),
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  fundingModel: integer('funding_model'),
  isActive: boolean('is_active').default(true),
  lastSync: timestamp('last_sync').defaultNow(),
});

// Cached Donations
export const cachedDonations = pgTable('cached_donations', {
  id: serial('id').primaryKey(),
  txHash: varchar('tx_hash', { length: 66 }).unique(),
  donorAddress: varchar('donor_address', { length: 42 }).notNull(),
  projectId: varchar('project_id', { length: 100 }).notNull(),
  amount: numeric('amount', { precision: 20, scale: 0 }).notNull(),
  tokenAddress: varchar('token_address', { length: 42 }),
  donatedAt: timestamp('donated_at').defaultNow(),
}); 