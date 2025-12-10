'use client'

import { useEffect, useState, type ReactNode } from 'react'
import sdk from '@farcaster/frame-sdk'

interface FarcasterInitializerProps {
  children: ReactNode
}

export function FarcasterInitializer({ children }: FarcasterInitializerProps) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initFarcaster = async () => {
      try {
        console.log('🚀 Initializing Farcaster SDK...')
        const context = await sdk.context
        console.log('✅ Farcaster context loaded:', context)
        sdk.actions.ready()
        console.log('✅ Farcaster ready signal sent')
        if (mounted) setIsReady(true)
      } catch (err) {
        console.error('❌ Farcaster initialization error:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setIsReady(true)
        }
      }
    }

    initFarcaster()
    return () => { mounted = false }
  }, [])

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading SwipePad...</p>
        </div>
      </div>
    )
  }

  if (error) console.warn('⚠️ Running outside Farcaster client:', error)
  return <>{children}</>
}
