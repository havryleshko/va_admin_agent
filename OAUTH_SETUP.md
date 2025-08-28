# Google OAuth Setup Guide

## Step 1: Google Cloud Console Setup

1. **Create/Select Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Gmail API:**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click "Enable"

3. **Configure OAuth Consent Screen:**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type
   - Fill in required information:
     - App name: "VA Admin Agent"
     - User support email: your email
     - Developer contact information: your email
   - Add scopes: `https://www.googleapis.com/auth/gmail.modify`
   - Add test users if needed

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Name: "VA Admin Agent Web Client"
   - **Authorized JavaScript origins:**
     - `http://localhost:3000`
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback`
     - `https://yourdomain.com/api/auth/callback` (for production)

## Step 2: Environment Configuration

Create a `.env.local` file in your project root:

```env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## Step 3: Copy Your Credentials

1. **Get Client ID:**
   - In Google Cloud Console → Credentials
   - Copy the "Client ID" from your OAuth 2.0 Client
   - Replace `your-actual-client-id` in `.env.local`

2. **Get Client Secret:**
   - Click on your OAuth 2.0 Client
   - Copy the "Client Secret"
   - Replace `your-actual-client-secret` in `.env.local`

## Step 4: Test the Setup

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Visit the app:**
   - Go to `http://localhost:3000`
   - You should be redirected to `/login`
   - Click "Continue with Gmail"
   - Should redirect to Google OAuth

## Common Issues & Solutions

### "invalid_client" Error
- ✅ Check that Client ID and Secret are correct
- ✅ Verify redirect URI matches exactly
- ✅ Ensure OAuth consent screen is configured
- ✅ Check that Gmail API is enabled

### "redirect_uri_mismatch" Error
- ✅ Add exact redirect URI to Google Console
- ✅ Include protocol (http/https)
- ✅ Include port number for localhost

### "access_denied" Error
- ✅ Add your email as test user in OAuth consent screen
- ✅ Check that required scopes are added

## Production Deployment

For production deployment:

1. **Update redirect URIs in Google Console:**
   - Add your production domain
   - Remove localhost URIs

2. **Update environment variables:**
   - Set `NEXT_PUBLIC_APP_URL` to your production URL
   - Use production Google OAuth credentials

3. **Publish OAuth consent screen:**
   - Go to OAuth consent screen
   - Click "Publish App" when ready

## Security Notes

- ✅ Never commit `.env.local` to version control
- ✅ Use different OAuth credentials for dev/prod
- ✅ Regularly rotate client secrets
- ✅ Monitor OAuth usage in Google Console
