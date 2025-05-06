import '@/styles/globals.css'

import AppLayout from '@/components/layout/app-layout'
import { Providers } from '@/components/providers'
import { inter } from '@/lib/config/fonts'
import { cn } from '@/lib/styles/tailwind'

export { metadata, viewport } from '@/lib/config/metadata'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={cn(inter.className, 'flex h-dvh flex-col')}>
                <Providers>
                    <AppLayout>{children}</AppLayout>
                </Providers>
            </body>
        </html>
    )
}
