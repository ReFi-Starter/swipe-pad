export interface CommunityTagDisplay {
    id: number
    text: string
    color: string
    count: number
}

export interface CommunityNoteDisplay {
    id: number
    author: string
    reputation: number
    text: string
    tags: string[]
    upvotes: number
}
