# <a name="top"></a>

<div align="center">
  <!-- Simple header design with gradients, compatible with GitHub -->
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:23a6d5,50:00a389,100:23d5ab&height=200&section=header&text=SwipePad&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=40" width="100%" alt="SwipePad Header" />
  
  <h2>Making Micro-Donations Seamless & Impactful</h2>
  <p><strong>SwipePad: Support global impact campaigns with a simple, joyful swipe!</strong></p>
  
  <img src="public/swipepad-banner.png" alt="SwipePad Banner" width="500" style="margin: 15px 0;" />
  
  <p>
    <img src="https://img.shields.io/badge/Celo-FCFF52?style=for-the-badge&logo=celo&logoColor=000000" alt="Celo" />
    <img src="https://img.shields.io/badge/MiniPay-000000?style=for-the-badge&logo=minipay&logoColor=white" alt="MiniPay" />
    <img src="https://img.shields.io/badge/Global_Stablecoin_Hackathon-May_2025-blue?style=for-the-badge" alt="Global Stablecoin Hackathon" />
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT" />
  </p>
</div>

> ⚠️ **IMPORTANT DISCLAIMER**
>
> SwipePad is currently a **hackathon project** developed for the Global Stablecoin Hackathon (May 2025). Please note:
>
> - This is an **experimental project** and should not be used in production
> - The smart contracts are **not audited** and may contain vulnerabilities
> - **DO NOT** use this system with significant amounts of funds
> - The project is under active development and may undergo significant changes
>
> We're excited about the potential of SwipePad, but please treat it as a proof of concept at this stage.

<h2>Table of Contents</h2>

- [🌟 What is SwipePad? The Spark Behind the Swipe!](#-what-is-swipepad-the-spark-behind-the-swipe)
- [💫 Key Features](#-key-features)
- [🏗️ How It Works](#️-how-it-works)
    - [Donation Flow](#donation-flow)
    - [Smart Contract Architecture](#smart-contract-architecture)
- [🧰 Tech Stack](#-tech-stack)
    - [Database Stack](#database-stack)
- [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Database Setup](#database-setup)
        - [Database Commands](#database-commands)
        - [Common Database Workflows](#common-database-workflows)
    - [Quick Setup](#quick-setup)
    - [Important Notes about Bun](#important-notes-about-bun)
- [📝 Project Status](#-project-status)
- [💖 Join Our Mission \& Contribute!](#-join-our-mission--contribute)
- [🗺️ Our Roadmap Ahead: The Journey to Impact](#️-our-roadmap-ahead-the-journey-to-impact)
- [👥 Team](#-team)
- [🔗 Links](#-links)
- [📜 Legal & Security](#-legal--security)

**SwipePad is a mobile-first dApp designed for Celo's MiniPay, revolutionizing how we connect with and contribute to causes we care about. Imagine Tinder, but for making a tangible difference in the world!** ✨

## 🌟 What is SwipePad? The Spark Behind the Swipe!

We believe everyone deserves the chance to make an impact, no matter how small their contribution. Yet, traditional philanthropy can feel distant, complex, and opaque. Millions are eager to help, but are hindered by outdated systems and a lack of direct connection to the causes they champion.

**The Problem We're Tackling:**

- Traditional donation platforms often feel clunky, slow, and lack real-time transparency.
- Billions of potential changemakers remain financially excluded from global funding ecosystems.
- It's hard to _feel_ the impact of your donation and connect with the stories behind the campaigns.

**Our Solution: SwipePad - Philanthropy Reimagined!**
SwipePad offers a frictionless, engaging mobile experience that directly connects passionate donors with verified, high-impact campaigns. Using Celo's fast and affordable stablecoins (cUSD, cEUR, cKES, and more!), we're making micro-donations accessible, transparent, and empowering for _anyone_ with a phone.

It's more than just donating; it's about discovering, connecting, and becoming part of a global movement for good, one swipe at a time.

<div align="right" style="margin-top: 1rem;">
  <a href="#top" style="font-size: 0.8rem; color: #58a6ff;">↑ Go to top</a>
</div>

## 💫 Key Features

| Feature                        | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| 👆 **Swipe Interface**         | Discover and donate to campaigns with intuitive swipe gestures |
| 💰 **Multi-currency**          | Support with cUSD, cEUR, cKES, and other Celo stablecoins      |
| 📱 **MiniPay Native**          | Seamlessly integrated for 7M+ MiniPay users                    |
| ✅ **Verified Campaigns**      | Curated selection of impact-driven initiatives                 |
| 🔍 **On-Chain Transparency**   | All donations are fully verifiable on Celo                     |
| 🎯 **Flexible Funding Models** | Choose All-or-Nothing or Keep-What-You-Raise                   |
| 💸 **Micro-Donations**         | Support campaigns with any amount, no minimum                  |

See the [complete contract documentation](./docs/milestones/donation-pool.md) for more details.

<div align="right" style="margin-top: 1rem;">
  <a href="#top" style="font-size: 0.8rem; color: #58a6ff;">↑ Go to top</a>
</div>

## 🏗️ How It Works

<div align="center">
  
```
┌───────────┐     ┌──────────────┐     ┌───────────────┐     ┌───────────────┐
│           │     │              │     │               │     │               │
│  MiniPay  │────▶│  SwipePad UI │────▶│ DonationPool  │────▶│  Campaign     │
│  User     │     │  (Next.js)   │     │  Contract     │     │  Creator      │
│           │     │              │     │               │     │               │
└───────────┘     └──────────────┘     └───────────────┘     └───────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  Campaign    │
                  │  Metadata    │
                  │  (Database)  │
                  └──────────────┘
```

</div>

1. **Browse** ― User swipes through verified impact campaigns
2. **Choose** ― User selects donation amount and currency
3. **Donate** ― Funds transfer directly via DonationPool contract on Celo
4. **Track** ― Both donor and campaign creator can verify the transaction on-chain

### Donation Flow

For a detailed explanation of the donation flow, see our [donation flow documentation](./docs/milestones/donation-flow.md).

### Smart Contract Architecture

The DonationPool contract is a purpose-built solution for handling donations with two funding models:

1. **All or Nothing (Kickstarter model)**:

    - Creators receive funds only if the funding goal is met
    - Donors can claim refunds if the goal isn't reached

2. **Keep What You Raise**:
    - Creators receive all donations regardless of goal achievement
    - Suitable for campaigns that can make partial progress

<div align="right" style="margin-top: 1rem;">
  <a href="#top" style="font-size: 0.8rem; color: #58a6ff;">↑ Go to top</a>
</div>

## 🧰 Tech Stack

<div align="center">
  
| Frontend | Web3 | Contracts | Platform |
|:--------:|:----:|:---------:|:--------:|
| Next.js 15 | Wagmi 2 | Solidity | Celo |
| TypeScript | Viem | Foundry | MiniPay |
| Tailwind CSS 4 | | | Bun |

</div>

### Database Stack

|   Type    |  Technology   |          Purpose           |
| :-------: | :-----------: | :------------------------: |
|    ORM    |  Drizzle ORM  | Type-safe database queries |
| Database  |  PostgreSQL   |     Primary data store     |
| Migration |  Drizzle Kit  |     Schema migrations      |
|  Client   | node-postgres |    Database connection     |

<div align="right" style="margin-top: 1rem;">
  <a href="#top" style="font-size: 0.8rem; color: #58a6ff;">↑ Go to top</a>
</div>

## 🚀 Getting Started

> 💻 Explore the live version at: [https://swipepad.xyz](https://swipepad.xyz)

### Prerequisites

You'll need:

- [Bun](https://bun.sh/docs/installation) (v1.0+)
- [Git](https://git-scm.com/)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [PostgreSQL](https://www.postgresql.org/download/) (v15+)

### Database Setup

1. Create a `.env.local` file in the root directory:

```bash
DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres"
```

2. Start your local PostgreSQL instance using Docker:

```bash
# Start the PostgreSQL container and WebSocket proxy
docker-compose up -d
```

3. Initialize and seed the database:

```bash
# Generate migrations
bun run db:generate

# Push migrations to database
bun run db:push

# Seed database with sample data
bun run db:minimal-seed
```

#### Database Commands

| Command           | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `db:generate`     | Generate new migrations based on schema changes        |
| `db:push`         | Push migrations to the database                        |
| `db:migrate`      | Run migrations using a migration script                |
| `db:studio`       | Launch Drizzle Studio UI to explore your data          |
| `db:seed`         | Seed database with sample data using drizzle-seed      |
| `db:minimal-seed` | Seed database with minimal sample data                 |
| `db:clean-seed`   | Seed database with comprehensive sample data using SQL |
| `db:clear`        | Delete all data from all tables                        |
| `db:reset`        | Reset database to initial state                        |
| `db:check`        | Check for pending migrations                           |
| `db:drop`         | Drop all tables                                        |
| `db:up`           | Full setup (generate, push, seed)                      |
| `db:down`         | Full cleanup (drop, push)                              |

#### Common Database Workflows

**Complete Reset:**

```bash
docker-compose down -v && docker-compose up -d && bun run db:push && bun run db:minimal-seed
```

**Visual Database Explorer:**

```bash
bun run db:studio
```

**Development Setup:**
For local development, the project is configured to use both local PostgreSQL and Neon serverless Postgres. By default, it will connect to your local PostgreSQL instance, but you can add a Neon connection string to `.env.local` to use in production environments.

### Quick Setup

```bash
# Clone the repo with submodules
git clone --recurse-submodules https://github.com/ReFi-Starter/swipe-pad.git
cd swipe-pad

# Use our script to set up the project with Bun
./scripts/bun-postinstall.sh

# Compile contracts
cd contracts && forge build && cd ..

# Generate contract hooks
./scripts/generate-types.sh

# Start development server
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Important Notes about Bun

This project uses [Bun](https://bun.sh/) instead of npm for package management. Key points:

- **Install packages:** `bun install <package-name>` or `bun add <package-name>`
- **Run scripts:** `bun run <script-name>` (e.g., `bun run dev`)
- **Lock file:** Bun uses `bun.lockb` instead of `package-lock.json`

If you run into dependency issues, use our cleanup script:

```bash
./scripts/bun-postinstall.sh
```

<div align="center">
  <div style="position: relative; width: 60%; max-width: 800px; margin: 3rem auto;">
    <img 
      src="public/abstract-banner.png" 
      alt="Decorative Divider" 
      style="height: 80px; width: 100%; object-fit: cover; border-radius: 4px; opacity: 0.7; filter: brightness(1.1) contrast(0.9);" 
    />
  </div>
</div>

## 📝 Project Status

Current milestone: **Initial Setup & Contract Integration** (April-May 2025)

- ✅ Project bootstrapped with Next.js & Bun
- ✅ Smart contracts integrated via git submodule
- ✅ Wagmi hooks generated for contract interaction
- ✅ Basic project structure established
- 🔜 UI components & donation flow

[View detailed progress on our current milestone →](./docs/milestones/001-project-setup.md)

<div align="right" style="margin-top: 1rem;">
  <a href="#top" style="font-size: 0.8rem; color: #58a6ff;">↑ Go to top</a>
</div>

## 💖 Join Our Mission & Contribute!

SwipePad is more than just a project; it's a community-driven effort to build a more inclusive and impactful future for philanthropy. We're a friendly and passionate team, and we believe that the best ideas come from collaboration! Whether you're a seasoned developer, a UI/UX wizard, a sharp-eyed tester, or just someone brimming with great ideas, there's a place for you here.

**Why Contribute to SwipePad?**

- **Make a Real-World Impact:** Help build a platform that directly supports global causes and empowers communities.
- **Learn & Grow:** Work with cutting-edge Web3 technologies on the Celo platform, Next.js, and more.
- **Join a Vibrant Community:** Be part of a supportive and enthusiastic team that values every contribution.
- **Shape the Future:** Your ideas and skills can directly influence the direction and success of SwipePad.

**Ways You Can Help Us Grow:**

- 💻 **Code Contributions:** Help us build new features, fix bugs, or improve existing functionalities. Check out our `good first issues`!
- 🎨 **Design & UX:** Have an eye for design? Help us make SwipePad even more intuitive and beautiful.
- 💡 **Ideas & Feedback:** Share your thoughts on new features, improvements, or potential campaigns.
- 📚 **Documentation:** Help us improve our guides and make it easier for others to get involved.
- 🐞 **Testing & Bug Reports:** Be our quality champion and help us find and squash those pesky bugs.

**Ready to jump in?**

1.  Take a look at our [Project Board](https://github.com/users/ReFi-Starter/projects/1) (Link to be updated if you have one) to see what we're working on.
2.  Check out the open [Issues](https://github.com/ReFi-Starter/swipe-pad/issues) - especially those tagged `help wanted` or `good first issue`.
3.  Have an idea? Start a [Discussion](https://github.com/ReFi-Starter/swipe-pad/discussions)!
4.  For code contributions, please read our (upcoming) `CONTRIBUTING.md` guide for details on our workflow and coding standards.

We're excited to build something amazing together! Don't hesitate to reach out.

<div align="right" style="margin-top: 1rem;">
  <a href="#top" style="font-size: 0.8rem; color: #58a6ff;">↑ Go to top</a>
</div>

## 🗺️ Our Roadmap Ahead: The Journey to Impact

We're just getting started on this exciting journey, and here's a glimpse of what's on our horizon:

**Current Focus (Initial Setup & Contract Integration - April-May 2025):**

- ✅ Project bootstrapped with Next.js & Bun - _Foundation laid!_
- ✅ Smart contracts (DonationPool) integrated via git submodule - _Core logic in place!_
- ✅ Wagmi hooks generated for seamless contract interaction - _Web3 connectivity established!_
- ✅ Basic project structure and essential database setup - _Organized for growth!_
- ⏳ Building out the core UI components for the swipe-to-donate experience - _Making it beautiful & intuitive!_
- ⏳ Implementing the full donation flow from campaign discovery to on-chain confirmation - _Ensuring a smooth user journey!_

[View detailed progress on our current milestone →](./docs/milestones/001-project-setup.md)

**Next Up: Expanding the Ecosystem**

- 📱 **Full MiniPay Integration & Testing:** Ensuring a flawless experience for the 7M+ MiniPay users.
- 🎨 **UI/UX Polish:** Refining the user interface for an even more delightful and engaging experience.
- 🌍 **Campaign Curation & Onboarding:** Developing a robust process for verifying and onboarding impactful campaigns.
- 🛠️ **Advanced Funding Models:** Exploring and implementing more nuanced funding options.
- 📊 **Donor Dashboards & Impact Tracking:** Providing users with clear visibility into their contributions and the collective impact.

**Future Dreams: Scaling the Impact**

- 🌐 **Multi-language Support:** Making SwipePad accessible to a global audience.
- 🤝 **Community Governance Features:** Empowering the community to participate in key decisions.
- 💡 **Gamification & Rewards:** Encouraging sustained engagement and contributions.
- 🌱 **Integration with more ReFi Protocols:** Expanding the reach and possibilities.

**Got ideas for our roadmap or want to help us get there faster? We'd love to hear from you in our [Discussions](https://github.com/ReFi-Starter/swipe-pad/discussions)!**

<div align="right" style="margin-top: 1rem;">
  <a href="#top" style="font-size: 0.8rem; color: #58a6ff;">↑ Go to top</a>
</div>

## 👥 Team

- **refistarter.eth** - Umbrella Collective
- **ottox.eth** - Tech Lead
- **ozkite.eth** - Product Development

## 🔗 Links

- **Live Demo (Production):** [https://swipe-pad.vercel.app](https://swipepad.xyz)
  **Farcaster:** TBA
- **MiniPay Website:** TBA
- [Demo Video](https://drive.google.com/file/d/1DywG644N0KwyuO1FJOuoTru5qkaEbl_L/view?usp=drivesdk)
- [Pitch Deck](https://docs.google.com/presentation/d/1vVyXT26NsGsk7kWdEKJk-qcfLY1cnyO_Gbo9tR83miI/edit?usp=sharing)
- [KarmaGAP Profile](https://gap.karmahq.xyz/project/refi-starter---swipe-2-donate-app)

## 📜 Legal & Security

- [License](.github/LICENSE.md) - MIT License
- [Security Policy](.github/SECURITY.md) - Security guidelines and reporting
- [Code of Conduct](.github/CODE_OF_CONDUCT.md) - Community guidelines
- [Contributing](.github/CONTRIBUTING.md) - How to contribute

---

<div align="center">
  
  *Built for the [Global Stablecoin Hackathon](https://mentolabs.notion.site/Global-Stablecoin-Hackathon-1c1a2148cc5c808aa42ddee1e3df7883) (May 2025)*
  
  **ReFi Starter** | [GitHub](https://github.com/ReFi-Starter) | [Website](https://swipepad.xyz)
</div>

<div align="right" style="margin-top: 1rem;">
  <a href="#top" style="font-size: 0.8rem; color: #58a6ff;">↑ Go to top</a>
</div>
