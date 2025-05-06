import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import {
    achievements,
    campaignNotes,
    campaigns,
    campaignTags,
    categories,
    friendships,
    supportedCurrencies,
    supportedLanguages,
    swipeAmounts,
    transactions,
    userAchievements,
    users,
} from '../../db/schema'

const connectionString =
    process.env.NODE_ENV === 'production'
        ? process.env.POSTGRES_URL
        : process.env.LOCAL_POSTGRES_URL || process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('Database connection string not found')
}

const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
})

const db = drizzle(pool)

async function main() {
    console.log('🧹 Clearing all tables...')

    try {
        // Delete in reverse order of dependencies
        await db.delete(userAchievements)
        await db.delete(friendships)
        await db.delete(transactions)
        await db.delete(campaignNotes)
        await db.delete(campaignTags)
        await db.delete(campaigns)
        await db.delete(users)
        await db.delete(achievements)
        await db.delete(categories)
        await db.delete(supportedCurrencies)
        await db.delete(supportedLanguages)
        await db.delete(swipeAmounts)

        console.log('✅ All tables cleared successfully!')
    } catch (error) {
        console.error('❌ Clearing tables failed:', error)
        throw error
    } finally {
        await pool.end()
    }
}

main().catch(err => {
    console.error('❌ Clear tables script failed:', err)
    process.exit(1)
})
