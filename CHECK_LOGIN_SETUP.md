# Login Setup Checklist

## ✅ Server Status
- Server running at: http://localhost:8081/
- Supabase configured: YES

## 🚨 Critical Steps to Enable Login

### Step 1: Apply Database Migrations (REQUIRED)

Your database needs tables to store users. Run the migrations:

**Option A: Supabase Dashboard** (Easiest)
1. Open: https://supabase.com/dashboard/project/jjnszcptwhzlrxbvbgtp
2. Click: **SQL Editor** in left sidebar
3. Open file: `ALL_MIGRATIONS_COMBINED.sql`
4. Copy entire content
5. Paste in SQL Editor
6. Click **"Run"**

**Option B: Using individual migration files**
Apply each file in supabase/migrations/ folder in order

### Step 2: Verify Tables Exist

After running migrations, check in Supabase Dashboard → Database → Tables:
- institutions
- profiles
- curriculum
- chat_sessions
- chat_messages
- usage_analytics
- subscriptions

### Step 3: Create Test User

**Option A: Use existing user from acadira prototype**
If you already have users in this Supabase project from the "acadira prototype" folder, use those credentials.

**Option B: Create new admin user**
Run this in Supabase SQL Editor:

```sql
-- Create example institution
INSERT INTO institutions (name, email, subscription_status, subscription_start_date, subscription_end_date)
VALUES ('Test Academy', 'admin@testacademy.com', 'active', NOW(), NOW() + INTERVAL '1 year')
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Create admin user (you'll need to do this via Supabase Auth UI)
-- Go to: Authentication → Users → Add User
-- Email: admin@testacademy.com
-- Password: Admin123!@#
-- Then get the user ID and run:

-- Replace USER_ID_HERE with the actual user ID from Auth
INSERT INTO profiles (user_id, email, full_name, role, institution_id)
VALUES (
  'USER_ID_HERE',
  'admin@testacademy.com',
  'Test Admin',
  'admin',
  (SELECT id FROM institutions WHERE email = 'admin@testacademy.com')
);
```

**Option C: Via Script**
```bash
cd "c:\Users\Admin\Desktop\acadira prototype\code"
npm run create-admin
```

### Step 4: Test Login

1. Open: http://localhost:8081/admin-login
2. Enter credentials:
   - Email: admin@testacademy.com (or your existing email)
   - Password: Admin123!@# (or your existing password)
3. Click Login

## 🐛 Troubleshooting

### Error: "Invalid login credentials"
- **Cause:** User doesn't exist in database
- **Fix:** Create user using steps above

### Error: "This account is not registered as..."
- **Cause:** User exists but profile with correct role doesn't exist
- **Fix:** Insert profile record with correct role

### Error: Network error / Connection refused
- **Cause:** Supabase credentials wrong or migrations not applied
- **Fix:** Verify .env file and apply migrations

### Page just refreshes / No error shown
- **Cause:** Usually means profiles table doesn't exist
- **Fix:** Apply migrations

### Check Browser Console (F12)
Open Developer Tools (F12) and look at Console tab for specific errors.

## 📋 Quick Test Commands

Check if migrations are applied (in Supabase SQL Editor):
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should return: chat_messages, chat_sessions, curriculum, institutions, profiles, subscriptions, usage_analytics
```

Check if you have any users:
```sql
-- Check institutions
SELECT * FROM institutions;

-- Check profiles
SELECT * FROM profiles;
```

## 🎯 Current Status

Your Supabase Project: https://jjnszcptwhzlrxbvbgtp.supabase.co
Server: http://localhost:8081/

**Next Action:** Apply migrations if you haven't already!
