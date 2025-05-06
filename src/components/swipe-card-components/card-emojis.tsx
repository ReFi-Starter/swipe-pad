import { SwipeAnimationState } from '@/types/swipe'
import { AnimatePresence, motion } from 'framer-motion'

interface CardEmojisProps {
    animationState: SwipeAnimationState
    isFront: boolean
}

// Enhanced retro game-style animation
const rewardVariants = {
    initial: {
        scale: 1.2,
        opacity: 0,
        y: 0,
    },
    animate: {
        scale: [1.2, 1.6, 1.4],
        opacity: [0, 1, 0.9],
        y: [0, -60, -80],
        transition: {
            duration: 0.8,
            ease: [0.2, 0.65, 0.3, 0.9], // Custom spring-like easing
            times: [0, 0.4, 1], // Control timing of scale/opacity changes
        },
    },
    exit: {
        scale: 1.2,
        opacity: 0,
        y: -100,
        transition: {
            duration: 0.2,
            ease: 'easeOut',
        },
    },
}

export function CardEmojis({ animationState, isFront }: CardEmojisProps) {
    if (!isFront) return null

    return (
        <div
            className='pointer-events-none fixed inset-0 overflow-visible'
            style={{
                perspective: '1000px',
                zIndex: 9999,
            }}>
            <AnimatePresence>
                {/* Like Heart - Single impactful animation */}
                {animationState.showRightEmoji && (
                    <motion.div
                        className='fixed left-1/2 -translate-x-1/2'
                        style={{
                            bottom: '40%',
                            filter: 'drop-shadow(0 0 10px rgba(255,105,180,0.7))',
                            WebkitTextStroke: '1px white', // Retro-style outline
                        }}
                        variants={rewardVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'>
                        <span className='text-6xl' style={{ color: '#ff69b4' }}>
                            ❤️
                        </span>
                    </motion.div>
                )}

                {/* Sad Face - Single impactful animation */}
                {animationState.showLeftEmoji && (
                    <motion.div
                        className='fixed left-1/2 -translate-x-1/2'
                        style={{
                            bottom: '40%',
                            filter: 'drop-shadow(0 0 10px rgba(100,149,237,0.7))',
                            WebkitTextStroke: '1px white',
                        }}
                        variants={rewardVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'>
                        <span className='text-6xl' style={{ color: '#6495ed' }}>
                            😢
                        </span>
                    </motion.div>
                )}

                {/* Super Like Star - Extra special animation */}
                {animationState.showSuperLikeEmoji && (
                    <motion.div
                        className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                        style={{
                            filter: 'drop-shadow(0 0 15px rgba(255,223,0,0.8))',
                            WebkitTextStroke: '2px white',
                            zIndex: 9999,
                        }}
                        variants={{
                            initial: { scale: 0, opacity: 0, rotate: -180 },
                            animate: {
                                scale: [0, 2, 1.6],
                                opacity: [0, 1, 0.9],
                                rotate: [-180, 0, 0],
                                transition: {
                                    duration: 0.8,
                                    ease: [0.175, 0.885, 0.32, 1.275],
                                },
                            },
                            exit: {
                                scale: 0,
                                opacity: 0,
                                transition: { duration: 0.2 },
                            },
                        }}
                        initial='initial'
                        animate='animate'
                        exit='exit'>
                        <span className='text-6xl' style={{ color: '#ffd700' }}>
                            ✨
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
