"use client"

import { useState, useEffect } from 'react'
import { mockProjects } from '@/lib/mock-data'
import { getUserStats } from '@/lib/utils'
import type { Project } from '@/components/swipe-card'

interface UserStats {
  reputation: number
  voteCount: number
  streak: number
  totalDonated: number
  projectsSupported: number
  categoriesSupported: number
  level: string
  nextLevel: {
    name: string
    pointsNeeded: number
    currentPoints: number
  }
}

export function useProjects() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [userStats, setUserStats] = useState<UserStats>({ 
    reputation: 0, 
    voteCount: 0,
    streak: 0,
    totalDonated: 0,
    projectsSupported: 0,
    categoriesSupported: 0,
    level: 'Beginner',
    nextLevel: {
      name: 'Intermediate',
      pointsNeeded: 100,
      currentPoints: 0
    }
  })

  useEffect(() => {
    const stats = getUserStats()
    setUserStats(prev => ({
      ...prev,
      ...stats
    }))
  }, [])

  const filteredProjects = selectedCategory === "All"
    ? mockProjects
    : mockProjects.filter(project => project.category === selectedCategory)

  const handleDonate = () => {
    console.log('Donate to project')
  }

  const handleSuperLike = () => {
    console.log('Super like project')
  }

  const handleBoost = () => {
    console.log('Boost project')
  }

  const handleShowDetails = () => {
    console.log('Show details for project')
  }

  const handleAddNote = async (projectId: string, content: string) => {
    console.log('Add note to project:', projectId, content)
  }

  const handleVoteNote = async (projectId: string, noteId: string, vote: 'up' | 'down') => {
    console.log('Vote on note:', noteId, vote)
  }

  const handleFlagNote = async (projectId: string, noteId: string) => {
    console.log('Flag note:', noteId)
  }

  return {
    selectedCategory,
    setSelectedCategory,
    userStats,
    filteredProjects,
    handlers: {
      handleDonate,
      handleSuperLike,
      handleBoost,
      handleShowDetails,
      handleAddNote,
      handleVoteNote,
      handleFlagNote
    }
  }
} 