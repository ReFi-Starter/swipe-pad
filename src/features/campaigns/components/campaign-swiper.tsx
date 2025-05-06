import useCampaignSwiper from '../hooks/use-campaign-swiper'
import ActionButtons from './action-buttons'
import EmptyState from './empty-state'
import SwipeCard from './swipe-card'
import SwipeIndicator from './swipe-indicator'

export default function CampaignSwiper() {
    const {
        cards,
        showLeftIndicator,
        showRightIndicator,
        showEmptyState,
        currentIndex,
        cardRef,
        isAnimating,
        handleDislikeClick,
        handleLikeClick,
    } = useCampaignSwiper()

    return (
        <>
            <div className='relative flex h-full w-full items-center justify-center'>
                {showEmptyState ? (
                    <EmptyState />
                ) : (
                    <>
                        <SwipeIndicator show={showLeftIndicator} position='left' color='#ff4757' />
                        <SwipeIndicator show={showRightIndicator} position='right' color='#1dd1a1' />

                        {cards.map((card, index) => (
                            <SwipeCard
                                key={`${card.name}-${currentIndex + index}`}
                                card={card}
                                index={index}
                                currentIndex={currentIndex}
                                cardRef={
                                    index === 0
                                        ? node => {
                                              if (cardRef) {
                                                  cardRef.current = node
                                              }
                                          }
                                        : null
                                }
                            />
                        ))}
                    </>
                )}
            </div>
            <div className='relative z-10 -mt-14 mb-2'>
                <ActionButtons
                    onDislike={handleDislikeClick}
                    onLike={handleLikeClick}
                    isDisabled={isAnimating.current || cards.length === 0}
                />
            </div>
        </>
    )
}
