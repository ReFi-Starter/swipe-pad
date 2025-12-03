# 🚀 SwipePad - Celo DApp: Swipe to Regenerate

A decentralized application for supporting high-impact **regenerative projects** with micro-donations through an intuitive **swipe interface** on the Celo blockchain.

---

## ✨ Key Features

| Category | Feature | Description |
| :--- | :--- | :--- |
| **💳 Wallet & Auth** | **Multi-Wallet Support** | Seamless connection via **email, social media** (Google, Discord, Telegram, Farcaster, X, Apple, GitHub, Twitch, TikTok, LINE), **passkey, guest mode**, and major **Web3 wallets** (MetaMask, Coinbase Wallet, Rainbow, Rabby, Zerion). |
| **🔄 Donation UX** | **Swipe-to-Donate** | An intuitive, **Tinder-style interface** for fun and easy discovery and support of projects. |
| **🌍 Global Reach** | **Multiple Stablecoins** | Support for **11 stablecoins** including cUSD, cEUR, cGBP, cAUD, cCHF, cCAD, cKES, cREAL, cZAR, cCOL, and cJPY. |
| **🌱 Project Scope** | **Diverse Categories** | Projects spanning Regeneration, Climate, Education, Wildlife, Health, Community, Technology, and Arts & Culture. |
| **🎮 Engagement** | **Gamification** | Motivate donors with **badges, streak tracking**, and a public donation profile. |
| **📈 Discovery** | **Trending Projects** | Showcase popular community funds and high-impact initiatives. |
| **📝 Owner Tools** | **Project Registration** | Simple submission process for new regenerative projects awaiting review. |

---

## 🛠️ Tech Stack & Architecture

* **Framework**: **Next.js 14** (App Router)
* **Blockchain**: **Celo Network** (Fast, low-cost, and carbon-negative)
* **Wallet/Auth**: **Thirdweb SDK** (Comprehensive integration for multiple wallets and auth methods)
* **Styling**: **Tailwind CSS + shadcn/ui** (Rapid, utility-first styling and accessible UI components)
* **Language**: **TypeScript** (Type-safe development)

### 🧭 Project Flow Diagram (Mermaid)

This illustrates the core user journey from connecting their wallet to confirming a donation.

```mermaid
graph TD
    A[Start] --> B(User Lands on SwipePad);
    B --> C{Connect Wallet?};
    C -- Yes/Skip --> D(Load Project Cards & Stablecoin Selector);
    C -- No/Guest --> D;
    D --> E{User Swipes};
    E -- Right (Like) --> F(Add to Cart/Donation Queue);
    E -- Left (Skip) --> D;
    E -- All Swipes Done --> G(Review & Confirm Donations);
    F --> D;
    G --> H(Thirdweb initiates Celo Transaction);
    H -- Success --> I(Success Screen & Badge/Streak Update);
    H -- Failure --> J(Transaction Error Notification);
    I --> K[End / Continue Swiping];
    J --> G;
