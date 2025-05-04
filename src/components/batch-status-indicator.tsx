"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { useBatchTransactions } from "./batch-transaction-provider"
import { formatCurrency } from "@/lib/utils"

export function BatchStatusIndicator() {
  const { pendingTransactions, completedTransactions } = useBatchTransactions()
  const [showIndicator, setShowIndicator] = useState(false)
  const [recentTx, setRecentTx] = useState<{
    id: string;
    amount: number;
    projectId: number;
    projectTitle: string;
    timestamp: number;
    status: "pending" | "completed" | "cancelled";
  } | null>(null)

  useEffect(() => {
    // Check for the most recent transaction
    const latestPendingTx = pendingTransactions.length > 0 
      ? pendingTransactions[pendingTransactions.length - 1] 
      : null

    if (latestPendingTx) {
      setRecentTx(latestPendingTx)
      setShowIndicator(true)
    } else {
      // Check for completed transactions in the last 5 seconds
      const recentCompletedTx = completedTransactions.find(
        (tx) => tx.timestamp > Date.now() - 5000
      )

      if (recentCompletedTx) {
        setRecentTx(recentCompletedTx)
        setShowIndicator(true)

        // Hide after 3 seconds
        const timer = setTimeout(() => {
          setShowIndicator(false)
        }, 3000)

        return () => clearTimeout(timer)
      } else {
        setShowIndicator(false)
      }
    }
  }, [pendingTransactions, completedTransactions])

  if (!recentTx) return null

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div className="bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 max-w-xs">
            {recentTx.status === "pending" && <Clock className="h-5 w-5 text-amber-500" />}
            {recentTx.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
            {recentTx.status === "cancelled" && <XCircle className="h-5 w-5 text-red-500" />}

            <div className="flex-1 text-sm">
              <div className="font-medium">
                {recentTx.status === "pending" && "Processing donation..."}
                {recentTx.status === "completed" && "Donation completed"}
                {recentTx.status === "cancelled" && "Donation cancelled"}
              </div>
              <div className="text-gray-500 text-xs">
                {formatCurrency(recentTx.amount, "CENTS")} to {recentTx.projectTitle}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
