import { motion, AnimatePresence } from 'framer-motion'
import type { SwipeAnimationState } from '@/components/types'

interface CardEmojisProps {
  animationState: SwipeAnimationState
  isFront: boolean
}

const emojiVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { 
    scale: [0.5, 1.8, 1.4], 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { scale: 0.5, opacity: 0 }
}

export function CardEmojis({ animationState, isFront }: CardEmojisProps) {
  if (!isFront) return null

  return (
    <motion.div className="absolute inset-0 pointer-events-none z-[60]">
      <AnimatePresence>
        {animationState.showRightEmoji && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            variants={emojiVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="text-8xl transform rotate-[15deg] drop-shadow-xl">❤️</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {animationState.showLeftEmoji && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            variants={emojiVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="text-8xl transform -rotate-[15deg] drop-shadow-xl">👎</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {animationState.showSuperLikeEmoji && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            variants={emojiVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="text-8xl transform rotate-[15deg] drop-shadow-xl">✨</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 