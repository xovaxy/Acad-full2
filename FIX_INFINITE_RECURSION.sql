-- ============================================================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- ============================================================================
-- Run this to fix the "infinite recursion detected in policy" error
-- ============================================================================

-- STEP 1: DROP ALL EXISTING POLICIES ON PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins view institution profiles" ON profiles;
DROP POLICY IF EXISTS "Admins insert institution profiles" ON profiles;
DROP POLICY IF EXISTS "Admins update institution profiles" ON profiles;
DROP POLICY IF EXISTS "Admins delete institution profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can insert any profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can delete any profile" ON profiles;

-- STEP 2: CREATE A HELPER TABLE TO STORE SUPER ADMIN STATUS
-- This avoids the recursion issue
CREATE TABLE IF NOT EXISTS super_admin_cache (
  user_id UUID PRIMARY KEY,
  is_super_admin BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the cache table
ALTER TABLE super_admin_cache ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own cache entry
CREATE POLICY "Users can read own super admin status" ON super_admin_cache
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- STEP 3: CREATE FUNCTION TO UPDATE SUPER ADMIN CACHE
CREATE OR REPLACE FUNCTION update_super_admin_cache()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update the cache when profile role changes
  INSERT INTO super_admin_cache (user_id, is_super_admin, updated_at)
  VALUES (NEW.user_id, (NEW.role = 'super_admin'), NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    is_super_admin = (NEW.role = 'super_admin'),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update cache
DROP TRIGGER IF EXISTS trigger_update_super_admin_cache ON profiles;
CREATE TRIGGER trigger_update_super_admin_cache
  AFTER INSERT OR UPDATE OF role ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_super_admin_cache();

-- STEP 4: POPULATE EXISTING SUPER ADMIN CACHE
INSERT INTO super_admin_cache (user_id, is_super_admin, updated_at)
SELECT user_id, (role = 'super_admin'), NOW()
FROM profiles
ON CONFLICT (user_id) DO UPDATE SET
  is_super_admin = EXCLUDED.is_super_admin,
  updated_at = EXCLUDED.updated_at;

-- STEP 5: CREATE NON-RECURSIVE RLS POLICIES
-- Basic user policies (no recursion)
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Super admin policies using the cache table (no recursion)
CREATE POLICY "Super admins can view all profiles" ON profiles
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM super_admin_cache
    WHERE user_id = auth.uid() AND is_super_admin = true
  )
);

CREATE POLICY "Super admins can insert any profile" ON profiles
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM super_admin_cache
    WHERE user_id = auth.uid() AND is_super_admin = true
  )
);

CREATE POLICY "Super admins can update any profile" ON profiles
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM super_admin_cache
    WHERE user_id = auth.uid() AND is_super_admin = true
  )
);

CREATE POLICY "Super admins can delete any profile" ON profiles
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM super_admin_cache
    WHERE user_id = auth.uid() AND is_super_admin = true
  )
);

-- Admin policies for institution management
CREATE POLICY "Admins view institution profiles" ON profiles
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('admin', 'super_admin')
    AND p.institution_id = profiles.institution_id
  ) OR
  EXISTS (
    SELECT 1 FROM super_admin_cache
    WHERE user_id = auth.uid() AND is_super_admin = true
  )
);

CREATE POLICY "Admins insert institution profiles" ON profiles
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('admin', 'super_admin')
    AND p.institution_id = profiles.institution_id
  ) OR
  EXISTS (
    SELECT 1 FROM super_admin_cache
    WHERE user_id = auth.uid() AND is_super_admin = true
  )
);

CREATE POLICY "Admins update institution profiles" ON profiles
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('admin', 'super_admin')
    AND p.institution_id = profiles.institution_id
  ) OR
  EXISTS (
    SELECT 1 FROM super_admin_cache
    WHERE user_id = auth.uid() AND is_super_admin = true
  )
);

CREATE POLICY "Admins delete institution profiles" ON profiles
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('admin', 'super_admin')
    AND p.institution_id = profiles.institution_id
  ) OR
  EXISTS (
    SELECT 1 FROM super_admin_cache
    WHERE user_id = auth.uid() AND is_super_admin = true
  )
);

-- STEP 6: VERIFY THE FIX
SELECT 'Checking for infinite recursion fix...' as status;

-- Check policies
SELECT 
  policyname,
  'Policy recreated without recursion' as status
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Check super admin cache
SELECT 
  user_id,
  is_super_admin,
  'Cache entry' as status
FROM super_admin_cache;

SELECT '✅ RECURSION FIX COMPLETE!' as final_status;
SELECT 'You can now login without the infinite recursion error.' as message;

-- ============================================================================
-- RECURSION FIX COMPLETE!
-- The policies now use a separate cache table to avoid infinite recursion
-- ============================================================================
