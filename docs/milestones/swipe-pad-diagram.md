1. User Entry Points & Authentication Flow
2. graph TB
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

   2. User Journey Flow
   3. sequenceDiagram
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

   
