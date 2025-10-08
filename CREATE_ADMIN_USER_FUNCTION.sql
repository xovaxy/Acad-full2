-- ============================================================================
-- CREATE DATABASE FUNCTION FOR SUPER ADMIN TO CREATE USERS
-- ============================================================================
-- This function bypasses RLS to allow super admins to create admin users
-- ============================================================================

-- Function to check if current user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create admin user for an institution
CREATE OR REPLACE FUNCTION create_admin_user(
  p_email TEXT,
  p_full_name TEXT,
  p_institution_id UUID
)
RETURNS JSON AS $$
DECLARE
  v_user_id UUID;
  v_result JSON;
BEGIN
  -- Check if caller is super admin
  IF NOT is_super_admin() THEN
    RAISE EXCEPTION 'Only super admins can create admin users';
  END IF;

  -- Note: We can't create auth.users from SQL in Supabase
  -- This function only creates the profile
  -- The auth user must be created first via Supabase Admin API
  
  -- Check if a user with this email already has a profile
  SELECT user_id INTO v_user_id
  FROM profiles
  WHERE email = p_email;
  
  IF v_user_id IS NOT NULL THEN
    RAISE EXCEPTION 'Profile already exists for this email';
  END IF;
  
  -- We need to get the user_id from auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found with this email. Create the user in Supabase Auth first.';
  END IF;
  
  -- Create the profile
  INSERT INTO profiles (user_id, email, full_name, role, institution_id)
  VALUES (v_user_id, p_email, p_full_name, 'admin', p_institution_id)
  RETURNING json_build_object(
    'user_id', user_id,
    'email', email,
    'full_name', full_name,
    'role', role,
    'institution_id', institution_id
  ) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_admin_user(TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin() TO authenticated;

-- ============================================================================
-- HOW TO USE THIS FUNCTION
-- ============================================================================

-- Example: Create an admin user for an institution
-- Note: The user must already exist in auth.users (create via Supabase Dashboard first)

/*
SELECT create_admin_user(
  'admin@institution.edu',  -- Email (must match auth.users email)
  'Admin Name',              -- Full name
  'institution-uuid-here'    -- Institution ID
);
*/

-- ============================================================================
-- VERIFY THE FUNCTION WAS CREATED
-- ============================================================================

SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_admin_user', 'is_super_admin');

-- ============================================================================
-- SUCCESS! Super admins can now create admin users
-- ============================================================================
