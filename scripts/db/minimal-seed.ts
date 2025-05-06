import 'dotenv/config'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const connectionString =
    process.env.NODE_ENV === 'production'
        ? process.env.POSTGRES_URL
        : process.env.LOCAL_POSTGRES_URL || process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('Database connection string not found')
}

const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
})

const db = drizzle(pool)

async function main() {
    console.log('🌱 Starting minimal database seed...')

    try {
        // First truncate all tables to ensure clean state
        await db.execute(sql`TRUNCATE 
            user_achievements, 
            friendships, 
            transactions, 
            campaign_notes, 
            campaign_tags, 
            campaigns, 
            users, 
            achievements, 
            categories, 
            supported_currencies, 
            supported_languages, 
            swipe_amounts
        CASCADE`)

        console.log('✓ Truncated all tables')

        // Seed categories
        await db.execute(sql`
            INSERT INTO categories (name, slug, description, icon, created_at, updated_at)
            VALUES 
                ('Environment', 'environment', 'Environmental sustainability projects', '🌱', NOW(), NOW()),
                ('Community', 'community', 'Community development initiatives', '👥', NOW(), NOW())
        `)

        console.log('✓ Seeded categories')

        // Seed supported currencies
        await db.execute(sql`
            INSERT INTO supported_currencies (code, name, symbol)
            VALUES 
                ('USD', 'US Dollar', '$'),
                ('EUR', 'Euro', '€')
        `)

        console.log('✓ Seeded supported currencies')

        // Seed supported languages
        await db.execute(sql`
            INSERT INTO supported_languages (code, name, native_name)
            VALUES 
                ('en', 'English', 'English'),
                ('es', 'Spanish', 'Español')
        `)

        console.log('✓ Seeded supported languages')

        // Seed swipe amounts
        await db.execute(sql`
            INSERT INTO swipe_amounts (amount)
            VALUES (10), (100)
        `)

        console.log('✓ Seeded swipe amounts')

        // Seed users (2 users)
        await db.execute(sql`
            INSERT INTO users (id, name, email, wallet_address, avatar_url, points, max_points, donations, streak, reputation, is_current_user, is_public_profile, created_at, updated_at)
            VALUES 
                (1, 'User 1', 'user1@example.com', '0x123', 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', 100, 1000, 10.5, 5, 100, true, true, NOW(), NOW()),
                (2, 'User 2', 'user2@example.com', '0x456', 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', 200, 1000, 20.5, 10, 200, false, true, NOW(), NOW())
        `)

        console.log('✓ Seeded users')

        // Seed achievements
        await db.execute(sql`
            INSERT INTO achievements (title, description, icon, created_at, updated_at)
            VALUES 
                ('First Donation', 'Made your first micro-donation', '🎉', NOW(), NOW()),
                ('Streak Master', 'Donated for 7 days in a row', '🔥', NOW(), NOW())
        `)

        console.log('✓ Seeded achievements')

        // Seed campaigns (2 campaigns)
        await db.execute(sql`
            INSERT INTO campaigns (title, category, description, image_url, funding_goal, current_funding, website_url, sponsor_boosted, creator_id, created_at, updated_at)
            VALUES 
                ('Campaign 1', 'Environment', 'This is a description for campaign 1', 'https://picsum.photos/seed/1/800/400', 1000, 100, 'https://example1.com', false, 1, NOW(), NOW()),
                ('Campaign 2', 'Community', 'This is a description for campaign 2', 'https://picsum.photos/seed/2/800/400', 2000, 200, 'https://example2.com', true, 2, NOW(), NOW())
        `)

        console.log('✓ Seeded campaigns')

        // Seed campaign tags
        await db.execute(sql`
            INSERT INTO campaign_tags (campaign_id, text, color, count)
            VALUES 
                (1, '✅ Verified', 'green', 10),
                (2, '👍 Recommended', 'blue', 20)
        `)

        console.log('✓ Seeded campaign tags')

        // Seed campaign notes
        await db.execute(sql`
            INSERT INTO campaign_notes (campaign_id, author_id, text, upvotes, created_at)
            VALUES 
                (1, 2, 'This is a note about campaign 1', 5, NOW()),
                (2, 1, 'This is a note about campaign 2', 10, NOW())
        `)

        console.log('✓ Seeded campaign notes')

        // Seed user achievements
        await db.execute(sql`
            INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
            VALUES 
                (1, 1, '2023-01-01'),
                (2, 2, '2023-02-01')
        `)

        console.log('✓ Seeded user achievements')

        // Seed friendships
        await db.execute(sql`
            INSERT INTO friendships (follower_id, following_id, created_at)
            VALUES 
                (1, 2, NOW()),
                (2, 1, NOW())
        `)

        console.log('✓ Seeded friendships')

        // Seed transactions
        await db.execute(sql`
            INSERT INTO transactions (sender_id, recipient_id, amount, currency, status, type, created_at, updated_at)
            VALUES 
                (1, 2, 10.5, 'USD', 'completed', 'donation', NOW(), NOW()),
                (2, 1, 20.5, 'EUR', 'completed', 'donation', NOW(), NOW())
        `)

        console.log('✓ Seeded transactions')

        console.log('✅ Database seeded successfully!')
    } catch (error) {
        console.error('❌ Seeding failed:', error)
        throw error
    } finally {
        await pool.end()
    }
}

main().catch(err => {
    console.error('❌ Seed script failed:', err)
    process.exit(1)
})
