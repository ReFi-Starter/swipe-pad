"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, ThumbsDown, Flag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface Note {
  id: string
  content: string
  author: {
    name: string
    reputation: number
  }
  votes: {
    up: number
    down: number
  }
  createdAt: Date
  status: 'helpful' | 'disputed' | 'flagged'
}

interface CommunityNotesDrawerProps {
  isOpen: boolean
  onClose: () => void
  notes: Note[]
  onAddNote?: (content: string) => Promise<void>
  onVote?: (noteId: string, vote: 'up' | 'down') => Promise<void>
  onFlag?: (noteId: string) => Promise<void>
}

export function CommunityNotesDrawer({
  isOpen,
  onClose,
  notes,
  onAddNote,
  onVote,
  onFlag
}: CommunityNotesDrawerProps) {
  const [newNote, setNewNote] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim() || !onAddNote) return

    setIsSubmitting(true)
    try {
      await onAddNote(newNote.trim())
      setNewNote('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[60vh] bg-background rounded-t-2xl shadow-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Community Notes</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>

            {/* Notes List */}
            <div className="overflow-y-auto h-[calc(100%-8rem)] p-4 space-y-4">
              {notes.map((note) => (
                <Card key={note.id} className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{note.author.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          Rep {note.author.reputation}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {note.content}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        note.status === 'helpful' ? 'default' :
                        note.status === 'disputed' ? 'secondary' : 'destructive'
                      }
                      className="shrink-0"
                    >
                      {note.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => onVote?.(note.id, 'up')}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span className="text-xs">{note.votes.up}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => onVote?.(note.id, 'down')}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      <span className="text-xs">{note.votes.down}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 ml-auto"
                      onClick={() => onFlag?.(note.id)}
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Add Note Form */}
            <form
              onSubmit={handleSubmit}
              className="sticky bottom-0 bg-background border-t p-4 flex gap-2"
            >
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={isSubmitting || !newNote.trim()}>
                Post
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 