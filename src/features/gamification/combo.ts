export function getComboMessage(combo: number): string {
    if (combo >= 10) return 'LEGENDARY!'
    if (combo >= 8) return 'INCREDIBLE!'
    if (combo >= 6) return 'FANTASTIC!'
    if (combo >= 5) return 'EXCELLENT!'
    if (combo >= 3) return 'GOOD COMBO!'
    return ''
}
