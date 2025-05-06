import { useState } from 'react'
import { Campaign } from '../types'

export default function useCampaignStack(campaigns: Campaign[]) {
    const [stack, setStack] = useState<Campaign[]>(campaigns.slice(0, 3))
    const [index, setIndex] = useState(3)
    const [liked, setLiked] = useState(0)
    const [disliked, setDisliked] = useState(0)

    const next = () => {
        setStack(prev => {
            const [, ...rest] = prev
            const nextItem = campaigns[index]
            setIndex(i => i + 1)
            return nextItem ? [...rest, nextItem] : rest
        })
    }

    const like = () => {
        setLiked(c => c + 1)
        next()
    }

    const dislike = () => {
        setDisliked(d => d + 1)
        next()
    }

    return {
        stack,
        like,
        dislike,
        liked,
        disliked,
        hasMore: stack.length > 0,
    }
}
