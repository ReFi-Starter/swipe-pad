export const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

export const isOnboardingCompleted = (): boolean => {
  try {
    return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
  } catch (error) {
    // In case localStorage is not available
    console.warn('Could not access localStorage:', error);
    return false;
  }
};

export const markOnboardingAsCompleted = (): void => {
  try {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
  } catch (error) {
    console.warn('Could not save to localStorage:', error);
  }
};

export const resetOnboarding = (): void => {
  try {
    localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
  } catch (error) {
    console.warn('Could not remove from localStorage:', error);
  }
}; 