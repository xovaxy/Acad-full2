-- INSTRUCTIONS: 
-- 1. Go to your Supabase Dashboard 
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire SQL code below
-- 4. Click "Run" to execute

-- Create function for admins and super admins to update user passwords directly
CREATE OR REPLACE FUNCTION update_user_password(
    p_user_id UUID,
    p_new_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_role TEXT;
    target_user_role TEXT;
    current_user_institution_id UUID;
    target_user_institution_id UUID;
BEGIN
    -- Get current user's role and institution
    SELECT role, institution_id INTO current_user_role, current_user_institution_id
    FROM profiles 
    WHERE user_id = auth.uid();
    
    -- Get target user's role and institution
    SELECT role, institution_id INTO target_user_role, target_user_institution_id
    FROM profiles 
    WHERE user_id = p_user_id;
    
    -- Check if current user has permission
    IF current_user_role IS NULL THEN
        RETURN json_build_object('error', 'User not authenticated');
    END IF;
    
    -- Super admins can change any password
    IF current_user_role = 'super_admin' THEN
        -- Update password using auth.users table
        UPDATE auth.users 
        SET 
            encrypted_password = crypt(p_new_password, gen_salt('bf')),
            updated_at = now()
        WHERE id = p_user_id;
        
        RETURN json_build_object('success', true, 'message', 'Password updated successfully');
    END IF;
    
    -- Admins can only change passwords in their institution
    IF current_user_role = 'admin' THEN
        -- Check if target user is in same institution
        IF current_user_institution_id != target_user_institution_id THEN
            RETURN json_build_object('error', 'Not authorized to update this user');
        END IF;
        
        -- Admins cannot change super admin passwords
        IF target_user_role = 'super_admin' THEN
            RETURN json_build_object('error', 'Cannot update super admin password');
        END IF;
        
        -- Update password using auth.users table
        UPDATE auth.users 
        SET 
            encrypted_password = crypt(p_new_password, gen_salt('bf')),
            updated_at = now()
        WHERE id = p_user_id;
        
        RETURN json_build_object('success', true, 'message', 'Password updated successfully');
    END IF;
    
    -- Default: not authorized
    RETURN json_build_object('error', 'Not authorized to update passwords');
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_user_password(UUID, TEXT) TO authenticated;

-- Test the function (optional - you can run this to test)
-- SELECT update_user_password('your-test-user-id-here', 'newpassword123');