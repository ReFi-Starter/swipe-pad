-- SwipePad Neon Database Initialization Script
-- This script initializes the complete database schema for SwipePad

-- User Schema
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

CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  icon TEXT NOT NULL, -- Emoji or other representation
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  criteria TEXT, -- Description of how to unlock
  points INT DEFAULT 10
);

CREATE TABLE user_settings (
  user_id INT PRIMARY KEY REFERENCES users(id),
  currency VARCHAR(10) DEFAULT 'CENTS',
  language VARCHAR(5) DEFAULT 'en',
  region VARCHAR(5) DEFAULT 'US',
  default_donation_amount DECIMAL(10,6) DEFAULT 0.01,
  auto_batch BOOLEAN DEFAULT TRUE
);

-- Project and Metadata Schema
CREATE TABLE project_metadata (
  project_id VARCHAR(100) PRIMARY KEY, -- ID from blockchain contract
  category VARCHAR(50) NOT NULL,
  tags TEXT[], -- Additional tags
  sponsor_boosted BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- Emoji or other identifier
  is_active BOOLEAN DEFAULT TRUE
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

CREATE TABLE community_note_votes (
  id SERIAL PRIMARY KEY,
  note_id INT REFERENCES community_notes(id),
  user_id INT REFERENCES users(id),
  is_upvote BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(note_id, user_id)
);

-- Social Schema
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
  data JSONB, -- Additional data specific to the activity type
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cache Schema
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
  token_address VARCHAR(42),
  donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimizing frequent queries
CREATE INDEX idx_user_wallet ON users(wallet_address);
CREATE INDEX idx_project_creator ON cached_projects(creator_address);
CREATE INDEX idx_donation_donor ON cached_donations(donor_address);
CREATE INDEX idx_donation_project ON cached_donations(project_id);
CREATE INDEX idx_community_tags_project ON community_tags(project_id);
CREATE INDEX idx_community_notes_project ON community_notes(project_id);
CREATE INDEX idx_user_activity_user ON user_activities(user_id);
CREATE INDEX idx_user_activity_type ON user_activities(activity_type);

-- Initial data for categories
INSERT INTO categories (name, description, icon) VALUES
('Education', 'Educational projects and initiatives', '🎓'),
('Climate', 'Climate change and environmental projects', '🌍'),
('Health', 'Healthcare and wellness initiatives', '🏥'),
('Wildlife', 'Animal conservation and protection', '🦁'),
('Open Source', 'Open source software and public goods', '💻'),
('SocFi', 'Social finance and impact investing', '💰'),
('Art', 'Art and creative projects', '🎨'),
('Community', 'Local community initiatives', '🏙️');

-- Initial data for achievements
INSERT INTO achievements (icon, title, description, criteria, points) VALUES
('🚀', 'First Donation', 'Made your first micro-donation', 'Make at least one donation', 10),
('🔥', 'Streak Master', 'Donated for 7 days in a row', 'Maintain a 7-day donation streak', 25),
('💰', 'Big Spender', 'Donated a total of $10', 'Reach $10 in total donations', 30),
('🌍', 'Global Impact', 'Donated to projects in 5 different categories', 'Donate to 5 different categories', 40),
('👑', 'Leaderboard Champion', 'Reached the top 3 on the leaderboard', 'Rank among the top 3 donors of the month', 50),
('🔍', 'Community Guardian', 'Submit 10 verified tags on projects', 'Add 10 tags that get verified', 20),
('⭐', 'Trusted Tagger', 'Have 50 of your tags confirmed by others', 'Get 50 tags confirmed by other users', 35);

-- Triggers for automation

-- Update reputation when receiving votes on community notes
CREATE OR REPLACE FUNCTION update_reputation_on_note_vote()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_upvote THEN
    UPDATE users SET reputation = reputation + 2 WHERE id = (SELECT author_id FROM community_notes WHERE id = NEW.note_id);
  ELSE
    UPDATE users SET reputation = reputation - 1 WHERE id = (SELECT author_id FROM community_notes WHERE id = NEW.note_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER note_vote_trigger
AFTER INSERT ON community_note_votes
FOR EACH ROW
EXECUTE FUNCTION update_reputation_on_note_vote();

-- Update tag count
CREATE OR REPLACE FUNCTION update_tag_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_tags 
  SET count = count + 1
  WHERE project_id = NEW.project_id AND text = NEW.text AND NEW.id <> id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tag_count_trigger
AFTER INSERT ON community_tags
FOR EACH ROW
EXECUTE FUNCTION update_tag_count();

-- Update user level based on reputation
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reputation >= 150 THEN
    NEW.level = 'Champion';
  ELSIF NEW.reputation >= 100 THEN
    NEW.level = 'Supporter';
  ELSIF NEW.reputation >= 50 THEN
    NEW.level = 'Contributor';
  ELSIF NEW.reputation >= 20 THEN
    NEW.level = 'Beginner';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_level_trigger
BEFORE UPDATE ON users
FOR EACH ROW
WHEN (OLD.reputation IS DISTINCT FROM NEW.reputation)
EXECUTE FUNCTION update_user_level(); 