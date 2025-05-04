import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client';
import { AppRouter } from '@/server/routers/_app';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/trpc`,
      transformer: superjson,
    }),
  ],
}); 