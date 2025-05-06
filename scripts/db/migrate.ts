import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

async function main() {
    console.log('🚀 Starting database migration...')

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

    try {
        await migrate(db, { migrationsFolder: './db/migrations' })
        console.log('✅ Migration completed successfully!')
    } catch (error) {
        console.error('❌ Migration failed:', error)
        throw error
    } finally {
        await pool.end()
    }
}

main().catch(err => {
    console.error('❌ Migration script failed:', err)
    process.exit(1)
})
