export function formatCurrency(amount: number, currency = 'USD'): string {
    if (isNaN(amount)) return '0'

    switch (currency) {
        case 'EUR':
            return `€${amount.toFixed(2)}`
        case 'GBP':
            return `£${amount.toFixed(2)}`
        case 'cUSD':
            return `cUSD ${amount.toFixed(2)}`
        case 'cEUR':
            return `cEUR ${amount.toFixed(2)}`
        case 'USDC':
            return `USDC ${amount.toFixed(2)}`
        case 'USDT':
            return `USDT ${amount.toFixed(2)}`
        case 'CENTS':
            return `¢${(amount * 100).toFixed(0)}`
        default:
            return `$${amount.toFixed(2)}`
    }
}
