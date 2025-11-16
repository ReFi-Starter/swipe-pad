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
```

## 2. User Journey Flow

```mermaid
sequenceDiagram
    participant User
    participant Platform as Farcaster/MiniPay/Browser
    participant SwipePad
    participant Auth as Auth System
    participant SelfProtocol
    participant CardRandomizer
    participant PrivateDB
    participant ThirdWeb
    participant DonationContract
    participant ProjectWallet
    participant Divvi
    participant KarmaGAP

    %% Entry and Authentication
    User->>Platform: Opens SwipePad
    Platform->>SwipePad: Load SwipePad MiniApp
    
    alt Browser Entry
        SwipePad->>ThirdWeb: Show ThirdWeb Wallet Component
        User->>ThirdWeb: Connect Wallet
        ThirdWeb-->>SwipePad: Wallet Connected
    else Farcaster Entry
        SwipePad->>Auth: Use Farcaster Profile
        Auth-->>SwipePad: Profile Authenticated
    else MiniPay Entry
        SwipePad->>Auth: Use MiniPay Wallet
        Auth-->>SwipePad: Wallet Authenticated
    end
    
    %% Self ID Verification (Optional)
    SwipePad->>User: Show ID Verification Prompt
    alt User Chooses to Verify
        User->>SelfProtocol: Initiate ID Verification
        SelfProtocol->>User: Request Verification Data
        User->>SelfProtocol: Submit Verification Data
        SelfProtocol->>SelfProtocol: Process Verification
        SelfProtocol-->>SwipePad: Verification Complete
        SelfProtocol->>DonationContract: Update User Verification Status
        DonationContract->>User: Send Reward for Verification
    end
    
    %% Project Discovery
    SwipePad->>CardRandomizer: Request Shuffled Projects
    CardRandomizer->>PrivateDB: Fetch Project Data
    PrivateDB-->>CardRandomizer: Return Project Cards
    CardRandomizer-->>SwipePad: Return Shuffled Cards
    SwipePad->>User: Display Project Cards
    
    %% Donation Flow
    User->>SwipePad: Swipe Right (Donate)
    SwipePad->>ThirdWeb: Initiate Donation
    ThirdWeb->>DonationContract: Process Donation
    DonationContract->>ProjectWallet: Transfer Funds
    DonationContract-->>ThirdWeb: Transaction Confirmation
    ThirdWeb-->>SwipePad: Donation Successful
    
    %% Impact Tracking
    DonationContract->>Divvi: Track Donation Impact
    DonationContract->>KarmaGAP: Record Impact
    Divvi->>SwipePad: Update Impact Metrics
    KarmaGAP->>SwipePad: Update Impact Metrics
    SwipePad->>User: Display Impact Confirmation
```

## 3. Project Submission Flow

```mermaid
sequenceDiagram
    participant ProjectSubmitter
    participant Platform as Farcaster/MiniPay/Browser
    participant SwipePad
    participant Auth as Auth System
    participant SelfProtocol
    participant AdminSystem
    participant ProjectRegistry
    participant PrivateDB
    participant KarmaGAP
    participant Divvi

    %% Entry and Authentication
    ProjectSubmitter->>Platform: Opens SwipePad
    Platform->>SwipePad: Load SwipePad MiniApp
    
    alt Browser Entry
        SwipePad->>Auth: Show ThirdWeb Wallet Component
        ProjectSubmitter->>Auth: Connect Wallet
        Auth-->>SwipePad: Wallet Connected
    else Farcaster Entry
        SwipePad->>Auth: Use Farcaster Profile
        Auth-->>SwipePad: Profile Authenticated
    else MiniPay Entry
        SwipePad->>Auth: Use MiniPay Wallet
        Auth-->>SwipePad: Wallet Authenticated
    end
    
    %% Mandatory Self ID Verification for Project Submission
    SwipePad->>ProjectSubmitter: Show Project Submission Form
    ProjectSubmitter->>SwipePad: Submit Project Details
    SwipePad->>SelfProtocol: Check Verification Status
    alt Not Verified
        SelfProtocol-->>SwipePad: User Not Verified
        SwipePad->>ProjectSubmitter: Require ID Verification
        ProjectSubmitter->>SelfProtocol: Initiate ID Verification
        SelfProtocol->>ProjectSubmitter: Request Verification Data
        ProjectSubmitter->>SelfProtocol: Submit Verification Data
        SelfProtocol->>SelfProtocol: Process Verification
        SelfProtocol-->>SwipePad: Verification Complete
    end
    
    %% Project Approval Process
    SwipePad->>AdminSystem: Submit Project for Review
    AdminSystem->>AdminSystem: Review Project Details
    AdminSystem->>ProjectSubmitter: Request Additional Info if Needed
    ProjectSubmitter->>AdminSystem: Provide Additional Info
    AdminSystem->>ProjectRegistry: Approve Project
    ProjectRegistry->>PrivateDB: Add Project to Database
    ProjectRegistry->>KarmaGAP: Register Project
    ProjectRegistry->>Divvi: Register Project
    PrivateDB-->>SwipePad: Project Available for Display
    SwipePad->>ProjectSubmitter: Project Submission Confirmed
```

## 4. Self Protocol Integration Flow

```mermaid
graph TB
    subgraph "Self Protocol Integration"
        A[User/Project Submitter] --> B[SwipePad App]
        B --> C[Self Protocol API]
        C --> D[Identity Verification]
        D --> E[DID Generation]
        E --> F[Verification Status]
        F --> G[Smart Contract]
        G --> H[Rewards System]
        
        subgraph "Verification Types"
            I[User Verification] --> J[Donation Rewards]
            K[Project Verification] --> L[Submission Privileges]
        end
        
        F --> I
        F --> K
    end
```

## 5. Impact Tracking & Rewards Flow

```mermaid
graph TB
    subgraph "Impact Tracking & Rewards"
        A[Donation] --> B[Donation Contract]
        B --> C[Karma GAP]
        B --> D[Divvi]
        
        C --> E[Impact Metrics]
        D --> F[Impact Analytics]
        
        E --> G[User Dashboard]
        F --> G
        
        subgraph "Rewards System"
            H[Verification Rewards] --> I[Token Distribution]
            J[Impact Badges] --> K[NFT Badges]
            L[Referral Rewards] --> M[Token Distribution]
        end
        
        G --> H
        G --> J
        G --> L
    end
```

## 6. Complete System Architecture

```mermaid
graph TB
    subgraph "User Entry Points"
        A[Farcaster App] --> B[Farcaster Profile Auth]
        C[MiniPay Wallet] --> D[MiniPay Wallet Auth]
        E[Browser/Next.js] --> F[ThirdWeb Wallet Component]
    end
    
    subgraph "SwipePad MiniApp"
        B --> G[SwipePad on Farcaster]
        D --> H[SwipePad on MiniPay]
        F --> I[SwipePad on Web]
    end
    
    subgraph "Application Layer"
        G --> J[Next.js Frontend]
        H --> J
        I --> J
        J --> K[API Layer]
        J --> L[ThirdWeb SDK]
        J --> M[Self Protocol]
        L --> N[Wallet Integration]
        M --> O[Identity Verification]
        K --> P[Card Randomizer]
        K --> Q[Project Database]
        K --> R[Admin System]
    end
    
    subgraph "Blockchain Layer"
        S[Celo Network] --> T[Smart Contracts]
        T --> U[Donation Contract]
        T --> V[Project Registry]
        T --> W[Mento Integration]
        T --> X[Self Protocol Integration]
        T --> Y[Rewards Contract]
    end
    
    subgraph "External Services"
        Z[Karma GAP] --> AA[Impact Tracking]
        BB[Divvi] --> CC[Impact Analytics]
        DD[IPFS/Phala/Filecoin] --> EE[Decentralized Storage]
    end
    
    subgraph "Data Storage"
        FF[Private Project Database] --> GG[Project Cards]
        FF --> HH[Project Images]
        FF --> II[Project URLs]
        FF --> JJ[Project Public Wallets]
        KK[Centralized Randomizer] --> P
    end
    
    Q --> FF
    P --> KK
    R --> V
    U --> Z
    V --> DD
    W --> BB
    X --> M
    Y --> AA
```

## 7. Reward System Flow

```mermaid
sequenceDiagram
    participant User
    participant SwipePad
    participant SelfProtocol
    participant RewardsContract
    participant TokenContract
    
    %% User Verification Reward
    User->>SwipePad: Complete Self ID Verification
    SwipePad->>SelfProtocol: Verify User Identity
    SelfProtocol-->>SwipePad: Verification Confirmed
    SwipePad->>RewardsContract: Trigger Verification Reward
    RewardsContract->>TokenContract: Mint Reward Tokens
    TokenContract->>User: Transfer Reward Tokens
    
    %% Donation Reward for Verified Users
    User->>SwipePad: Make Donation
    SwipePad->>RewardsContract: Check Verification Status
    alt User is Verified
        RewardsContract->>TokenContract: Mint Additional Reward Tokens
        TokenContract->>User: Transfer Additional Rewards
    end
    
    %% Project Submission Reward
    User->>SwipePad: Submit Project
    SwipePad->>SelfProtocol: Verify Project Submitter
    SelfProtocol-->>SwipePad: Verification Confirmed
    SwipePad->>RewardsContract: Trigger Submission Reward
    RewardsContract->>TokenContract: Mint Reward Tokens
    TokenContract->>User: Transfer Reward Tokens
```
