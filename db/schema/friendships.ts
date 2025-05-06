import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const friendships = pgTable(
    'friendships',
    {
        followerId: integer('follower_id')
            .notNull()
            .references(() => users.id),
        followingId: integer('following_id')
            .notNull()
            .references(() => users.id),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    table => ({
        pk: primaryKey({ columns: [table.followerId, table.followingId] }),
    }),
)

export const friendshipsRelations = relations(friendships, ({ one }) => ({
    follower: one(users, {
        fields: [friendships.followerId],
        references: [users.id],
    }),
    following: one(users, {
        fields: [friendships.followingId],
        references: [users.id],
    }),
}))
