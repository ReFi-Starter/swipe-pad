# Data Architecture: Neon Database and Smart Contracts

This document details the planned data architecture for SwipePad, which uses a hybrid approach combining smart contracts on the Celo blockchain with Neon Database (PostgreSQL) for secondary data storage.

## General Architecture

```
┌─────────────────┐            ┌─────────────────┐
│  Smart Contract │            │   Neon Database │
│  (Blockchain)   │            │   (Postgres)    │
├─────────────────┤            ├─────────────────┤
│ • Transactions  │            │ • Social Data   │
│ • Projects      │◄───►│      │ • Metadata      │
│ • Donations     │     │      │ • Cache         │
└─────────────────┘     │      └─────────────────┘
                        │
                  ┌─────┴─────┐
                  │  Frontend │
                  │(Next.js)  │
                  └───────────┘
```

## Design Principles

1. **Selective decentralization**: Critical financial data and core business logic remain on the blockchain.
2. **Cost optimization**: Non-critical or high-volume data are stored in the traditional database.
3. **Enriched social experience**: Social and community features primarily hosted off-chain.
4. **Optimized performance**: Cache and frequently accessed data in PostgreSQL for a smooth user experience.

## 1. Data in Smart Contract (Blockchain)

### DonationPool Contract

```solidity
struct Project {
    uint256 startTime;
    uint256 endTime;
    string projectName;
    string projectDescription;
    string projectUrl;
    string imageUrl;
    uint256 fundingGoal;
    uint8 fundingModel; // 0: ALL_OR_NOTHING, 1: KEEP_WHAT_YOU_RAISE
    address tokenAddress;
    address creator;
    bool isActive;
}

mapping(uint256 => Project) public projects;
mapping(uint256 => uint256) public projectBalances;
mapping(address => uint256[]) public projectsByCreator;
mapping(address => uint256[]) public donationsByUser;
```

### Data to store on blockchain:

- **Essential Project Information**:
  - Project ID
  - Creator address
  - Name and basic description
  - Funding goal
  - Funding model (All or Nothing / Keep What You Raise)
  - Project URL and image URL
  - Campaign start and end dates

- **Financial Data**:
  - Donation records
  - Project balances
  - Token address used

- **States and Authorizations**:
  - Active/inactive project status
  - Fund withdrawal permissions
  - Creator-project relationship

## 2. Data in Neon Database (PostgreSQL)

### Users Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  username VARCHAR(100),
  avatar_url TEXT,
  reputation INT DEFAULT 0,
  streak INT DEFAULT 0,
  level VARCHAR(50) DEFAULT 'Beginner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_public_profile BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  achievement_id INT NOT NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE user_settings (
  user_id INT PRIMARY KEY REFERENCES users(id),
  currency VARCHAR(10) DEFAULT 'CENTS',
  language VARCHAR(5) DEFAULT 'en',
  region VARCHAR(5) DEFAULT 'US',
  default_donation_amount DECIMAL(10,6) DEFAULT 0.01,
  auto_batch BOOLEAN DEFAULT TRUE
);
```

### Project Metadata Schema

```sql
CREATE TABLE project_metadata (
  project_id VARCHAR(100) PRIMARY KEY, -- ID from blockchain contract
  category VARCHAR(50) NOT NULL,
  tags TEXT[], -- Additional tags
  sponsor_boosted BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE community_tags (
  id SERIAL PRIMARY KEY,
  project_id VARCHAR(100) NOT NULL,
  user_id INT REFERENCES users(id),
  text VARCHAR(100) NOT NULL,
  count INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE community_notes (
  id SERIAL PRIMARY KEY,
  project_id VARCHAR(100) NOT NULL,
  author_id INT REFERENCES users(id),
  text TEXT NOT NULL,
  tags TEXT[],
  upvotes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Social Schema

```sql
CREATE TABLE user_connections (
  id SERIAL PRIMARY KEY,
  follower_id INT REFERENCES users(id),
  following_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id)
);

CREATE TABLE user_activities (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  activity_type VARCHAR(50) NOT NULL, -- donation, tag, note, etc.
  project_id VARCHAR(100),
  tx_hash VARCHAR(66), -- Transaction hash if applicable
  points_earned INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Cache Schema

```sql
CREATE TABLE cached_projects (
  id VARCHAR(100) PRIMARY KEY,
  creator_address VARCHAR(42) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT,
  funding_goal DECIMAL(20,0),
  current_funding DECIMAL(20,0) DEFAULT 0,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  funding_model SMALLINT,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cached_donations (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(66) UNIQUE,
  donor_address VARCHAR(42) NOT NULL,
  project_id VARCHAR(100) NOT NULL,
  amount DECIMAL(20,0) NOT NULL,
  donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Data Flows and Integration

### Project Creation

1. User creates a project through the SwipePad interface
2. The application sends a transaction to the `DonationPool` contract with the essential data
3. After confirming the transaction, additional metadata is stored in Neon Database:
   - Detailed category
   - Specific tags
   - Promotion status
4. A record is created in the `cached_projects` table for quick access

### Donation Process

1. User makes a donation through the interface
2. The `donate()` method is executed in the contract
3. After blockchain confirmation:
   - User reputation is updated
   - Activity is recorded
   - Checks if the user unlocks any achievements
   - Donation streak is updated
4. The project cache is updated with the new balance

### Reputation and Social System

The reputation system is based on:

- **Donations**: Amount and frequency
- **Community participation**: Tags and notes contributed
- **Social validation**: Upvotes received on notes
- **Consistency**: Maintaining streaks

User levels advance automatically based on accumulated reputation points.

## 4. Synchronization Services

### Event Indexer

Service that listens to events emitted by the contract:
- `ProjectCreated`
- `DonationReceived`
- `FundsWithdrawn`
- `RefundClaimed`

This service updates the Neon database to keep the data synchronized.

### Cache Service

Periodically updates:
- Project balances
- Project status (active/inactive, completed)
- Cumulative donation totals

## 5. Security Considerations

### Authentication and Authorization

- User authentication via wallet signature (SIWE)
- On-chain verification for critical actions
- Authorization rules in API for operations on Neon Database

### Data Integrity

- Cross-verification between blockchain and database
- Transaction hashes as reference for validation
- Recovery system for inconsistencies

## 6. User Experience and Optimizations

### UI Optimizations

- Pre-loaded data from Neon for fast initial rendering
- Optimistic UI updates before blockchain confirmation
- Fallback to cached data when blockchain connection is slow

### Metrics and Analytics

- User interaction tracking
- Donation pattern analysis
- Social engagement metrics

## 7. Implementation Plan

### Phase 1: Basic Infrastructure

- Neon Database setup
- DonationPool contract deployment on Celo Alfajores
- Implementation of basic user and project schema

### Phase 2: Social Functionality

- Development of reputation system
- Implementation of community notes and tags
- User connections

### Phase 3: Optimizations and Scalability

- Indexing and cache services
- Performance optimizations
- Deployment to mainnet

## Conclusion

This hybrid architecture leverages the strengths of each technology:
- **Blockchain**: For security, immutability, and trust in financial transactions
- **Neon Database**: For social data, metadata, and fast user experience

The result is a platform that provides the trust of blockchain for donations, combined with the rich social experience and performance of a traditional database. 