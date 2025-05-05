import { useMemo } from 'react'
import { blo } from 'blo'

interface AddressAvatarProps {
  address: `0x${string}`
  size?: number
  className?: string
}

export function AddressAvatar({ address, size = 40, className = '' }: AddressAvatarProps) {
  const avatarSvg = useMemo(() => {
    return blo(address, {
      size,
      square: true,
      colors: ['#22CC88', '#4B7BFF', '#FF4B4B']
    })
  }, [address, size])

  return (
    <div 
      className={`rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: avatarSvg }}
    />
  )
} 