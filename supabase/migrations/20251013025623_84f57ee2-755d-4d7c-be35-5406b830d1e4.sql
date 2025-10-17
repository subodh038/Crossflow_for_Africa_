-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT NOT NULL,
  transaction_hash TEXT UNIQUE NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  token TEXT NOT NULL,
  chain_id INTEGER NOT NULL,
  chain_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  gas_fee NUMERIC,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  block_number BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create recipients table
CREATE TABLE public.recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address TEXT NOT NULL,
  recipient_address TEXT NOT NULL,
  nickname TEXT,
  transaction_count INTEGER DEFAULT 1,
  last_transaction_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_address, recipient_address)
);

-- Enable Row Level Security
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipients DISABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow all operations for simplicity (wallet-based app)
CREATE POLICY "Allow all transactions" ON public.transactions FOR ALL USING (true);
CREATE POLICY "Allow all recipients" ON public.recipients FOR ALL USING (false);

-- Indexes for performance
CREATE INDEX idx_transactions_user_address ON public.transactions(user_address);
CREATE INDEX idx_transactions_timestamp ON public.transactions(timestamp DESC);
CREATE INDEX idx_transactions_hash ON public.transactions(transaction_hash);
CREATE INDEX idx_recipients_user_address ON public.recipients(user_address);

-- Enable realtime for transactions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.recipients;