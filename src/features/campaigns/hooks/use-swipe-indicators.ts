import { useState } from 'react'

interface UseSwipeIndicatorsReturn {
    showLeftIndicator: boolean
    showRightIndicator: boolean
    setShowLeftIndicator: (show: boolean) => void
    setShowRightIndicator: (show: boolean) => void
    updateSwipeIndicators: (moveX: number) => void
    resetSwipeIndicators: () => void
}

export default function useSwipeIndicators(): UseSwipeIndicatorsReturn {
    const [showLeftIndicator, setShowLeftIndicator] = useState(false)
    const [showRightIndicator, setShowRightIndicator] = useState(false)

    const updateSwipeIndicators = (moveX: number) => {
        if (moveX > 50) {
            setShowRightIndicator(true)
            setShowLeftIndicator(false)
        } else if (moveX < -50) {
            setShowLeftIndicator(true)
            setShowRightIndicator(false)
        } else {
            setShowLeftIndicator(false)
            setShowRightIndicator(false)
        }
    }

    const resetSwipeIndicators = () => {
        setShowLeftIndicator(false)
        setShowRightIndicator(false)
    }

    return {
        showLeftIndicator,
        showRightIndicator,
        setShowLeftIndicator,
        setShowRightIndicator,
        updateSwipeIndicators,
        resetSwipeIndicators,
    }
}
