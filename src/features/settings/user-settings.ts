import { UserSettings } from '@/types/user'

export function detectUserRegion(): string {
    try {
        const userLocale = navigator.language
        return userLocale.split('-')[1] || userLocale
    } catch (error) {
        console.error('Error detecting user region:', error)
        return 'US'
    }
}

export function getUserStats() {
    return {
        streak: 7,
        totalDonated: 8.15,
        projectsSupported: 12,
        categoriesSupported: 3,
        reputation: 113,
        level: 'Supporter',
        nextLevel: {
            name: 'Champion',
            pointsNeeded: 150,
            currentPoints: 113,
        },
    }
}

export function getUserSettings(): UserSettings {
    try {
        const savedSettings = localStorage.getItem('userSettings')
        if (savedSettings) {
            return JSON.parse(savedSettings)
        }
    } catch (error) {
        console.error('Error getting user settings:', error)
    }

    return {
        currency: 'CENTS',
        language: navigator.language.split('-')[0] || 'en',
        region: detectUserRegion(),
    }
}

export function saveUserSettings(settings: UserSettings): void {
    try {
        localStorage.setItem('userSettings', JSON.stringify(settings))
    } catch (error) {
        console.error('Error saving user settings:', error)
    }
}
