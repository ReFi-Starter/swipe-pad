import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const url =
    process.env.NODE_ENV === 'production'
        ? process.env.POSTGRES_URL
        : process.env.LOCAL_POSTGRES_URL || process.env.DATABASE_URL

if (!url)
    throw new Error(
        `Connection string to ${process.env.NODE_ENV === 'production' ? 'Neon' : 'local'} Postgres not found.`,
    )

export default defineConfig({
    schema: './db/schema/index.ts',
    out: './db/migrations',
    driver: 'pg',
    dbCredentials: {
        connectionString: url,
    },
})
