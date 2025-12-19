import Providers from "@/components/Providers"
import { Analytics } from "@vercel/analytics/next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import type React from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "SwipePad",
  description: "Support vetted projects with micro-donations on Celo.",
  openGraph: {
    title: "SwipePad",
    description: "Support vetted projects with micro-donations on Celo.",
    url: "https://farcaster-swipepad.vercel.app",
    siteName: "SwipePad",
    images: [
      {
        url: "https://farcaster-swipepad.vercel.app/splash.png",
        width: 1200,
        height: 630,
        alt: "SwipePad Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://farcaster-swipepad.vercel.app/splash.png",
    "fc:frame:button:1": "Launch App",
    "fc:frame:button:1:action": "link",
    // IMPORTANT: Point this to the Farcaster Directory Deep Link to ensure native open
    "fc:frame:button:1:target": "https://farcaster.xyz/miniapps/Creyx6pow0Ko/swipepad",
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
