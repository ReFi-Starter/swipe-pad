import { motion, MotionValue } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CardHeader } from './card-header'
import { CardProgress } from './card-progress'
import { CardEmojis } from './card-emojis'
import type { Project, SwipeAnimationState } from '@/components/types'

interface CardSwipeViewProps {
  project: Project
  x: MotionValue<number>
  rotate: MotionValue<string>
  rightSwipeOpacity: MotionValue<number>
  leftSwipeOpacity: MotionValue<number>
  shineOpacity: MotionValue<number>
  animationState: SwipeAnimationState
  isDraggable: boolean
  handleDragEnd: () => void
  handleTap: () => void
  onOpenNotes: () => void
  className?: string
  isFront: boolean
  cardIndex: number
  comboCount?: number
}

export function CardSwipeView({
  project,
  x,
  rotate,
  rightSwipeOpacity,
  leftSwipeOpacity,
  shineOpacity,
  animationState,
  isDraggable,
  handleDragEnd,
  handleTap,
  onOpenNotes,
  className = "",
  isFront,
  cardIndex,
  comboCount = 0
}: CardSwipeViewProps) {
  return (
    <motion.div
      style={{
        x,
        rotate,
        zIndex: isFront ? 10 : 5 - cardIndex,
      }}
      drag={isDraggable ? "x" : false}
      dragElastic={0.7}
      dragMomentum={false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      onClick={handleTap}
      className={`absolute w-full ${className}`}
      initial={false}
      animate={{ scale: isFront ? 1 : 0.95 - cardIndex * 0.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="relative overflow-hidden rounded-2xl shadow-sm border bg-white">
        <CardHeader 
          project={project}
          onOpenNotes={onOpenNotes}
        />

        <CardProgress 
          current={project.progress.current}
          target={project.progress.target}
        />

        {/* Action Prompt */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center">
          <motion.div
            style={{ opacity: leftSwipeOpacity }}
            className="absolute left-4"
          >
            <span className="text-destructive">Skip</span>
          </motion.div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              ¢{project.donationAmount} to support
            </span>
            {comboCount > 1 && (
              <Badge variant="secondary" className="animate-pulse">
                🔥 x{comboCount}
              </Badge>
            )}
          </div>

          <motion.div
            style={{ opacity: rightSwipeOpacity }}
            className="absolute right-4"
          >
            <span className="text-primary">Support</span>
          </motion.div>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            opacity: shineOpacity
          }}
        />
      </Card>

      <CardEmojis 
        animationState={animationState}
        isFront={isFront}
      />
    </motion.div>
  )
} 