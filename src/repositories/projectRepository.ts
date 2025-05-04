import { db } from '@/db';
import { 
  projectMetadata, 
  communityTags, 
  communityNotes,
  communityNoteVotes,
  cachedProjects,
  type NewCommunityTag,
  type NewCommunityNote,
  type NewCommunityNoteVote
} from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

export const projectRepository = {
  async getProjectById(id: string) {
    return await db.query.cachedProjects.findFirst({
      where: eq(cachedProjects.id, id),
      with: {
        metadata: true,
      },
    });
  },

  async getAllProjects(params?: {
    limit?: number;
    offset?: number;
    category?: string;
    sponsoredFirst?: boolean;
  }) {
    const query = db.select()
      .from(cachedProjects)
      .leftJoin(projectMetadata, eq(cachedProjects.id, projectMetadata.projectId))
      .where(eq(cachedProjects.isActive, true));

    if (params?.category) {
      query.where(eq(projectMetadata.category, params.category));
    }

    if (params?.sponsoredFirst) {
      query.orderBy(desc(projectMetadata.sponsorBoosted));
    }

    if (params?.limit) {
      query.limit(params.limit);
    }

    if (params?.offset) {
      query.offset(params.offset);
    }

    return await query;
  },

  async upsertProjectMetadata(data: typeof projectMetadata.$inferInsert) {
    const [metadata] = await db.insert(projectMetadata)
      .values(data)
      .onConflictDoUpdate({
        target: projectMetadata.projectId,
        set: data,
      })
      .returning();
    return metadata;
  },

  async incrementViewCount(projectId: string) {
    const [metadata] = await db.update(projectMetadata)
      .set({
        viewsCount: sql`${projectMetadata.viewsCount} + 1`,
      })
      .where(eq(projectMetadata.projectId, projectId))
      .returning();
    return metadata;
  },

  async addCommunityTag(data: NewCommunityTag) {
    const existingTag = await db.query.communityTags.findFirst({
      where: and(
        eq(communityTags.projectId, data.projectId),
        eq(communityTags.text, data.text.toLowerCase())
      ),
    });

    if (existingTag) {
      const [tag] = await db.update(communityTags)
        .set({
          count: sql`${communityTags.count} + 1`,
        })
        .where(eq(communityTags.id, existingTag.id))
        .returning();
      return tag;
    }

    const [tag] = await db.insert(communityTags)
      .values({
        ...data,
        text: data.text.toLowerCase(),
      })
      .returning();
    return tag;
  },

  async getProjectTags(projectId: string) {
    return await db.query.communityTags.findMany({
      where: eq(communityTags.projectId, projectId),
      orderBy: desc(communityTags.count),
    });
  },

  async addCommunityNote(data: NewCommunityNote) {
    const [note] = await db.insert(communityNotes)
      .values(data)
      .returning();
    return note;
  },

  async getProjectNotes(projectId: string) {
    return await db.query.communityNotes.findMany({
      where: eq(communityNotes.projectId, projectId),
      orderBy: desc(communityNotes.upvotes),
      with: {
        author: true,
      },
    });
  },

  async voteOnNote(data: NewCommunityNoteVote) {
    const [vote] = await db.insert(communityNoteVotes)
      .values(data)
      .onConflictDoUpdate({
        target: [communityNoteVotes.noteId, communityNoteVotes.userId],
        set: { isUpvote: data.isUpvote },
      })
      .returning();

    // Update note upvotes count
    await db.update(communityNotes)
      .set({
        upvotes: sql`(
          SELECT COUNT(*) 
          FROM ${communityNoteVotes} 
          WHERE note_id = ${data.noteId} 
          AND is_upvote = true
        )`,
      })
      .where(eq(communityNotes.id, data.noteId));

    return vote;
  },
}; 