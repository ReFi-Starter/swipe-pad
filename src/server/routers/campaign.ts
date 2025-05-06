import { campaignRepository } from '@/repositories/campaign-repository'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const campaignRouter = router({
    byId: publicProcedure.input(z.string()).query(async ({ input }) => {
        return await campaignRepository.getCampaignById(input)
    }),

    getAllCampaigns: publicProcedure
        .input(
            z
                .object({
                    limit: z.number().optional(),
                    offset: z.number().optional(),
                    category: z.string().optional(),
                    sponsoredFirst: z.boolean().optional(),
                })
                .optional(),
        )
        .query(async ({ input }) => {
            return await campaignRepository.getAllCampaigns(input)
        }),

    upsertMetadata: publicProcedure
        .input(
            z.object({
                campaignId: z.string(),
                category: z.string(),
                tags: z.array(z.string()).optional(),
                sponsorBoosted: z.boolean().optional(),
            }),
        )
        .mutation(async ({ input }) => {
            return await campaignRepository.upsertCampaignMetadata(input)
        }),

    incrementViewCount: publicProcedure.input(z.string()).mutation(async ({ input }) => {
        return await campaignRepository.incrementViewCount(input)
    }),

    addTag: publicProcedure
        .input(
            z.object({
                campaignId: z.string(),
                userId: z.number(),
                text: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            return await campaignRepository.addCommunityTag(input)
        }),

    getCampaignTags: publicProcedure.input(z.string()).query(async ({ input }) => {
        return await campaignRepository.getCampaignTags(input)
    }),

    addNote: publicProcedure
        .input(
            z.object({
                campaignId: z.string(),
                authorId: z.number(),
                text: z.string(),
                tags: z.array(z.string()).optional(),
            }),
        )
        .mutation(async ({ input }) => {
            return await campaignRepository.addCommunityNote(input)
        }),

    getCampaignNotes: publicProcedure.input(z.string()).query(async ({ input }) => {
        return await campaignRepository.getCampaignNotes(input)
    }),

    voteOnNote: publicProcedure
        .input(
            z.object({
                noteId: z.number(),
                userId: z.number(),
                isUpvote: z.boolean(),
            }),
        )
        .mutation(async ({ input }) => {
            return await campaignRepository.voteOnNote(input)
        }),
})
