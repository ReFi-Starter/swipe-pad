// https://github.com/ReFi-Starter/swipe-pad/blob/main/apps/MiniPay/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Example Font
import './globals.css'; // Global styles
import { Providers } from './providers'; // Client-side Web3 providers wrapper

const inter = Inter({ subsets: ['latin'] });

// Define metadata for SEO and app info
export const metadata: Metadata = {
  title: 'SwipePad MiniPay',
  description: 'Support vetted projects with micro-donations on the Celo Network via MiniPay.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The Root Layout must contain <html> and <body> tags.
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap the entire application in the client-side Providers component.
          This component (providers.tsx) contains WagmiProvider and QueryClientProvider.
        */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

