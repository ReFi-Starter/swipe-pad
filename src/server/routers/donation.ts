import { donationRepository } from '@/repositories/donation-repository'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const donationRouter = router({
    byCampaign: publicProcedure.input(z.string()).query(async ({ input }) => {
        return await donationRepository.getDonationsByCampaign(input)
    }),

    byDonor: publicProcedure.input(z.string()).query(async ({ input }) => {
        return await donationRepository.getDonationsByDonor(input)
    }),

    create: publicProcedure
        .input(
            z.object({
                txHash: z.string(),
                donorAddress: z.string(),
                campaignId: z.string(),
                amount: z.string(),
                tokenAddress: z.string().optional(),
            }),
        )
        .mutation(async ({ input }) => {
            return await donationRepository.createDonation(input)
        }),

    byTxHash: publicProcedure.input(z.string()).query(async ({ input }) => {
        return await donationRepository.getDonationByTxHash(input)
    }),
})
