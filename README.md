# ReFi Starter - Swipe-to-Donate App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This repository contains the frontend application for the Swipe-to-Donate project, part of the ReFi Starter initiative. It's a mobile-first Web3 app built for the Celo ecosystem, designed to make supporting meaningful causes as easy as swiping right.

Users can discover verified impact projects, donate stablecoins (like cUSD) on Celo, and track impact transparently on the blockchain.

This project is being built in public. Follow our progress in the [**Documentation**](./docs/README.md).

## ✨ Features (Planned)

- **Swipe Interface:** Easily browse and discover impact projects.
- **Micro-Donations:** Support causes with small amounts of Celo stablecoins.
- **MiniPay Integration:** Seamless experience within the MiniPay wallet.
- **Project Verification:** Ensuring listed projects meet impact criteria (details TBD).
- **On-Chain Transparency:** Donations and project funding tracked on Celo.

## 🛠 Tech Stack

- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Blockchain Interaction:** [Wagmi](https://wagmi.sh/) / [Viem](https://viem.sh/)
- **Smart Contracts:** [Foundry](https://getfoundry.sh/) (Solidity) - Managed as a git submodule in `./contracts`.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/docs/installation) (v1.0 or higher)
- [Git](https://git-scm.com/)
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for contract interaction/testing)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd swipe-pad
    ```

2.  **Initialize Submodules:**
    The project uses git submodules for the smart contracts. Initialize them:
    ```bash
    git submodule update --init --recursive
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    bun install
    ```

4.  **Compile Contracts:**
    Navigate to the contracts directory and compile:
    ```bash
    cd contracts
    forge build
    cd ..
    ```

5.  **Generate Wagmi Hooks:**
    Ensure contracts are compiled, then generate hooks:
    ```bash
    bunx wagmi generate
    ```

6.  **Environment Variables:**
    Create a `.env.local` file based on `.env.example` (if one exists) and populate it with necessary keys (e.g., RPC URLs, API keys).

### Running the Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📚 Documentation

Detailed documentation, including milestones, technical decisions (ADRs), and build-in-public updates, can be found in the [`docs/`](./docs/README.md) directory.

## 🤝 Contributing

Contributions are welcome! Please refer to the `CONTRIBUTING.md` guide (to be created) for details on how to contribute.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (to be created).
