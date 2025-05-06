import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required')
}

// Create a database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })

// Function to run migrations
export async function runMigrations() {
    try {
        console.log('🔄 Running migrations...')
        await migrate(db, { migrationsFolder: './db/migrations' })
        console.log('✅ Migrations completed successfully')
    } catch (error) {
        console.error('❌ Migration failed:', error)
        process.exit(1)
    }
}

// Function to check database connection
export async function checkConnection() {
    try {
        const result = await pool.query('SELECT NOW()')
        console.log('✅ Database connection successful:', result.rows[0].now)
        return true
    } catch (error) {
        console.error('❌ Database connection failed:', error)
        return false
    }
}

// Function to drop all tables
export async function dropAllTables() {
    try {
        console.log('🗑️ Dropping all tables...')
        // Get all table names
        const result = await pool.query(`
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public'
        `)

        // Drop each table
        for (const row of result.rows) {
            await pool.query(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE`)
        }
        console.log('✅ All tables dropped successfully')
    } catch (error) {
        console.error('❌ Failed to drop tables:', error)
        process.exit(1)
    }
}

// Function to reset database (drop all and recreate)
export async function resetDatabase() {
    try {
        console.log('🔄 Resetting database...')
        await dropAllTables()
        await runMigrations()
        console.log('✅ Database reset completed')
    } catch (error) {
        console.error('❌ Database reset failed:', error)
        process.exit(1)
    }
}
