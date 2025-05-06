import { motion, useAnimation, type PanInfo } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CardHeader } from './card-header'
import { CardProgress } from './card-progress'
import { CardEmojis } from './card-emojis'
import type { Project, SwipeAnimationState } from '@/components/types'

interface CardSwipeViewProps {
  project: Project
  isDraggable: boolean
  handleDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
  handleTap: () => void
  onOpenNotes: () => void
  className?: string
  isFront: boolean
  cardIndex: number
  comboCount?: number
  animationState: SwipeAnimationState
}

export function CardSwipeView({
  project,
  isDraggable,
  handleDragEnd,
  handleTap,
  onOpenNotes,
  className = "",
  isFront,
  cardIndex,
  comboCount = 0,
  animationState
}: CardSwipeViewProps) {
  const controls = useAnimation()

  // Calculate stacked card transforms
  const stackStyles = {
    0: {
      scale: 1,
      y: 0,
      opacity: 1,
      zIndex: 30,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
    },
    1: {
      scale: 0.95,
      y: -10,
      opacity: 0.8,
      zIndex: 20,
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
    },
    2: {
      scale: 0.9,
      y: -20,
      opacity: 0.6,
      zIndex: 10,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    }
  }[Math.min(cardIndex, 2)] || {
    scale: 0.85,
    y: -30,
    opacity: 0.4,
    zIndex: 0,
    boxShadow: "none"
  }
  
  return (
    <motion.div
      style={{
        zIndex: stackStyles.zIndex,
        perspective: 1000
      }}
      animate={controls}
      initial={{
        scale: stackStyles.scale,
        y: stackStyles.y,
        opacity: stackStyles.opacity
      }}
      drag={isDraggable ? "x" : false}
      dragElastic={0.9}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      onClick={handleTap}
      className={`absolute inset-0 ${className}`}
      whileDrag={{
        scale: 1.02,
        cursor: 'grabbing'
      }}
    >
      <Card 
        className="h-full overflow-hidden rounded-2xl bg-white border-none pt-0"
        style={{
          boxShadow: stackStyles.boxShadow,
          transform: `perspective(1000px) ${cardIndex > 0 ? `translateZ(${-cardIndex * 10}px)` : ''}`
        }}
      >
        <div className="flex flex-col h-full">
          <CardHeader 
            project={project}
            onOpenNotes={onOpenNotes}
          />

          <CardProgress 
            current={project.progress.current}
            target={project.progress.target}
          />

          {/* Enhanced Action Indicators */}
          <div className="mt-auto p-4 flex items-center justify-center">
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
          </div>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            opacity: 0
          }}
          animate={{
            opacity: [0, 0.5, 0],
            x: [-200, 200],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 1
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