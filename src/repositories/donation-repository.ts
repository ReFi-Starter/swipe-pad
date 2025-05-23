import { db } from '@/db'
import { cachedDonations, type NewCachedDonation } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

export const donationRepository = {
    async getDonationsByCampaign(campaignId: string) {
        return await db.query.cachedDonations.findMany({
            where: eq(cachedDonations.campaignId, campaignId),
            orderBy: desc(cachedDonations.donatedAt),
        })
    },

    async getDonationsByDonor(donorAddress: string) {
        return await db.query.cachedDonations.findMany({
            where: eq(cachedDonations.donorAddress, donorAddress.toLowerCase()),
            orderBy: desc(cachedDonations.donatedAt),
        })
    },

    async createDonation(data: NewCachedDonation) {
        const [donation] = await db
            .insert(cachedDonations)
            .values({
                ...data,
                donorAddress: data.donorAddress.toLowerCase(),
            })
            .returning()
        return donation
    },

    async getDonationByTxHash(txHash: string) {
        return await db.query.cachedDonations.findFirst({
            where: eq(cachedDonations.txHash, txHash),
        })
    },
}
