import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"
import { FarcasterInitializer } from "@/components/FarcasterInitializer"
export const metadata: Metadata = {
  title: "SwipePad - Micro-donations for ReFi",
  description: "Swipe to support ReFi projects on Celo",
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <FarcasterInitializer>{children}</FarcasterInitializer>
        </Providers>
      </body>
    </html>
  )
}
