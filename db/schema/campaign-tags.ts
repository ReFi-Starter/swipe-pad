import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { campaigns } from './campaigns'

export const campaignTags = pgTable('campaign_tags', {
    id: serial('id').primaryKey(),
    campaignId: integer('campaign_id')
        .references(() => campaigns.id)
        .notNull(),
    text: varchar('text', { length: 50 }).notNull(),
    color: varchar('color', { length: 20 }).notNull(),
    count: integer('count').default(0).notNull(),
})

export const campaignTagsRelations = relations(campaignTags, ({ one }) => ({
    campaign: one(campaigns, {
        fields: [campaignTags.campaignId],
        references: [campaigns.id],
    }),
}))
