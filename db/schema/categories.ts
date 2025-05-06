import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { campaigns } from './campaigns'

export const categories = pgTable('categories', {
    name: varchar('name', { length: 100 }).primaryKey(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    description: text('description'),
    icon: varchar('icon', { length: 50 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
    campaigns: many(campaigns),
}))
