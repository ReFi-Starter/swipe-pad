import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Automatically cleanup after each test
afterEach(() => {
    cleanup()
})

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn(),
    }),
    usePathname: () => '/',
}))

// Mock wagmi hooks
vi.mock('wagmi', () => ({
    useAccount: () => ({
        address: '0x0000000000000000000000000000000000000000',
        isConnected: false,
    }),
    useConnect: () => ({
        connect: vi.fn(),
        connectors: [],
    }),
    useDisconnect: () => ({
        disconnect: vi.fn(),
    }),
}))
