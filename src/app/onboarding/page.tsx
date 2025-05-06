'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion'
import { useAppStore } from '@/store/use-app-store'
import { X, Heart, ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/styles/tailwind'

// Onboarding steps definition
interface Step {
    id: string
    title: string
    subtitle: string
    description: string
    illustration: 'cards' | 'swipe' | 'complete'
}

const steps: Step[] = [
    {
        id: 'welcome',
        title: 'Welcome to SwipePad',
        subtitle: 'Micro-donations, macro impact',
        description: 'The easiest way to donate to causes you care about with a simple gesture.',
        illustration: 'cards',
    },
    {
        id: 'swipe',
        title: 'Swipe to Donate',
        subtitle: 'Swipe to choose',
        description:
            'Swipe left to skip or right to donate. Every swipe right sends your donation to a cause making a difference.',
        illustration: 'swipe',
    },
    {
        id: 'complete',
        title: "You're All Set!",
        subtitle: "Let's begin",
        description: 'Your SwipePad journey starts now. Explore projects, make donations, and make a difference!',
        illustration: 'complete',
    },
]

// Shared variants for consistent animations
const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.95,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            x: { type: 'spring', stiffness: 350, damping: 30 },
            opacity: { duration: 0.3 },
            scale: { duration: 0.4, ease: 'easeOut' },
        },
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        scale: 0.95,
        transition: {
            x: { type: 'spring', stiffness: 350, damping: 30 },
            opacity: { duration: 0.3 },
            scale: { duration: 0.2 },
        },
    }),
}

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [direction, setDirection] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const router = useRouter()
    const setOnboarded = useAppStore(state => state.setOnboarded)

    // Swipe handling
    const swipeX = useMotionValue(0)
    const controls = useAnimation()
    const swipeProgress = useTransform(swipeX, [-200, 0, 200], [-1, 0, 1])

    const handleDragEnd = async () => {
        const swipe = swipeProgress.get()
        if (Math.abs(swipe) > 0.5) {
            if (swipe > 0 && currentStep < steps.length - 1) {
                await nextStep()
            } else if (swipe < 0 && currentStep > 0) {
                await prevStep()
            } else {
                // Reset position if can't move
                controls.start({ x: 0 })
            }
        } else {
            // Reset position if swipe not far enough
            controls.start({ x: 0 })
        }
    }

    // Advance to next step
    const nextStep = async () => {
        if (isAnimating) return

        if (currentStep < steps.length - 1) {
            setDirection(1)
            setIsAnimating(true)
            setCurrentStep(prev => prev + 1)
            await controls.start({ x: 0 })
        } else {
            completeOnboarding()
        }
    }

    // Go back to previous step
    const prevStep = async () => {
        if (isAnimating || currentStep === 0) return

        setDirection(-1)
        setIsAnimating(true)
        setCurrentStep(prev => prev - 1)
        await controls.start({ x: 0 })
    }

    // Complete onboarding and redirect
    const completeOnboarding = () => {
        setOnboarded(true)
        router.push('/swipe')
    }

    // Handle animation completion
    const handleAnimationComplete = () => {
        setIsAnimating(false)
    }

    return (
        <motion.div
            className={cn(
                'relative h-screen w-full overflow-hidden',
                '[&_.gradient-green]:bg-gradient-to-br [&_.gradient-green]:from-[#22CC88] [&_.gradient-green]:to-[#A0EAB4]',
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}>
            {/* Background layer */}
            <motion.div
                className='gradient-green absolute inset-0'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            />

            {/* Content layer */}
            <div className='relative flex h-full flex-col'>
                {/* Fixed step indicators at top */}
                <motion.div
                    className='fixed top-8 right-0 left-0 z-10 flex justify-center gap-2'
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}>
                    {steps.map((_, idx) => (
                        <motion.div
                            key={idx}
                            className={cn(
                                'h-1.5 w-6 rounded-full transition-all duration-300',
                                currentStep === idx ? 'bg-white' : 'bg-white/30',
                            )}
                            animate={{
                                scale: currentStep === idx ? 1 : 0.8,
                            }}
                        />
                    ))}
                </motion.div>

                {/* Main content area with swipe support */}
                <div className='flex flex-1 items-center justify-center px-6 pt-8'>
                    <div className='relative w-full max-w-md'>
                        <motion.div
                            drag='x'
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            style={{ x: swipeX }}
                            animate={controls}
                            className='touch-pan-y'>
                            <AnimatePresence
                                initial={false}
                                mode='wait'
                                custom={direction}
                                onExitComplete={handleAnimationComplete}>
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial='enter'
                                    animate='center'
                                    exit='exit'
                                    className='mt-8 text-center'>
                                    <motion.h2
                                        className='mb-3 text-3xl font-bold text-white'
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 }}>
                                        {steps[currentStep].title}
                                    </motion.h2>

                                    <motion.h3
                                        className='mb-3 text-lg font-medium text-white/90'
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.15 }}>
                                        {steps[currentStep].subtitle}
                                    </motion.h3>

                                    <motion.p
                                        className='mb-8 text-base text-white/80'
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}>
                                        {steps[currentStep].description}
                                    </motion.p>

                                    {/* Step-specific illustrations */}
                                    <IllustrationByStep step={steps[currentStep]} currentStep={currentStep} />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                {/* Fixed bottom navigation */}
                <motion.div
                    className='fixed right-0 bottom-0 left-0 bg-gradient-to-t from-black/20 to-transparent p-4'
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}>
                    <div className='mx-auto flex max-w-md items-center justify-between px-2'>
                        {currentStep > 0 ? (
                            <Button
                                variant='ghost'
                                className='text-white hover:bg-white/10'
                                onClick={prevStep}
                                disabled={isAnimating}>
                                Back
                            </Button>
                        ) : (
                            <div></div>
                        )}

                        <Button
                            className='bg-white px-8 text-[#22CC88] transition-all hover:scale-105 hover:bg-white/90'
                            onClick={nextStep}
                            disabled={isAnimating}>
                            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                            <ArrowRight className='ml-2 h-4 w-4' />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}

// Illustration selector component
interface IllustrationProps {
    step: Step
    currentStep: number
}

function IllustrationByStep({ step }: IllustrationProps) {
    switch (step.illustration) {
        case 'cards':
            return <CardsIllustration />
        case 'swipe':
            return <SwipeIllustration />
        case 'complete':
            return <CompleteIllustration />
        default:
            return null
    }
}

// First step illustration - Stacked cards
function CardsIllustration() {
    return (
        <motion.div
            className='relative mb-4 h-48 w-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            <motion.div
                className='absolute bottom-0 left-1/2 h-40 w-64 -translate-x-1/2 rotate-[-8deg] transform rounded-2xl bg-white/20 backdrop-blur-sm'
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            />
            <motion.div
                className='absolute bottom-4 left-1/2 h-40 w-64 -translate-x-1/2 rotate-[-4deg] transform rounded-2xl bg-white/40 backdrop-blur-sm'
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            />
            <motion.div
                className='absolute bottom-8 left-1/2 h-40 w-64 -translate-x-1/2 transform rounded-2xl bg-white/60 backdrop-blur-sm'
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
                <motion.div
                    className='absolute inset-0 flex items-center justify-center'
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}>
                    <div className='text-4xl text-[#22CC88]'>♥</div>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

// Second step illustration - Swipe mechanic
function SwipeIllustration() {
    return (
        <motion.div
            className='mb-4 flex items-center justify-between'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}>
            <motion.div
                className='flex flex-col items-center'
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                <motion.div
                    className='mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white/20'
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        x: [-5, 0, -5],
                        boxShadow: [
                            '0 0 0 rgba(255,255,255,0)',
                            '0 0 10px rgba(255,255,255,0.3)',
                            '0 0 0 rgba(255,255,255,0)',
                        ],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        boxShadow: { repeat: Infinity, duration: 2 },
                    }}>
                    <X className='h-8 w-8 text-white' />
                </motion.div>
                <p className='font-medium text-white'>Skip</p>
            </motion.div>

            <motion.div
                className='h-1 w-16 overflow-hidden rounded-full bg-white/30'
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7 }}>
                <motion.div
                    className='h-full w-full bg-white/50'
                    animate={{
                        x: ['-100%', '100%'],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: 'linear',
                    }}
                />
            </motion.div>

            <motion.div
                className='flex flex-col items-center'
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                <motion.div
                    className='mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white'
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        x: [5, 0, 5],
                        boxShadow: [
                            '0 0 0 rgba(34,204,136,0)',
                            '0 0 15px rgba(34,204,136,0.5)',
                            '0 0 0 rgba(34,204,136,0)',
                        ],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        delay: 0.5,
                        boxShadow: { repeat: Infinity, duration: 2, delay: 0.5 },
                    }}>
                    <Heart className='h-8 w-8 text-[#22CC88]' />
                </motion.div>
                <p className='font-medium text-white'>Donate</p>
            </motion.div>
        </motion.div>
    )
}

// Final step illustration - Completion
function CompleteIllustration() {
    return (
        <motion.div
            className='relative mb-4 flex h-48 w-full items-center justify-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <motion.div
                className='flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#22CC88]/40 bg-[#22CC88]/20'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                }}
                whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 30px rgba(34,204,136,0.4)',
                    transition: { duration: 0.2 },
                }}>
                <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        delay: 0.3,
                        type: 'spring',
                        stiffness: 200,
                    }}>
                    <Check className='h-12 w-12 text-[#22CC88]' />
                </motion.div>
            </motion.div>

            <motion.div
                className='absolute inset-0 -z-10'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}>
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className='absolute h-2 w-2 rounded-full bg-[#22CC88]/30'
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        initial={{ scale: 0 }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 0.8, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5 + Math.random() * 2,
                            delay: Math.random() * 1,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </motion.div>
        </motion.div>
    )
}
