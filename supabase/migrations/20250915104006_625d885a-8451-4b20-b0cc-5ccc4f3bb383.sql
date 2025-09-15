-- Fix critical security issue: Enable RLS on supply_chain_news table and create appropriate policies
ALTER TABLE supply_chain_news ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read supply chain news (it's public information)
CREATE POLICY "Anyone can view supply chain news" 
ON supply_chain_news 
FOR SELECT 
USING (true);

-- Only allow inserting through edge functions or admin users
CREATE POLICY "Only edge functions can insert news" 
ON supply_chain_news 
FOR INSERT 
WITH CHECK (
  -- Allow if called from edge function context (service role)
  auth.role() = 'service_role'
  OR 
  -- Or if user is admin
  (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ))
);

-- Prevent updates/deletes except by admins
CREATE POLICY "Only admins can modify news" 
ON supply_chain_news 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can delete news" 
ON supply_chain_news 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);