-- Create a table for public profiles
create table profiles (
  wallet_address text primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  twitter_handle text,
  farcaster_handle text,
  is_self_verified boolean default false,
  badges jsonb default '[]'::jsonb,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( true ); -- In a real app, you'd verify the wallet signature

create policy "Users can update own profile."
  on profiles for update
  using ( true ); -- In a real app, you'd verify the wallet signature
