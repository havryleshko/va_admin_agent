# VA Admin Agent Backend

This is the Flask backend API for the VA Admin Agent application.

## 🚀 Deployment Options

### Option 1: Railway Deployment

#### Prerequisites
- Railway account
- OpenAI API key
- Google OAuth credentials

#### Deployment Steps

1. **Connect to Railway:**
   - Go to [Railway](https://railway.app/)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository and select the `backend/` folder

2. **Set Environment Variables:**
   In Railway dashboard, add these environment variables:
   ```
   OPENAI_API_KEY=your-openai-api-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FLASK_ENV=production
   FLASK_DEBUG=False
   ```

3. **Deploy:**
   - Railway will automatically detect the Python app
   - It will install dependencies from `requirements.txt`
   - The app will start using the `Procfile`

### Option 2: Render Deployment (Recommended)

#### Prerequisites
- Render account
- OpenAI API key
- Google OAuth credentials

#### Deployment Steps

1. **Connect to Render:**
   - Go to [Render](https://render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repo: `va_admin_agent`
   - **Important:** Set the **Root Directory** to `backend`

2. **Configure the Service:**
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --timeout 120`
   - **Plan:** Free (for testing) or Starter (for production)

3. **Set Environment Variables:**
   In Render dashboard, go to Environment → Environment Variables and add:
   ```
   OPENAI_API_KEY=your-openai-api-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FLASK_ENV=production
   FLASK_DEBUG=False
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically deploy your app
   - You'll get a URL like: `https://your-app-name.onrender.com`

## 🆚 Railway vs Render

**Render Advantages:**
- ✅ Free tier available
- ✅ Simpler interface
- ✅ Better documentation
- ✅ More predictable pricing

**Railway Advantages:**
- ✅ Faster deployments
- ✅ More generous free tier
- ✅ Better for complex setups

**Both are excellent choices for your backend!**

## API Endpoints

- `GET /` - Health check
- `GET /api/health` - API health check
- `POST /api/emails` - Fetch unread emails
- `POST /api/emails/classify` - Classify emails using AI
- `POST /api/emails/draft-replies` - Generate draft replies
- `POST /api/emails/send` - Send email reply
- `POST /api/emails/discard` - Discard email
- `GET /api/emails/stats` - Get email statistics

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
python app.py
```

The server will start on `http://localhost:5000`

## Files Structure

```
backend/
├── app.py              # Main Flask application
├── for_emails.py       # Email processing logic
├── utils.py            # Utility functions
├── llm_central.py      # LLM integration
├── requirements.txt    # Python dependencies
├── Procfile           # Railway deployment config
├── runtime.txt        # Python version
├── env.example        # Environment variables template
├── config/            # Configuration files
└── README.md          # This file
```
