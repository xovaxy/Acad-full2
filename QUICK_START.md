# 🚀 Quick Start Guide

Get the integrated Acadira + Code platform running in minutes!

---

## ⚡ Fast Track (5 Minutes)

### Step 1: Install Dependencies (1 min)
```bash
cd "c:\Users\Admin\Desktop\acadira prototype\code"
npm install
```

### Step 2: Environment Setup (1 min)
Create `.env` file in the root of the code folder:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

**Where to find these values:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" → Use as `VITE_SUPABASE_URL`
5. Copy "anon public" key → Use as `VITE_SUPABASE_PUBLISHABLE_KEY`

### Step 3: Apply Database Migrations (2 min)

**Option A: Using Supabase Dashboard (Easiest)**
1. Go to Supabase Dashboard → SQL Editor
2. Copy content from each migration file in `supabase/migrations/` folder
3. Run them in order (sorted by filename)

**Option B: Using Supabase CLI**
```bash
# If you have Supabase CLI installed
supabase db push
```

### Step 4: Start Development Server (30 sec)
```bash
npm run dev
```

### Step 5: Open Browser
Navigate to `http://localhost:5173`

---

## 🎯 What You Can Access Immediately

### Marketing Pages (Original Theme) ✅
- **http://localhost:5173/** - Home page
- **http://localhost:5173/features** - Features
- **http://localhost:5173/pricing** - Pricing
- **http://localhost:5173/about** - About
- **http://localhost:5173/contact** - Contact
- **http://localhost:5173/demo** - Demo

### Acadira Application ✅
- **http://localhost:5173/student-login** - Student login
- **http://localhost:5173/admin-login** - Admin login

---

## 👥 Creating Your First Users

### Option 1: Run Setup Script (Automated)
```bash
npm run create-admin
```
This creates:
- Example institution
- Admin user: `admin@example.com` (password: `admin123`)

### Option 2: Manual Creation via Super Admin

1. **Create Super Admin in Supabase:**
   - Go to Supabase Dashboard → SQL Editor
   - Run:
   ```sql
   -- Create super admin user
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, role)
   VALUES ('superadmin@acadira.com', crypt('SuperAdmin123!', gen_salt('bf')), now(), 'authenticated');
   
   -- Add super admin profile
   INSERT INTO profiles (id, email, role)
   SELECT id, email, 'super_admin'
   FROM auth.users
   WHERE email = 'superadmin@acadira.com';
   ```

2. **Login at:** http://localhost:5173/admin-login
3. **Navigate to:** http://localhost:5173/superadmin
4. **Create institutions, admins, and students** via the UI

---

## 🤖 Setting Up AI Tutor (Optional)

### Step 1: Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Copy the key

### Step 2: Deploy Edge Function
```bash
# Deploy the chat-tutor function
supabase functions deploy chat-tutor

# Set the secret
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Test AI Tutor
1. Login as student
2. Navigate to student dashboard
3. Start chatting with AI tutor

---

## 📂 Project Structure

```
code/
├── src/
│   ├── pages/
│   │   ├── Index.tsx              # Original home page
│   │   ├── Features.tsx           # Original features
│   │   ├── Student.tsx            # NEW: Student dashboard
│   │   ├── Admin.tsx              # NEW: Admin dashboard
│   │   ├── admin/                 # NEW: Admin pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Curriculum.tsx
│   │   │   ├── Students.tsx
│   │   │   └── ...
│   │   └── superadmin/            # NEW: Super admin pages
│   │       ├── Dashboard.tsx
│   │       ├── Institutions.tsx
│   │       └── ...
│   ├── components/
│   │   ├── Header.tsx             # Original
│   │   ├── Footer.tsx             # Original
│   │   ├── admin/                 # NEW
│   │   └── superadmin/            # NEW
│   ├── services/                  # NEW: API services
│   │   ├── authService.ts
│   │   ├── chatService.ts
│   │   └── ...
│   └── integrations/
│       └── supabase/
│           ├── client.ts
│           └── types.ts           # Updated
├── supabase/
│   ├── migrations/                # NEW: 15 migration files
│   └── functions/                 # NEW: Edge functions
│       ├── chat-tutor/
│       └── process-curriculum/
├── scripts/                       # NEW: Setup scripts
└── *.md                          # Documentation files
```

---

## 🔑 Default Test Credentials

After running `npm run create-admin`:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`
- Role: Admin
- Institution: Example Institution

**Student User (Create via Admin Panel):**
- Create students through `/admin/students`
- Set password during creation

---

## 🧪 Testing the Integration

### Test 1: Original Theme Pages ✅
Visit these URLs and verify original theme is intact:
- http://localhost:5173/
- http://localhost:5173/features
- http://localhost:5173/pricing

### Test 2: Student Portal ✅
1. Create student via admin panel
2. Login at http://localhost:5173/student-login
3. Test AI tutor chat

### Test 3: Admin Panel ✅
1. Login at http://localhost:5173/admin-login
2. Navigate to /admin/curriculum
3. Upload curriculum
4. Manage students

### Test 4: Super Admin Panel ✅
1. Login with super admin account
2. Navigate to http://localhost:5173/superadmin
3. Create institutions
4. Manage subscriptions

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module" errors
**Solution:**
```bash
npm install
# or
npm ci
```

### Issue 2: Supabase connection errors
**Solution:**
- Verify `.env` file exists
- Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
- Ensure values don't have quotes around them

### Issue 3: Login not working
**Solution:**
- Verify migrations are applied
- Check if user exists in Supabase Dashboard → Authentication
- Ensure RLS policies are enabled

### Issue 4: AI Tutor not responding
**Solution:**
- Verify edge function is deployed
- Check GEMINI_API_KEY secret is set
- Check browser console for errors

### Issue 5: 404 on routes
**Solution:**
- Clear browser cache
- Restart dev server
- Verify App.tsx has all routes

---

## 📚 Additional Resources

### Documentation Files
- **INTEGRATION_SUMMARY.md** - Complete integration details
- **VERIFICATION_CHECKLIST.md** - Full verification checklist
- **README.md** - Enhanced readme with all info
- **DEPLOY_EDGE_FUNCTION.md** - Edge function deployment
- **GEMINI_SETUP.md** - AI tutor setup guide

### Troubleshooting Guides
- **AI_TUTOR_FIX.md** - AI tutor issues
- **DEBUG_CONVERSATIONS.md** - Conversation debugging
- **MIGRATION_FIX_INSTRUCTIONS.md** - Migration issues

---

## ✅ Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with Supabase credentials
- [ ] Database migrations applied (all 15 files)
- [ ] Dev server running (`npm run dev`)
- [ ] Original pages load correctly (/, /features, /pricing)
- [ ] Can access admin login (/admin-login)
- [ ] Can access student login (/student-login)
- [ ] Admin/student users created
- [ ] Can login and access dashboards

---

## 🎉 You're Ready!

Your integrated platform is now running with:
- ✅ Original marketing theme preserved
- ✅ Full Acadira educational platform
- ✅ Multi-role authentication
- ✅ Admin & Super Admin panels
- ✅ Student portal with AI tutor
- ✅ Subscription management
- ✅ Complete database schema

**Start Development:**
```bash
npm run dev
```

**Create Admin User:**
```bash
npm run create-admin
```

**Verify Setup:**
```bash
npm run verify-setup
```

---

## 💡 Pro Tips

1. **Use multiple browsers** for testing different roles simultaneously
2. **Check browser console** for any errors during development
3. **Use Supabase Dashboard** to view database tables and auth users
4. **Edge function logs** can be viewed in Supabase Dashboard → Edge Functions
5. **Keep documentation handy** - refer to INTEGRATION_SUMMARY.md for details

---

## 🆘 Need Help?

1. Check **VERIFICATION_CHECKLIST.md** for detailed verification steps
2. Review **INTEGRATION_SUMMARY.md** for integration details
3. Consult specific troubleshooting guides in documentation files
4. Check Supabase Dashboard logs for backend issues
5. Review browser console for frontend errors

---

**Happy Coding! 🚀**
