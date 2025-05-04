# SwipePad Donation Flow

## User Journeys

### Project Creator Journey

```mermaid
flowchart TD
    A[Creator visits SwipePad] -->|Connects MiniPay wallet| B[Navigates to Create Project]
    B --> C[Fills project details form]
    C --> D{Choose Funding Model}
    D -->|All or Nothing| E[Sets funding goal & deadline]
    D -->|Keep What You Raise| E
    E --> F[Submits project]
    F --> G[Project awaits donations]
    G --> H{Funding Goal Met?}
    H -->|Yes| I[Creator withdraws funds]
    H -->|No & All-or-Nothing| J[Project fails]
    H -->|No & Keep-What-You-Raise| K[Creator withdraws partial funds]
    I --> L[Project completed]
    K --> L
```

### Donor Journey

```mermaid
flowchart TD
    A[User opens SwipePad] -->|Connects MiniPay wallet| B[Browses projects]
    B -->|Swipes through projects| C[Views project details]
    C -->|Decides to support| D[Chooses donation amount]
    D --> E[Confirms transaction]
    E --> F[Donation processed on-chain]
    F --> G[User receives confirmation]
    G --> H{Project Status?}
    H -->|Successful| I[Project proceeds]
    H -->|Failed & All-or-Nothing| J[User can claim refund]
    J --> K[Refund processed]
```

### Admin Dispute Resolution Journey

```mermaid
flowchart TD
    A[Report received] -->|Admin reviews| B{Legitimate Issue?}
    B -->|No| C[No action taken]
    B -->|Yes| D[Project flagged as disputed]
    D --> E[Investigation period]
    E --> F{Resolution Decision}
    F -->|In favor of creator| G[Dispute resolved, project continues]
    F -->|In favor of donors| H[Project marked as failed]
    H --> I[Donors can claim refunds]
```

## Complete Donation Lifecycle

```mermaid
stateDiagram-v2
    [*] --> ProjectCreation
    ProjectCreation --> Active: Project published
    Active --> Successful: Funding goal reached
    Active --> Failed: Deadline reached without\nmeeting goal (All-or-Nothing)
    Active --> PartiallyFunded: Deadline reached with\npartial funding (Keep-What-You-Raise)
    Active --> Disputed: Project flagged
    Disputed --> Successful: Resolved in favor of creator
    Disputed --> Failed: Resolved in favor of donors
    Successful --> Completed: Funds withdrawn
    PartiallyFunded --> Completed: Funds withdrawn
    Failed --> Refunded: All refunds claimed
    Completed --> [*]
    Refunded --> [*]
```

## Important Timeframes

| Event | Timeframe | Notes |
|-------|-----------|-------|
| Minimum funding period | 1 day | Projects must run for at least 24 hours |
| Maximum funding period | 180 days | Projects cannot run longer than 6 months |
| Refund grace period | 14 days | Period after project failure when refunds can be claimed |
| Dispute resolution | 7 days | Default time for admin to resolve disputes |

## Technical Flow

```mermaid
sequenceDiagram
    participant Creator
    participant Donor
    participant SwipePad as SwipePad Frontend
    participant MiniPay
    participant DonationPool as DonationPool Contract
    participant Celo as Celo Blockchain
    
    Creator->>SwipePad: Create project
    SwipePad->>MiniPay: Request connection
    MiniPay->>Creator: Approve connection
    Creator->>SwipePad: Submit project details
    SwipePad->>DonationPool: createProject()
    DonationPool->>Celo: Store project data
    Celo-->>SwipePad: Project created event
    
    Donor->>SwipePad: Browse projects
    SwipePad->>DonationPool: getProjectDetails()
    DonationPool-->>SwipePad: Project information
    Donor->>SwipePad: Select donation amount
    SwipePad->>MiniPay: Request payment
    MiniPay->>Donor: Confirm payment
    Donor->>MiniPay: Approve transaction
    MiniPay->>DonationPool: donate()
    DonationPool->>Celo: Record donation
    Celo-->>SwipePad: Donation event
    SwipePad-->>Donor: Confirmation
    
    Note over DonationPool,Celo: After deadline
    
    Creator->>SwipePad: Request withdrawal
    SwipePad->>DonationPool: withdrawFunds()
    DonationPool->>DonationPool: Validate eligibility
    DonationPool->>Celo: Transfer funds
    Celo-->>Creator: Receive funds
``` 