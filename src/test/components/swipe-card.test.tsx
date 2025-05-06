import { SwipeCard } from '@/components/swipe-card'
import type { Campaign } from '@/types/campaign'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('SwipeCard', () => {
    const mockCampaign: Campaign = {
        id: '1',
        title: 'Test Campaign',
        category: 'test',
        description: 'A test campaign description',
        imageUrl: '/test-image.jpg',
        donationAmount: 0,
        trustStatus: 'verified',
        creator: {
            name: 'Test Creator',
            verified: true,
        },
        fundingGoal: 1000,
        currentFunding: 500,
        websiteUrl: 'https://example.com',
        createdAt: new Date(),
    }

    it('renders campaign information correctly', () => {
        render(<SwipeCard campaign={mockCampaign} />)

        expect(screen.getByText('Test Campaign')).toBeInTheDocument()
        expect(screen.getByText('A test campaign description')).toBeInTheDocument()
        expect(screen.getByText('$500')).toBeInTheDocument()
        expect(screen.getByText('$1000')).toBeInTheDocument()
    })

    it('renders without crashing with minimal props', () => {
        render(<SwipeCard campaign={mockCampaign} />)
        expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Campaign')
    })
})
