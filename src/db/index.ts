import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// For serverless environments
const sql = neon(process.env.NEON_DATABASE_URL!);
export const db = drizzle(sql, { schema });

// For environments with persistent connections (optional)
import { Pool } from 'pg';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  });
} else {
  // @ts-expect-error - Global type augmentation for dev environment
  if (!global.pool) {
    // @ts-expect-error - Global type augmentation for dev environment
    global.pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
    });
  }
  // @ts-expect-error - Global type augmentation for dev environment
  pool = global.pool;
}

export const dbPool = drizzlePg(pool, { schema }); 