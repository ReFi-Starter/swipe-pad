import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { WalletProvider } from "@/providers/wallet-provider";
import { Navbar } from "@/components/navbar";
import { BatchTransactionProvider } from "@/components/batch-transaction-provider";
import { TrpcProvider } from "@/providers/TrpcProvider";
import { BottomNav } from "@/components/bottom-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwipePad Donations",
  description: "Support projects on the Celo blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TrpcProvider>
          <WalletProvider>
            <BatchTransactionProvider>
              <Navbar />
              {children}
              <div className="fixed bottom-0 left-0 right-0 bg-white">
                <BottomNav />
              </div>
              <Toaster position="bottom-center" richColors />
            </BatchTransactionProvider>
          </WalletProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}