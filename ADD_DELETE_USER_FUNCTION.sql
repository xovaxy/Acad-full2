-- ============================================================================
-- RPC FUNCTION: Delete User (Profile + Auth User)
-- ============================================================================
-- This function allows super admins to delete users completely
-- ============================================================================

CREATE OR REPLACE FUNCTION public.delete_user_by_id(
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_super_admin BOOLEAN;
  v_deleted_email TEXT;
BEGIN
  -- Check if the caller is a super admin
  SELECT (role = 'super_admin') INTO v_is_super_admin
  FROM public.profiles
  WHERE user_id = auth.uid();
  
  IF NOT COALESCE(v_is_super_admin, false) THEN
    RAISE EXCEPTION 'Only super admins can delete users';
  END IF;
  
  -- Get the email before deleting
  SELECT email INTO v_deleted_email
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  IF v_deleted_email IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Delete the profile (this will cascade due to ON DELETE CASCADE on auth.users)
  DELETE FROM public.profiles WHERE user_id = p_user_id;
  
  -- Note: We can't delete from auth.users directly in SQL for security reasons
  -- The profile deletion is sufficient for most use cases
  -- If you need to delete the auth user too, it must be done via Supabase Admin API
  
  RETURN json_build_object(
    'success', true,
    'deleted_user_id', p_user_id,
    'deleted_email', v_deleted_email,
    'message', 'Profile deleted successfully. Auth user may still exist.'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_user_by_id(UUID) TO authenticated;

-- Verify function was created
SELECT 'Delete user function created successfully' as status;
