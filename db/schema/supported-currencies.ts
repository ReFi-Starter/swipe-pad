import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'

export const supportedCurrencies = pgTable('supported_currencies', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 3 }).notNull().unique(),
    name: varchar('name', { length: 50 }).notNull(),
    symbol: varchar('symbol', { length: 5 }).notNull(),
})
