import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { projectRepository } from '@/repositories/projectRepository';

export const projectRouter = router({
  byId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await projectRepository.getProjectById(input);
    }),
    
  getAllProjects: publicProcedure
    .input(z.object({
      limit: z.number().optional(),
      offset: z.number().optional(),
      category: z.string().optional(),
      sponsoredFirst: z.boolean().optional(),
    }).optional())
    .query(async ({ input }) => {
      return await projectRepository.getAllProjects(input);
    }),
    
  upsertMetadata: publicProcedure
    .input(z.object({
      projectId: z.string(),
      category: z.string(),
      tags: z.array(z.string()).optional(),
      sponsorBoosted: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      return await projectRepository.upsertProjectMetadata(input);
    }),
    
  incrementViewCount: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await projectRepository.incrementViewCount(input);
    }),
    
  addTag: publicProcedure
    .input(z.object({
      projectId: z.string(),
      userId: z.number(),
      text: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await projectRepository.addCommunityTag(input);
    }),
    
  getProjectTags: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await projectRepository.getProjectTags(input);
    }),
    
  addNote: publicProcedure
    .input(z.object({
      projectId: z.string(),
      authorId: z.number(),
      text: z.string(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      return await projectRepository.addCommunityNote(input);
    }),
    
  getProjectNotes: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await projectRepository.getProjectNotes(input);
    }),
    
  voteOnNote: publicProcedure
    .input(z.object({
      noteId: z.number(),
      userId: z.number(),
      isUpvote: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      return await projectRepository.voteOnNote(input);
    }),
}); 