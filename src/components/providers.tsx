'use client'

import { Toaster } from "sonner"
import { WalletProvider } from "@/providers/wallet-provider"
import { BatchTransactionProvider } from "@/components/batch-transaction-provider"
import { TrpcProvider } from "@/providers/trpc-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TrpcProvider>
      <WalletProvider>
        <BatchTransactionProvider>
          {children}
          <Toaster position="bottom-center" richColors />
        </BatchTransactionProvider>
      </WalletProvider>
    </TrpcProvider>
  )
} 