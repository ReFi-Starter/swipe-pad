import { checkConnection, runMigrations } from './utils'

async function deploy() {
    console.log('🚀 Starting production database deployment...')

    // Verify we're in production
    if (process.env.NODE_ENV !== 'production') {
        console.error('❌ This script should only be run in production environment')
        process.exit(1)
    }

    // Check database connection
    const isConnected = await checkConnection()
    if (!isConnected) {
        console.error('❌ Cannot connect to production database')
        process.exit(1)
    }

    // Run migrations
    await runMigrations()

    console.log('✅ Production deployment completed successfully')
}

deploy().catch(error => {
    console.error('❌ Deployment failed:', error)
    process.exit(1)
})
