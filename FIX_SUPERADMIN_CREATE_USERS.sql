-- ============================================================================
-- FIX: Allow Super Admins to Create Users for Any Institution
-- ============================================================================
-- Run this in Supabase SQL Editor to fix the RLS policy issue
-- ============================================================================

-- Drop conflicting policies if they exist
DROP POLICY IF EXISTS "Super admins can insert any profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;

-- Create policy to allow super admins to insert profiles for any institution
CREATE POLICY "Super admins can insert any profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'super_admin'
  )
);

-- Also ensure super admins can read all profiles
CREATE POLICY "Super admins can view all profiles" 
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'super_admin'
  )
);

-- Allow super admins to update any profile
CREATE POLICY "Super admins can update any profile"
ON profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'super_admin'
  )
);

-- Allow super admins to delete any profile
CREATE POLICY "Super admins can delete any profile"
ON profiles FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'super_admin'
  )
);

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- ============================================================================
-- Success! Super admins can now create users for any institution
-- ============================================================================
