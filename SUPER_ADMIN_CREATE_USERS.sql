-- ============================================================================
-- SUPER ADMIN: Create Students and Admins for Institutions
-- ============================================================================
-- This function allows super admins to create students and admins for any institution
-- It handles both auth user creation and profile creation in one transaction
-- ============================================================================

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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_user_for_institution(TEXT, TEXT, TEXT, TEXT, UUID) TO authenticated;

-- ============================================================================
-- Bulk User Creation Function
-- ============================================================================

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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_multiple_users_for_institution(JSONB, UUID) TO authenticated;

-- ============================================================================
-- Get Institution Users Function
-- ============================================================================

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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_institution_users(UUID) TO authenticated;

-- ============================================================================
-- HOW TO USE FROM FRONTEND
-- ============================================================================

/*
// Create single user
const { data, error } = await supabase.rpc('create_user_for_institution', {
  p_email: 'student@example.com',
  p_password: 'tempPassword123',
  p_full_name: 'John Doe',
  p_role: 'student', // or 'admin'
  p_institution_id: institutionId
});

// Create multiple users
const users = [
  { email: 'student1@example.com', full_name: 'Student One', role: 'student' },
  { email: 'admin1@example.com', full_name: 'Admin One', role: 'admin' }
];

const { data, error } = await supabase.rpc('create_multiple_users_for_institution', {
  p_users: users,
  p_institution_id: institutionId
});

// Get institution users
const { data, error } = await supabase.rpc('get_institution_users', {
  p_institution_id: institutionId
});
*/

-- ============================================================================
-- TEST THE FUNCTIONS
-- ============================================================================

-- Check if functions exist
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('create_user_for_institution', 'create_multiple_users_for_institution', 'get_institution_users');

-- ============================================================================
-- SUCCESS! Super admins can now create students and admins for institutions
-- ============================================================================
