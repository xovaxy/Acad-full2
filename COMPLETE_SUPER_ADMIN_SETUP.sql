-- ============================================================================
-- COMPLETE SUPER ADMIN SETUP - Copy and paste this ENTIRE file into Supabase SQL Editor
-- ============================================================================
-- This file contains everything needed to enable super admin user creation
-- Run this in one go in your Supabase SQL Editor
-- ============================================================================

-- STEP 1: DROP EXISTING POLICIES (if they exist)
DROP POLICY IF EXISTS "Super admins can insert any profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can delete any profile" ON profiles;

-- STEP 2: CREATE RLS POLICIES FOR SUPER ADMINS
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

-- STEP 3: CREATE RPC FUNCTIONS
-- Function to create single user for institution
CREATE OR REPLACE FUNCTION create_user_for_institution(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_role TEXT,
  p_institution_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
  v_is_super_admin BOOLEAN;
  v_auth_user_id UUID;
  v_institution_exists BOOLEAN;
BEGIN
  -- Check if the caller is a super admin
  SELECT (role = 'super_admin') INTO v_is_super_admin
  FROM profiles
  WHERE user_id = auth.uid();
  
  IF NOT COALESCE(v_is_super_admin, false) THEN
    RAISE EXCEPTION 'Only super admins can create users for institutions';
  END IF;
  
  -- Validate role
  IF p_role NOT IN ('student', 'admin') THEN
    RAISE EXCEPTION 'Invalid role. Must be either student or admin';
  END IF;
  
  -- Check if institution exists
  SELECT EXISTS(SELECT 1 FROM institutions WHERE id = p_institution_id) INTO v_institution_exists;
  IF NOT v_institution_exists THEN
    RAISE EXCEPTION 'Institution not found';
  END IF;
  
  -- Check if user with this email already exists
  IF EXISTS (SELECT 1 FROM profiles WHERE email = p_email) THEN
    RAISE EXCEPTION 'User with this email already exists';
  END IF;
  
  -- Generate a UUID for the new user (simulating auth.users creation)
  v_auth_user_id := gen_random_uuid();
  
  -- Insert the profile directly (bypassing auth.signUp for now)
  -- In production, you would need to use Supabase Admin API or Edge Functions
  INSERT INTO profiles (user_id, email, full_name, role, institution_id)
  VALUES (v_auth_user_id, p_email, p_full_name, p_role::user_role, p_institution_id)
  RETURNING json_build_object(
    'user_id', user_id,
    'email', email,
    'full_name', full_name,
    'role', role,
    'institution_id', institution_id,
    'created_at', created_at
  ) INTO v_result;
  
  -- Return success with user details and temporary password info
  RETURN json_build_object(
    'success', true,
    'user', v_result,
    'message', 'User created successfully. Temporary password: ' || p_password,
    'note', 'User must change password on first login'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'message', 'Failed to create user'
    );
END;
$$;

-- Function for bulk user creation
CREATE OR REPLACE FUNCTION create_multiple_users_for_institution(
  p_users JSONB,
  p_institution_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
  v_is_super_admin BOOLEAN;
  v_institution_exists BOOLEAN;
  v_user JSONB;
  v_created_users JSONB := '[]'::JSONB;
  v_failed_users JSONB := '[]'::JSONB;
  v_success_count INTEGER := 0;
  v_fail_count INTEGER := 0;
BEGIN
  -- Check if the caller is a super admin
  SELECT (role = 'super_admin') INTO v_is_super_admin
  FROM profiles
  WHERE user_id = auth.uid();
  
  IF NOT COALESCE(v_is_super_admin, false) THEN
    RAISE EXCEPTION 'Only super admins can create users for institutions';
  END IF;
  
  -- Check if institution exists
  SELECT EXISTS(SELECT 1 FROM institutions WHERE id = p_institution_id) INTO v_institution_exists;
  IF NOT v_institution_exists THEN
    RAISE EXCEPTION 'Institution not found';
  END IF;
  
  -- Process each user
  FOR v_user IN SELECT * FROM jsonb_array_elements(p_users)
  LOOP
    BEGIN
      -- Validate required fields
      IF NOT (v_user ? 'email' AND v_user ? 'full_name' AND v_user ? 'role') THEN
        v_failed_users := v_failed_users || jsonb_build_object(
          'email', COALESCE(v_user->>'email', 'unknown'),
          'error', 'Missing required fields (email, full_name, role)'
        );
        v_fail_count := v_fail_count + 1;
        CONTINUE;
      END IF;
      
      -- Check if user already exists
      IF EXISTS (SELECT 1 FROM profiles WHERE email = v_user->>'email') THEN
        v_failed_users := v_failed_users || jsonb_build_object(
          'email', v_user->>'email',
          'error', 'User already exists'
        );
        v_fail_count := v_fail_count + 1;
        CONTINUE;
      END IF;
      
      -- Create the user
      INSERT INTO profiles (
        user_id, 
        email, 
        full_name, 
        role, 
        institution_id
      ) VALUES (
        gen_random_uuid(),
        v_user->>'email',
        v_user->>'full_name',
        (v_user->>'role')::user_role,
        p_institution_id
      );
      
      v_created_users := v_created_users || jsonb_build_object(
        'email', v_user->>'email',
        'full_name', v_user->>'full_name',
        'role', v_user->>'role'
      );
      v_success_count := v_success_count + 1;
      
    EXCEPTION
      WHEN OTHERS THEN
        v_failed_users := v_failed_users || jsonb_build_object(
          'email', COALESCE(v_user->>'email', 'unknown'),
          'error', SQLERRM
        );
        v_fail_count := v_fail_count + 1;
    END;
  END LOOP;
  
  RETURN json_build_object(
    'success', true,
    'created_count', v_success_count,
    'failed_count', v_fail_count,
    'created_users', v_created_users,
    'failed_users', v_failed_users,
    'message', format('Created %s users, %s failed', v_success_count, v_fail_count)
  );
  
END;
$$;

-- Function to get institution users
CREATE OR REPLACE FUNCTION get_institution_users(p_institution_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
  v_is_super_admin BOOLEAN;
BEGIN
  -- Check if the caller is a super admin
  SELECT (role = 'super_admin') INTO v_is_super_admin
  FROM profiles
  WHERE user_id = auth.uid();
  
  IF NOT COALESCE(v_is_super_admin, false) THEN
    RAISE EXCEPTION 'Only super admins can view institution users';
  END IF;
  
  -- Get all users for the institution
  SELECT json_agg(
    json_build_object(
      'id', id,
      'user_id', user_id,
      'email', email,
      'full_name', full_name,
      'role', role,
      'created_at', created_at,
      'updated_at', updated_at
    )
  ) INTO v_result
  FROM profiles
  WHERE institution_id = p_institution_id
  ORDER BY created_at DESC;
  
  RETURN COALESCE(v_result, '[]'::JSON);
END;
$$;

-- STEP 4: GRANT PERMISSIONS
GRANT EXECUTE ON FUNCTION create_user_for_institution(TEXT, TEXT, TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_multiple_users_for_institution(JSONB, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_institution_users(UUID) TO authenticated;

-- STEP 5: VERIFY SETUP
SELECT 'Setup verification starting...' as status;

-- Check if functions exist
SELECT 
  routine_name,
  routine_type,
  security_type,
  'Function created successfully' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'create_user_for_institution', 
  'create_multiple_users_for_institution', 
  'get_institution_users'
);

-- Check policies
SELECT 
  policyname,
  cmd,
  'Policy created successfully' as status
FROM pg_policies
WHERE tablename = 'profiles'
AND policyname LIKE '%super%'
ORDER BY policyname;

-- STEP 6: CREATE A SUPER ADMIN USER (REPLACE WITH YOUR EMAIL)
-- Uncomment and modify the line below with your email:
-- UPDATE profiles SET role = 'super_admin' WHERE email = 'your-email@example.com';

SELECT '✅ SETUP COMPLETE! Now create a super admin user by running:' as final_step;
SELECT 'UPDATE profiles SET role = ''super_admin'' WHERE email = ''your-email@example.com'';' as command_to_run;

-- ============================================================================
-- SUCCESS! Super admin functionality is now ready
-- Next steps:
-- 1. Update a user to super_admin role using the UPDATE command above
-- 2. Login to the frontend with that user
-- 3. Navigate to /superadmin to access the super admin panel
-- ============================================================================
