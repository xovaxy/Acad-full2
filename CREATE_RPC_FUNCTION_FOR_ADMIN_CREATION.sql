    -- ============================================================================
    -- RPC FUNCTION: Create Admin User Profile (Called from Frontend)
    -- ============================================================================
    -- This function allows super admins to create admin profiles via RPC
    -- It bypasses RLS using SECURITY DEFINER
    -- ============================================================================

    CREATE OR REPLACE FUNCTION create_admin_profile(
    p_user_id UUID,
    p_email TEXT,
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
    BEGIN
    -- Check if the caller is a super admin
    SELECT (role = 'super_admin') INTO v_is_super_admin
    FROM profiles
    WHERE user_id = auth.uid();
    
    IF NOT COALESCE(v_is_super_admin, false) THEN
        RAISE EXCEPTION 'Only super admins can create admin profiles';
    END IF;
    
    -- Check if profile already exists
    IF EXISTS (SELECT 1 FROM profiles WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'Profile already exists for this user';
    END IF;
    
    -- Insert the profile
    INSERT INTO profiles (user_id, email, full_name, role, institution_id)
    VALUES (p_user_id, p_email, p_full_name, p_role, p_institution_id)
    RETURNING json_build_object(
        'user_id', user_id,
        'email', email,
        'full_name', full_name,
        'role', role,
        'institution_id', institution_id
    ) INTO v_result;
    
    RETURN v_result;
    END;
    $$;

    -- Grant execute permission
    GRANT EXECUTE ON FUNCTION create_admin_profile(UUID, TEXT, TEXT, TEXT, UUID) TO authenticated;

    -- ============================================================================
    -- HOW TO USE FROM FRONTEND
    -- ============================================================================

    /*
    // In your TypeScript code:
    const { data, error } = await supabase.rpc('create_admin_profile', {
    p_user_id: authData.user.id,
    p_email: 'admin@institution.edu',
    p_full_name: 'Admin Name',
    p_role: 'admin',
    p_institution_id: institutionId
    });
    */

    -- ============================================================================
    -- TEST THE FUNCTION
    -- ============================================================================

    -- Check if function exists
    SELECT 
    routine_name,
    routine_type,
    security_type
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name = 'create_admin_profile';

    -- ============================================================================
    -- SUCCESS! You can now call this function from the frontend
    -- ============================================================================
