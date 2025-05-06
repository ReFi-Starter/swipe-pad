import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'

export const supportedLanguages = pgTable('supported_languages', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 5 }).notNull().unique(),
    name: varchar('name', { length: 50 }).notNull(),
    nativeName: varchar('native_name', { length: 50 }).notNull(),
})
