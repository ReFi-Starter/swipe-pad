import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Cargar variables de entorno de .env.local
dotenv.config({ path: '.env.local' });

const { NEON_DATABASE_URL } = process.env;

if (!NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL is required');
}

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: NEON_DATABASE_URL,
  },
} satisfies Config; 