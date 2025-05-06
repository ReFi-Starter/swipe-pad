import { relations } from 'drizzle-orm'
import { decimal, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { campaigns } from './campaigns'
import { users } from './users'

export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id),
    campaignId: integer('campaign_id')
        .notNull()
        .references(() => campaigns.id),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 10 }).notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    type: varchar('type', { length: 20 }).notNull(),
    description: text('description'),
    metadata: text('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const transactionsRelations = relations(transactions, ({ one }) => ({
    user: one(users, {
        fields: [transactions.userId],
        references: [users.id],
    }),
    campaign: one(campaigns, {
        fields: [transactions.campaignId],
        references: [campaigns.id],
    }),
}))
