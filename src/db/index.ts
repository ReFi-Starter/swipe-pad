import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required')
}

let pool: Pool

if (process.env.NODE_ENV === 'production') {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    })
} else {
    // Use connection pooling in development
    if (!(global as any).pool) {
        ;(global as any).pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        })
    }
    pool = (global as any).pool
}

// Create the database connection
export const db = drizzle(pool, { schema })

// Export the schema for use in the application
export * from './schema'
