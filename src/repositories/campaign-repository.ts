import { db } from '@/db'
import {
    cachedCampaigns,
    campaignMetadata,
    communityNotes,
    communityNoteVotes,
    communityTags,
    type NewCommunityNote,
    type NewCommunityNoteVote,
    type NewCommunityTag,
} from '@/db/schema'
import { and, desc, eq, sql, type SQL } from 'drizzle-orm'

export const campaignRepository = {
    async getCampaignById(id: string) {
        return await db.query.cachedCampaigns.findFirst({
            where: eq(cachedCampaigns.id, id),
            with: {
                metadata: true,
            },
        })
    },

    async getAllCampaigns(params?: { limit?: number; offset?: number; category?: string; sponsoredFirst?: boolean }) {
        const conditions: SQL[] = [eq(cachedCampaigns.isActive, true)]

        if (params?.category) {
            conditions.push(eq(campaignMetadata.category, params.category))
        }

        const query = db
            .select()
            .from(cachedCampaigns)
            .leftJoin(campaignMetadata, eq(cachedCampaigns.id, campaignMetadata.campaignId))
            .where(and(...conditions))

        if (params?.sponsoredFirst) {
            query.orderBy(desc(campaignMetadata.sponsorBoosted))
        }

        if (typeof params?.limit === 'number') {
            query.limit(params.limit)
        }

        if (typeof params?.offset === 'number') {
            query.offset(params.offset)
        }

        return await query
    },

    async upsertCampaignMetadata(data: typeof campaignMetadata.$inferInsert) {
        const [metadata] = await db
            .insert(campaignMetadata)
            .values(data)
            .onConflictDoUpdate({
                target: campaignMetadata.campaignId,
                set: data,
            })
            .returning()
        return metadata
    },

    async incrementViewCount(campaignId: string) {
        const [metadata] = await db
            .update(campaignMetadata)
            .set({
                viewsCount: sql`${campaignMetadata.viewsCount} + 1`,
            })
            .where(eq(campaignMetadata.campaignId, campaignId))
            .returning()
        return metadata
    },

    async addCommunityTag(data: NewCommunityTag) {
        const existingTag = await db.query.communityTags.findFirst({
            where: and(eq(communityTags.campaignId, data.campaignId), eq(communityTags.text, data.text.toLowerCase())),
        })

        if (existingTag) {
            const [tag] = await db
                .update(communityTags)
                .set({
                    count: sql`${communityTags.count} + 1`,
                })
                .where(eq(communityTags.id, existingTag.id))
                .returning()
            return tag
        }

        const [tag] = await db
            .insert(communityTags)
            .values({
                ...data,
                text: data.text.toLowerCase(),
            })
            .returning()
        return tag
    },

    async getCampaignTags(campaignId: number) {
        return await db.query.communityTags.findMany({
            where: eq(communityTags.campaignId, campaignId),
            orderBy: desc(communityTags.count),
        })
    },

    async addCommunityNote(data: NewCommunityNote) {
        const [note] = await db.insert(communityNotes).values(data).returning()
        return note
    },

    async getCampaignNotes(campaignId: number) {
        return await db.query.communityNotes.findMany({
            where: eq(communityNotes.campaignId, campaignId),
            orderBy: desc(communityNotes.upvotes),
            with: {
                author: true,
            },
        })
    },

    async voteOnNote(data: NewCommunityNoteVote) {
        const [vote] = await db
            .insert(communityNoteVotes)
            .values(data)
            .onConflictDoUpdate({
                target: [communityNoteVotes.noteId, communityNoteVotes.userId],
                set: { isUpvote: data.isUpvote },
            })
            .returning()

        // Update note upvotes count using a simpler SQL approach
        const noteId = data.noteId
        if (typeof noteId === 'number') {
            await db
                .update(communityNotes)
                .set({
                    upvotes: sql`(
            SELECT COUNT(*) 
            FROM ${communityNoteVotes} 
            WHERE note_id = ${noteId} 
            AND is_upvote = true
          )`,
                })
                .where(eq(communityNotes.id, noteId))
        }

        return vote
    },
}
