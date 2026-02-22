-- Barnbook schema
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/_/sql

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('owner', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE barns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address JSONB NOT NULL DEFAULT '{}',
  phone TEXT,
  website TEXT,
  email TEXT,
  disciplines TEXT[] DEFAULT '{}',
  amenities JSONB NOT NULL DEFAULT '{}',
  boarding JSONB NOT NULL DEFAULT '{}',
  pricing JSONB NOT NULL DEFAULT '{}',
  trainers JSONB DEFAULT '[]',
  lesson_availability BOOLEAN DEFAULT FALSE,
  horse_breeds TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barn_id UUID REFERENCES barns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX barns_slug_idx ON barns(slug);
CREATE INDEX barns_owner_idx ON barns(owner_id);
CREATE INDEX reviews_barn_idx ON reviews(barn_id);
