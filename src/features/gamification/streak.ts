export function formatStreak(streak: number): string {
    return streak > 0 ? `${streak} day${streak > 1 ? 's' : ''}` : 'Start a streak!'
}

export function getStreakEmoji(streak: number): string {
    if (streak >= 30) return '🔥🔥🔥'
    if (streak >= 14) return '🔥🔥'
    if (streak >= 7) return '🔥'
    if (streak >= 3) return '✨'
    if (streak >= 1) return '👍'
    return '🤞'
}
