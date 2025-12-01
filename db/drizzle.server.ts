import { neonConfig, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { WebSocket } from 'ws'

const connectionString =
    process.env.NODE_ENV === 'production'
        ? process.env.POSTGRES_URL
        : process.env.LOCAL_POSTGRES_URL || process.env.DATABASE_URL

\
\
\
\
