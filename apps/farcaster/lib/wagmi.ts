import { http, createConfig } from 'wagmi'
import { celo } from 'wagmi/chains'
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'
export const config = createConfig({
  chains: [celo],
  transports: { [celo.id]: http() },
  connectors: [farcasterMiniApp({ shimDisconnect: true })],
  ssr: true,
})
export { celo as defaultChain }
