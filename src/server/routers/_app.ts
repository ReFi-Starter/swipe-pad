import { router } from '../trpc'
import { campaignRouter } from './campaign'
import { donationRouter } from './donation'
import { userRouter } from './user'

export const appRouter = router({
    user: userRouter,
    campaign: campaignRouter,
    donation: donationRouter,
})

export type AppRouter = typeof appRouter
