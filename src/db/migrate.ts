import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import 'dotenv/config';

const runMigration = async () => {
  try {
    if (!process.env.NEON_DATABASE_URL) {
      throw new Error('NEON_DATABASE_URL is required');
    }
    
    console.log('Connecting to Neon Database...');
    const sql = neon(process.env.NEON_DATABASE_URL);
    const db = drizzle(sql);

    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: 'src/db/migrations' });
    
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration(); 