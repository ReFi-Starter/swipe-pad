"use client"

import React, { useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { ThumbsDown, ThumbsUp, Info } from 'lucide-react'
import { VerifiedBadge } from '@/components/verified-badge'
import { ProjectImage } from '@/components/project-image'

export interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  donationAmount: number
  creator: {
    name: string
    avatar?: string
    verified?: boolean
  }
  createdAt?: Date
}

// Para uso con referencias externas
export type SwipeCardRef = {
  swipe: (dir: 'left' | 'right') => void
}

interface SwipeCardProps {
  project: Project
  onSwipe?: (direction: 'left' | 'right') => void
  active?: boolean
  className?: string
  cardIndex?: number
  mode?: 'swipe' | 'list'
}

// Funciones auxiliares para activar el swipe desde componentes externos
export const swipeLeft = (ref: HTMLDivElement) => {
  if (!ref) return;
  
  // Aplicar transformación para simular swipe hacia la izquierda
  ref.style.transform = `translateX(-200px) rotate(-20deg)`;
  
  // Añadir transición CSS
  ref.style.transition = 'transform 0.5s ease-out';
  
  // Disparar el evento de transitionend después de la animación
  setTimeout(() => {
    const parent = ref.parentElement;
    if (parent) {
      parent.classList.add('moving-left');
    }
  }, 100);
};

export const swipeRight = (ref: HTMLDivElement) => {
  if (!ref) return;
  
  // Aplicar transformación para simular swipe hacia la derecha
  ref.style.transform = `translateX(200px) rotate(20deg)`;
  
  // Añadir transición CSS
  ref.style.transition = 'transform 0.5s ease-out';
  
  // Disparar el evento de transitionend después de la animación
  setTimeout(() => {
    const parent = ref.parentElement;
    if (parent) {
      parent.classList.add('moving-right');
    }
  }, 100);
};

export function SwipeCard({
  project,
  onSwipe,
  active = true,
  className = "",
  cardIndex = 0,
  mode = 'swipe'
}: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Motion values for animations
  const x = useMotionValue(0)
  const rotateRaw = useTransform(x, [-150, 150], [-18, 18])
  
  // Visual feedback transformations
  const rightSwipeOpacity = useTransform(x, [0, 100], [0, 0.8])
  const leftSwipeOpacity = useTransform(x, [-100, 0], [0.8, 0])
  
  const isFront = cardIndex === 0
  const baseRotation = !isFront ? (cardIndex % 2 ? 3 : -3) : 0
  
  // List mode render
  if (mode === 'list') {
    return (
      <Card className={`w-full overflow-hidden shadow-sm border ${className}`}>
        <div className="relative aspect-[4/3] w-full">
          <ProjectImage
            src={project.imageUrl}
            alt={project.title}
            projectId={project.id}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover"
            fallbackClassName="bg-cover bg-center"
          />
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold line-clamp-1">{project.title}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>by {project.creator.name}</span>
                {project.creator.verified && <VerifiedBadge isVerified />}
              </div>
            </div>
            <Badge variant="outline" className="ml-2 shrink-0">
              {formatCurrency(project.donationAmount)}
            </Badge>
          </div>
          
          <p className="text-sm mb-3 text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          
          <Button size="sm" variant="default" className="w-full h-8">
            <Info className="h-4 w-4 mr-1" />
            <span className="text-xs">View Details</span>
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  // Swipe mode with framer-motion
  return (
    <motion.div
      ref={cardRef}
      className={`w-[280px] h-[400px] ${className} rounded-lg overflow-hidden`} 
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        zIndex: 50 - cardIndex,
      }}
      animate={{
        scale: isFront ? 1 : 1 - (cardIndex * 0.01),
        y: isFront ? 0 : cardIndex * -3,
        rotate: isFront ? `${rotateRaw.get()}deg` : `${baseRotation}deg`,
        boxShadow: isFront 
          ? "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)"
          : "0 4px 6px -1px rgb(0 0 0 / 0.03), 0 2px 4px -1px rgb(0 0 0 / 0.03)",
        opacity: isFront ? 1 : 0.9 - (cardIndex * 0.1),
      }}
      exit={{ 
        x: x.get() > 0 ? 200 : -200,
        opacity: 0,
        scale: 0.8, 
        transition: { duration: 0.2, ease: "easeIn" }
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 25,
        mass: 0.5,
        boxShadow: { duration: 0.3 },
        rotate: { type: 'spring', stiffness: 200, damping: 25, mass: 0.5 }, 
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={() => {
        const xValue = x.get()
        if (isFront && Math.abs(xValue) > 100) { // Check isFront here
          const direction = xValue > 0 ? 'right' : 'left'
          onSwipe?.(direction) // Call onSwipe only if it's the front card
        }
      }}
      dragElastic={0.7}
      whileTap={{ cursor: "grabbing" }}
    >
      {/* Added subtle border to the inner card */}
      <Card className="w-full h-full rounded-lg overflow-hidden border border-black/5 shadow-none flex flex-col bg-background">
        {/* Image container aligned to top with fixed height */}
        <div className="relative w-full h-[60%] flex-none"> 
          <div className="absolute inset-0 z-0">
            <ProjectImage
              src={project.imageUrl}
              alt={project.title}
              projectId={project.id}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              fallbackClassName="bg-cover bg-center"
              priority={active} // Ensures LCP priority for the top card image
            />
          </div>
          
          {/* Visual feedback during swipe - overlay on image */}
          {isFront && (
            <>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-green-500/50 to-transparent pointer-events-none z-10"
                style={{ opacity: rightSwipeOpacity }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-4 right-4 transform rotate-[15deg]">
                  <ThumbsUp className="text-white w-10 h-10 drop-shadow-lg" strokeWidth={2.5} />
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-l from-red-500/50 to-transparent pointer-events-none z-10"
                style={{ opacity: leftSwipeOpacity }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-4 left-4 transform -rotate-[15deg]">
                  <ThumbsDown className="text-white w-10 h-10 drop-shadow-lg" strokeWidth={2.5}/>
                </div>
              </motion.div>
            </>
          )}
        </div>
        
        {/* Restructured Card Content with fixed height to ensure initial render */}
        <div className="h-[40%] p-3 flex flex-col justify-between overflow-y-auto z-20 bg-background relative">
          {/* Top section: Title, Creator, Amount */}
          <div className="mb-2">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-base font-semibold line-clamp-2 leading-tight">{project.title}</h3>
              <Badge variant="secondary" className="ml-auto shrink-0 text-xs font-bold px-1.5 py-0.5">
                {formatCurrency(project.donationAmount)}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>by {project.creator.name}</span>
              {project.creator.verified && <VerifiedBadge isVerified />} 
            </div>
          </div>

          {/* Middle section: Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-auto py-1">
            {project.description}
          </p>
          
          {/* Bottom section: Actions (only for front card) */}
          {isFront && (
            <div className="flex justify-between items-center pt-2 border-t border-black/5 -mx-3 px-3 mt-2">
              <Button size="sm" variant="ghost" className="h-6 px-1 text-xs text-muted-foreground hover:text-foreground">
                <Info className="h-3 w-3 mr-1" />
                Details
              </Button>
              <div className="flex gap-2">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-7 w-7 rounded-full bg-red-100 border-red-200 text-red-500 hover:bg-red-200 shadow-sm transition-transform active:scale-90"
                  onClick={() => {
                    // Programmatic swipe left
                    x.set(-200); // Trigger motion value change
                    onSwipe?.('left');
                  }}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-7 w-7 rounded-full bg-green-100 border-green-200 text-green-500 hover:bg-green-200 shadow-sm transition-transform active:scale-90"
                  onClick={() => {
                    // Programmatic swipe right
                    x.set(200); // Trigger motion value change
                    onSwipe?.('right');
                  }}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
} 