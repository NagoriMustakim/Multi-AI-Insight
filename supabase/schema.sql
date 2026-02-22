-- ============================================================
-- CompetitorGap AI — Supabase Database Schema
-- Run this SQL in your Supabase SQL editor to set up tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ANALYSIS USAGE TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS analysis_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  market VARCHAR(255),
  report_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on user_id for usage count queries
CREATE INDEX IF NOT EXISTS idx_analysis_usage_user_id ON analysis_usage(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Backend bypasses via service_role key
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_usage ENABLE ROW LEVEL SECURITY;

-- Policies (service_role key bypasses RLS automatically)
-- These policies are for anon/authenticated roles if ever needed

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view own analyses"
  ON analysis_usage FOR SELECT
  USING (auth.uid() = user_id);
