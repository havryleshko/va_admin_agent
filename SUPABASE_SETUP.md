# Supabase Setup Guide

## Why Supabase?

✅ **No redirect URI issues** - Supabase handles OAuth automatically  
✅ **Stable authentication** - Works with any deployment URL  
✅ **Built-in user management** - Database integration  
✅ **Multiple providers** - Google, GitHub, etc.  
✅ **Session management** - Automatic token handling  

## Step 1: Create Supabase Project

1. **Go to Supabase:**
   - Visit [https://supabase.com](https://supabase.com)
   - Sign up/Login with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Choose organization
   - Enter project name: "va-admin-agent"
   - Set database password
   - Choose region (closest to you)
   - Click "Create new project"

3. **Wait for Setup:**
   - Project setup takes 1-2 minutes
   - You'll get a notification when ready

## Step 2: Get Project Credentials

1. **Go to Project Settings:**
   - In your Supabase dashboard
   - Go to "Settings" → "API"

2. **Copy Credentials:**
   - **Project URL** (starts with `https://`)
   - **Anon public key** (starts with `eyJ`)

## Step 3: Configure Google OAuth

1. **Go to Authentication:**
   - In Supabase dashboard
   - Go to "Authentication" → "Providers"

2. **Enable Google:**
   - Find "Google" in the list
   - Toggle to enable
   - Click "Configure"

3. **Add Google Credentials:**
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
   - **Redirect URL**: Copy from Supabase (auto-generated)

4. **Update Google Console:**
   - Go to Google Cloud Console
   - Add the Supabase redirect URL to your OAuth credentials
   - Format: `https://your-project.supabase.co/auth/v1/callback`

## Step 4: Environment Variables

Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Other variables
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## Step 5: Test Authentication

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Visit your app:**
   - Go to `http://localhost:3000`
   - Click "Continue with Google"
   - Should redirect to Google OAuth
   - After authorization, redirects back to dashboard

## Step 6: Deploy to Production

1. **Add environment variables to Vercel:**
   - Go to Vercel dashboard
   - Project settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Deploy:**
   ```bash
   npx vercel --prod
   ```

## Benefits of This Setup

- ✅ **No more redirect URI issues**
- ✅ **Works with any deployment URL**
- ✅ **Automatic session management**
- ✅ **Built-in user database**
- ✅ **Easy to scale**

## Troubleshooting

### "Invalid redirect URI"
- Check that you added the Supabase redirect URL to Google Console
- Format: `https://your-project.supabase.co/auth/v1/callback`

### "Supabase not configured"
- Verify environment variables are set correctly
- Check that `.env.local` exists and has correct values

### "Authentication failed"
- Verify Google OAuth credentials in Supabase
- Check that Google provider is enabled in Supabase

## Next Steps

After setup, you can:
- Add more OAuth providers (GitHub, Discord, etc.)
- Create user profiles in Supabase database
- Add email management features
- Implement user-specific settings
