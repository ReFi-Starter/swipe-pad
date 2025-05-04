"use client"

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion"
import Image from "next/image"
import { VerifiedBadge } from "./verified-badge"
import { Button } from "./ui/button"

interface ProjectCardProps {
  id: string
  title: string
  description: string
  imageUrl: string
  donationAmount: number
  creator?: {
    name: string
    verified?: boolean
  }
  onSwipe?: (direction: "left" | "right") => void
  mode?: "swipe" | "list"
}

export function ProjectCard({
  title,
  description,
  imageUrl,
  donationAmount,
  creator,
  onSwipe,
  mode = "swipe"
}: ProjectCardProps) {
  // Motion values for tracking swipe
  const x = useMotionValue(0)
  const controls = useAnimation()

  // Transform values for visual feedback
  const rotate = useTransform(x, [-150, 150], [-10, 10]) // Less rotation for more subtle effect
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])
  const scale = useTransform(x, [-200, -150, 0, 150, 200], [0.7, 0.9, 1, 0.9, 0.7])

  // Handle drag end
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (Math.abs(velocity) >= 800 || Math.abs(offset) > 100) {
      const direction = offset > 0 ? "right" : "left"
      controls.start({ x: offset > 0 ? 500 : -500 })
      onSwipe?.(direction)
    } else {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 40 } })
    }
  }

  // Render list mode
  if (mode === "list") {
    return (
      <div className="project-card static transform-none cursor-pointer hover:scale-[0.98] transition-transform">
        <div className="project-card-image">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 340px) 90vw, 340px"
            priority
          />
        </div>
        <div className="project-card-content">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
            {creator?.verified && <VerifiedBadge isVerified={true} />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Goal: ${donationAmount}</span>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render swipe mode
  return (
    <motion.div
      className="project-card"
      style={{
        x,
        rotate,
        opacity,
        scale
      }}
      drag={mode === "swipe" ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileTap={{ cursor: "grabbing" }}
    >
      <div className="project-card-image">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 340px) 90vw, 340px"
          priority
        />
      </div>
      <div className="project-card-content">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
          {creator?.verified && <VerifiedBadge isVerified={true} />}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{description}</p>
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-semibold">Goal: ${donationAmount}</span>
            <Button variant="outline" size="sm">Details</Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
