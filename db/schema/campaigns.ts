import { relations } from 'drizzle-orm'
import { boolean, decimal, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { campaignNotes } from './campaign-notes'
import { campaignTags } from './campaign-tags'
import { categories } from './categories'
import { users } from './users'

export const campaigns = pgTable('campaigns', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    categoryName: varchar('category', { length: 100 })
        .notNull()
        .references(() => categories.name),
    description: text('description').notNull(),
    imageUrl: text('image_url').notNull(),
    fundingGoal: decimal('funding_goal', { precision: 10, scale: 2 }).notNull(),
    currentFunding: decimal('current_funding', { precision: 10, scale: 2 }).default('0'),
    websiteUrl: text('website_url'),
    sponsorBoosted: boolean('sponsor_boosted').default(false),
    creatorId: integer('creator_id')
        .notNull()
        .references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
    creator: one(users, {
        fields: [campaigns.creatorId],
        references: [users.id],
    }),
    category: one(categories, {
        fields: [campaigns.categoryName],
        references: [categories.name],
    }),
    tags: many(campaignTags),
    notes: many(campaignNotes),
}))
