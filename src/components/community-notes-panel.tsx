import { Button } from '@/components/ui/button'
import { getTagColor } from '@/features/campaigns/trust'
import { AlertTriangle, CheckCircle, HelpCircle, Send, ThumbsUp, X } from 'lucide-react'
import { useState } from 'react'

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
    const [newNote, setNewNote] = useState('')
    const [selectedTag, setSelectedTag] = useState<string | null>(null)

    const availableTags = ['✅ Trusted', '👍 Recommended', '🔍 Needs Review', '⚠️ Fake', '🚫 Spam', '🔍 Unverified']

    const handleAddTag = () => {
        if (selectedTag) {
            onAddTag(selectedTag)
            setSelectedTag(null)
        }
    }

    const getTrustIcon = () => {
        const score = project.trustScore || 0
        if (score >= 70) {
            return <CheckCircle className='mr-2 h-5 w-5 text-green-500' />
        } else if (score >= 40) {
            return <HelpCircle className='mr-2 h-5 w-5 text-orange-500' />
        } else {
            return <AlertTriangle className='mr-2 h-5 w-5 text-red-500' />
        }
    }

    if (!isOpen) return null

    return (
        <div className={`fixed inset-0 z-50 bg-black/50 ${isOpen ? 'slide-up-panel open' : 'slide-up-panel'}`}>
            <div className='absolute right-0 bottom-0 left-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white'>
                <div className='sticky top-0 flex items-center justify-between border-b bg-white p-4'>
                    <h2 className='text-lg font-semibold'>Community Notes</h2>
                    <button onClick={onClose} className='p-1'>
                        <X className='h-5 w-5' />
                    </button>
                </div>

                <div className='p-4'>
                    <div className='mb-4 flex items-center'>
                        {getTrustIcon()}
                        <h3 className='font-medium'>{project.title}</h3>
                    </div>

                    <div className='mb-4'>
                        <p className='mb-2 text-sm text-slate-500'>Community Tags</p>
                        <div className='flex flex-wrap gap-2'>
                            {project.communityTags?.map(tag => (
                                <div key={tag.id} className={`rounded-full px-3 py-1 text-sm ${getTagColor(tag.text)}`}>
                                    {tag.text} ({tag.count})
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mb-4'>
                        <p className='mb-2 text-sm text-slate-500'>Add a tag</p>
                        <div className='mb-2 flex flex-wrap gap-2'>
                            {availableTags.map(tag => (
                                <button
                                    key={tag}
                                    className={`rounded-full px-3 py-1 text-sm ${
                                        selectedTag === tag ? 'bg-[#22CC88] text-white' : 'bg-slate-100 text-slate-700'
                                    }`}
                                    onClick={() => setSelectedTag(tag)}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                        <Button onClick={handleAddTag} disabled={!selectedTag} className='w-full'>
                            Add Tag
                        </Button>
                    </div>

                    <div className='mb-4'>
                        <p className='mb-2 text-sm text-slate-500'>Notes from the community</p>
                        {project.communityNotes
                            ?.sort((a, b) => b.reputation - a.reputation)
                            .map(note => (
                                <div key={note.id} className='mb-3 rounded-lg bg-slate-50 p-3'>
                                    <div className='mb-2 flex items-center justify-between'>
                                        <div className='flex items-center'>
                                            <div className='text-sm font-medium'>{note.author}</div>
                                            <div className='ml-2 text-xs text-slate-500'>Rep: {note.reputation}</div>
                                        </div>
                                        <div className='flex items-center text-slate-500'>
                                            <ThumbsUp className='mr-1 h-3 w-3' />
                                            <span className='text-xs'>{note.upvotes}</span>
                                        </div>
                                    </div>
                                    <p className='mb-2 text-sm'>{note.text}</p>
                                    <div className='flex flex-wrap gap-1'>
                                        {note.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className={`rounded-full px-2 py-0.5 text-xs ${getTagColor(tag)}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className='sticky bottom-0 bg-white pt-2'>
                        <div className='flex items-center gap-2'>
                            <input
                                type='text'
                                className='flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm'
                                placeholder='Add your note...'
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                            />
                            <Button size='icon' className='rounded-full'>
                                <Send className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
