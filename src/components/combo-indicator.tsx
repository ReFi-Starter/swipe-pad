"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FlameIcon as Fire } from "lucide-react"

interface ComboIndicatorProps {
  combo: number
  show: boolean
  onComplete?: () => void
}

export function ComboIndicator({ combo, show, onComplete }: ComboIndicatorProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show || combo < 3) return null

  // Determinar el mensaje y estilo según el combo
  const getMessage = () => {
    if (combo >= 10) return "¡LEGENDARIO!"
    if (combo >= 8) return "¡INCREÍBLE!"
    if (combo >= 6) return "¡FANTÁSTICO!"
    if (combo >= 5) return "¡EXCELENTE!"
    if (combo >= 3) return "¡BUEN COMBO!"
    return ""
  }

  // Determinar el número de iconos de fuego según el combo
  const getFireIcons = () => {
    if (combo >= 10) return Array(3).fill(0)
    if (combo >= 7) return Array(2).fill(0)
    return Array(1).fill(0)
  }

  // Mover el combo indicator a la esquina superior derecha
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          className="fixed top-16 right-4 z-50 pointer-events-none"
        >
          <motion.div
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: 2, duration: 0.5 }}
          >
            <div className="flex">
              {getFireIcons().map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
                >
                  <Fire className="h-5 w-5 text-yellow-300" />
                </motion.div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">{getMessage()}</span>
              <motion.span
                className="font-bold text-yellow-300"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: 1, duration: 0.5 }}
              >
                x{combo}
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
