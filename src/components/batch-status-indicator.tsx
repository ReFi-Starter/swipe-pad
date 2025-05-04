"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useBatchTransactions } from "@/components/batch-transaction-provider"
import { formatCurrency, getUserSettings } from "@/lib/utils"
import { Clock, Check } from "lucide-react"

export function BatchStatusIndicator() {
  const { pendingTransactions } = useBatchTransactions()
  const [userSettings, setUserSettings] = useState({ currency: "CENTS" })
  const [timeLeft, setTimeLeft] = useState(5)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setUserSettings(getUserSettings())
  }, [])

  useEffect(() => {
    if (pendingTransactions.length > 0) {
      setIsVisible(true)
      setTimeLeft(5)
    } else {
      // Pequeño delay antes de ocultar para mostrar la animación de completado
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [pendingTransactions.length])

  // Actualizar el contador regresivo
  useEffect(() => {
    if (pendingTransactions.length === 0 || timeLeft <= 0) return

    const timer = setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, pendingTransactions.length])

  // Calcular el total pendiente
  const totalPending = pendingTransactions.reduce((sum, tx) => sum + tx.amount, 0)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30"
      >
        <div className="bg-white rounded-full shadow-lg border border-slate-200 px-4 py-2 flex items-center gap-2">
          {pendingTransactions.length > 0 ? (
            <>
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="text-sm">
                Procesando {formatCurrency(totalPending, userSettings.currency)} en {timeLeft}s
              </span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">¡Batch procesado!</span>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
