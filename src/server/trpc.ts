import { initTRPC } from '@trpc/server'
import { ZodError } from 'zod'
import superjson from 'superjson'

import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import { AppRouter } from '@/server/routers/_app'

export const trpcClient = createTRPCProxyClient<AppRouter>({
    links: [
        loggerLink({
            enabled: opts =>
                process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
            url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/trpc`,
            transformer: superjson,
        }),
    ],
})

const t = initTRPC.create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        }
    },
})

export const router = t.router
export const publicProcedure = t.procedure
