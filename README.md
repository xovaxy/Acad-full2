# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d714dece-f2ea-4f1f-a179-575d5ec5a7f2

## 🎓 Acadira Integration

This project has been integrated with the complete Acadira educational platform logic while preserving the original theme and landing pages. The integration includes:

### **Features Integrated**
- ✅ **Complete Database Schema** - All 15 database migrations from Acadira
- ✅ **Subscription Management** - Auto-expire subscriptions, storage tracking
- ✅ **Admin Dashboard** - Full admin panel with curriculum, students, conversations management
- ✅ **Student Portal** - AI-powered tutor interface for students
- ✅ **Super Admin Panel** - Multi-institution management system
- ✅ **Edge Functions** - AI chat tutor and curriculum processing
- ✅ **Authentication** - Separate login flows for students and admins
- ✅ **Services Layer** - Complete backend integration services

### **Routes Available**

**Marketing/Landing Pages** (Original Theme Preserved)
- `/` - Home page
- `/how-it-works` - How it works page
- `/features` - Features page
- `/pricing` - Pricing page
- `/about` - About page
- `/contact` - Contact page
- `/demo` - Demo page

**Acadira Application Routes** (New)
- `/student-login` - Student authentication
- `/admin-login` - Admin authentication
- `/student` - Student dashboard with AI tutor
- `/admin` - Admin dashboard (with nested routes)
  - `/admin/curriculum` - Curriculum management
  - `/admin/students` - Student management
  - `/admin/conversations` - Conversation tracking
  - `/admin/questions` - Questions management
  - `/admin/institution` - Institution settings
- `/superadmin` - Super admin dashboard (with nested routes)
  - `/superadmin/institutions` - Institutions management
  - `/superadmin/users` - Users management
  - `/superadmin/subscriptions` - Subscriptions management
  - `/superadmin/settings` - System settings

### **Setup Instructions**

1. **Install Dependencies**
   ```sh
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file with:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

3. **Run Database Migrations**
   Apply all migrations in the `supabase/migrations` folder in order

4. **Deploy Edge Functions**
   See `DEPLOY_EDGE_FUNCTION.md` for deployment instructions

5. **Start Development Server**
   ```sh
   npm run dev
   ```

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run create-admin` - Create example institution and admin
- `npm run verify-setup` - Verify database setup
- `npm run setup-institution` - Setup institution and profile

### **Documentation**
Additional documentation files have been copied for reference:
- `AI_TUTOR_FIX.md` - AI tutor troubleshooting
- `CONVERSATION_TRACKING_GUIDE.md` - Conversation tracking guide
- `DEPLOY_EDGE_FUNCTION.md` - Edge function deployment
- `GEMINI_SETUP.md` - Gemini AI setup
- `MIGRATION_FIX_INSTRUCTIONS.md` - Migration troubleshooting
- And more...

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d714dece-f2ea-4f1f-a179-575d5ec5a7f2) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d714dece-f2ea-4f1f-a179-575d5ec5a7f2) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
