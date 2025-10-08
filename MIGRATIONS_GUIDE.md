# Database Migrations Guide

## 🎯 Quick Setup - Single File Method

### Option 1: Use Combined Migration (Fastest)

**File:** `ALL_MIGRATIONS_COMBINED.sql`

This single file contains all 15 migrations in the correct order.

#### How to Use:

**Method A: Supabase Dashboard**
1. Go to your Supabase project
2. Navigate to: **SQL Editor**
3. Open `ALL_MIGRATIONS_COMBINED.sql`
4. Copy the entire content
5. Paste into SQL Editor
6. Click **Run**

**Method B: Supabase CLI**
```bash
cd "c:\Users\Admin\Desktop\acadira prototype\code"
supabase db reset
# Or apply directly:
psql -h your-db-host -d your-db-name -f ALL_MIGRATIONS_COMBINED.sql
```

**Method C: Using psql**
```bash
psql "postgresql://user:pass@host:port/database" -f ALL_MIGRATIONS_COMBINED.sql
```

---

## 📋 Alternative: Individual Migration Files

If you prefer to run migrations one by one (for debugging or incremental setup):

### Migration Files (in order):

1. `20251003135235_99d949ae-b835-4dd4-8a68-c92908c40448.sql` - Initial schema
2. `20251003135236_security_policies.sql` - Security policies
3. `20251003135237_add_super_admin_role.sql` - Super admin role
4. `20251003135237_update_roles_and_policies.sql` - Update roles
5. `20251003135238_update_policies_and_functions.sql` - Update functions
6. `20251003135239_setup_restricted_policies.sql` - Restricted policies
7. `20251003135240_create_example_institution.sql` - Example institution
8. `20251003135241_temp_disable_rls.sql` - Temp disable RLS
9. `20251003135242_reenable_rls.sql` - Re-enable RLS
10. `20251004000001_add_rls_policies.sql` - RLS policies
11. `20251004000002_fix_admin_create_users.sql` - Fix admin create
12. `20251004000003_create_subscriptions.sql` - Subscriptions table
13. `20251004000004_add_suspension_reason.sql` - Suspension fields
14. `20251004000005_auto_expire_subscriptions.sql` - Auto-expire logic
15. `20251004000006_add_storage_tracking.sql` - Storage tracking

### Run them in order:
```bash
# Using Supabase CLI
cd supabase/migrations
for file in *.sql; do
  echo "Running $file..."
  supabase db execute --file $file
done
```

---

## ✅ What Gets Created

### Tables (7 tables)
- `institutions` - Institution/organization data
- `profiles` - User profiles with roles
- `curriculum` - Curriculum files
- `chat_sessions` - Student chat sessions
- `chat_messages` - Chat messages
- `usage_analytics` - Usage tracking
- `subscriptions` - Subscription management

### Enums (2 enums)
- `user_role` - admin, student, super_admin
- `subscription_status` - active, expired, cancelled

### Functions (9 functions)
- `update_updated_at_column()` - Auto-update timestamps
- `is_admin_user()` - Check if user is admin
- `get_user_institution_id()` - Get user's institution
- `reset_monthly_usage()` - Reset monthly usage
- `increment_subscription_usage(UUID)` - Increment usage
- `auto_expire_subscriptions()` - Auto-expire subscriptions
- `check_subscription_expiration()` - Check expiration
- `increment_storage_usage(UUID, DECIMAL)` - Track storage
- `get_storage_percentage(UUID)` - Get storage %

### Storage Buckets
- `curriculum` - For storing curriculum files

### Indexes
- `idx_subscriptions_institution_id` - Fast institution lookup
- `idx_subscriptions_status` - Fast status filtering

### RLS Policies
- **31 Row Level Security policies** across all tables
- Role-based access control (admin, student, super_admin)
- Institution-scoped data access

---

## 🔍 Verification

After running the migration, verify setup:

### 1. Check Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected: 7 tables (institutions, profiles, curriculum, chat_sessions, chat_messages, usage_analytics, subscriptions)

### 2. Check Enums
```sql
SELECT typname 
FROM pg_type 
WHERE typtype = 'e';
```

Expected: user_role, subscription_status

### 3. Check Functions
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;
```

Expected: 9 functions

### 4. Check RLS Policies
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

Expected: 31+ policies

### 5. Check Storage Buckets
```sql
SELECT id, name, public 
FROM storage.buckets;
```

Expected: curriculum bucket

---

## 🐛 Troubleshooting

### Issue: "Type user_role already exists"
**Solution:** The combined file uses `IF NOT EXISTS` for super_admin, but if you run it multiple times, some statements may fail. This is safe to ignore.

### Issue: "Relation already exists"
**Solution:** Drop tables first if you need to re-run:
```sql
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS usage_analytics CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS curriculum CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS institutions CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
```

### Issue: "Permission denied for schema public"
**Solution:** Ensure you're connected as a superuser or the database owner.

### Issue: "Function already exists"
**Solution:** The functions use `CREATE OR REPLACE`, so they should update automatically. If issues persist, drop them first:
```sql
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS is_admin_user CASCADE;
-- etc...
```

---

## 🎯 Next Steps After Migration

1. **Verify Setup**
   ```bash
   npm run verify-setup
   ```

2. **Create Example Institution** (Optional)
   ```bash
   npm run create-admin
   ```
   Creates test institution with admin user

3. **Create Super Admin** (Manual)
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_user_meta_data)
   VALUES (
     'superadmin@acadira.com',
     crypt('YourPassword123!', gen_salt('bf')),
     NOW(),
     '{"full_name": "Super Admin"}'::jsonb
   );
   
   INSERT INTO profiles (user_id, email, full_name, role)
   SELECT id, 'superadmin@acadira.com', 'Super Admin', 'super_admin'
   FROM auth.users WHERE email = 'superadmin@acadira.com';
   ```

4. **Test Login**
   - Student: Create via admin panel
   - Admin: Use created credentials
   - Super Admin: Use created credentials

---

## 📊 Database Schema Overview

```
institutions (organizations)
  ↓
  ├─ profiles (users with roles)
  ├─ curriculum (files)
  ├─ chat_sessions (student chats)
  │   └─ chat_messages
  ├─ usage_analytics
  └─ subscriptions (billing)
```

---

## 🔐 Security Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Role-based access control (admin, student, super_admin)
- ✅ Institution-scoped data isolation
- ✅ Secure functions with SECURITY DEFINER
- ✅ Storage policies for file access
- ✅ Auto-expire subscriptions
- ✅ Usage tracking and limits

---

## 💡 Tips

1. **Backup First:** Always backup before running migrations
2. **Test Environment:** Test in development first
3. **Single Transaction:** The combined file runs as multiple statements
4. **RLS Testing:** Test with different user roles
5. **Monitor Logs:** Check Supabase logs for any errors

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review `MIGRATION_FIX_INSTRUCTIONS.md`
3. Check Supabase Dashboard → Database → Logs
4. Verify RLS policies are correct for your use case

---

**File Location:** `c:\Users\Admin\Desktop\acadira prototype\code\ALL_MIGRATIONS_COMBINED.sql`

**Ready to run:** ✅ Yes

**Estimated time:** ~30 seconds

**Safe to re-run:** ⚠️ Partial (uses CREATE OR REPLACE, but may have conflicts)
