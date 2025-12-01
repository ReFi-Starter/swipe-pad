import { expect, test } from '@playwright/test'

test('homepage has title and links', async ({ page }) => {
    await page.goto('/')

    // Verify title
    await expect(page).toHaveTitle(/SwipePad/)

    // Basic navigation test
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
\
     \
     \
     \
     \
