/**
 * Generates a random Ethereum address
 * @returns A random Ethereum address string
 */
export function generateRandomEthereumAddress(): string {
    const chars = '0123456789abcdef'
    let address = '0x'
    for (let i = 0; i < 40; i++) {
        address += chars[Math.floor(Math.random() * chars.length)]
    }
    return address
}
