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
-- SUBSCRIPTION & CREDITS COLUMNS (on users table)
-- ============================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN IF NOT EXISTS available_credits INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS razorpay_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_used BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ;

-- Index for Razorpay customer lookups
CREATE INDEX IF NOT EXISTS idx_users_razorpay_customer ON users(razorpay_customer_id);

-- ============================================================
-- CREDIT LEDGER TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS credit_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,  -- 'subscription_grant', 'add_on_purchase', 'report_usage', 'trial_grant', 'admin_grant'
  description TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id ON credit_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_created ON credit_ledger(created_at DESC);

-- ============================================================
-- ATOMIC CREDIT DEDUCTION FUNCTION
-- Uses FOR UPDATE row lock to prevent race conditions
-- ============================================================

CREATE OR REPLACE FUNCTION deduct_credits(p_user_id UUID, p_amount INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Lock the row to prevent concurrent deductions
  SELECT available_credits INTO current_credits
  FROM users WHERE id = p_user_id FOR UPDATE;

  IF current_credits >= p_amount THEN
    UPDATE users
    SET available_credits = available_credits - p_amount
    WHERE id = p_user_id;

    INSERT INTO credit_ledger (id, user_id, amount, transaction_type, description)
    VALUES (
      uuid_generate_v4(),
      p_user_id,
      -p_amount,
      'report_usage',
      'Deducted for report generation'
    );

    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CREDIT GRANT FUNCTION (for subscriptions, purchases, admin)
-- ============================================================

CREATE OR REPLACE FUNCTION grant_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_payment_id TEXT DEFAULT NULL,
  p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  UPDATE users
  SET available_credits = available_credits + p_amount
  WHERE id = p_user_id
  RETURNING available_credits INTO new_balance;

  INSERT INTO credit_ledger (id, user_id, amount, transaction_type, description, razorpay_payment_id, expires_at)
  VALUES (
    uuid_generate_v4(),
    p_user_id,
    p_amount,
    p_type,
    p_description,
    p_payment_id,
    p_expires_at
  );

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Backend bypasses via service_role key
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;

-- Policies (service_role key bypasses RLS automatically)
-- These policies are for anon/authenticated roles if ever needed

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view own analyses"
  ON analysis_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own credit ledger"
  ON credit_ledger FOR SELECT
  USING (auth.uid() = user_id);
