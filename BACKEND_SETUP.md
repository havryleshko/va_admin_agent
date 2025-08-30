# Backend Setup Guide

## Overview

The backend is a Flask API that integrates with your existing Python email functions to provide real email data to the frontend.

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Flask Settings
FLASK_ENV=development
FLASK_DEBUG=1
```

### 3. Run the Backend

```bash
cd backend
python app.py
```

The backend will start on `http://localhost:5000`

### 4. Update Frontend Environment

In your frontend `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## API Endpoints

### GET /api/emails/stats
- Returns email statistics
- Requires Authorization header with Bearer token

### POST /api/emails
- Action: 'fetch_unread'
- Fetches unread emails from Gmail
- Requires Authorization header with Bearer token

### POST /api/emails/classify
- Classifies emails using AI
- Requires Authorization header with Bearer token

### POST /api/emails/draft-replies
- Generates draft replies for emails
- Requires Authorization header with Bearer token

### POST /api/emails/send
- Sends email replies
- Requires Authorization header with Bearer token

### POST /api/emails/discard
- Discards emails
- Requires Authorization header with Bearer token

## Integration with Frontend

The frontend now calls these API endpoints instead of using mock data:

1. **Authentication**: Uses Supabase OAuth tokens
2. **Email Fetching**: Calls backend to get real Gmail data
3. **AI Classification**: Backend processes emails with OpenAI
4. **Draft Generation**: Backend generates contextual replies
5. **Email Actions**: Backend handles sending/discarding

## Development Workflow

1. **Start Backend**: `python app.py` (runs on port 5000)
2. **Start Frontend**: `npm run dev` (runs on port 3000)
3. **Test Integration**: Frontend will call backend APIs

## Production Deployment

For production, deploy the backend to:
- Heroku
- Railway
- AWS
- Google Cloud

Update `NEXT_PUBLIC_BACKEND_URL` to your production backend URL.

## Current Status

- ✅ **Frontend Integration**: Complete
- ✅ **API Endpoints**: Complete
- ✅ **Mock Data**: Working
- 🔄 **Real Gmail Integration**: Needs OAuth token conversion
- 🔄 **Production Deployment**: Ready for deployment

## Next Steps

1. **Real Gmail Integration**: Convert OAuth tokens to Gmail API credentials
2. **Production Deployment**: Deploy backend to cloud platform
3. **Error Handling**: Add comprehensive error handling
4. **Rate Limiting**: Add API rate limiting
5. **Monitoring**: Add logging and monitoring
