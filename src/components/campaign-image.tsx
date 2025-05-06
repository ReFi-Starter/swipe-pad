'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface CampaignImageProps extends Omit<ImageProps, 'src' | 'alt'> {
    src: string
    alt: string
    fallbackClassName?: string
}

export function CampaignImage({ src, alt, fallbackClassName, className, onError, ...props }: CampaignImageProps) {
    const [error, setError] = useState(false)

    // Generate a random gradient for fallback
    const getRandomGradient = () => {
        const colors = [
            ['#FF6B6B', '#4ECDC4'],
            ['#A8E6CF', '#FFD3B6'],
            ['#DCEDC1', '#FFD3B6'],
            ['#FF9A9E', '#FAD0C4'],
            ['#96E6A1', '#D4FC79'],
        ]
        const [color1, color2] = colors[Math.floor(Math.random() * colors.length)]
        return `linear-gradient(45deg, ${color1}, ${color2})`
    }

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setError(true)
        if (onError) {
            onError(e)
        }
    }

    if (error) {
        return (
            <div
                className={`relative h-full w-full ${fallbackClassName || ''}`}
                style={{ backgroundImage: getRandomGradient() }}
                aria-hidden='true'
            />
        )
    }

    return <Image src={src} alt={alt} className={`${className || ''} object-cover`} onError={handleError} {...props} />
}
