import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core'
import { achievements } from './achievements'
import { users } from './users'

export const userAchievements = pgTable('user_achievements', {
    userId: integer('user_id')
        .references(() => users.id)
        .notNull(),
    achievementId: integer('achievement_id')
        .references(() => achievements.id)
        .notNull(),
    unlockedAt: timestamp('unlocked_at').notNull().defaultNow(),
})
