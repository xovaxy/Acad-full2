-- ============================================================================
-- CREATE OR FIX SUPER ADMIN USER
-- ============================================================================
-- Use this script to check if your super admin exists and create one if needed
-- ============================================================================

-- STEP 1: Check if you have any users in auth.users
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- STEP 2: Check if those users have profiles
SELECT 
  p.id,
  p.user_id,
  p.email,
  p.full_name,
  p.role,
  p.institution_id,
  u.email as auth_email
FROM profiles p
LEFT JOIN auth.users u ON u.id = p.user_id
ORDER BY p.created_at DESC;

-- ============================================================================
-- IF YOU SEE A USER IN auth.users BUT NO PROFILE, RUN THIS:
-- ============================================================================

-- Replace 'your-email@example.com' with the email you're trying to login with
DO $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = 'your-email@example.com'; -- CHANGE THIS EMAIL
  
  IF user_uuid IS NOT NULL THEN
    -- Check if profile exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = user_uuid) THEN
      -- Create the profile
      INSERT INTO profiles (user_id, email, full_name, role, institution_id)
      VALUES (
        user_uuid,
        'your-email@example.com', -- CHANGE THIS EMAIL
        'Super Admin',             -- CHANGE THIS NAME
        'super_admin',
        NULL  -- Super admin doesn't need institution_id
      );
      
      RAISE NOTICE 'Super admin profile created successfully!';
    ELSE
      RAISE NOTICE 'Profile already exists for this user';
    END IF;
  ELSE
    RAISE NOTICE 'User not found in auth.users. Please create the user first.';
  END IF;
END $$;

-- ============================================================================
-- IF YOU DON'T HAVE A USER IN auth.users AT ALL, RUN THIS:
-- ============================================================================

-- This creates a new super admin user from scratch
-- CHANGE THE EMAIL AND PASSWORD BELOW!

DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Note: You need to use Supabase Dashboard → Authentication → Users → Add User
  -- Or use the auth.admin API
  
  RAISE NOTICE 'To create a new user, use Supabase Dashboard:';
  RAISE NOTICE '1. Go to Authentication → Users → Add User';
  RAISE NOTICE '2. Email: your-email@example.com';
  RAISE NOTICE '3. Password: YourSecurePassword123!';
  RAISE NOTICE '4. Auto Confirm: YES';
  RAISE NOTICE '5. Then run the profile creation query above';
END $$;

-- ============================================================================
-- ALTERNATIVE: Manual Profile Creation (if you know the user_id)
-- ============================================================================

-- If you already created a user in Supabase Dashboard, get their ID and run:
/*
INSERT INTO profiles (user_id, email, full_name, role, institution_id)
VALUES (
  'paste-user-uuid-here',  -- Get this from auth.users query above
  'your-email@example.com',
  'Super Admin',
  'super_admin',
  NULL
);
*/

-- ============================================================================
-- VERIFY THE SUPER ADMIN WAS CREATED
-- ============================================================================

SELECT 
  p.user_id,
  p.email,
  p.full_name,
  p.role,
  u.email as auth_email,
  u.email_confirmed_at
FROM profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE p.role = 'super_admin';

-- You should see your super admin user here!

-- ============================================================================
-- TROUBLESHOOTING: Check RLS Policies
-- ============================================================================

-- Check if RLS is enabled (should be true)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Check RLS policies on profiles table
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- If you see no policies for super_admin, run FIX_SUPERADMIN_CREATE_USERS.sql

-- ============================================================================
-- SUCCESS!
-- ============================================================================
-- After running this, try logging in at http://localhost:8081/login
-- Use the Institution tab with your email and password
-- ============================================================================
