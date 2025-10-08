-- ============================================================================
-- EMERGENCY FIX - DISABLE RLS COMPLETELY FOR DEVELOPMENT
-- ============================================================================
-- This will allow you to login and test the super admin functionality
-- You can re-enable and fix RLS properly later
-- ============================================================================

-- Disable RLS on profiles table
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all policies to clean up
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
DROP POLICY IF EXISTS "profiles_basic_access" ON profiles;
DROP POLICY IF EXISTS "profiles_super_admin_access" ON profiles;

-- Clean up cache table if it exists
DROP TABLE IF EXISTS super_admin_cache CASCADE;

SELECT '🚨 EMERGENCY FIX APPLIED!' as status;
SELECT 'RLS is now DISABLED on profiles table.' as warning;
SELECT 'You can now login and test super admin functionality.' as message;
SELECT 'Remember to re-enable RLS for production!' as important_note;

-- ============================================================================
-- RLS DISABLED - YOU CAN NOW LOGIN AND TEST
-- ============================================================================
