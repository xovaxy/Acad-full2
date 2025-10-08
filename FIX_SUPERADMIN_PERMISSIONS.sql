-- ============================================================================
-- FIX: Allow Super Admins to Create Users (Without Recursion)
-- ============================================================================
-- This allows super admins to create profiles for other users
-- ============================================================================

-- STEP 1: Create a function that checks if user is super admin
-- This uses SECURITY DEFINER to bypass RLS and avoid recursion
CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT role = 'super_admin'
    FROM public.profiles
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$;

-- STEP 2: Add super admin policies for INSERT
DROP POLICY IF EXISTS "Super admins can insert any profile" ON profiles;
CREATE POLICY "Super admins can insert any profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  auth.is_super_admin() = true
);

-- STEP 3: Add super admin policies for SELECT
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
CREATE POLICY "Super admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.is_super_admin() = true
);

-- STEP 4: Add super admin policies for UPDATE
DROP POLICY IF EXISTS "Super admins can update any profile" ON profiles;
CREATE POLICY "Super admins can update any profile"
ON profiles FOR UPDATE
TO authenticated
USING (
  auth.is_super_admin() = true
);

-- STEP 5: Add super admin policies for DELETE
DROP POLICY IF EXISTS "Super admins can delete any profile" ON profiles;
CREATE POLICY "Super admins can delete any profile"
ON profiles FOR DELETE
TO authenticated
USING (
  auth.is_super_admin() = true
);

-- STEP 6: Grant execute permission on the function
GRANT EXECUTE ON FUNCTION auth.is_super_admin() TO authenticated;

-- ============================================================================
-- VERIFY THE POLICIES
-- ============================================================================

SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- ============================================================================
-- TEST THE FUNCTION
-- ============================================================================

-- Test if the super admin check works
SELECT auth.is_super_admin() as is_super_admin;

-- If this returns true, you're a super admin!

-- ============================================================================
-- SUCCESS! Super admins can now create users without recursion
-- ============================================================================
