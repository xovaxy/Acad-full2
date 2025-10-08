-- ============================================================================
-- FIX: RLS Infinite Recursion on Profiles Table
-- ============================================================================
-- This fixes the "infinite recursion detected in policy" error
-- ============================================================================

-- STEP 1: Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view institution profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage institution profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can insert any profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can delete any profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;

-- STEP 2: Create simple, non-recursive policies

-- Policy 1: Users can ALWAYS view their own profile (no recursion)
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Users can update their own profile (no recursion)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Allow INSERT for new users (for signup)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Service role can do everything (for admin operations)
-- This allows backend/service operations to bypass RLS
CREATE POLICY "Service role full access"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- ALTERNATIVE: Disable RLS temporarily for testing
-- ============================================================================
-- If you're still having issues, you can temporarily disable RLS:
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- 
-- WARNING: Only do this for local development/testing!
-- Re-enable it once you've verified everything works:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: Verify policies are correct
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- ============================================================================
-- STEP 4: Test if you can query profiles
-- ============================================================================

-- This should now work without infinite recursion
SELECT * FROM profiles WHERE user_id = auth.uid();

-- ============================================================================
-- SUCCESS! Now try logging in again
-- ============================================================================
