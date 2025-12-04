"use client"


import { CheckCircle, X } from "lucide-react"
import { useState } from "react"

import { SelfVerificationButton } from "./SelfVerificationButton"

interface EditProfileProps {
  isOpen: boolean
  onClose: () => void
  onSave: (profileData: any) => void
  currentProfile: {
    name: string
    image: string
    farcaster?: string
    twitter?: string
    zora?: string
    discord?: string
    lens?: string
    ens?: string
    poaps: number
    lilNounsHeld: number
    nounsHeld: number
    paragraphs: number
    totalSwipes: number
    projectsReported: number
    totalDonated: number
    isVerified?: boolean
  }
}

import { useProfile } from "@farcaster/auth-kit"

export function EditProfile({ isOpen, onClose, onSave, currentProfile }: EditProfileProps) {
  const { profile } = useProfile()
  const [isVerified, setIsVerified] = useState(currentProfile.isVerified || false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1F2732] rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-[#1F2732] p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={profile?.pfpUrl || currentProfile.image || "/placeholder.svg"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-600"
              />
            </div>
            <h3 className="text-xl font-bold mt-3">{profile?.displayName || currentProfile.name || "Anonymous"}</h3>
            <p className="text-gray-400">@{profile?.username || currentProfile.farcaster || "user"}</p>
          </div>

          {/* Bio */}
          {profile?.bio && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-300 italic">"{profile.bio}"</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-4">NFT Holdings</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">P</span>
                  </div>
                  <span>POAPs</span>
                </div>
                <span className="text-[#FFD600] font-bold">{currentProfile.poaps || 10} POAPs</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-pink-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">L</span>
                  </div>
                  <span>Lil Nouns</span>
                </div>
                <span className="text-[#FFD600] font-bold">{currentProfile.lilNounsHeld || 8} Lil Nouns</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-black font-bold text-xs">N</span>
                  </div>
                  <span>Nouns</span>
                </div>
                <span className="text-[#FFD600] font-bold">{currentProfile.nounsHeld || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">¶</span>
                  </div>
                  <span>Paragraphs</span>
                </div>
                <span className="text-[#FFD600] font-bold">{currentProfile.paragraphs || 0}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                NFT holdings are automatically detected from your connected wallet
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Self ID Check</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className={`w-6 h-6 mr-3 ${isVerified ? "text-green-500" : "text-gray-500"}`} />
                  <div>
                    <p className="font-medium">Verify your identity</p>
                    <p className="text-sm text-gray-400">
                      {isVerified ? "You are verified over 18!" : "Gain 100 points to your profile"}
                    </p>
                  </div>
                </div>
                {isVerified ? (
                  <span className="px-4 py-2 bg-green-500/20 text-green-500 text-sm font-medium rounded-lg">
                    Verified
                  </span>
                ) : (
                  <SelfVerificationButton onVerified={() => setIsVerified(true)} />
                )}
              </div>
            </div>
          </div>

          {/* User Stats (Read-only) */}
          <div>
            <h3 className="text-lg font-medium mb-4">Your Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-xl font-bold text-[#FFD600]">{currentProfile.totalSwipes || 47}</p>
                <p className="text-xs text-gray-400">Total Swipes</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-xl font-bold text-[#FFD600]">{currentProfile.projectsReported || 3}</p>
                <p className="text-xs text-gray-400">Reports Made</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-xl font-bold text-[#FFD600]">${currentProfile.totalDonated || 125.75}</p>
                <p className="text-xs text-gray-400">Total Donated</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#FFD600] hover:bg-[#E6C200] text-black font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
