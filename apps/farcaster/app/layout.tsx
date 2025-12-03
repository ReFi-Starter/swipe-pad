import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Providers from "@/components/Providers"

export const metadata: Metadata = {
  title: "Swipe Pad",
  description: "Swipe to support regenerative projects on Celo",
  openGraph: {
    title: "Swipe Pad",
    description: "Swipe to support regenerative projects on Celo",
    url: "https://farcaster.swipepad.xyz",
    siteName: "Swipe Pad",
    images: [
      {
        url: "https://farcaster.swipepad.xyz/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://farcaster.swipepad.xyz/og-image.png",
    "fc:frame:button:1": "Launch App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://farcaster.swipepad.xyz",
    // Miniapp specific tags
    "fc:miniapp": "vNext",
    "fc:miniapp:title": "Swipe Pad",
    "fc:miniapp:icon": "https://farcaster.swipepad.xyz/icon.png",
    "fc:miniapp:action": "https://farcaster.swipepad.xyz",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
