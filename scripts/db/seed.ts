import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { seed } from 'drizzle-seed'
import { Pool } from 'pg'
import {
    achievements,
    campaignNotes,
    campaigns,
    campaignTags,
    categories,
    friendships,
    supportedCurrencies,
    supportedLanguages,
    swipeAmounts,
    transactions,
    userAchievements,
    users,
} from '../../db/schema'

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
    console.log('🌱 Starting database seed...')

    try {
        await seed(db, {
            categories,
            users,
            achievements,
            campaigns,
            campaignNotes,
            campaignTags,
            userAchievements,
            supportedCurrencies,
            supportedLanguages,
            swipeAmounts,
            friendships,
            transactions,
        }).refine(f => ({
            // Categories
            categories: {
                count: 8,
                columns: {
                    name: f.valuesFromArray({
                        values: [
                            'Environment',
                            'Community',
                            'Energy',
                            'Healthcare',
                            'Education',
                            'SocFi',
                            'Open Source',
                            'Animal Rescue',
                        ],
                    }),
                    slug: f.valuesFromArray({
                        values: [
                            'environment',
                            'community',
                            'energy',
                            'healthcare',
                            'education',
                            'socfi',
                            'open-source',
                            'animal-rescue',
                        ],
                    }),
                    description: f.valuesFromArray({
                        values: [
                            'Environmental sustainability projects',
                            'Community development initiatives',
                            'Clean energy solutions',
                            'Healthcare accessibility projects',
                            'Educational resources and programs',
                            'Social finance initiatives',
                            'Open source software projects',
                            'Animal welfare and rescue programs',
                        ],
                    }),
                    icon: f.valuesFromArray({
                        values: ['🌱', '👥', '⚡', '🏥', '📚', '💰', '💻', '🐾'],
                    }),
                },
            },
            // Users
            users: {
                count: 20,
                columns: {
                    name: f.fullName(),
                    email: f.email(),
                    walletAddress: f.string(),
                    avatarUrl: f.valuesFromArray({
                        values: Array.from(
                            { length: 20 },
                            (_, i) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
                        ),
                    }),
                    points: f.int({ minValue: 0, maxValue: 1000 }),
                    maxPoints: f.default({ defaultValue: 1000 }),
                    donations: f.number({ minValue: 0, maxValue: 100, precision: 2 }),
                    streak: f.int({ minValue: 0, maxValue: 30 }),
                    reputation: f.int({ minValue: 0, maxValue: 1000 }),
                    isCurrentUser: f.valuesFromArray({ values: [true, false], isUnique: false }),
                    isPublicProfile: f.valuesFromArray({ values: [true, false], isUnique: false }),
                },
            },
            // Achievements
            achievements: {
                count: 7,
                columns: {
                    title: f.valuesFromArray({
                        values: [
                            'First Donation',
                            'Streak Master',
                            'Big Spender',
                            'Global Impact',
                            'Leaderboard Champion',
                            'Community Guardian',
                            'Trusted Tagger',
                        ],
                    }),
                    description: f.valuesFromArray({
                        values: [
                            'Made your first micro-donation',
                            'Donated for 7 days in a row',
                            'Donated a total of $10',
                            'Donated to campaigns in 5 different categories',
                            'Reached the top 3 on the leaderboard',
                            'Submit 10 verified tags on campaigns',
                            'Have 50 of your tags confirmed by others',
                        ],
                    }),
                    icon: f.valuesFromArray({
                        values: ['🎉', '🔥', '💰', '🌍', '🏆', '🛡️', '✅'],
                    }),
                },
            },
            // Campaigns
            campaigns: {
                count: 15,
                columns: {
                    title: f.loremIpsum({ sentencesCount: 1 }),
                    description: f.loremIpsum({ sentencesCount: 3 }),
                    imageUrl: f.valuesFromArray({
                        values: Array.from({ length: 15 }, (_, i) => `https://picsum.photos/seed/${i}/800/400`),
                    }),
                    fundingGoal: f.number({ minValue: 1000, maxValue: 10000, precision: 2 }),
                    currentFunding: f.number({ minValue: 0, maxValue: 1000, precision: 2 }),
                    websiteUrl: f.valuesFromArray({
                        values: Array.from({ length: 15 }, (_, i) => `https://example${i}.com`),
                    }),
                    sponsorBoosted: f.valuesFromArray({ values: [true, false], isUnique: false }),
                    creatorId: f.int({ minValue: 1, maxValue: 20 }),
                    categoryName: f.valuesFromArray({
                        values: [
                            'Environment',
                            'Community',
                            'Energy',
                            'Healthcare',
                            'Education',
                            'SocFi',
                            'Open Source',
                            'Animal Rescue',
                        ],
                    }),
                },
            },
            // Campaign Tags
            campaignTags: {
                count: 5,
                columns: {
                    text: f.valuesFromArray({
                        values: ['✅ Verified', '👍 Recommended', '🔍 Needs Review', '⚠️ Warning', '🚫 Spam'],
                    }),
                    color: f.valuesFromArray({
                        values: ['green', 'blue', 'orange', 'yellow', 'red'],
                    }),
                    count: f.int({ minValue: 0, maxValue: 100 }),
                },
            },
            // Campaign Notes
            campaignNotes: {
                count: 30,
                columns: {
                    text: f.loremIpsum({ sentencesCount: 2 }),
                    upvotes: f.int({ minValue: 0, maxValue: 50 }),
                    authorId: f.int({ minValue: 1, maxValue: 20 }),
                },
            },
            // User Achievements
            userAchievements: {
                count: 40,
                columns: {
                    unlockedAt: f.date({ minDate: '2023-01-01', maxDate: '2024-03-01' }),
                },
            },
            // Supported Currencies
            supportedCurrencies: {
                count: 7,
                columns: {
                    code: f.valuesFromArray({
                        values: ['USD', 'EUR', 'GBP', 'CUS', 'CEU', 'USC', 'CNT'],
                    }),
                    name: f.valuesFromArray({
                        values: ['US Dollar', 'Euro', 'British Pound', 'Celo Dollar', 'Celo Euro', 'USD Coin', 'Cents'],
                    }),
                    symbol: f.valuesFromArray({
                        values: ['$', '€', '£', 'cUSD', 'cEUR', 'USDC', '¢'],
                    }),
                },
            },
            // Supported Languages
            supportedLanguages: {
                count: 4,
                columns: {
                    code: f.valuesFromArray({
                        values: ['en', 'es', 'fr', 'de'],
                    }),
                    name: f.valuesFromArray({
                        values: ['English', 'Spanish', 'French', 'German'],
                    }),
                    nativeName: f.valuesFromArray({
                        values: ['English', 'Español', 'Français', 'Deutsch'],
                    }),
                },
            },
            // Swipe Amounts
            swipeAmounts: {
                count: 4,
                columns: {
                    amount: f.valuesFromArray({
                        values: [1, 10, 50, 100], // Values in cents
                    }),
                },
            },
            // Friendships (following relationships)
            friendships: {
                count: 30, // We'll create 30 random following relationships
                columns: {
                    followerId: f.int({ minValue: 1, maxValue: 20 }),
                    followingId: f.int({ minValue: 1, maxValue: 20 }),
                },
            },
            // Transactions
            transactions: {
                count: 50,
                columns: {
                    amount: f.number({ minValue: 1, maxValue: 100, precision: 2 }),
                    currency: f.valuesFromArray({
                        values: ['USD', 'EUR', 'GBP', 'CUS', 'CEU', 'USC', 'CNT'],
                    }),
                    status: f.valuesFromArray({
                        values: ['pending', 'completed', 'failed'],
                    }),
                    type: f.valuesFromArray({
                        values: ['donation', 'withdrawal', 'refund'],
                    }),
                    senderId: f.int({ minValue: 1, maxValue: 20 }),
                    recipientId: f.int({ minValue: 1, maxValue: 20 }),
                },
            },
        }))

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
