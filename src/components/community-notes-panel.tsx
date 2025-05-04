"use client"

import { useState } from "react"
import { X, ThumbsUp, Send, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTagColor } from "@/lib/utils"

interface CommunityNotesProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id: number
    title: string
    trustScore?: number
    communityTags?: Array<{
      id: number
      text: string
      color: string
      count: number
    }>
    communityNotes?: Array<{
      id: number
      author: string
      reputation: number
      text: string
      tags: string[]
      upvotes: number
    }>
  }
  onAddTag: (tag: string) => void
}

export function CommunityNotesPanel({ isOpen, onClose, project, onAddTag }: CommunityNotesProps) {
  const [newNote, setNewNote] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const availableTags = ["✅ Trusted", "👍 Recommended", "🔍 Needs Review", "⚠️ Fake", "🚫 Spam", "🔍 Unverified"]

  const handleAddTag = () => {
    if (selectedTag) {
      onAddTag(selectedTag)
      setSelectedTag(null)
    }
  }

  const getTrustIcon = () => {
    const score = project.trustScore || 0
    if (score >= 70) {
      return <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
    } else if (score >= 40) {
      return <HelpCircle className="h-5 w-5 text-orange-500 mr-2" />
    } else {
      return <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
    }
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black/50 z-50 ${isOpen ? "slide-up-panel open" : "slide-up-panel"}`}>
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Community Notes</h2>
          <button onClick={onClose} className="p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-4">
            {getTrustIcon()}
            <h3 className="font-medium">{project.title}</h3>
          </div>

          <div className="mb-4">
            <p className="text-sm text-slate-500 mb-2">Community Tags</p>
            <div className="flex flex-wrap gap-2">
              {project.communityTags?.map((tag) => (
                <div key={tag.id} className={`px-3 py-1 rounded-full text-sm ${getTagColor(tag.text)}`}>
                  {tag.text} ({tag.count})
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-slate-500 mb-2">Add a tag</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTag === tag ? "bg-[#22CC88] text-white" : "bg-slate-100 text-slate-700"
                  }`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <Button onClick={handleAddTag} disabled={!selectedTag} className="w-full">
              Add Tag
            </Button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-slate-500 mb-2">Notes from the community</p>
            {project.communityNotes
              ?.sort((a, b) => b.reputation - a.reputation)
              .map((note) => (
                <div key={note.id} className="bg-slate-50 p-3 rounded-lg mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="font-medium text-sm">{note.author}</div>
                      <div className="text-xs text-slate-500 ml-2">Rep: {note.reputation}</div>
                    </div>
                    <div className="flex items-center text-slate-500">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span className="text-xs">{note.upvotes}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{note.text}</p>
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, i) => (
                      <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          <div className="sticky bottom-0 bg-white pt-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-sm"
                placeholder="Add your note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button size="icon" className="rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
