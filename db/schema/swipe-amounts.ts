import { integer, pgTable, serial } from 'drizzle-orm/pg-core'

export const swipeAmounts = pgTable('swipe_amounts', {
    id: serial('id').primaryKey(),
    amount: integer('amount').notNull(),
})
