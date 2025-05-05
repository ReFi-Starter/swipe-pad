import { motion, AnimatePresence } from 'framer-motion'
import type { SwipeAnimationState } from '@/components/types'

interface CardEmojisProps {
  animationState: SwipeAnimationState
  isFront: boolean
}

// Enhanced animations with more fluid motion
const emojiVariants = {
  initial: { scale: 0.2, opacity: 0, y: 20 },
  animate: { 
    scale: [0.2, 1.5, 1.2], 
    opacity: [0, 1, 1],
    y: [20, -10, 0],
    transition: { 
      duration: 0.6, 
      ease: [0.175, 0.885, 0.32, 1.275], // Custom "elastic" ease
      times: [0, 0.6, 1]
    }
  },
  exit: { 
    scale: 0, 
    opacity: 0,
    transition: { duration: 0.3 }
  }
}

// Background burst effect
const burstVariants = {
  initial: { scale: 0.1, opacity: 0 },
  animate: { 
    scale: 2, 
    opacity: [0, 0.7, 0],
    transition: { duration: 0.7 }
  },
  exit: { opacity: 0 }
}

export function CardEmojis({ animationState, isFront }: CardEmojisProps) {
  if (!isFront) return null

  return (
    <motion.div className="absolute inset-0 pointer-events-none z-[60]">
      <AnimatePresence>
        {animationState.showRightEmoji && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Background burst effect */}
            <motion.div
              className="absolute w-20 h-20 rounded-full bg-green-500/20"
              variants={burstVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            />
            
            <motion.div
              variants={emojiVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative"
            >
              <div className="text-8xl transform rotate-[15deg] drop-shadow-xl">❤️</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {animationState.showLeftEmoji && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Background burst effect */}
            <motion.div
              className="absolute w-20 h-20 rounded-full bg-red-500/20"
              variants={burstVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            />
            
            <motion.div
              variants={emojiVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative"
            >
              <div className="text-8xl transform -rotate-[15deg] drop-shadow-xl">👎</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {animationState.showSuperLikeEmoji && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Background burst effect */}
            <motion.div
              className="absolute w-20 h-20 rounded-full bg-blue-500/20"
              variants={burstVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            />
            
            <motion.div
              variants={emojiVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative"
            >
              <div className="text-8xl transform rotate-[15deg] drop-shadow-xl">✨</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 