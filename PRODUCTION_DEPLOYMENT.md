# Production Deployment Guide

## Making Your App Publicly Available

### 1. Google OAuth Configuration

#### Publish OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "OAuth consent screen"
3. Click **"PUBLISH APP"** to make it available to all users
4. Remove test users (they're no longer needed)

#### Update Redirect URIs
1. Go to "APIs & Services" → "Credentials"
2. Edit your OAuth 2.0 Client ID
3. Add production redirect URIs:
   - `https://yourdomain.com/api/auth/callback`
   - Remove localhost URIs for production

### 2. Environment Variables for Production

Create production environment variables:

```env
# Production Environment Variables
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com

# Google OAuth (Production)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Security
NEXTAUTH_SECRET=your-secure-random-secret
NEXTAUTH_URL=https://yourdomain.com
```

### 3. Deploy to Production Platform

#### Option A: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically

#### Option B: Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

#### Option C: Railway
1. Connect repository to Railway
2. Add environment variables
3. Deploy automatically

### 4. Domain Configuration

1. **Custom Domain Setup:**
   - Configure your domain in your hosting platform
   - Update DNS records
   - Enable HTTPS (automatic with most platforms)

2. **Update Google OAuth:**
   - Add your production domain to authorized origins
   - Add production redirect URI

### 5. Security Considerations

#### Environment Variables
- ✅ Use different OAuth credentials for production
- ✅ Set strong NEXTAUTH_SECRET
- ✅ Use HTTPS URLs only
- ✅ Never expose secrets in client-side code

#### OAuth Security
- ✅ Regularly rotate client secrets
- ✅ Monitor OAuth usage in Google Console
- ✅ Set up OAuth consent screen properly
- ✅ Request Google verification for trust

#### App Security
- ✅ Enable HTTPS everywhere
- ✅ Set secure cookies
- ✅ Implement rate limiting
- ✅ Monitor for suspicious activity

### 6. Testing Production

1. **Test OAuth Flow:**
   - Visit your production URL
   - Test login with different Google accounts
   - Verify redirects work correctly

2. **Test Email Integration:**
   - Verify Gmail API access works
   - Test email fetching and sending
   - Check error handling

3. **Monitor Performance:**
   - Check loading times
   - Monitor API response times
   - Watch for errors in logs

### 7. Post-Launch Checklist

- ✅ OAuth consent screen published
- ✅ Production credentials configured
- ✅ HTTPS enabled
- ✅ Domain properly configured
- ✅ Environment variables set
- ✅ Error monitoring enabled
- ✅ Performance monitoring active
- ✅ Backup strategy in place

### 8. Maintenance

#### Regular Tasks
- Monitor OAuth usage
- Check for security updates
- Review error logs
- Update dependencies
- Rotate secrets periodically

#### User Support
- Set up support email
- Create documentation
- Monitor user feedback
- Handle OAuth issues

## Quick Commands

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy to Vercel
vercel --prod

# Check environment variables
curl https://yourdomain.com/api/auth/test
```
