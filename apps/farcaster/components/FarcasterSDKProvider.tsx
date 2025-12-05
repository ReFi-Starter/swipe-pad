"use client"

import sdk from "@farcaster/frame-sdk"
import { useEffect } from "react"

export function FarcasterSDKProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const load = async () => {
      // Add context to the SDK
      const context = await sdk.context
      console.log("Farcaster SDK Context:", context)
      
      // Call ready when the app is loaded
      sdk.actions.ready()
    }
    
    load()
  }, [])

  return <>{children}</>
}
