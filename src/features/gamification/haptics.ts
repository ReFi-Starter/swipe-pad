export function simulateHapticFeedback() {
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50)
    }
    console.log('Haptic feedback triggered')
}
