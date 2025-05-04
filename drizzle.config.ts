import type { Config } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL is required');
}

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: process.env.NEON_DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config; 