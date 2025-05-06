import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface RefreshButtonProps {
    onClick: () => void
    className?: string
}

export function RefreshButton({ onClick, className = '' }: RefreshButtonProps) {
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    return (
        <div className={`flex h-full flex-col items-center justify-center ${className}`}>
            <div className='flex flex-col items-center gap-4'>
                <motion.button
                    className='group relative flex h-24 w-24 items-center justify-center'
                    onClick={onClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    {/* Base circle */}
                    <div className='bg-primary/10 hover:bg-primary/20 absolute inset-0 rounded-full transition-colors duration-200' />

                    {/* Countdown circle */}
                    {countdown > 0 && (
                        <svg className='absolute h-full w-full -rotate-90'>
                            <circle
                                cx='48'
                                cy='48'
                                r='46'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                className='text-muted/20'
                            />
                            <motion.circle
                                cx='48'
                                cy='48'
                                r='46'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                className='text-primary/40'
                                strokeDasharray={290}
                                strokeDashoffset={290 * (1 - countdown / 5)}
                            />
                        </svg>
                    )}

                    {/* Pulse effect */}
                    <motion.div
                        className='bg-primary/5 absolute inset-0 rounded-full'
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 0, 0.7],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Icon container */}
                    <div className='relative flex h-10 w-10 items-center justify-center'>
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                            className='text-primary h-full w-full'>
                            <svg
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                className='h-full w-full'>
                                <path
                                    d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </motion.div>
                    </div>

                    {/* Countdown number */}
                    {countdown > 0 && (
                        <motion.div
                            className='absolute inset-0 flex items-center justify-center'
                            initial={{ opacity: 0, scale: 1.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={countdown}>
                            <span className='text-primary/40 pointer-events-none text-4xl font-bold'>{countdown}</span>
                        </motion.div>
                    )}

                    {/* Shine effect */}
                    <motion.div
                        className='absolute inset-0 overflow-hidden rounded-full'
                        style={{
                            background:
                                'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                            transform: 'rotate(35deg)',
                        }}
                        animate={{
                            opacity: [0, 0.5, 0],
                            x: [-50, 100],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 1,
                        }}
                    />
                </motion.button>

                <motion.span
                    className='text-muted-foreground text-sm font-medium'
                    animate={{ opacity: countdown > 0 ? 1 : 0.7 }}>
                    {countdown > 0 ? 'CONTINUE?' : 'PLAY AGAIN'}
                </motion.span>
            </div>
        </div>
    )
}
