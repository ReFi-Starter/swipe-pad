"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { formatCurrency, getUserSettings } from "@/lib/utils"
import { toast } from "sonner"
import { Undo2 } from "lucide-react"

interface Transaction {
  id: string
  amount: number
  projectId: number
  projectTitle: string
  timestamp: number
  status: "pending" | "completed" | "cancelled"
}

interface BatchTransactionContextType {
  pendingTransactions: Transaction[]
  completedTransactions: Transaction[]
  addTransaction: (amount: number, projectId: number, projectTitle: string) => string
  cancelTransaction: (id: string) => void
  processBatch: () => void
}

// Define the action interface for the toast
interface ActionProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

const BatchTransactionContext = createContext<BatchTransactionContextType | undefined>(undefined)

export function BatchTransactionProvider({ children }: { children: React.ReactNode }) {
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([])
  const [completedTransactions, setCompletedTransactions] = useState<Transaction[]>([])
  const [batchTimer, setBatchTimer] = useState<NodeJS.Timeout | null>(null)
  const [userSettings, setUserSettings] = useState({ currency: "CENTS" })

  useEffect(() => {
    setUserSettings(getUserSettings())
  }, [])

  const cancelTransaction = useCallback((id: string) => {
    setPendingTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, status: "cancelled" } : tx)))

    // Filtrar la transacción cancelada
    setPendingTransactions((prev) => prev.filter((tx) => tx.id !== id))

    toast.success("Donación cancelada")
  }, [])

  const processBatch = useCallback(() => {
    if (pendingTransactions.length === 0) return

    // Filtrar solo las transacciones pendientes
    const validTransactions = pendingTransactions.filter((tx) => tx.status === "pending")

    if (validTransactions.length === 0) return

    // Calcular el total del batch
    const totalAmount = validTransactions.reduce((sum, tx) => sum + tx.amount, 0)

    // Mover transacciones de pendientes a completadas
    setCompletedTransactions((prev) => [...prev, ...(validTransactions.map((tx) => ({ ...tx, status: "completed" as const })))])
    setPendingTransactions([])

    // Resetear el timer
    if (batchTimer) {
      clearTimeout(batchTimer)
      setBatchTimer(null)
    }

    // Notificar al usuario
    if (validTransactions.length > 1) {
      toast.success(`Batch procesado: ${formatCurrency(totalAmount, userSettings.currency)}`, {
        description: `${validTransactions.length} donaciones procesadas`,
      })
    } else {
      toast.success(`Donación procesada: ${formatCurrency(totalAmount, userSettings.currency)}`, {
        description: `Para ${validTransactions[0].projectTitle}`,
      })
    }
  }, [pendingTransactions, batchTimer, userSettings])

  // Procesar batch automáticamente después de un tiempo
  useEffect(() => {
    if (pendingTransactions.length > 0 && !batchTimer) {
      const timer = setTimeout(() => {
        processBatch()
      }, 5000) // 5 segundos de delay para permitir deshacer
      setBatchTimer(timer)
    }

    return () => {
      if (batchTimer) {
        clearTimeout(batchTimer)
      }
    }
  }, [pendingTransactions, batchTimer, processBatch])

  const addTransaction = useCallback(
    (amount: number, projectId: number, projectTitle: string): string => {
      const id = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const newTransaction: Transaction = {
        id,
        amount,
        projectId,
        projectTitle,
        timestamp: Date.now(),
        status: "pending",
      }

      setPendingTransactions((prev) => [...prev, newTransaction])

      // Mostrar toast con opción de deshacer
      toast(`Donación: ${formatCurrency(amount, userSettings.currency)}`, {
        description: `Para ${projectTitle}`,
        action: {
          label: "Deshacer",
          onClick: () => cancelTransaction(id),
          icon: <Undo2 className="h-4 w-4" />,
        } as ActionProps,
        duration: 4000,
      })

      return id
    },
    [userSettings, cancelTransaction],
  )

  return (
    <BatchTransactionContext.Provider
      value={{
        pendingTransactions,
        completedTransactions,
        addTransaction,
        cancelTransaction,
        processBatch,
      }}
    >
      {children}
    </BatchTransactionContext.Provider>
  )
}

export function useBatchTransactions() {
  const context = useContext(BatchTransactionContext)
  if (context === undefined) {
    throw new Error("useBatchTransactions must be used within a BatchTransactionProvider")
  }
  return context
}
