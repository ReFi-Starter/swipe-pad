import { expect, test } from '@playwright/test'

test('homepage has title and links', async ({ page }) => {
    await page.goto('/')

    // Verify title
    await expect(page).toHaveTitle(/SwipePad/)

    // Basic navigation test
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
})

test('home page shows swipe interface', async ({ page }) => {
    await page.goto('/')

    // Check for main elements
    await expect(page.getByRole('heading', { name: 'SwipePad' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Connect Wallet' })).toBeVisible()

    // Check for project card
    await expect(page.getByTestId('swipe-card')).toBeVisible()

    // Check for navigation elements
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible()
})

test('wallet connection flow', async ({ page }) => {
    await page.goto('/')

    // Click connect wallet
    await page.getByRole('button', { name: 'Connect Wallet' }).click()

    // Check for wallet modal
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Connect a Wallet')).toBeVisible()
})
