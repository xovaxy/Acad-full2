-- ============================================================================
-- ACADIRA COMBINED MIGRATIONS - ALL 15 FILES IN ONE
-- Created: October 5, 2025
-- Run this single file to set up the complete database
-- ============================================================================

-- MIGRATION 1: Initial Schema
CREATE TYPE user_role AS ENUM ('admin', 'student');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled');

CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  subscription_status subscription_status DEFAULT 'active',
  subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL,
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE curriculum (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  subject TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Chat',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  question_count INTEGER DEFAULT 1,
  topic TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('curriculum', 'curriculum', false) ON CONFLICT (id) DO NOTHING;

-- MIGRATION 3: Add super_admin role
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';

-- MIGRATION 11: Helper Functions
CREATE OR REPLACE FUNCTION is_admin_user() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_institution_id() RETURNS UUID AS $$
BEGIN
  RETURN (SELECT institution_id FROM profiles WHERE user_id = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- MIGRATION 12: Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL UNIQUE REFERENCES institutions(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'professional' CHECK (plan IN ('trial', 'professional', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired', 'cancelled')),
  monthly_question_limit INTEGER NOT NULL DEFAULT 10000,
  current_usage INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  last_renewed TIMESTAMP WITH TIME ZONE,
  suspension_reason TEXT,
  suspended_at TIMESTAMP WITH TIME ZONE,
  suspended_by UUID REFERENCES auth.users(id),
  storage_limit_gb DECIMAL(10,2) NOT NULL DEFAULT 10.0,
  storage_used_gb DECIMAL(10,2) NOT NULL DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_subscriptions_institution_id ON subscriptions(institution_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Subscription Functions
CREATE OR REPLACE FUNCTION reset_monthly_usage() RETURNS void AS $$
BEGIN
  UPDATE subscriptions SET current_usage = 0, updated_at = NOW() 
  WHERE DATE_PART('day', NOW() - last_renewed) >= 30 AND status = 'active';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_subscription_usage(inst_id UUID) RETURNS void AS $$
BEGIN
  UPDATE subscriptions SET current_usage = current_usage + 1, updated_at = NOW() 
  WHERE institution_id = inst_id AND status = 'active';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION auto_expire_subscriptions() RETURNS void AS $$
BEGIN
  UPDATE subscriptions SET status = 'expired', updated_at = NOW() 
  WHERE end_date < NOW() AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_subscription_expiration() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_date < NOW() AND NEW.status = 'active' THEN
    NEW.status = 'expired';
    NEW.updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_subscription_expiration BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION check_subscription_expiration();

CREATE OR REPLACE FUNCTION increment_storage_usage(inst_id UUID, size_mb DECIMAL) RETURNS void AS $$
BEGIN
  UPDATE subscriptions SET storage_used_gb = storage_used_gb + (size_mb / 1024.0), updated_at = NOW() WHERE institution_id = inst_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_storage_percentage(inst_id UUID) RETURNS DECIMAL AS $$
DECLARE usage_percent DECIMAL;
BEGIN
  SELECT (storage_used_gb / storage_limit_gb * 100) INTO usage_percent FROM subscriptions WHERE institution_id = inst_id;
  RETURN COALESCE(usage_percent, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS POLICIES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins view institution profiles" ON profiles FOR SELECT USING (is_admin_user() AND institution_id = get_user_institution_id());
CREATE POLICY "Admins insert institution profiles" ON profiles FOR INSERT WITH CHECK (is_admin_user() AND institution_id = get_user_institution_id());
CREATE POLICY "Admins update institution profiles" ON profiles FOR UPDATE USING (is_admin_user() AND institution_id = get_user_institution_id());
CREATE POLICY "Admins delete institution profiles" ON profiles FOR DELETE USING (is_admin_user() AND institution_id = get_user_institution_id());

CREATE POLICY "Authenticated view institutions" ON institutions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admins create institutions" ON institutions FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin'));
CREATE POLICY "Admins update own institution" ON institutions FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND (role = 'admin' OR role = 'super_admin') AND institution_id = id));

CREATE POLICY "Users view institution curriculum" ON curriculum FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND institution_id = curriculum.institution_id));
CREATE POLICY "Admins insert curriculum" ON curriculum FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin' AND institution_id = curriculum.institution_id));
CREATE POLICY "Admins delete curriculum" ON curriculum FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin' AND institution_id = curriculum.institution_id));

CREATE POLICY "Students view own sessions" ON chat_sessions FOR SELECT TO authenticated USING (student_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin' AND institution_id = chat_sessions.institution_id));
CREATE POLICY "Students create own sessions" ON chat_sessions FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students delete own sessions" ON chat_sessions FOR DELETE TO authenticated USING (student_id = auth.uid());

CREATE POLICY "Students view own messages" ON chat_messages FOR SELECT TO authenticated USING (session_id IN (SELECT id FROM chat_sessions WHERE student_id = auth.uid()));
CREATE POLICY "Students insert own messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (session_id IN (SELECT id FROM chat_sessions WHERE student_id = auth.uid()));

CREATE POLICY "Admins view institution analytics" ON usage_analytics FOR SELECT TO authenticated USING (institution_id IN (SELECT institution_id FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "System insert analytics" ON usage_analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view institution subscription" ON subscriptions FOR SELECT TO authenticated USING (institution_id IN (SELECT institution_id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "Super admins view all subscriptions" ON subscriptions FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin'));
CREATE POLICY "Super admins update subscriptions" ON subscriptions FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin'));
CREATE POLICY "Super admins insert subscriptions" ON subscriptions FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin'));
CREATE POLICY "Super admins delete subscriptions" ON subscriptions FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin'));

CREATE POLICY "Admins upload curriculum" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'curriculum' AND EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Authenticated view curriculum" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'curriculum');
CREATE POLICY "Admins delete curriculum files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'curriculum' AND EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create subscriptions for existing institutions
INSERT INTO subscriptions (institution_id, plan, status, monthly_question_limit)
SELECT id, 'professional', 'active', 10000 FROM institutions WHERE id NOT IN (SELECT institution_id FROM subscriptions);

-- Grant permissions
GRANT EXECUTE ON FUNCTION increment_subscription_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_storage_usage(UUID, DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION get_storage_percentage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION auto_expire_subscriptions() TO authenticated;

-- Run initial expiration check
SELECT auto_expire_subscriptions();

-- ============================================================================
-- Setup complete! All 15 migrations combined successfully.
-- ============================================================================
