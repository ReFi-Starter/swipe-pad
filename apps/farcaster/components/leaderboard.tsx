"use client"

import { useState, useEffect } from "react"
import { Trophy, Flame, Medal, Star, Shield, MessageCircle, Heart, Share2, ArrowLeft } from "lucide-react"

interface LeaderboardProps {
    userStats: any
    userProfile: any
    onBack: () => void
}

interface LeaderboardUser {
    id: string
    name: string
    image: string
    swipes: number
    streak: number
    badges: number
    score: number
    isCurrentUser?: boolean
}

export function Leaderboard({ userStats, userProfile, onBack }: LeaderboardProps) {
    const [users, setUsers] = useState<LeaderboardUser[]>([])
    const [timeframe, setTimeframe] = useState<"weekly" | "all-time">("weekly")

    // Calculate profile completion
    const calculateProfileCompletion = () => {
        let filledFields = 0
        const totalFields = 8 // name, image, bio, farcaster, twitter, lens, zora, email/discord
        if (userProfile.name) filledFields++
        if (userProfile.image) filledFields++
        if (userProfile.bio) filledFields++
        if (userProfile.farcaster) filledFields++
        if (userProfile.twitter) filledFields++
        if (userProfile.lens) filledFields++
        if (userProfile.zora) filledFields++
        if (userProfile.discord) filledFields++
        return Math.round((filledFields / totalFields) * 100)
    }

    // Calculate user score
    const calculateScore = () => {
        const swipeScore = userProfile.totalSwipes * 10
        const streakScore = userStats.streak * 50
        const badgeScore = (userProfile.poaps + userProfile.projectsReported) * 100 // simplified
        const completionScore = calculateProfileCompletion() * 10
        const nftScore = (userProfile.nounsHeld + userProfile.lilNounsHeld) * 20

        return swipeScore + streakScore + badgeScore + completionScore + nftScore
    }

    useEffect(() => {
        // Mock data for other users
        const mockUsers: LeaderboardUser[] = [
            { id: "1", name: "vitalik.eth", image: "https://i.imgur.com/PNaumro.jpg", swipes: 1250, streak: 45, badges: 12, score: 15400 },
            { id: "2", name: "dwr.eth", image: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/3cef26d3-9f0a-4c12-160a-47082c268d00/original", swipes: 980, streak: 12, badges: 8, score: 11200 },
            { id: "3", name: "jesse.xyz", image: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/05f5a8aa-48ee-48af-d618-c420091f3200/original", swipes: 850, streak: 30, badges: 15, score: 10800 },
            { id: "4", name: "linda", image: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/ce812b3c-6930-41e7-b2a1-d70075494500/original", swipes: 720, streak: 5, badges: 4, score: 8500 },
            { id: "5", name: "brian", image: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/fa31601f-a263-40b3-2067-517a1b110400/rectcrop3", swipes: 650, streak: 8, badges: 6, score: 7900 },
        ]

        const currentUser: LeaderboardUser = {
            id: "current",
            name: userProfile.name || "You",
            image: userProfile.image,
            swipes: userProfile.totalSwipes,
            streak: userStats.streak,
            badges: userProfile.poaps || 0, // using poaps as proxy for badges count
            score: calculateScore(),
            isCurrentUser: true
        }

        // Combine and sort
        const allUsers = [...mockUsers, currentUser].sort((a, b) => b.score - a.score)
        setUsers(allUsers)
    }, [userStats, userProfile])

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-10">
                <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    Leaderboard
                </h2>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Timeframe Toggle */}
            <div className="p-4">
                <div className="bg-gray-800 p-1 rounded-xl flex">
                    <button
                        onClick={() => setTimeframe("weekly")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${timeframe === "weekly" ? "bg-gray-700 text-white shadow-lg" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setTimeframe("all-time")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${timeframe === "all-time" ? "bg-gray-700 text-white shadow-lg" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        All Time
                    </button>
                </div>
            </div>

            {/* Current User Stats Card */}
            <div className="px-4 mb-6">
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={userProfile.image} alt="Profile" className="w-12 h-12 rounded-full border-2 border-purple-400" />
                                <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-0.5">
                                    <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{userProfile.name || "You"}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-300">
                                    <span className="flex items-center gap-1">
                                        <Flame className="w-3 h-3 text-orange-400" /> {userStats.streak} day streak
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-purple-400">{calculateScore().toLocaleString()}</div>
                            <div className="text-xs text-gray-400">Total Score</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-800/50 rounded-lg p-2">
                            <div className="text-lg font-bold">{userProfile.totalSwipes}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Swipes</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-2">
                            <div className="text-lg font-bold">{calculateProfileCompletion()}%</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Profile</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-2">
                            <div className="text-lg font-bold">{userProfile.poaps}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Badges</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard List */}
            <div className="flex-1 overflow-y-auto px-4 pb-20">
                <div className="space-y-2">
                    {users.map((user, index) => (
                        <div
                            key={user.id}
                            className={`flex items-center p-3 rounded-xl border transition-all ${user.isCurrentUser
                                    ? "bg-purple-900/20 border-purple-500/50"
                                    : "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800"
                                }`}
                        >
                            <div className="w-8 font-bold text-gray-400 flex justify-center">
                                {index + 1 === 1 ? (
                                    <Medal className="w-6 h-6 text-yellow-400" />
                                ) : index + 1 === 2 ? (
                                    <Medal className="w-6 h-6 text-gray-300" />
                                ) : index + 1 === 3 ? (
                                    <Medal className="w-6 h-6 text-amber-600" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>

                            <div className="relative mx-3">
                                <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                {index < 3 && (
                                    <div className="absolute -top-1 -right-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className={`font-semibold truncate ${user.isCurrentUser ? "text-purple-400" : "text-white"}`}>
                                        {user.name}
                                    </h4>
                                    {user.badges > 10 && <Shield className="w-3 h-3 text-blue-400 fill-blue-400" />}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Flame className="w-3 h-3 text-orange-400" /> {user.streak}
                                    </span>
                                    <span>{user.swipes} swipes</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-bold text-white">{user.score.toLocaleString()}</div>
                                <div className="text-[10px] text-gray-500">pts</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
