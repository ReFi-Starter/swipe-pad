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
    console.log('🌱 Starting clean database seed...')

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
                ('Community', 'community', 'Community development initiatives', '👥', NOW(), NOW()),
                ('Energy', 'energy', 'Clean energy solutions', '⚡', NOW(), NOW()),
                ('Healthcare', 'healthcare', 'Healthcare accessibility projects', '🏥', NOW(), NOW()),
                ('Education', 'education', 'Educational resources and programs', '📚', NOW(), NOW()),
                ('SocFi', 'socfi', 'Social finance initiatives', '💰', NOW(), NOW()),
                ('Open Source', 'open-source', 'Open source software projects', '💻', NOW(), NOW()),
                ('Animal Rescue', 'animal-rescue', 'Animal welfare and rescue programs', '🐾', NOW(), NOW())
        `)

        console.log('✓ Seeded categories')

        // Seed supported currencies
        await db.execute(sql`
            INSERT INTO supported_currencies (code, name, symbol)
            VALUES 
                ('USD', 'US Dollar', '$'),
                ('EUR', 'Euro', '€'),
                ('GBP', 'British Pound', '£'),
                ('CUS', 'Celo Dollar', 'cUSD'),
                ('CEU', 'Celo Euro', 'cEUR'),
                ('USC', 'USD Coin', 'USDC'),
                ('CNT', 'Cents', '¢')
        `)

        console.log('✓ Seeded supported currencies')

        // Seed supported languages
        await db.execute(sql`
            INSERT INTO supported_languages (code, name, native_name)
            VALUES 
                ('en', 'English', 'English'),
                ('es', 'Spanish', 'Español'),
                ('fr', 'French', 'Français'),
                ('de', 'German', 'Deutsch')
        `)

        console.log('✓ Seeded supported languages')

        // Seed swipe amounts
        await db.execute(sql`
            INSERT INTO swipe_amounts (amount)
            VALUES (1), (10), (50), (100)
        `)

        console.log('✓ Seeded swipe amounts')

        // Seed users (20 users)
        const usersQuery = `
            INSERT INTO users (name, email, wallet_address, avatar_url, points, max_points, donations, streak, reputation, is_current_user, is_public_profile, created_at, updated_at)
            VALUES ${Array.from(
                { length: 20 },
                (_, i) => `(
                'User ${i + 1}', 
                'user${i + 1}@example.com', 
                '0x${i.toString(16).padStart(40, '0')}', 
                'https://api.dicebear.com/7.x/avataaars/svg?seed=${i}',
                ${Math.floor(Math.random() * 1000)},
                1000,
                ${(Math.random() * 100).toFixed(2)},
                ${Math.floor(Math.random() * 30)},
                ${Math.floor(Math.random() * 1000)},
                ${i === 0 ? 'true' : 'false'},
                ${Math.random() > 0.2 ? 'true' : 'false'},
                NOW(),
                NOW()
            )`,
            ).join(',')}
        `
        await db.execute(sql.raw(usersQuery))

        console.log('✓ Seeded users')

        // Seed achievements
        await db.execute(sql`
            INSERT INTO achievements (title, description, icon, created_at, updated_at)
            VALUES 
                ('First Donation', 'Made your first micro-donation', '🎉', NOW(), NOW()),
                ('Streak Master', 'Donated for 7 days in a row', '🔥', NOW(), NOW()),
                ('Big Spender', 'Donated a total of $10', '💰', NOW(), NOW()),
                ('Global Impact', 'Donated to campaigns in 5 different categories', '🌍', NOW(), NOW()),
                ('Leaderboard Champion', 'Reached the top 3 on the leaderboard', '🏆', NOW(), NOW()),
                ('Community Guardian', 'Submit 10 verified tags on campaigns', '🛡️', NOW(), NOW()),
                ('Trusted Tagger', 'Have 50 of your tags confirmed by others', '✅', NOW(), NOW())
        `)

        console.log('✓ Seeded achievements')

        // Seed campaigns (15 campaigns)
        const campaignsQuery = `
            INSERT INTO campaigns (title, category, description, image_url, funding_goal, current_funding, website_url, sponsor_boosted, creator_id, created_at, updated_at)
            VALUES ${Array.from({ length: 15 }, (_, i) => {
                const categories = [
                    'Environment',
                    'Community',
                    'Energy',
                    'Healthcare',
                    'Education',
                    'SocFi',
                    'Open Source',
                    'Animal Rescue',
                ]
                const category = categories[Math.floor(Math.random() * categories.length)]
                const fundingGoal = (Math.random() * 9000 + 1000).toFixed(2)
                const currentFunding = (Math.random() * 1000).toFixed(2)
                // Make sure creator_id is between 1 and 20
                const creatorId = (i % 20) + 1

                return `(
                    'Campaign ${i + 1}',
                    '${category}',
                    'This is a description for campaign ${i + 1}. It aims to make a difference in the ${category} sector.',
                    'https://picsum.photos/seed/${i}/800/400',
                    ${fundingGoal},
                    ${currentFunding},
                    'https://example${i}.com',
                    ${Math.random() > 0.7 ? 'true' : 'false'},
                    ${creatorId},
                    NOW(),
                    NOW()
                )`
            }).join(',')}
        `
        await db.execute(sql.raw(campaignsQuery))

        console.log('✓ Seeded campaigns')

        // Seed campaign tags
        const campaignTagsQuery = `
            INSERT INTO campaign_tags (campaign_id, text, color, count)
            VALUES ${[...Array(15)]
                .flatMap((_, campaignId) => {
                    const tags = [
                        ['✅ Verified', 'green'],
                        ['👍 Recommended', 'blue'],
                        ['🔍 Needs Review', 'orange'],
                        ['⚠️ Warning', 'yellow'],
                        ['🚫 Spam', 'red'],
                    ]

                    // Randomly select 1-3 tags for each campaign
                    const numTags = Math.floor(Math.random() * 3) + 1
                    const selectedTags = tags.sort(() => 0.5 - Math.random()).slice(0, numTags)

                    return selectedTags.map(
                        ([text, color]) => `(
                    ${campaignId + 1},
                    '${text}',
                    '${color}',
                    ${Math.floor(Math.random() * 100)}
                )`,
                    )
                })
                .join(',')}
        `
        await db.execute(sql.raw(campaignTagsQuery))

        console.log('✓ Seeded campaign tags')

        // Seed campaign notes
        const campaignNotesQuery = `
            INSERT INTO campaign_notes (campaign_id, author_id, text, upvotes, created_at)
            VALUES ${[...Array(30)]
                .map((_, i) => {
                    const campaignId = Math.floor(Math.random() * 15) + 1
                    const authorId = Math.floor(Math.random() * 20) + 1

                    return `(
                    ${campaignId},
                    ${authorId},
                    'This is note ${i + 1} about campaign ${campaignId}. It contains some feedback or information.',
                    ${Math.floor(Math.random() * 50)},
                    NOW()
                )`
                })
                .join(',')}
        `
        await db.execute(sql.raw(campaignNotesQuery))

        console.log('✓ Seeded campaign notes')

        // Seed user achievements
        const userAchievementsQuery = `
            INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
            VALUES ${[...Array(40)]
                .map(() => {
                    const userId = Math.floor(Math.random() * 20) + 1
                    const achievementId = Math.floor(Math.random() * 7) + 1

                    // Random date between 2023-01-01 and 2024-03-01
                    const start = new Date('2023-01-01').getTime()
                    const end = new Date('2024-03-01').getTime()
                    const randomDate = new Date(start + Math.random() * (end - start))
                    const dateString = randomDate.toISOString().split('T')[0]

                    return `(
                    ${userId},
                    ${achievementId},
                    '${dateString}'
                )`
                })
                .join(',')}
        `
        await db.execute(sql.raw(userAchievementsQuery))

        console.log('✓ Seeded user achievements')

        // Seed friendships
        const friendshipsQuery = `
            INSERT INTO friendships (follower_id, following_id, created_at)
            VALUES ${[...Array(30)]
                .map(() => {
                    let followerId, followingId
                    do {
                        followerId = Math.floor(Math.random() * 20) + 1
                        followingId = Math.floor(Math.random() * 20) + 1
                    } while (followerId === followingId)

                    return `(
                    ${followerId},
                    ${followingId},
                    NOW()
                )`
                })
                .join(',')}
        `
        await db.execute(sql.raw(friendshipsQuery))

        console.log('✓ Seeded friendships')

        // Seed transactions
        const transactionsQuery = `
            INSERT INTO transactions (sender_id, recipient_id, amount, currency, status, type, created_at, updated_at)
            VALUES ${[...Array(50)]
                .map(() => {
                    let senderId, recipientId
                    do {
                        senderId = Math.floor(Math.random() * 20) + 1
                        recipientId = Math.floor(Math.random() * 20) + 1
                    } while (senderId === recipientId)

                    const amount = (Math.random() * 99 + 1).toFixed(2)
                    const currencies = ['USD', 'EUR', 'GBP', 'CUS', 'CEU', 'USC', 'CNT']
                    const currency = currencies[Math.floor(Math.random() * currencies.length)]
                    const statuses = ['pending', 'completed', 'failed']
                    const status = statuses[Math.floor(Math.random() * statuses.length)]
                    const types = ['donation', 'withdrawal', 'refund']
                    const type = types[Math.floor(Math.random() * types.length)]

                    return `(
                    ${senderId},
                    ${recipientId},
                    ${amount},
                    '${currency}',
                    '${status}',
                    '${type}',
                    NOW(),
                    NOW()
                )`
                })
                .join(',')}
        `
        await db.execute(sql.raw(transactionsQuery))

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
