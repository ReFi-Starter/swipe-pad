"use client"

import { sdk } from '@farcaster/miniapp-sdk'
import { SelfAppBuilder, type SelfApp } from '@selfxyz/qrcode'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

// Helper to generate Universal Link (https://self.xyz/r/...)
// We implement this manually to ensure it's always correct and doesn't rely on potentially missing exports.
const getUniversalLink = (app: any) => {
    if (!app) return "";
    // The request object is inside the app instance.
    // We need to base64 encode the JSON string of the request.
    const request = (app as any).request;
    if (request) {
        const jsonString = JSON.stringify(request);
        const base64 = typeof window !== 'undefined' ? btoa(jsonString) : Buffer.from(jsonString).toString('base64');
        // URL safe base64
        const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return `https://self.xyz/r/${urlSafeBase64}`;
    }
    return "";
}

interface VerificationData {
  verified: boolean
  date_of_birth?: string
  userIdentifier?: string
  name?: string
  nationality?: string
  timestamp?: number
}

interface SelfContextType {
  // State
  isVerified: boolean
  verificationData: VerificationData | null
  isVerifying: boolean
  error: string | null
  selfApp: SelfApp | null
  universalLink: string | null

  // Actions
  initiateSelfVerification: () => Promise<void>
  checkVerificationStatus: () => Promise<void>
  clearVerification: () => void

  // Widget visibility
  showWidget: boolean
  setShowWidget: (show: boolean) => void
}

const SelfContext = createContext<SelfContextType | null>(null)

export function useSelf() {
  const context = useContext(SelfContext)
  if (!context) {
    throw new Error('useSelf must be used within SelfProvider')
  }
  return context
}

interface SelfProviderProps {
  children: React.ReactNode
  // Configuration
  scope?: string
  appName?: string
  logoUrl?: string
  useMock?: boolean
  minimumAge?: number
  excludedCountries?: any[]
  ofac?: boolean
  // Verification mode
  verificationMode?: 'backend' | 'contract'
  contractAddress?: string
  contractChain?: 'celo' | 'staging_celo' | 'base' | 'staging_base'
  // Disclosures
  disclosures?: {
    name?: boolean
    date_of_birth?: boolean
    nationality?: boolean
    gender?: boolean
    passport_number?: boolean
    expiry_date?: boolean
    issuing_state?: boolean
  }
}

export function SelfProvider({
  children,
  scope = process.env.NEXT_PUBLIC_SELF_SCOPE || 'swipe-pad',
  appName = process.env.NEXT_PUBLIC_SELF_APP_NAME || 'SwipePad',
  logoUrl = process.env.NEXT_PUBLIC_SELF_LOGO_URL || '',
  useMock = process.env.NEXT_PUBLIC_SELF_USE_MOCK === 'true',
  minimumAge = 18,
  excludedCountries = [],
  ofac = false,
  verificationMode = 'contract', // Default to contract mode to use direct endpoint logic if needed
  contractAddress = "https://api.self.xyz", // Using this as endpoint for now based on previous working setup
  contractChain = (process.env.NEXT_PUBLIC_SELF_ENDPOINT_TYPE as any) || 'celo',
  disclosures = {
    date_of_birth: false,
    name: false,
    nationality: false,
  }
}: SelfProviderProps) {
  const { address, isConnected } = useAccount()

  const [isVerified, setIsVerified] = useState(false)
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null)
  const [universalLink, setUniversalLink] = useState<string | null>(null)
  const [showWidget, setShowWidget] = useState(false)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

  // Define checkVerificationStatus before it's used in useEffect
  const checkVerificationStatus = useCallback(async () => {
    if (!address) return

    try {
      // Mock check or real backend check
      // Since we don't have the backend route '/api/verify-self/check' yet, we'll just log.
      // Or we can try to fetch if it exists.
      // For now, let's assume the user might add it later or we rely on client-side success callback from the button.
      /*
      const response = await fetch('/api/verify-self/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: address })
      })

      const data = await response.json()

      if (data.verified) {
        setIsVerified(true)
        setVerificationData(data)
        setError(null)

        // Stop polling if active
        if (pollingInterval) {
          clearInterval(pollingInterval)
          setPollingInterval(null)
        }
      }
      */
     console.log("Checking verification status (mock)...");
    } catch (err) {
      console.error('Failed to check verification status:', err)
    }
  }, [address, pollingInterval])

  // Initialize Self app when address changes
  useEffect(() => {
    if (!address) {
      console.log('⚠️ SelfProvider: No address connected, skipping SelfApp initialization')
      setSelfApp(null)
      setUniversalLink(null)
      return
    }

    try {
      // Determine endpoint and type based on verification mode
      // We force the production endpoint logic here to match previous working setup
      const endpoint = "https://api.self.xyz";
      const endpointType = "celo";

      console.log('🔧 Self Protocol Configuration:', {
        verificationMode,
        endpoint,
        endpointType,
        scope,
        userId: address,
      })

      const app = new SelfAppBuilder({
        version: 2,
        appName,
        scope,
        endpoint,
        deeplinkCallback: process.env.NEXT_PUBLIC_SELF_DEEPLINK_CALLBACK ||
          (typeof window !== 'undefined' ? `${window.location.origin}/?status=verified` : ''),
        logoBase64: logoUrl,
        userId: address,
        endpointType,
        userIdType: 'hex',
        disclosures: {
          minimumAge,
          excludedCountries,
          ofac,
          ...disclosures,
        }
      }).build()

      setSelfApp(app)
      const link = getUniversalLink(app)
      console.log('🔗 Generated Universal Link:', link)
      setUniversalLink(link)
    } catch (err) {
      console.error('Failed to initialize Self app:', err)
      setError('Failed to initialize Self Protocol')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isConnected, appName, scope, logoUrl, minimumAge, ofac])

  // Check verification status on mount
  useEffect(() => {
    if (address && isConnected) {
      checkVerificationStatus()
    }
  }, [address, isConnected, checkVerificationStatus])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [pollingInterval])

  const initiateSelfVerification = useCallback(async () => {
    if (!universalLink || !address) {
      setError('Self Protocol not initialized')
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      console.log('🔗 Generated Self deeplink:', universalLink)
      // console.log('📍 Verification endpoint:', `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify-self`)
      console.log('👤 User address:', address)

      // Check if we're in Farcaster environment
      // We use @farcaster/frame-sdk context to check if we are in a frame/miniapp
      // The sdk.context is a promise
      const context = await sdk.context;
      const isInMiniAppResult = !!context?.user; // Rough check if user context exists

      // Clear any existing polling interval
      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }

      if (isInMiniAppResult) {
        // In Farcaster app - open with SDK
        try {
          await sdk.actions.openUrl(universalLink)
          console.log('✅ Opened Self app with Farcaster SDK')
        } catch (sdkError) {
          console.error('Error opening Self app with SDK:', sdkError)
          // Fallback to window.open
          window.open(universalLink, '_blank')
          console.log('⚠️ Fell back to window.open')
        }
      } else {
        // In browser - open in new tab
        window.open(universalLink, '_blank')
        console.log('🌐 Opened Self app in new browser tab')
      }

      let pollAttempts = 0
      const maxPollAttempts = 60 // 60 attempts * 5 seconds = 5 minutes max

      // Start polling for verification results
      const interval = setInterval(async () => {
        pollAttempts++

        // Stop after max attempts
        if (pollAttempts > maxPollAttempts) {
          clearInterval(interval)
          setPollingInterval(null)
          setIsVerifying(false)
          if (!isVerified) {
            setError('Verification timeout. Please try again or refresh the page.')
          }
          console.log(`⏱️ Polling stopped after ${pollAttempts} attempts (${(pollAttempts * 5) / 60} minutes)`)
          return
        }

        await checkVerificationStatus()
      }, 5000) // Poll every 5 seconds

      setPollingInterval(interval)

    } catch (err) {
      console.error('Failed to initiate Self verification:', err)
      setError('Failed to open Self app')
      setIsVerifying(false)
    }
  }, [universalLink, address, checkVerificationStatus, isVerified, pollingInterval])

  const clearVerification = useCallback(() => {
    setIsVerified(false)
    setVerificationData(null)
    setError(null)
    setIsVerifying(false)
    if (pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
  }, [pollingInterval])

  const value: SelfContextType = {
    isVerified,
    verificationData,
    isVerifying,
    error,
    selfApp,
    universalLink,
    initiateSelfVerification,
    checkVerificationStatus,
    clearVerification,
    showWidget,
    setShowWidget,
  }

  return (
    <SelfContext.Provider value={value}>
      {children}
    </SelfContext.Provider>
  )
}
