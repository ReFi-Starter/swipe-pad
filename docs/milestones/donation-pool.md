# Donation Pool Implementation

## Overview

The Donation Pool smart contract provides a secure and transparent way for users to create and donate to charitable projects. It's built on Celo and integrated with MiniPay, allowing for micro-donations with various stablecoins.

## Core Features

### Two Funding Models

1. **All or Nothing** (Kickstarter model):
   - Creator only receives funds if the funding goal is met
   - Donors can claim refunds if the goal isn't reached by deadline
   - Best for projects with specific funding thresholds

2. **Keep What You Raise**:
   - Creator receives all donations regardless of goal achievement
   - No refunds available to donors if goal isn't met
   - Best for ongoing projects or when partial funding is useful

### Project Creation

Creators can specify:
- Funding goal
- Timeframe (start and end dates)
- Project details (name, description, URLs for more info and images)
- Funding model (All or Nothing or Keep What You Raise)
- Token for donations (e.g., cUSD, cEUR)

### Donation Flow

1. User discovers a project
2. User decides on donation amount
3. Transaction is completed through MiniPay
4. Donation is recorded on-chain
5. Project funding progress is updated

### Fund Management

- Successful projects: Creator can withdraw funds after goal is reached
- Keep What You Raise: Creator can withdraw collected funds after deadline
- Failed All or Nothing projects: Donors can claim refunds during grace period

### Security Features

- Dispute mechanism for problematic projects
- Admin oversight with ability to pause contract in emergencies
- Timelock periods for withdrawals and refunds
- Platform fees to sustain operations

## Technical Implementation

### Contract Structure

- **IDonationPool**: Interface defining the contract's API
- **DonationPool**: Main contract implementing the donation platform
- **Helper Libraries**: Specialized functions for different aspects of the contract

### State Management

Projects can be in one of four states:
- **ACTIVE**: Accepting donations
- **SUCCESSFUL**: Funding goal reached
- **FAILED**: Deadline reached without meeting goal (for All or Nothing)
- **DELETED**: Project cancelled or removed

### Key Functions

| Function | Purpose |
| --- | --- |
| `createProject` | Create a new donation project |
| `donate` | Donate to a project |
| `withdrawFunds` | Creator withdraws collected funds |
| `claimRefund` | Donor claims refund for failed project |
| `getFundingProgress` | Check project's progress toward goal |

## Integration with SwipePad

The DonationPool contract serves as the backend for the SwipePad mobile dApp, enabling:

1. Simple project discovery with swipe interface
2. One-tap donation experience
3. Real-time funding updates
4. Multi-currency support
5. Transparent fund management

## Security Considerations

- All functions protected with appropriate access control
- Critical operations guarded by pausable mechanism
- Timelock periods prevent immediate withdrawals in disputed cases
- Platform fees deducted at donation time for sustainability
- Dispute resolution mechanism handled by admin role

## Future Enhancements

1. Multi-sig admin functions for greater decentralization
2. Milestone-based funding release
3. Donation matching campaigns
4. Integration with on-chain identity and reputation systems
5. Support for recurring donations 