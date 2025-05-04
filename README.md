# SwipePad ― Micro-Donations Made Easy

<div align="center">
  
  ![SwipePad Logo](https://via.placeholder.com/200x200.png?text=SwipePad)
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Celo](https://img.shields.io/badge/Celo-FCFF52?style=flat&logo=celo&logoColor=000000)](https://celo.org/)
  [![Global Stablecoin Hackathon](https://img.shields.io/badge/Hackathon-May_2025-blue)](https://mentolabs.notion.site/Global-Stablecoin-Hackathon-1c1a2148cc5c808aa42ddee1e3df7883)

  ### **Supporting global impact projects with a simple swipe** ✨
  
  *A mobile-first dApp for MiniPay on Celo*
</div>

## 🌟 What is SwipePad?

SwipePad makes micro-philanthropy effortless by letting users swipe through verified impact projects and donate with Celo stablecoins in seconds.

**Problem**: Traditional donation platforms are centralized, slow, and lack transparency. Billions remain financially excluded from global funding systems.

**Solution**: A frictionless mobile experience that connects donors directly with verified projects using Celo's stablecoins—making micro-donations accessible to anyone with a phone.

## 💫 Key Features

| Feature | Description |
|---------|-------------|
| 👆 **Swipe Interface** | Discover and donate to projects with intuitive swipe gestures |
| 💰 **Multi-currency** | Support with cUSD, cEUR, cKES, and other Celo stablecoins |
| 📱 **MiniPay Native** | Seamlessly integrated for 7M+ MiniPay users |
| ✅ **Verified Projects** | Curated selection of impact-driven initiatives |
| 🔍 **On-Chain Transparency** | All donations are fully verifiable on Celo |

## 🏗️ How It Works

<div align="center">
  
```
┌───────────┐     ┌──────────────┐     ┌───────────────┐     ┌───────────────┐
│           │     │              │     │               │     │               │
│  MiniPay  │────▶│  SwipePad UI │────▶│  Pool Smart   │────▶│  Project      │
│  User     │     │  (Next.js)   │     │  Contracts    │     │  Wallet       │
│           │     │              │     │               │     │               │
└───────────┘     └──────────────┘     └───────────────┘     └───────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  Project     │
                  │  Metadata    │
                  │  (Future)    │
                  └──────────────┘
```

</div>

1. **Browse** ― User swipes through verified impact projects
2. **Choose** ― User selects donation amount and currency
3. **Donate** ― Funds transfer directly via Pool contracts on Celo
4. **Track** ― Both donor and project can verify the transaction on-chain

## 🧰 Tech Stack

<div align="center">
  
| Frontend | Web3 | Contracts | Platform |
|:--------:|:----:|:---------:|:--------:|
| Next.js 14 | Wagmi | Solidity | Celo |
| TypeScript | Viem | Foundry | MiniPay |
| Tailwind CSS | | | Bun |

</div>

## 🚀 Getting Started

### Prerequisites

You'll need:
- [Bun](https://bun.sh/docs/installation) (v1.0+)
- [Git](https://git-scm.com/)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Quick Setup

```bash
# Clone the repo with submodules
git clone --recurse-submodules https://github.com/ReFi-Starter/swipe-pad.git
cd swipe-pad

# Install dependencies
bun install

# Compile contracts
cd contracts && forge build && cd ..

# Generate contract hooks
bunx wagmi generate

# Start development server
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Project Status

Current milestone: **Initial Setup & Contract Integration** (April-May 2025)
- ✅ Project bootstrapped with Next.js & Bun
- ✅ Smart contracts integrated via git submodule
- ✅ Wagmi hooks generated for contract interaction
- ✅ Basic project structure established
- 🔜 UI components & donation flow

[View detailed progress →](./docs/milestones/001-project-setup.md)

## 👥 Team

- **refistarter.eth** - Project Lead
- **ottox.eth** - Frontend Developer
- **ozkite.eth** - Smart Contract Developer

## 🔗 Links

- [Demo Video](https://example.com) (Coming soon)
- [Pitch Deck](https://example.com) (Coming soon)
- [KarmaGAP Profile](https://gap.karmahq.xyz/project/refi-starter---swipe-2-donate-app)

---

<div align="center">
  
  *Built for the [Global Stablecoin Hackathon](https://mentolabs.notion.site/Global-Stablecoin-Hackathon-1c1a2148cc5c808aa42ddee1e3df7883) (May 2025)*
  
  **ReFi Starter** | [GitHub](https://github.com/ReFi-Starter) | [Website](https://example.com)
</div>
