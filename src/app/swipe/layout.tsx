import SwipeHeader from '@/components/views/swipe/swipe-header'

export default function SwipePageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SwipeHeader />
            {children}
        </>
    )
}
