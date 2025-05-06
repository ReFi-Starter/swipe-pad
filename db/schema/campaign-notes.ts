import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { campaigns } from './campaigns'
import { users } from './users'

export const campaignNotes = pgTable('campaign_notes', {
    id: serial('id').primaryKey(),
    campaignId: integer('campaign_id')
        .references(() => campaigns.id)
        .notNull(),
    authorId: integer('author_id')
        .references(() => users.id)
        .notNull(),
    text: text('text').notNull(),
    upvotes: integer('upvotes').default(0).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const campaignNotesRelations = relations(campaignNotes, ({ one }) => ({
    campaign: one(campaigns, {
        fields: [campaignNotes.campaignId],
        references: [campaigns.id],
    }),
    author: one(users, {
        fields: [campaignNotes.authorId],
        references: [users.id],
    }),
}))
