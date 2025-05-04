import { db } from '@/db';
import { users, userSettings, type NewUser } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const userRepository = {
  // Find user by wallet address
  async findByWalletAddress(address: string) {
    return await db.query.users.findFirst({
      where: eq(users.walletAddress, address.toLowerCase()),
    });
  },
  
  // Create new user
  async create(data: NewUser) {
    const [user] = await db.insert(users)
      .values({
        walletAddress: data.walletAddress.toLowerCase(),
        username: data.username,
        avatarUrl: data.avatarUrl,
      })
      .returning();
    
    // Create default user settings
    await db.insert(userSettings)
      .values({
        userId: user.id,
      })
      .onConflictDoNothing();
      
    return user;
  },
  
  // Update user streak
  async updateStreak(userId: number, streak: number) {
    const [user] = await db.update(users)
      .set({ streak })
      .where(eq(users.id, userId))
      .returning();
    return user;
  },
  
  // Update user reputation
  async updateReputation(userId: number, reputation: number) {
    return await db.update(users)
      .set({ reputation })
      .where(eq(users.id, userId))
      .returning();
  },
  
  // Update user profile
  async updateProfile(userId: number, data: Partial<NewUser>) {
    const [user] = await db.update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();
    return user;
  },
  
  // Get user settings
  async getUserSettings(userId: number) {
    return await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, userId),
    });
  },
  
  // Update user settings
  async updateUserSettings(userId: number, data: Partial<typeof userSettings.$inferInsert>) {
    const [settings] = await db.update(userSettings)
      .set(data)
      .where(eq(userSettings.userId, userId))
      .returning();
    return settings;
  }
}; 