# 🚀 Railway Deployment Guide

## Your Backend is Now Ready for Railway!

The `backend/` folder has been restructured and is ready for deployment to Railway.

## 📁 What's Been Set Up

### Backend Structure:
```
backend/
├── app.py              # Flask API with all endpoints
├── for_emails.py       # Your email processing logic
├── utils.py            # Gmail API utilities
├── llm_central.py      # OpenAI integration
├── requirements.txt    # All Python dependencies
├── Procfile           # Railway deployment config
├── runtime.txt        # Python 3.11.7
├── env.example        # Environment variables template
├── config/            # Configuration folder
└── README.md          # Backend documentation
```

### Key Features Added:
- ✅ **Health check endpoints** (`/` and `/api/health`)
- ✅ **Production-ready configuration** (debug=False, gunicorn)
- ✅ **CORS enabled** for frontend communication
- ✅ **All your original logic** preserved and integrated
- ✅ **Proper dependency management**

## 🚀 Deploy to Railway

### Step 1: Go to Railway
1. Visit [Railway](https://railway.app/)
2. Sign in with GitHub
3. Click "New Project"

### Step 2: Connect Your Repo
1. Select "Deploy from GitHub repo"
2. Choose your repository: `va_admin_agent`
3. **Important:** Select the `backend/` folder (not the root)
4. Click "Deploy"

### Step 3: Set Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```
OPENAI_API_KEY=your-actual-openai-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FLASK_ENV=production
FLASK_DEBUG=False
```

### Step 4: Get Your Production URL
Once deployed, Railway will give you a URL like:
`https://your-app-name.railway.app`

## 🔗 Connect Frontend to Backend

### Step 1: Update Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `va_admin_agent` project
3. Go to Settings → Environment Variables
4. Add/Update:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-railway-url.railway.app
   ```

### Step 2: Redeploy Frontend
Push to GitHub or manually redeploy in Vercel dashboard.

## 🧪 Test Your Deployment

### Test Backend Health:
Visit your Railway URL: `https://your-app.railway.app/`
You should see:
```json
{
  "status": "healthy",
  "message": "VA Admin Agent Backend is running",
  "version": "1.0.0"
}
```

### Test API Health:
Visit: `https://your-app.railway.app/api/health`

## 🔧 Troubleshooting

### If Railway Build Fails:
1. Check the build logs in Railway dashboard
2. Ensure all environment variables are set
3. Verify Python version compatibility

### If Frontend Can't Connect:
1. Check CORS settings
2. Verify the backend URL in Vercel environment variables
3. Test the backend URL directly in browser

### Common Issues:
- **Port issues:** Railway sets `PORT` automatically
- **Missing dependencies:** All are in `requirements.txt`
- **Environment variables:** Make sure they're set in Railway dashboard

## 📊 Monitoring

Railway provides:
- **Logs:** Real-time application logs
- **Metrics:** CPU, memory usage
- **Deployments:** Automatic deployments on git push

## 🎉 Success!

Once deployed, your full stack will be:
- **Frontend:** Vercel (Next.js)
- **Backend:** Railway (Flask)
- **Auth:** Supabase
- **Database:** Supabase (if needed)

Your app will be fully functional in production! 🚀
