# Milestone 1: Project Setup

## 📅 Date: April 2025

- Added the `swipe-pad-contracts` repository as a git submodule in the `contracts/` directory.

### Frontend Integration
- Installed `wagmi`, `viem`, and `@wagmi/cli`.
- Compiled contracts within the submodule using `forge build`.
- Configured `wagmi.config.ts` for Celo/Alfajores and Foundry artifacts.
- Generated typed hooks using `bunx wagmi generate` into `src/lib/wagmi/contracts.ts`.

### Key Dependencies