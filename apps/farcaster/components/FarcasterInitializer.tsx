'use client'
import { useEffect, useState, type ReactNode } from 'react'
import sdk from '@farcaster/frame-sdk'
export function FarcasterInitializer({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    let mounted = true
    const init = async () => {
      try {
        await sdk.context
        sdk.actions.ready()
        if (mounted) setIsReady(true)
      } catch (err) {
        console.error(err)
        if (mounted) setIsReady(true)
      }
    }
    init()
    return () => { mounted = false }
  }, [])
  if (!isReady) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
  return <>{children}</>
}
