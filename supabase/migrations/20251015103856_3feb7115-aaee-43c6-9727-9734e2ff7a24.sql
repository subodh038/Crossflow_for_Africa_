-- Drop the insecure policies that allow all operations
DROP POLICY IF EXISTS "Allow all transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow all recipients" ON public.recipients;

-- Create secure policies for transactions table
-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (user_address = lower(current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Users can insert their own transactions
CREATE POLICY "Users can insert own transactions" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (user_address = lower(current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Create secure policies for recipients table
-- Users can view their own recipients
CREATE POLICY "Users can view own recipients" 
  ON public.recipients 
  FOR SELECT 
  USING (user_address = lower(current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Users can insert their own recipients
CREATE POLICY "Users can insert own recipients" 
  ON public.recipients 
  FOR INSERT 
  WITH CHECK (user_address = lower(current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Users can update their own recipients
CREATE POLICY "Users can update own recipients" 
  ON public.recipients 
  FOR UPDATE 
  USING (user_address = lower(current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Users can delete their own recipients
CREATE POLICY "Users can delete own recipients" 
  ON public.recipients 
  FOR DELETE 
  USING (user_address = lower(current_setting('request.jwt.claims', true)::json->>'wallet_address'));