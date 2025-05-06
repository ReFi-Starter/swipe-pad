# SwipePad — Micro-Donations Made Easy

## Product Overview
SwipePad is a mobile-first dApp for MiniPay on Celo enabling users to swipe through verified impact projects and donate with stablecoins in seconds. It addresses the challenges of centralized donation platforms by providing a transparent, accessible alternative for global micro-philanthropy.

## Business Model
- **Target Market**: MiniPay users (7M+), socially conscious donors, global impact creators
- **Revenue Strategy**: 2% platform fee on successful donations
- **Value Proposition**: Frictionless mobile experience connecting donors directly to projects

## Technical Architecture
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, Framer Motion
- **Web3 Stack**: Wagmi 2, Viem, MiniPay wallet integration
- **Backend**: Neon PostgreSQL (serverless), tRPC for type-safe APIs
- **Blockchain**: Celo network, Solidity smart contracts (DonationPool)
- **Package Manager**: Bun instead of npm

## Key Features
- **Swipe Interface**: Tinder-like UX for discovering projects
- **Multi-currency**: Support for cUSD, cEUR, cKES, and other Celo stablecoins
- **Flexible Funding**: All-or-Nothing or Keep-What-You-Raise models
- **On-Chain Transparency**: Fully verifiable donations
- **Social Elements**: User profiles, activity tracking, community tags

## Donation Flow
1. **Creator** publishes project with details, funding goal, and deadline
2. **Donors** swipe through projects and make instant donations
3. **Funds** are stored in smart contract until goal/deadline
4. **Creator** withdraws funds after successful campaign
5. **Refunds** automatically processed if goal not met (All-or-Nothing model only)

## Smart Contract Architecture
The DonationPool contract manages the entire lifecycle with two funding models:
- **All-or-Nothing**: Creators receive funds only if goal is met
- **Keep-What-You-Raise**: Creators receive all donations regardless of goal

## Team
- **refistarter.eth**: Project Lead
- **ottox.eth**: Frontend Developer
- **ozkite.eth**: Smart Contract Developer

## Project Status
Current milestone: Initial Setup & Contract Integration (April-May 2025)
Built for the Global Stablecoin Hackathon on Celo 