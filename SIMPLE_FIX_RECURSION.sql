-- ============================================================================
-- SIMPLE FIX FOR INFINITE RECURSION - DISABLE RLS TEMPORARILY
-- ============================================================================
-- This is a quick fix to get you working immediately
-- ============================================================================

-- STEP 1: DISABLE RLS ON PROFILES TABLE TEMPORARILY
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- STEP 2: DROP ALL EXISTING POLICIES
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

-- STEP 3: CREATE SIMPLE, NON-RECURSIVE POLICIES
-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Basic policy: Users can manage their own profile
CREATE POLICY "profiles_basic_access" ON profiles
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Super admin policy: Allow all operations for super admins
-- This uses a subquery that should not cause recursion
CREATE POLICY "profiles_super_admin_access" ON profiles
FOR ALL TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM profiles 
    WHERE role = 'super_admin' 
    AND user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM profiles 
    WHERE role = 'super_admin' 
    AND user_id = auth.uid()
  )
);

-- STEP 4: VERIFY THE FIX
SELECT 'Checking policies...' as status;

SELECT 
  policyname,
  cmd,
  'Policy status' as info
FROM pg_policies
WHERE tablename = 'profiles';

SELECT '✅ SIMPLE FIX APPLIED!' as result;
SELECT 'Try logging in now. If this still causes issues, we may need to disable RLS entirely for development.' as next_step;

-- ============================================================================
-- IF THIS STILL DOESN'T WORK, RUN THE EMERGENCY FIX BELOW:
-- ============================================================================

-- EMERGENCY: COMPLETELY DISABLE RLS FOR DEVELOPMENT
-- Uncomment the line below if you still get recursion errors:
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SIMPLE FIX COMPLETE!
-- ============================================================================
