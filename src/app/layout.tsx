import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '@/app/globals.css';
import '@/app/fullscreen.css';

import { AppProvider } from '@/providers/AppProvider';
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwipePad - Micro-Donations Made Easy",
  description: "Supporting global impact projects with a simple swipe",
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL('https://swipepad.example.com'),
  openGraph: {
    title: 'SwipePad - Micro-Donations Made Easy',
    description: 'Supporting global impact projects with a simple swipe',
    url: 'https://swipepad.example.com',
    siteName: 'SwipePad',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <div className="fullscreen-container">
            {children}
          </div>
          <Toaster position="bottom-center" richColors expand={false} visibleToasts={1} />
        </AppProvider>
      </body>
    </html>
  );
}