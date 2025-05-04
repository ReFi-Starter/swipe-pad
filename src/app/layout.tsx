import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Shell, TopBar as ShellTopBar, Content, BottomBar } from '@/components/shell'
import { Providers } from '@/components/providers'
import { TopBar } from '@/components/top-bar'
import { BottomNav } from '@/components/bottom-nav'
import { ContentView } from '@/components/content-view'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwipePad",
  description: "Discover and support sustainable projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-full bg-gray-50`}>
        <Providers>
          <Shell>
            <ShellTopBar>
              <TopBar />
            </ShellTopBar>
            <Content>
              <ContentView>
                {children}
              </ContentView>
            </Content>
            <BottomBar>
              <BottomNav />
            </BottomBar>
          </Shell>
        </Providers>
      </body>
    </html>
  );
}