import { router } from '../trpc';
import { userRouter } from './user';
import { projectRouter } from './project';
import { donationRouter } from './donation';

export const appRouter = router({
  user: userRouter,
  project: projectRouter,
  donation: donationRouter,
});

export type AppRouter = typeof appRouter; 