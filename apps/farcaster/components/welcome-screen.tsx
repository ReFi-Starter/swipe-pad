"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface WelcomeScreenProps {
  onEnter: () => void
}

export function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 animate-fade-in">
      <div className="relative w-32 h-32 mb-4">
        <Image
          src="/images/swipepad-logo.png"
          alt="SwipePad Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          SwipePad
        </h1>
        <p className="text-gray-400 text-lg max-w-xs mx-auto">
          Support vetted projects with micro-donations on Celo.
        </p>
      </div>

      <button
        onClick={onEnter}
        className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-black transition-all duration-200 bg-[#FFD600] rounded-full hover:bg-[#E6C200] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD600] focus:ring-offset-gray-900"
      >
        <span>Enter MiniApp</span>
        <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
      </button>

      <div className="absolute bottom-8 text-xs text-gray-600">
        Powered by Celo & Farcaster
      </div>
    </div>
  )
}
