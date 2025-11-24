export interface Project {
  id: string;
  category: 'builders' | 'karmahq' | 'eco';
  name: string;
  description: string;
  wallet_address: `0x${string}`;
  image_url: string;
  logo_url?: string;
  social_links: {
    twitter?: string;
    github?: string;
    website?: string;
    farcaster?: string;
  };
  tags: string[];
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Boost {
  id: string;
  project_id: string;
  amount_usd: number;
  token_address: `0x${string}`;
  duration_days: number;
  created_at: string;
  expires_at: string;
  active: boolean;
}

export interface Donation {
  id: string;
  project_id: string;
  donor_address: `0x${string}`;
  amount: string;
  token_address: `0x${string}`;
  transaction_hash: `0x${string}`;
  created_at: string;
  verified: boolean;
}

export interface UserProfile {
  id: string;
  wallet_address: `0x${string}`;
  is_verified: boolean;
  age_verified: boolean;
  nationality?: string;
  farcaster_fid?: number;
  created_at: string;
  updated_at: string;
}

export interface FrameState {
  currentProjectIndex: number;
  category: 'builders' | 'karmahq' | 'eco';
  userAddress?: `0x${string}`;
  farcasterFid?: number;
  seed: string;
}
