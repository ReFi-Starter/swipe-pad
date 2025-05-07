import { userRepository } from '@/repositories/user-repository'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const userRouter = router({
    byWalletAddress: publicProcedure.input(z.string()).query(async ({ input }) => {
        return await userRepository.findByWalletAddress(input)
    }),

    create: publicProcedure
        .input(
            z.object({
                walletAddress: z.string(),
                name: z.string(),
                username: z.string().optional(),
                avatarUrl: z.string().optional(),
            }),
        )
        .mutation(async ({ input }) => {
            return await userRepository.create(input)
        }),

    updateStreak: publicProcedure
        .input(
            z.object({
                userId: z.number(),
                streak: z.number(),
            }),
        )
        .mutation(async ({ input }) => {
            return await userRepository.updateStreak(input.userId, input.streak)
        }),

    updateProfile: publicProcedure
        .input(
            z.object({
                userId: z.number(),
                data: z.object({
                    username: z.string().optional(),
                    avatarUrl: z.string().optional(),
                    isPublicProfile: z.boolean().optional(),
                }),
            }),
        )
        .mutation(async ({ input }) => {
            return await userRepository.updateProfile(input.userId, input.data)
        }),

    getUserSettings: publicProcedure.input(z.number()).query(async ({ input }) => {
        return await userRepository.getUserSettings(input)
    }),

    updateUserSettings: publicProcedure
        .input(
            z.object({
                userId: z.number(),
                data: z.object({
                    currency: z.string().optional(),
                    language: z.string().optional(),
                    region: z.string().optional(),
                    defaultDonationAmount: z.string().optional(),
                    autoBatch: z.boolean().optional(),
                }),
            }),
        )
        .mutation(async ({ input }) => {
            return await userRepository.updateUserSettings(input.userId, input.data)
        }),
})
