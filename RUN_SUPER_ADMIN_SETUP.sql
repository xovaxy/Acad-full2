-- ============================================================================
-- SUPER ADMIN SETUP - Run this to enable super admin user creation
-- ============================================================================
-- IMPORTANT: Copy and paste each section manually in Supabase SQL Editor
-- The \i command doesn't work in Supabase - you need to copy file contents
-- ============================================================================

-- Step 1: Copy and paste the ENTIRE contents of FIX_SUPERADMIN_CREATE_USERS.sql
-- Step 2: Copy and paste the ENTIRE contents of SUPER_ADMIN_CREATE_USERS.sql

-- Step 3: Verify setup
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'create_user_for_institution', 
  'create_multiple_users_for_institution', 
  'get_institution_users',
  'delete_user_by_id'
);

-- Step 4: Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
AND policyname LIKE '%super%'
ORDER BY policyname;

-- ============================================================================
-- MANUAL SETUP INSTRUCTIONS
-- ============================================================================

/*
If the \i commands don't work, copy and paste the contents of these files manually:

1. First run: FIX_SUPERADMIN_CREATE_USERS.sql
   - This sets up the RLS policies for super admins

2. Then run: SUPER_ADMIN_CREATE_USERS.sql  
   - This creates the RPC functions for user creation

3. Verify by running the SELECT statements above

4. Test by creating a super admin user:
   - Go to Supabase Auth > Users
   - Create a new user manually
   - Then run this SQL to make them super admin:

UPDATE profiles 
SET role = 'super_admin' 
WHERE email = 'your-super-admin@email.com';

5. Now you can use the frontend to create students and admins!
*/

-- ============================================================================
-- SUCCESS! Super admin functionality is now ready
-- ============================================================================
