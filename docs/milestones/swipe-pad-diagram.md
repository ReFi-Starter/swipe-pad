# SwipePad Architecture & User Journey Diagrams

This document contains comprehensive diagrams showing the SwipePad architecture, user flows, and integration points across all supported platforms (Farcaster, MiniPay, and Browser/Next.js).

## 1. User Entry Points & Authentication Flow

```mermaid
graph TB
    subgraph "User Entry Points"
        A[Mobile User] --> B[Farcaster App]
        A --> C[MiniPay Wallet]
        A --> D[Browser/Next.js App]
    end
    
    subgraph "Authentication Methods"
        B --> E[Farcaster Profile]
        C --> F[MiniPay Wallet]
        D --> G[ThirdWeb Wallet Component]
    end
    
    subgraph "SwipePad MiniApp"
        E --> H[SwipePad on Farcaster]
        F --> I[SwipePad on MiniPay]
        G --> J[SwipePad on Web]
    end
    
    subgraph "Shared Backend"
        H --> K[API Layer]
        I --> K
        J --> K
        K --> L[Self Protocol]
        K --> M[Project Database]
        K --> N[Card Randomizer]
        K --> O[Smart Contracts]
    end
