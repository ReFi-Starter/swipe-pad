import { relations } from 'drizzle-orm'
import { boolean, decimal, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { campaignNotes } from './campaign-notes'
import { campaigns } from './campaigns'
import { transactions } from './transactions'
import { userAchievements } from './user-achievements'

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique(),
    walletAddress: varchar('wallet_address', { length: 42 }).unique(),
    avatarUrl: text('avatar_url'),
    points: integer('points').default(0),
    maxPoints: integer('max_points').default(200),
    donations: decimal('donations', { precision: 10, scale: 2 }).default('0'),
    streak: integer('streak').default(0),
    reputation: integer('reputation').default(0),
    isCurrentUser: boolean('is_current_user').default(false),
    isPublicProfile: boolean('is_public_profile').default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
    createdCampaigns: many(campaigns, { relationName: 'creator' }),
    notes: many(campaignNotes, { relationName: 'author' }),
    transactions: many(transactions),
    achievements: many(userAchievements),
}))
