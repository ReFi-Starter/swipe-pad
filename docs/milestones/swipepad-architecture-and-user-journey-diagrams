# SwipePad Architecture & User Journey Diagrams

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

## 2. Complete User Journey Flow with Donation Configuration

```mermaid
sequenceDiagram
    participant User
    participant Platform as Farcaster/MiniPay/Browser
    participant SwipePad
    participant ThirdWeb
    participant DonationConfig
    participant CardRandomizer
    participant PrivateDB
    participant ActivityTracker
    participant DonationContract
    participant ProjectWallet
    participant ProfileDB
    
    %% Entry and Wallet Connection
    User->>Platform: Opens SwipePad
    Platform->>SwipePad: Load SwipePad MiniApp
    SwipePad->>ThirdWeb: Show ThirdWeb Wallet Component
    User->>ThirdWeb: Connect Wallet
    ThirdWeb-->>SwipePad: Wallet Connected (Address: 0x8922...bcB2)
    
    %% Donation Configuration Screen
    SwipePad->>User: Show Donation Configuration Screen
    SwipePad->>DonationConfig: Display Platform-Specific Options
    
    alt MiniPay Platform
        DonationConfig->>User: Show Stablecoins (USDT, cUSD, USDC)
    else Farcaster Platform
        DonationConfig->>User: Show Stablecoins (USDT, cUSD, cEUR, USDC)
    else Next.js Platform
        DonationConfig->>User: Show Stablecoins (cUSD, cEUR, USDT, Mento stablecoins)
    end
    
    User->>DonationConfig: Select Amount per Swipe (1¢, 10¢, 20¢, 50¢)
    User->>DonationConfig: Select Stablecoin (e.g., USDT)
    User->>DonationConfig: Set Confirmation Threshold (10, 20, 30 swipes)
    DonationConfig-->>SwipePad: Save Configuration
    
    User->>SwipePad: Click "Start Swiping"
    
    %% Project Discovery & Card Swiping
    SwipePad->>CardRandomizer: Request Shuffled Projects
    CardRandomizer->>PrivateDB: Fetch Project Data
    PrivateDB-->>CardRandomizer: Return Project Cards
    CardRandomizer-->>SwipePad: Return Shuffled Cards
    SwipePad->>User: Display Project Cards with Categories
    
    %% User Interaction Loop
    loop Swiping Through Projects
        User->>SwipePad: View Project Card
        
        alt User Swipes Right (Like/Donate)
            SwipePad->>ActivityTracker: Record Like Swipe
            ActivityTracker->>ProfileDB: Update User Stats (Likes +1)
            SwipePad->>User: Add to Donation Cart
            SwipePad->>User: Show Swipes Until Confirmation Counter
        else User Swipes Left (Skip)
            SwipePad->>ActivityTracker: Record Skip Swipe
            ActivityTracker->>ProfileDB: Update User Stats (Skips +1)
        else User Clicks Heart Icon
            SwipePad->>ActivityTracker: Record Favorite
            ActivityTracker->>ProfileDB: Save to Favorites
        else User Clicks Comment
            User->>SwipePad: Enter Personalized Message
            SwipePad->>ActivityTracker: Save Comment
            ActivityTracker->>ProfileDB: Link Comment to Project
        else User Clicks Social Media Link
            SwipePad->>User: Open External Link
        end
    end
    
    %% Donation Confirmation
    alt Confirmation Threshold Reached
        SwipePad->>User: Show "Your Donations" Summary
        User->>SwipePad: Review Donations List
        User->>SwipePad: Click "Confirm Donation"
        
        SwipePad->>ThirdWeb: Batch Process Donations
        ThirdWeb->>DonationContract: Execute Smart Contract
        
        loop For Each Project
            DonationContract->>ProjectWallet: Transfer Funds
            DonationContract->>ActivityTracker: Record Donation
            ActivityTracker->>ProfileDB: Update Total Donated
        end
        
        DonationContract-->>ThirdWeb: Transaction Confirmation
        ThirdWeb-->>SwipePad: All Donations Successful
        SwipePad->>User: Show Success & Impact
    end
```

## 3. Category Filtering & View Modes Flow

```mermaid
sequenceDiagram
    participant User
    participant SwipePad
    participant CategoryFilter
    participant CardRandomizer
    participant PrivateDB
    
    User->>SwipePad: On Main Swipe Screen
    
    alt Switch to Category View
        User->>CategoryFilter: Click Category Tab (Projects/Builders/Celo KarmaGap 100)
        CategoryFilter->>CardRandomizer: Request Projects by Category
        CardRandomizer->>PrivateDB: Filter by Category
        PrivateDB-->>CardRandomizer: Return Filtered Projects
        CardRandomizer-->>SwipePad: Display Category-Specific Cards
    end
    
    alt Switch View Mode
        User->>SwipePad: Toggle "View All" Mode
        SwipePad->>PrivateDB: Request All Projects in Category
        PrivateDB-->>SwipePad: Return All Projects
        SwipePad->>User: Display Grid/List View
    else Stay in Swipe Mode
        User->>SwipePad: Stay on "Swipe" Mode
        SwipePad->>User: Continue Card-by-Card Swiping
    end
```

## 4. Trending & Boost System Flow

```mermaid
sequenceDiagram
    participant User
    participant SwipePad
    participant TrendingEngine
    participant BoostSystem
    participant PaymentContract
    participant PrivateDB
    
    %% View Trending Projects
    User->>SwipePad: Click "Trending This Week" Section
    SwipePad->>TrendingEngine: Request Trending Projects
    TrendingEngine->>PrivateDB: Calculate Trending Score (Likes + Boosts)
    PrivateDB-->>TrendingEngine: Return Sorted Projects
    TrendingEngine-->>SwipePad: Display Trending List
    SwipePad->>User: Show Projects with Like Count & Donate Button
    
    %% Quick Donate from Trending
    User->>SwipePad: Click "Donate" on Trending Project
    SwipePad->>User: Process Direct Donation
    
    %% Boost Project Flow
    alt User Wants to Boost Project
        User->>SwipePad: Click "Boost" Button on Project Card
        SwipePad->>BoostSystem: Show Boost Modal
        BoostSystem->>User: Display Boost Options ($1, $5, $10, Custom)
        User->>BoostSystem: Select Boost Amount (e.g., $5)
        BoostSystem->>User: Show Fee Breakdown (Amount: $5, Fee 5%: $0.25, Total: $5.25)
        User->>BoostSystem: Confirm Boost
        
        BoostSystem->>PaymentContract: Process Boost Payment
        PaymentContract->>ProjectWallet: Transfer Boost Amount ($5)
        PaymentContract->>PlatformWallet: Transfer Platform Fee ($0.25)
        PaymentContract-->>BoostSystem: Payment Confirmed
        
        BoostSystem->>TrendingEngine: Update Project Boost Score
        TrendingEngine->>PrivateDB: Increase Visibility Ranking
        BoostSystem->>User: Show Boost Confirmation
    end
```

## 5. Shopping Cart & Donation History Flow

```mermaid
sequenceDiagram
    participant User
    participant SwipePad
    participant CartSystem
    participant DonationHistory
    participant PrivateDB
    
    %% View Cart
    User->>SwipePad: Click Cart Icon (Shows badge with count)
    SwipePad->>CartSystem: Open Cart View
    CartSystem->>PrivateDB: Fetch Pending Donations
    PrivateDB-->>CartSystem: Return Cart Items
    CartSystem->>User: Display "Your Donations" List
    
    %% Cart Actions
    alt Review and Modify
        User->>CartSystem: View All Pending Donations
        CartSystem->>User: Show Project List with Amounts
        User->>CartSystem: Remove Item (Optional)
        CartSystem->>PrivateDB: Update Cart
    end
    
    User->>CartSystem: Click "Confirm Donation"
    CartSystem->>SwipePad: Process Batch Donation
    
    %% View History
    User->>SwipePad: Access Donation History
    SwipePad->>DonationHistory: Request Past Donations
    DonationHistory->>PrivateDB: Fetch Historical Data
    PrivateDB-->>DonationHistory: Return Donation Records
    DonationHistory->>User: Display Chronological List
```

## 6. User Profile & Activity Tracking System

```mermaid
sequenceDiagram
    participant User
    participant SwipePad
    participant ProfileSystem
    participant ActivityTracker
    participant NFTSystem
    participant SelfProtocol
    participant ProfileDB
    
    %% Access Profile
    User->>SwipePad: Click Profile Avatar
    SwipePad->>ProfileSystem: Open Edit Profile Modal
    ProfileSystem->>ProfileDB: Fetch User Data
    ProfileDB-->>ProfileSystem: Return Profile Info
    
    %% Display Profile Stats
    ProfileSystem->>User: Show Profile Details
    Note over User,ProfileSystem: Display Name, Bio, Photo<br/>Social Profiles (Farcaster, Lens, Zora, Twitter/X)
    
    ProfileSystem->>ActivityTracker: Fetch User Stats
    ActivityTracker->>ProfileDB: Query Activity Data
    ProfileDB-->>ActivityTracker: Return Stats
    ActivityTracker-->>ProfileSystem: Provide Metrics
    
    ProfileSystem->>User: Display Stats Dashboard
    Note over User,ProfileSystem: Total Swipes: 47<br/>Reports Made: 3<br/>Total Donated: $125.75<br/>Like Swipes: (calculated)<br/>Pass Swipes: (calculated)
    
    %% NFT Holdings Display
    ProfileSystem->>NFTSystem: Check Connected Wallet
    NFTSystem->>User: Auto-detect NFT Holdings
    Note over User,NFTSystem: Nouns: 2<br/>Lil Nouns: 5
    
    %% Self Protocol Verification
    ProfileSystem->>SelfProtocol: Check Verification Status
    alt Not Verified
        SelfProtocol-->>ProfileSystem: User Not Verified
        ProfileSystem->>User: Show QR Code for Verification
        ProfileSystem->>User: Offer "10 points to scale on rankings"
    else Already Verified
        SelfProtocol-->>ProfileSystem: User Verified
        ProfileSystem->>User: Show Verified Badge
    end
    
    %% Edit Profile
    User->>ProfileSystem: Update Display Name
    User->>ProfileSystem: Update Bio
    User->>ProfileSystem: Update Photo
    User->>ProfileSystem: Update Social Profiles
    ProfileSystem->>ProfileDB: Save Changes
    User->>ProfileSystem: Click "Save Profile"
```

## 7. Platform-Specific Stablecoin Configuration

```mermaid
graph TB
    subgraph "Platform Detection & Stablecoin Options"
        A[User Entry Point] --> B{Detect Platform}
        
        B -->|MiniPay| C[MiniPay Configuration]
        B -->|Farcaster| D[Farcaster Configuration]
        B -->|Next.js Browser| E[Next.js Configuration]
        
        C --> F[Available: USDT, cUSD, USDC]
        D --> G[Available: USDT, cUSD, cEUR, USDC]
        E --> H[Available: cUSD, cEUR, USDT, Mento Stablecoins]
        
        F --> I[Donation Config Screen]
        G --> I
        H --> I
        
        I --> J[Select Amount per Swipe]
        I --> K[Select Stablecoin]
        I --> L[Set Confirmation Threshold]
        
        J --> M[Start Swiping]
        K --> M
        L --> M
    end
```

## 8. Project Interaction & Social Engagement Flow

```mermaid
sequenceDiagram
    participant User
    participant ProjectCard
    participant SocialSystem
    participant ActivityTracker
    participant ExternalLink
    participant ProfileDB
    
    User->>ProjectCard: View Project Card
    
    %% Social Interactions
    alt Click Heart (Favorite)
        User->>ProjectCard: Click Heart Icon
        ProjectCard->>ActivityTracker: Record Favorite
        ActivityTracker->>ProfileDB: Save to User Favorites
        ProjectCard->>User: Show Visual Feedback (416 → 417 likes)
    end
    
    alt Click Comment
        User->>ProjectCard: Click Comment Icon (60 comments)
        ProjectCard->>SocialSystem: Open Comment Modal
        User->>SocialSystem: Type Personalized Message
        SocialSystem->>ActivityTracker: Save Comment
        ActivityTracker->>ProfileDB: Link Comment to Project & User
        SocialSystem->>User: Show Comment Posted
    end
    
    alt Click Social Media Links
        User->>ProjectCard: Click Twitter/X Icon
        ProjectCard->>ExternalLink: Open Project Twitter
        ExternalLink->>User: Navigate to External Platform
    else
        User->>ProjectCard: Click Website Icon
        ProjectCard->>ExternalLink: Open Project Website
    end
    
    alt View Project Details
        User->>ProjectCard: Click Project Name/Image
        ProjectCard->>SocialSystem: Open Project Full Profile
        SocialSystem->>User: Show Full Description & Links
        Note over User,SocialSystem: Display: KarmaGap Profile<br/>Project Images, Videos, Team Info
    end
```

## 9. Complete System Architecture (Updated)

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
        J --> N[Donation Config System]
        J --> O[Activity Tracker]
        J --> P[Profile System]
        L --> Q[Wallet Integration]
        M --> R[Identity Verification]
        K --> S[Card Randomizer]
        K --> T[Project Database]
        K --> U[Admin System]
        K --> V[Trending Engine]
        K --> W[Boost System]
        K --> X[Cart System]
        K --> Y[Social System]
    end
    
    subgraph "Blockchain Layer"
        Z[Celo Network] --> AA[Smart Contracts]
        AA --> AB[Donation Contract]
        AA --> AC[Project Registry]
        AA --> AD[Mento Integration]
        AA --> AE[Self Protocol Integration]
        AA --> AF[Rewards Contract]
        AA --> AG[Boost Payment Contract]
    end
    
    subgraph "External Services"
        AH[Karma GAP] --> AI[Impact Tracking]
        AJ[Divvi] --> AK[Impact Analytics]
        AL[IPFS/Phala/Filecoin] --> AM[Decentralized Storage]
    end
    
    subgraph "Data Storage"
        AN[Private Project Database] --> AO[Project Cards]
        AN --> AP[Project Images]
        AN --> AQ[Project URLs]
        AN --> AR[Project Public Wallets]
        AS[Activity Database] --> AT[User Stats]
        AS --> AU[Donation History]
        AS --> AV[Comments & Favorites]
        AW[Centralized Randomizer] --> S
    end
    
    T --> AN
    S --> AW
    U --> AC
    AB --> AH
    AC --> AL
    AD --> AJ
    AE --> M
    AF --> AI
    O --> AS
    P --> AS
    Y --> AS
```

## 10. Reward System Flow

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
    SwipePad->>User: Award 10 Ranking Points
    
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

## 11. Project Submission Flow

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
    SwipePad->>ProjectSubmitter: Show Project Registration Form
    ProjectSubmitter->>SwipePad: Fill Project Details
    Note over ProjectSubmitter,SwipePad: Name, Representative, Type<br/>Description, Social Links<br/>Zora/Lens/Farcaster URLs<br/>Category, Community, Website<br/>Wallet Address (ENS/Multi-Sig)<br/>Previous Work, Discord
    
    SwipePad->>SelfProtocol: Check Verification Status
    alt Not Verified
        SelfProtocol-->>SwipePad: User Not Verified
        SwipePad->>ProjectSubmitter: Show QR Code for ID Verification
        ProjectSubmitter->>SelfProtocol: Scan QR & Complete Verification
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
    SwipePad->>ProjectSubmitter: Show "Submit Project" Success Confirmation
```
