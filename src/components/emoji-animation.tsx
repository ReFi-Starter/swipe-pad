"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EmojiAnimationProps {
  type: "success" | "skip" | "error"
  show: boolean
  onComplete?: () => void
}

export function EmojiAnimation({ type, show, onComplete }: EmojiAnimationProps) {
  const [emojis, setEmojis] = useState<{ id: number; x: number; y: number; rotate: number; scale: number }[]>([])

  // Configuración según el tipo
  const config = {
    success: {
      emoji: "❤️",
      count: 8,
      duration: 1.5,
    },
    skip: {
      emoji: "😔",
      count: 5,
      duration: 1.2,
    },
    error: {
      emoji: "⚠️",
      count: 3,
      duration: 1.2,
    },
  }[type]

  useEffect(() => {
    if (show) {
      // Crear emojis con posiciones aleatorias
      const newEmojis = Array.from({ length: config.count }).map((_, i) => ({
        id: i,
        x: Math.random() * 200 - 100, // -100 a 100
        y: Math.random() * -200 - 50, // -50 a -250 (hacia arriba)
        rotate: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5,
      }))

      setEmojis(newEmojis)

      // Llamar a onComplete después de la animación
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, config.duration * 1000)

      return () => clearTimeout(timer)
    }
  }, [show, type])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <AnimatePresence>
        {emojis.map((emoji) => (
          <motion.div
            key={emoji.id}
            initial={{
              opacity: 0,
              scale: 0.5,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, emoji.scale, 0],
              x: emoji.x,
              y: emoji.y,
              rotate: emoji.rotate,
            }}
            transition={{
              duration: config.duration,
              ease: "easeOut",
            }}
            className="absolute text-3xl"
          >
            {config.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
