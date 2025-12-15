// https://github.com/ReFi-Starter/swipe-pad/blob/main/apps/MiniPay/lib/constants.ts

import { Address } from 'viem';

// Celo Mainnet Chain ID is 42220 (0xa4ec in hex)
export const CELO_MAINNET_ID = 42220; 

// --- Stablecoin Addresses (Celo Mainnet) ---
export const CUSD_ADDRESS: Address = '0x765DE816845861e75A25fCA122bb6898B8B1282a'; // Celo Dollar
export const USDT_ADDRESS: Address = '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e'; // Tether USD

// --- Fee Abstraction Address (USDT Adapter) ---
// Since USDT uses 6 decimals (not 18 like cUSD), Celo requires an Adapter contract address
// to be used in the 'feeCurrency' field for gas fee abstraction.
export const USDT_ADAPTER_ADDRESS: Address = '0x0e2a3e05bc9a16f5292a6170456a710cb89c6f72'; 

// --- MiniPay Detection Variable ---
export const IS_MINIPAY_ENVIRONMENT = typeof window !== 'undefined' && (window.ethereum as any)?.isMiniPay;

// --- Stablecoin List for UI (Restricted) ---
export const SUPPORTED_STABLECOINS = [
  { symbol: 'cUSD', address: CUSD_ADDRESS, decimals: 18, isAdapter: false },
  { symbol: 'USDT', address: USDT_ADDRESS, decimals: 6, isAdapter: true, feeAdapter: USDT_ADAPTER_ADDRESS },
];
