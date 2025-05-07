import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import {
    boolean,
    decimal,
    integer,
    json,
    numeric,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core'

// Enums
export const userLevelEnum = pgEnum('user_level', ['Beginner', 'Contributor', 'Supporter', 'Champion'])
export const activityTypeEnum = pgEnum('activity_type', ['donation', 'tag', 'note', 'follow', 'achievement'])

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
    name: text('name').notNull(),
    points: integer('points').default(0),
    maxPoints: integer('max_points').default(200),
    donations: decimal('donations', { precision: 10, scale: 2 }).default('0'),
    isFollowing: boolean('is_following').default(false),
    updatedAt: timestamp('updated_at').defaultNow(),
})

// User Settings
export const userSettings = pgTable('user_settings', {
    userId: integer('user_id')
        .primaryKey()
        .references(() => users.id),
    currency: varchar('currency', { length: 10 }).default('CENTS'),
    language: varchar('language', { length: 5 }).default('en'),
    region: varchar('region', { length: 5 }).default('US'),
    defaultDonationAmount: numeric('default_donation_amount', { precision: 10, scale: 6 }).default('0.01'),
    autoBatch: boolean('auto_batch').default(true),
})

// Achievements
export const achievements = pgTable('achievements', {
    id: serial('id').primaryKey(),
    icon: text('icon').notNull(),
    title: varchar('title', { length: 100 }).notNull(),
    description: text('description').notNull(),
})

// User Achievements
export const userAchievements = pgTable('user_achievements', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    achievementId: integer('achievement_id').references(() => achievements.id, { onDelete: 'cascade' }),
    unlocked: boolean('unlocked').default(false),
    unlockedAt: timestamp('unlocked_at'),
})

// Campaign Metadata
export const campaignMetadata = pgTable('campaign_metadata', {
    campaignId: varchar('campaign_id', { length: 100 }).primaryKey(),
    category: varchar('category', { length: 50 }).notNull(),
    tags: text('tags').array(),
    sponsorBoosted: boolean('sponsor_boosted').default(false),
    viewsCount: integer('views_count').default(0),
    updatedAt: timestamp('updated_at').defaultNow(),
})

// Categories
export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }).notNull().unique(),
    description: text('description'),
    icon: text('icon'),
    isActive: boolean('is_active').default(true),
})

// Community Tags
export const communityTags = pgTable('community_tags', {
    id: serial('id').primaryKey(),
    campaignId: integer('campaign_id')
        .references(() => campaigns.id, { onDelete: 'cascade' })
        .notNull(),
    text: text('text').notNull(),
    color: text('color').notNull(),
    count: integer('count').default(0),
})

// Community Notes
export const communityNotes = pgTable('community_notes', {
    id: serial('id').primaryKey(),
    campaignId: integer('campaign_id').references(() => campaigns.id, { onDelete: 'cascade' }),
    authorId: integer('author_id').references(() => users.id),
    text: text('text').notNull(),
    tags: json('tags').$type<string[]>(),
    upvotes: integer('upvotes').default(0),
    createdAt: timestamp('created_at').defaultNow(),
})

// Community Note Votes
export const communityNoteVotes = pgTable('community_note_votes', {
    id: serial('id').primaryKey(),
    noteId: integer('note_id').references(() => communityNotes.id),
    userId: integer('user_id').references(() => users.id),
    isUpvote: boolean('is_upvote').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})

// User Connections
export const userConnections = pgTable('user_connections', {
    id: serial('id').primaryKey(),
    followerId: integer('follower_id').references(() => users.id),
    followingId: integer('following_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
})

// User Activities
export const userActivities = pgTable('user_activities', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    activityType: activityTypeEnum('activity_type'),
    campaignId: varchar('campaign_id', { length: 100 }),
    txHash: varchar('tx_hash', { length: 66 }),
    pointsEarned: integer('points_earned').default(0),
    createdAt: timestamp('created_at').defaultNow(),
})

// Cached Campaigns
export const cachedCampaigns = pgTable('cached_campaigns', {
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
})

// Cached Donations
export const cachedDonations = pgTable('cached_donations', {
    id: serial('id').primaryKey(),
    txHash: varchar('tx_hash', { length: 66 }).unique(),
    donorAddress: varchar('donor_address', { length: 42 }).notNull(),
    campaignId: varchar('campaign_id', { length: 100 }).notNull(),
    amount: numeric('amount', { precision: 20, scale: 0 }).notNull(),
    tokenAddress: varchar('token_address', { length: 42 }),
    donatedAt: timestamp('donated_at').defaultNow(),
})

// Campaigns
export const campaigns = pgTable('campaigns', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    category: text('category').notNull(),
    description: text('description').notNull(),
    imageUrl: text('image_url').notNull(),
    fundingGoal: decimal('funding_goal', { precision: 10, scale: 2 }).notNull(),
    currentFunding: decimal('current_funding', { precision: 10, scale: 2 }).default('0'),
    websiteUrl: text('website_url'),
    sponsorBoosted: boolean('sponsor_boosted').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})

// Swipe Amounts
export const swipeAmounts = pgTable('swipe_amounts', {
    id: serial('id').primaryKey(),
    value: decimal('value', { precision: 10, scale: 2 }).notNull(),
    label: text('label').notNull(),
})

// Supported Currencies
export const supportedCurrencies = pgTable('supported_currencies', {
    id: serial('id').primaryKey(),
    value: text('value').notNull().unique(),
    label: text('label').notNull(),
    symbol: text('symbol').notNull(),
})

// Supported Languages
export const supportedLanguages = pgTable('supported_languages', {
    id: serial('id').primaryKey(),
    value: text('value').notNull().unique(),
    label: text('label').notNull(),
})

// User Following
export const userFollowing = pgTable('user_following', {
    id: serial('id').primaryKey(),
    followerId: integer('follower_id').references(() => users.id, { onDelete: 'cascade' }),
    followingId: integer('following_id').references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
})

// Relations
export const campaignRelations = relations(campaigns, ({ many }) => ({
    communityTags: many(communityTags),
    communityNotes: many(communityNotes),
}))

export const userRelations = relations(users, ({ many }) => ({
    achievements: many(userAchievements),
    following: many(userFollowing, { relationName: 'following' }),
    followers: many(userFollowing, { relationName: 'followers' }),
    communityNotes: many(communityNotes),
}))

export const achievementRelations = relations(achievements, ({ many }) => ({
    users: many(userAchievements),
}))

// Export types
export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export type UserSettings = InferSelectModel<typeof userSettings>
export type NewUserSettings = InferInsertModel<typeof userSettings>

export type Achievement = InferSelectModel<typeof achievements>
export type NewAchievement = InferInsertModel<typeof achievements>

export type UserAchievement = InferSelectModel<typeof userAchievements>
export type NewUserAchievement = InferInsertModel<typeof userAchievements>

export type CampaignMetadata = InferSelectModel<typeof campaignMetadata>
export type NewCampaignMetadata = InferInsertModel<typeof campaignMetadata>

export type Category = InferSelectModel<typeof categories>
export type NewCategory = InferInsertModel<typeof categories>

export type CommunityTag = InferSelectModel<typeof communityTags>
export type NewCommunityTag = InferInsertModel<typeof communityTags>

export type CommunityNote = InferSelectModel<typeof communityNotes>
export type NewCommunityNote = InferInsertModel<typeof communityNotes>

export type CommunityNoteVote = InferSelectModel<typeof communityNoteVotes>
export type NewCommunityNoteVote = InferInsertModel<typeof communityNoteVotes>

export type UserConnection = InferSelectModel<typeof userConnections>
export type NewUserConnection = InferInsertModel<typeof userConnections>

export type UserActivity = InferSelectModel<typeof userActivities>
export type NewUserActivity = InferInsertModel<typeof userActivities>

export type CachedCampaign = InferSelectModel<typeof cachedCampaigns>
export type NewCachedCampaign = InferInsertModel<typeof cachedCampaigns>

export type CachedDonation = InferSelectModel<typeof cachedDonations>
export type NewCachedDonation = InferInsertModel<typeof cachedDonations>
