import { db } from '@/db';
import { 
  cachedProjects, 
  projectMetadata, 
  communityTags, 
  communityNotes, 
  communityNoteVotes 
} from '@/db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';

export const projectRepository = {
  // Get project by ID
  async getProjectById(projectId: string) {
    const project = await db.query.cachedProjects.findFirst({
      where: eq(cachedProjects.id, projectId),
    });
    
    if (!project) return null;
    
    // Get project metadata
    const metadata = await db.query.projectMetadata.findFirst({
      where: eq(projectMetadata.projectId, projectId),
    });
    
    return { ...project, metadata };
  },
  
  // Get all projects
  async getAllProjects(options?: { 
    limit?: number; 
    offset?: number; 
    category?: string;
    sponsoredFirst?: boolean;
  }) {
    const { limit = 10, offset = 0, category, sponsoredFirst = true } = options || {};
    
    let query = db.select()
      .from(cachedProjects)
      .leftJoin(projectMetadata, eq(cachedProjects.id, projectMetadata.projectId))
      .limit(limit)
      .offset(offset);
    
    if (category) {
      query = query.where(eq(projectMetadata.category, category));
    }
    
    if (sponsoredFirst) {
      query = query.orderBy(desc(projectMetadata.sponsorBoosted));
    }
    
    return await query;
  },
  
  // Create or update project metadata
  async upsertProjectMetadata(data: {
    projectId: string;
    category: string;
    tags?: string[];
    sponsorBoosted?: boolean;
  }) {
    return await db.insert(projectMetadata)
      .values(data)
      .onConflictDoUpdate({
        target: projectMetadata.projectId,
        set: {
          category: data.category,
          tags: data.tags,
          sponsorBoosted: data.sponsorBoosted,
          updatedAt: new Date(),
        },
      })
      .returning();
  },
  
  // Increment view count
  async incrementViewCount(projectId: string) {
    return await db.update(projectMetadata)
      .set({
        viewsCount: sql`${projectMetadata.viewsCount} + 1`,
      })
      .where(eq(projectMetadata.projectId, projectId));
  },
  
  // Add community tag
  async addCommunityTag(data: {
    projectId: string;
    userId: number;
    text: string;
  }) {
    // Check if tag already exists
    const existingTag = await db.query.communityTags.findFirst({
      where: and(
        eq(communityTags.projectId, data.projectId),
        eq(communityTags.text, data.text)
      ),
    });
    
    if (existingTag) {
      // Increment count
      return await db.update(communityTags)
        .set({
          count: sql`${communityTags.count} + 1`,
        })
        .where(
          and(
            eq(communityTags.projectId, data.projectId),
            eq(communityTags.text, data.text)
          )
        )
        .returning();
    } else {
      // Create new tag
      return await db.insert(communityTags)
        .values(data)
        .returning();
    }
  },
  
  // Get project tags
  async getProjectTags(projectId: string) {
    return await db.select()
      .from(communityTags)
      .where(eq(communityTags.projectId, projectId))
      .orderBy(desc(communityTags.count));
  },
  
  // Add community note
  async addCommunityNote(data: {
    projectId: string;
    authorId: number;
    text: string;
    tags?: string[];
  }) {
    return await db.insert(communityNotes)
      .values(data)
      .returning();
  },
  
  // Get project notes
  async getProjectNotes(projectId: string) {
    return await db.select()
      .from(communityNotes)
      .where(eq(communityNotes.projectId, projectId))
      .orderBy(desc(communityNotes.upvotes));
  },
  
  // Vote on note
  async voteOnNote(data: {
    noteId: number;
    userId: number;
    isUpvote: boolean;
  }) {
    // Check if vote already exists
    const existingVote = await db.query.communityNoteVotes.findFirst({
      where: and(
        eq(communityNoteVotes.noteId, data.noteId),
        eq(communityNoteVotes.userId, data.userId)
      ),
    });
    
    if (existingVote) {
      // Update vote
      return await db.update(communityNoteVotes)
        .set({
          isUpvote: data.isUpvote,
        })
        .where(
          and(
            eq(communityNoteVotes.noteId, data.noteId),
            eq(communityNoteVotes.userId, data.userId)
          )
        )
        .returning();
    } else {
      // Create new vote
      const result = await db.insert(communityNoteVotes)
        .values(data)
        .returning();
      
      // Update note upvotes count
      await db.update(communityNotes)
        .set({
          upvotes: sql`${communityNotes.upvotes} ${data.isUpvote ? '+' : '-'} 1`,
        })
        .where(eq(communityNotes.id, data.noteId));
      
      return result;
    }
  },
}; 