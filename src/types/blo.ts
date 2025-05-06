declare module 'blo' {
  interface BloOptions {
    size?: number
    square?: boolean
    colors?: string[]
  }

  export function blo(address: `0x${string}`, options?: BloOptions): string
} 