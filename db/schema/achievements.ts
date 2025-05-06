import { relations } from 'drizzle-orm'
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { userAchievements } from './user-achievements'

export const achievements = pgTable('achievements', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    icon: varchar('icon', { length: 50 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const achievementsRelations = relations(achievements, ({ many }) => ({
    userAchievements: many(userAchievements),
}))
