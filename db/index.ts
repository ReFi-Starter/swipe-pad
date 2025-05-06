import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
// Initialize postgres connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// Initialize drizzle with all schema tables
export const db = drizzle(pool, { schema })
