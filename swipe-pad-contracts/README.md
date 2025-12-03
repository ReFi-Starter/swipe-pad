# SwipePad Smart Contracts

<div align="center">
  <h3>Making Micro-Donations Secure & Transparent on Celo</h3>
  
  [![Built with Foundry](https://img.shields.io/badge/Built%20with-Foundry-FFDB1C.svg)](https://book.getfoundry.sh/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.19-363636.svg)](https://soliditylang.org/)
</div>

> 🚨 **SMART CONTRACT SECURITY DISCLAIMER**
>
> These smart contracts are part of a **hackathon project** and are **NOT PRODUCTION READY**. Important considerations:
>
> - **NO AUDIT**: These contracts have not undergone a professional security audit
> - **EXPERIMENTAL**: The code is experimental and may contain bugs or vulnerabilities
> - **HIGH RISK**: Do not use these contracts with substantial amounts of funds
> - **IN DEVELOPMENT**: The contract architecture may change significantly
> - **TEST ONLY**: Only use on testnet for demonstration purposes
>
> While we follow smart contract security best practices and our code is based on the battle-tested [Pool-Escrow](https://github.com/Pool-Escrow/Pool-Contracts) architecture,
> this implementation is still experimental and meant for hackathon demonstration purposes only.

## �� Table of Contents

- [Overview](#overview)
- [Project Origins](#project-origins)
- [Smart Contract Architecture](#smart-contract-architecture)
- [Development Setup](#development-setup)
- [Testing & Deployment](#testing--deployment)
- [Security Features](#security-features)
- [Documentation](#documentation)

## Overview

The SwipePad smart contracts power our decentralized donation platform on Celo, enabling secure and transparent micro-donations through MiniPay. Our core contract, `DonationPool`, manages the entire lifecycle of donation campaigns with two flexible funding models.

## Project Origins

SwipePad's smart contract architecture is built upon the foundation of [Pool-Escrow](https://github.com/Pool-Escrow/Pool-Contracts), another successful project from our team that powers [PoolParty.cc](https://poolparty.cc). We've forked and adapted the core Pool contract architecture to create a specialized version for handling charitable donations with the following enhancements:

### Key Differences from Pool-Escrow

- Specialized for charitable donations and impact campaigns
- Integration with MiniPay for mobile-first UX
- Additional funding models (All-or-Nothing & Keep-What-You-Raise)
- Enhanced dispute resolution for charitable contexts
- Multi-currency support focused on Celo stablecoins
- Optimized fee structure for micro-donations

### Key Features

- Campaign creation and management
- Multi-currency donation support (cUSD, cEUR, cKES)
- Flexible funding models (All-or-Nothing & Keep-What-You-Raise)
- Role-based access control
- Emergency pause functionality
- Dispute resolution system
- Comprehensive event logging

## Smart Contract Architecture

### Core Contracts

#### DonationPool Contract

The heart of our platform, built upon Pool-Escrow's battle-tested architecture, enabling:

- Campaign creation and management
- Secure donation handling
- Platform fee management
- Emergency controls
- Dispute resolution

### Libraries

- **DonationConstantsLib**: Configuration constants
- **DonationEventsLib**: Event definitions
- **DonationErrorsLib**: Custom error handling
- **DonationPoolAdminLib**: Administrative functions
- **DonationPoolBalanceLib**: Balance management
- **DonationPoolDetailLib**: Campaign details
- **DonorDetailLib**: Donor information

### Dependencies

- **OpenZeppelin**:
    - `Ownable2Step`: Secure ownership transfers
    - `Pausable`: Emergency stop functionality
    - `AccessControl`: Role-based permissions
- **Pool-Escrow**:
    - Core escrow functionality
    - Base contract patterns
    - Security features

## Development Setup

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Git](https://git-scm.com/)
- [Bun](https://bun.sh) (for scripts)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/swipe-pad
cd swipe-pad/contracts

# Install dependencies
forge install
```

## Testing & Deployment

### Build

```shell
forge build
```

### Test

```shell
forge test
```

### Format

```shell
forge fmt
```

### Gas Analysis

```shell
forge snapshot
```

### Local Development

```shell
anvil
```

### Deployment

```shell
forge script script/DonationPool.s.sol:DonationPoolScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

## Security Features

- **Two-Step Ownership**: Safe ownership transfers
- **Role-Based Access**: Granular permission control
- **Emergency Pause**: Quick response to issues
- **Dispute Resolution**: Handle problematic campaigns
- **Safe Token Transfers**: Secure token handling
- **Events & Logging**: Full transparency

## Documentation

- [Foundry Book](https://book.getfoundry.sh/)
- [Contract Documentation](../docs/milestones/donation-pool.md)
- [Donation Flow](../docs/milestones/donation-flow.md)
- [Pool-Escrow Documentation](https://github.com/Pool-Escrow/Pool-Contracts)

## Contributing

We welcome contributions! Please check our [Contributing Guidelines](../CONTRIBUTING.md) before submitting PRs.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
