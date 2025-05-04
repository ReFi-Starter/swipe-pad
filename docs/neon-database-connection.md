# Connecting Next.js with Neon Database

This document details the process for connecting our Next.js application with Neon Database (PostgreSQL) to handle social data and project metadata for the SwipePad project.

## Initial Setup

### 1. Installing Dependencies

```bash
# Install the necessary dependencies
bun add @neondatabase/serverless pg pg-promise next-auth drizzle-orm @vercel/postgres
bun add -D drizzle-kit @types/pg
```

### 2. Environment Variables

Create or update the `.env.local` file at the root of the project:

```env
# Neon Database
NEON_DATABASE_URL="postgresql://username:password@your-neon-host/neondb"
NEON_SHADOW_DATABASE_URL="postgresql://username:password@your-neon-host/neondb_shadow"

# Drizzle
NEXT_PUBLIC_ENABLE_DRIZZLE_LOGGING=true

# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here
NEXT_PUBLIC_CHAIN_ID=44787 # Celo Alfajores
```

Make sure to add `.env.local` to your `.gitignore`.

## Drizzle ORM Configuration

### 1. Create the Schema

Create a file `src/db/schema.ts` to define your models:

```typescript
import { pgTable, serial, varchar, timestamp, text, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userLevelEnum = pgEnum('user_level', ['Beginner', 'Contributor', 'Supporter', 'Champion']);
export const activityTypeEnum = pgEnum('activity_type', ['donation', 'tag', 'note', 'follow', 'achievement']);

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  walletAddress: varchar('wallet_address', { length: 42 }).notNull().unique(),
  username: varchar('username', { length: 100 }),
  avatarUrl: text('avatar_url'),
  reputation: integer('reputation').default(0),
  streak: integer('streak').default(0),
  level: userLevelEnum('level').default('Beginner'),
  createdAt: timestamp('created_at').defaultNow(),
  lastActive: timestamp('last_active').defaultNow(),
  isPublicProfile: boolean('is_public_profile').default(true),
});

// User Settings
export const userSettings = pgTable('user_settings', {
  userId: integer('user_id').primaryKey().references(() => users.id),
  currency: varchar('currency', { length: 10 }).default('CENTS'),
  language: varchar('language', { length: 5 }).default('en'),
  region: varchar('region', { length: 5 }).default('US'),
  defaultDonationAmount: numeric('default_donation_amount', { precision: 10, scale: 6 }).default('0.01'),
  autoBatch: boolean('auto_batch').default(true),
});

// ... Define the rest of the tables according to the SQL schema ...
```

### 2. Configure the Connection

Create a file `src/db/index.ts` to handle the connection:

```typescript
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
  if (!global.pool) {
    global.pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
    });
  }
  pool = global.pool;
}

export const dbPool = drizzlePg(pool, { schema });
```

### 3. Configure Migrations

Create a file `drizzle.config.ts` at the root of the project:

```typescript
import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NEON_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

Add migration scripts to `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "bun run src/db/migrate.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

Create the migration script in `src/db/migrate.ts`:

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const runMigration = async () => {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL!);
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
```

## Implementing Data Access

### 1. Data Access Repositories

Create repositories for each entity in `src/repositories/`:

```typescript
// src/repositories/userRepository.ts
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const userRepository = {
  // Find user by wallet address
  async findByWalletAddress(address: string) {
    return await db.query.users.findFirst({
      where: eq(users.walletAddress, address.toLowerCase()),
    });
  },
  
  // Create new user
  async create(data: { walletAddress: string; username?: string; avatarUrl?: string }) {
    return await db.insert(users).values({
      walletAddress: data.walletAddress.toLowerCase(),
      username: data.username,
      avatarUrl: data.avatarUrl,
    }).returning();
  },
  
  // Update user streak
  async updateStreak(userId: number, streak: number) {
    return await db.update(users)
      .set({ streak })
      .where(eq(users.id, userId))
      .returning();
  },
  
  // More methods as needed...
};
```

### 2. Implementation in Route Handlers (API)

```typescript
// src/app/api/users/[address]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/repositories/userRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const user = await userRepository.findByWalletAddress(params.address);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 3. Usage in Server Components

```typescript
// src/app/profile/[address]/page.tsx
import { userRepository } from '@/repositories/userRepository';
import { notFound } from 'next/navigation';

export default async function ProfilePage({ params }: { params: { address: string } }) {
  const user = await userRepository.findByWalletAddress(params.address);
  
  if (!user) {
    notFound();
  }
  
  return (
    <div>
      <h1>{user.username || 'Anonymous User'}</h1>
      <p>Reputation: {user.reputation}</p>
      <p>Streak: {user.streak} days</p>
      {/* More profile information */}
    </div>
  );
}
```

### 4. Usage in Client Components with Server Actions

```typescript
// src/actions/user-actions.ts
'use server'

import { userRepository } from '@/repositories/userRepository';
import { revalidatePath } from 'next/cache';

export async function updateUserProfile(
  userId: number,
  data: { username?: string; avatarUrl?: string; isPublicProfile?: boolean }
) {
  try {
    // Update user profile
    await db.update(users)
      .set(data)
      .where(eq(users.id, userId));
    
    // Revalidate the page to reflect changes
    revalidatePath(`/profile/${userId}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}
```

## Integration with Wallet Authentication

### 1. Configure NextAuth with Siwe (Sign-In with Ethereum)

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import { userRepository } from '@/repositories/userRepository';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
        },
        signature: {
          label: 'Signature',
          type: 'text',
        },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.message || !credentials?.signature) return null;

          const siwe = new SiweMessage(JSON.parse(credentials.message));
          const result = await siwe.verify({
            signature: credentials.signature,
          });

          if (!result.success) return null;

          // Verify or create user in the database
          let user = await userRepository.findByWalletAddress(siwe.address);
          
          if (!user) {
            const newUsers = await userRepository.create({
              walletAddress: siwe.address,
            });
            user = newUsers[0];
          }

          return {
            id: user.id.toString(),
            name: user.username || siwe.address,
            address: siwe.address,
            image: user.avatarUrl,
          };
        } catch (error) {
          console.error('Error in authorization:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.address = token.address as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.address = user.address;
      }
      return token;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
  },
});
```

### 2. Implementation of Authentication Routes

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import { GET, POST } from '@/lib/auth';

export { GET, POST };
```

## Blockchain Synchronization Services

### 1. Service for Indexing Blockchain Events

```typescript
// src/services/blockchain-indexer.ts
import { createPublicClient, http, parseAbiItem } from 'viem';
import { celoAlfajores } from 'viem/chains';
import { db } from '@/db';
import { cachedProjects, cachedDonations } from '@/db/schema';

// Public client for reading blockchain events
const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http('https://alfajores-forno.celo-testnet.org'),
});

// ABI of relevant events
const projectCreatedEvent = parseAbiItem('event ProjectCreated(uint256 indexed projectId, address indexed creator, string name)');
const donationReceivedEvent = parseAbiItem('event DonationReceived(uint256 indexed projectId, address indexed donor, uint256 amount)');

export async function indexBlockchainEvents(fromBlock: bigint, toBlock: bigint) {
  try {
    // Index ProjectCreated events
    const projectCreatedLogs = await publicClient.getLogs({
      address: '0xYourContractAddress' as `0x${string}`,
      event: projectCreatedEvent,
      fromBlock,
      toBlock,
    });

    // Process project creation logs
    for (const log of projectCreatedLogs) {
      const { projectId, creator, name } = log.args;
      
      // Get complete project details from the contract
      const projectDetails = await getProjectDetailsFromContract(projectId);
      
      // Update the database
      await db.insert(cachedProjects).values({
        id: projectId.toString(),
        creator_address: creator.toLowerCase(),
        name: projectDetails.name,
        description: projectDetails.description,
        // ... other fields
      }).onConflictDoUpdate({
        target: cachedProjects.id,
        set: {
          // Fields to update
          last_sync: new Date(),
        },
      });
    }

    // Similar for donation events
    // ...

    console.log(`Indexed events from block ${fromBlock} to ${toBlock}`);
  } catch (error) {
    console.error('Error indexing blockchain events:', error);
  }
}

// Helper function to get complete project details
async function getProjectDetailsFromContract(projectId: bigint) {
  // Implement contract call to get details
  // ...
}
```

### 2. Configure the Indexer as a Cron Service

```typescript
// src/app/api/cron/index-blockchain/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { indexBlockchainEvents } from '@/services/blockchain-indexer';
import { db } from '@/db';
import { indexerState } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  // Verify secret to protect the endpoint
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get last indexed block
    const state = await db.query.indexerState.findFirst({
      where: eq(indexerState.id, 1),
    });

    const lastIndexedBlock = state?.lastIndexedBlock || 0n;
    const currentBlock = await getCurrentBlockNumber();

    // Calculate how many blocks to index (max 1000 per execution)
    const blocksToIndex = 1000n;
    const toBlock = lastIndexedBlock + blocksToIndex > currentBlock
      ? currentBlock
      : lastIndexedBlock + blocksToIndex;

    // Index events
    await indexBlockchainEvents(lastIndexedBlock + 1n, toBlock);

    // Update state
    await db.update(indexerState)
      .set({ lastIndexedBlock: toBlock, updatedAt: new Date() })
      .where(eq(indexerState.id, 1));

    return NextResponse.json({
      success: true,
      fromBlock: lastIndexedBlock + 1n,
      toBlock,
      blocksIndexed: toBlock - lastIndexedBlock,
    });
  } catch (error) {
    console.error('Error running blockchain indexer:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

// Helper function to get the current block number
async function getCurrentBlockNumber() {
  const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http('https://alfajores-forno.celo-testnet.org'),
  });
  return await publicClient.getBlockNumber();
}
```

## Vercel Configuration

1. Create a project on Vercel and connect it to your repository
2. Configure environment variables in Vercel:
   - `NEON_DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `CRON_SECRET`
3. Configure Vercel Cron:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/index-blockchain",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

## Conclusion

This implementation allows for complete integration between our Next.js application, Neon Database (PostgreSQL), and the Celo blockchain. The main advantages are:

1. **Optimized performance**: Frequently accessed data is stored in Neon
2. **Reduced costs**: Minimizes the number of blockchain calls
3. **Enriched social experience**: Social features implemented in PostgreSQL
4. **Automatic synchronization**: Indexing service keeps data updated

In development, you can use Drizzle Studio to manage your database:

```bash
bun run db:studio
```

And to deploy schema changes:

```bash
bun run db:generate
bun run db:migrate
``` 