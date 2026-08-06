-- MoneyFlow Production-Ready Database Schema Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------
-- 1. PROFILES TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- Automatically create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

----------------------------------------------------
-- 2. ACCOUNTS TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'checking' CHECK (type IN ('checking', 'savings', 'credit_card', 'cash', 'investment', 'other')),
  balance NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own accounts"
  ON public.accounts FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own accounts"
  ON public.accounts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own accounts"
  ON public.accounts FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own accounts"
  ON public.accounts FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

----------------------------------------------------
-- 3. CATEGORIES TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for default system categories
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'needs' CHECK (type IN ('needs', 'wants', 'invested', 'income', 'custom')),
  color TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view system and their own categories"
  ON public.categories FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR (select auth.uid()) = user_id);

CREATE POLICY "Users can insert custom categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Pre-populate default system categories
INSERT INTO public.categories (id, user_id, name, type, color, icon) VALUES
  ('00000000-0000-0000-0000-000000000001', NULL, 'Housing & Utilities', 'needs', '#3b82f6', 'home'),
  ('00000000-0000-0000-0000-000000000002', NULL, 'Groceries & Food', 'needs', '#10b981', 'shopping-cart'),
  ('00000000-0000-0000-0000-000000000003', NULL, 'Transportation', 'needs', '#6366f1', 'car'),
  ('00000000-0000-0000-0000-000000000004', NULL, 'Healthcare', 'needs', '#ef4444', 'heart-pulse'),
  ('00000000-0000-0000-0000-000000000005', NULL, 'Dining Out & Entertainment', 'wants', '#f59e0b', 'utensils'),
  ('00000000-0000-0000-0000-000000000006', NULL, 'Shopping & Personal', 'wants', '#ec4899', 'shopping-bag'),
  ('00000000-0000-0000-0000-000000000007', NULL, 'Subscriptions', 'wants', '#8b5cf6', 'film'),
  ('00000000-0000-0000-0000-000000000008', NULL, 'Stocks & ETFs', 'invested', '#14b8a6', 'trending-up'),
  ('00000000-0000-0000-0000-000000000009', NULL, 'Retirement / 401(k)', 'invested', '#06b6d4', 'piggy-bank'),
  ('00000000-0000-0000-0000-000000000010', NULL, 'Emergency Fund', 'invested', '#84cc16', 'shield-check'),
  ('00000000-0000-0000-0000-000000000011', NULL, 'Salary & Wages', 'income', '#22c55e', 'dollar-sign'),
  ('00000000-0000-0000-0000-000000000012', NULL, 'Freelance & Business', 'income', '#10b981', 'briefcase')
ON CONFLICT (id) DO NOTHING;

----------------------------------------------------
-- 4. TRANSACTIONS TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  amount NUMERIC(14,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  bucket TEXT NOT NULL DEFAULT 'needs' CHECK (bucket IN ('needs', 'wants', 'invested', 'income', 'other')),
  date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  note TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending')),
  is_loan BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON public.transactions FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

----------------------------------------------------
-- 5. BUDGETS TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- Format: 'YYYY-MM'
  target_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  needs_ratio NUMERIC(5,2) DEFAULT 50.00,
  wants_ratio NUMERIC(5,2) DEFAULT 30.00,
  invested_ratio NUMERIC(5,2) DEFAULT 20.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own budgets"
  ON public.budgets FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own budgets"
  ON public.budgets FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own budgets"
  ON public.budgets FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own budgets"
  ON public.budgets FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

----------------------------------------------------
-- 6. LOAN ENTRIES TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loan_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('given', 'received', 'repaid')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'repaid', 'closed')),
  due_date TIMESTAMPTZ,
  note TEXT,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.loan_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own loan entries"
  ON public.loan_entries FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own loan entries"
  ON public.loan_entries FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own loan entries"
  ON public.loan_entries FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own loan entries"
  ON public.loan_entries FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE TRIGGER update_loan_entries_updated_at
  BEFORE UPDATE ON public.loan_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

----------------------------------------------------
-- 7. MONTHLY SUMMARIES TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.monthly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- Format: 'YYYY-MM'
  total_income NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  total_expense NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  total_needs NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  total_wants NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  total_invested NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  budget_remaining NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  ai_insight TEXT,
  model_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (user_id, month)
);

ALTER TABLE public.monthly_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own monthly summaries"
  ON public.monthly_summaries FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own monthly summaries"
  ON public.monthly_summaries FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own monthly summaries"
  ON public.monthly_summaries FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own monthly summaries"
  ON public.monthly_summaries FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE TRIGGER update_monthly_summaries_updated_at
  BEFORE UPDATE ON public.monthly_summaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

----------------------------------------------------
-- 8. LOGS TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own logs"
  ON public.logs FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own logs"
  ON public.logs FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

----------------------------------------------------
-- INDEXES FOR PERFORMANCE
----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_accounts_user ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON public.budgets(user_id, month);
CREATE INDEX IF NOT EXISTS idx_loan_entries_user ON public.loan_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_summaries_user_month ON public.monthly_summaries(user_id, month);
CREATE INDEX IF NOT EXISTS idx_logs_user ON public.logs(user_id);
