import { db } from '@/db';
import { users, userSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const userRepository = {
  // Find user by wallet address
  async findByWalletAddress(address: string) {
    return await db.query.users.findFirst({
      where: eq(users.walletAddress, address.toLowerCase()),
    });
  },
  
  // Create new user
  async create(data: { walletAddress: string; username?: string; avatarUrl?: string }) {
    const newUsers = await db.insert(users).values({
      walletAddress: data.walletAddress.toLowerCase(),
      username: data.username,
      avatarUrl: data.avatarUrl,
    }).returning();
    
    if (newUsers.length > 0) {
      // Create default user settings
      await db.insert(userSettings).values({
        userId: newUsers[0].id,
      });
    }
    
    return newUsers;
  },
  
  // Update user streak
  async updateStreak(userId: number, streak: number) {
    return await db.update(users)
      .set({ streak, lastActive: new Date() })
      .where(eq(users.id, userId))
      .returning();
  },
  
  // Update user reputation
  async updateReputation(userId: number, reputation: number) {
    return await db.update(users)
      .set({ reputation })
      .where(eq(users.id, userId))
      .returning();
  },
  
  // Update user profile
  async updateProfile(userId: number, data: { 
    username?: string; 
    avatarUrl?: string; 
    isPublicProfile?: boolean 
  }) {
    return await db.update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();
  },
  
  // Get user settings
  async getUserSettings(userId: number) {
    return await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, userId),
    });
  },
  
  // Update user settings
  async updateUserSettings(userId: number, data: {
    currency?: string;
    language?: string;
    region?: string;
    defaultDonationAmount?: string;
    autoBatch?: boolean;
  }) {
    return await db.update(userSettings)
      .set(data)
      .where(eq(userSettings.userId, userId))
      .returning();
  }
}; 