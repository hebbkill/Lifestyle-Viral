# 🚀 Deployment Guide - Lifestyle Viral Planner

This guide will walk you through deploying your Lifestyle Viral Planner to the cloud with Supabase database backend.

## 📋 Prerequisites

- A free [Supabase](https://supabase.com) account
- A free [Netlify](https://netlify.com) or [Vercel](https://vercel.com) account
- Your project files

---

## Part 1: Supabase Database Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `lifestyle-viral-planner` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it somewhere safe!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Free tier is perfect for personal use
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to initialize

### Step 2: Run Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the `schema.sql` file from your project folder
4. Copy ALL the contents and paste into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: `Success. No rows returned`

### Step 3: Verify Tables Created

1. Click **"Table Editor"** in the left sidebar
2. You should see two tables:
   - `videos` - stores your video planning data
   - `app_config` - stores your app settings
3. Both tables should be empty (that's normal!)

### Step 4: Get Your Credentials

1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the settings menu
3. You'll see two important values:

   **Project URL** (looks like):
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon public key** (looks like):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg5ODc2NTAsImV4cCI6MTk5NDU2MzY1MH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Keep this tab open** - you'll need these values in the next steps!

---

## Part 2: Configure Your App

### Step 5: Update Configuration File

1. Open your project folder
2. Find and open `config.js`
3. Replace the placeholder values with your actual credentials:

```javascript
window.ENV = {
    SUPABASE_URL: 'https://xxxxxxxxxxxxx.supabase.co',  // ← Your Project URL
    SUPABASE_ANON_KEY: 'eyJhbGci...'  // ← Your anon public key
};
```

4. Save the file

### Step 6: Test Locally (Optional but Recommended)

1. Open terminal/command prompt in your project folder
2. Run: `npm install` (first time only)
3. Run: `npx serve .`
4. Open browser to `http://localhost:3000`
5. Try creating a video - it should save to Supabase!
6. Check Supabase Table Editor - you should see your data appear

---

## Part 3: Deploy to Netlify

### Option A: Drag & Drop (Easiest)

1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign up/login
3. Drag your entire project folder onto the Netlify dashboard
4. Wait for deployment to complete (~30 seconds)
5. Click on your site URL (looks like `random-name-123.netlify.app`)
6. Your app is live! 🎉

### Option B: GitHub (Recommended for Updates)

1. Create a GitHub repository for your project
2. Push your code to GitHub
3. Go to [app.netlify.com](https://app.netlify.com)
4. Click **"Add new site"** → **"Import an existing project"**
5. Choose **"GitHub"** and authorize
6. Select your repository
7. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.`
8. Click **"Deploy site"**
9. Your app is live! 🎉

### Important: Custom Domain (Optional)

1. In Netlify dashboard, go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow instructions to connect your domain

---

## Part 4: Deploy to Vercel (Alternative)

If you prefer Vercel over Netlify:

### Option A: Drag & Drop

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login
3. Click **"Add New..."** → **"Project"**
4. Drag your project folder
5. Click **"Deploy"**
6. Your app is live! 🎉

### Option B: GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"Add New..."** → **"Project"**
4. Import your GitHub repository
5. Click **"Deploy"**
6. Your app is live! 🎉

---

## Part 5: Verify Deployment

### Test Your Live App

1. Open your deployed URL
2. Try these actions:
   - ✅ Create a new video
   - ✅ Edit the video
   - ✅ Change status (drag in Kanban view)
   - ✅ Delete the video
   - ✅ Change weekly goal in settings
3. Open Supabase Table Editor
4. Verify all changes appear in the database

### Test Multi-Device Sync

1. Open your app on your phone
2. Create a video
3. Open your app on your computer
4. The video should appear automatically! (real-time sync)

---

## 🔧 Troubleshooting

### "Supabase configuration missing" Error

**Problem**: App shows error about missing Supabase config

**Solution**:
1. Check that `config.js` has your real credentials (not placeholders)
2. Make sure `config.js` is included in your deployment
3. Clear browser cache and reload

### Videos Not Saving

**Problem**: Creating videos doesn't work

**Solution**:
1. Open browser console (F12)
2. Look for error messages
3. Common issues:
   - Wrong Supabase credentials → Update `config.js`
   - Schema not created → Re-run `schema.sql` in Supabase
   - Network blocked → Check firewall/antivirus

### Data Not Syncing Between Devices

**Problem**: Changes on one device don't appear on another

**Solution**:
1. Check that both devices are using the same Supabase project
2. Refresh the page (real-time sync requires active connection)
3. Check Supabase dashboard → Database → Logs for errors

### Deployment Failed

**Problem**: Netlify/Vercel deployment fails

**Solution**:
1. Make sure `package.json` exists in your project
2. Check that all files are included (especially `config.js`)
3. Try manual drag-and-drop deployment first

---

## 🔐 Security Notes

### Current Setup (Single User)

- ✅ Your Supabase credentials are safe to expose in frontend code
- ✅ The `anon` key has limited permissions
- ⚠️ **Anyone with your app URL can access your data**
- ⚠️ This is fine for personal use, but not for public apps

### Future: Adding Authentication

If you want to make this a multi-user app later:

1. Enable Supabase Authentication
2. Update RLS policies (see comments in `schema.sql`)
3. Add login/signup UI
4. Update `supabase_sdk.js` to use `auth.uid()`

---

## 📊 Monitoring Your App

### Supabase Dashboard

- **Table Editor**: View all your data
- **Database → Logs**: See all queries
- **API → Logs**: Monitor API usage
- **Settings → Usage**: Check storage/bandwidth

### Netlify/Vercel Dashboard

- **Analytics**: See visitor stats
- **Functions**: Monitor performance
- **Deploys**: View deployment history

---

## 🎯 Next Steps

Now that your app is deployed:

1. ✅ Bookmark your app URL
2. ✅ Add to phone home screen (works like a native app!)
3. ✅ Start planning your viral content
4. ✅ Share with friends (if you want)

---

## 💡 Tips

### Performance

- The app uses real-time sync, so changes appear instantly
- First load might be slow (cold start), but subsequent loads are fast
- Supabase free tier is plenty for personal use

### Backup

- Your data is automatically backed up by Supabase
- You can export data anytime from Table Editor → Export as CSV

### Updates

- To update your app, just re-deploy (drag & drop or push to GitHub)
- Database schema changes require running new SQL in Supabase

---

## 🆘 Need Help?

If you run into issues:

1. Check browser console (F12) for errors
2. Check Supabase logs (Dashboard → Database → Logs)
3. Verify your credentials are correct
4. Try the troubleshooting steps above

---

## 🎉 Congratulations!

Your Lifestyle Viral Planner is now live on the internet with a real database! You can access it from anywhere, on any device.

**Your app URL**: `https://your-site.netlify.app` (or `.vercel.app`)

Start creating viral content! 🚀
