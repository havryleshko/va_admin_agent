# VA Admin Agent

An AI-powered email management assistant that helps you classify, categorize, and draft replies to your emails using OpenAI's GPT-4.

## Features

- 🔐 **Google OAuth Authentication** - Secure access to your Gmail account
- 📧 **Real Email Integration** - Fetch and manage actual emails from Gmail
- 🤖 **AI-Powered Classification** - Automatically categorize emails using GPT-4
- ✍️ **Smart Reply Drafting** - Generate contextual email replies
- 📊 **Email Analytics** - Track email statistics and trends
- 🚀 **Modern UI** - Built with Next.js 14 and Tailwind CSS

## Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Flask API with Gmail API integration
- **Authentication**: Direct Google OAuth 2.0 flow
- **AI**: OpenAI GPT-4 for email classification and reply generation
- **Email Service**: Gmail API for real email access

## Quick Start

### Prerequisites

1. **Google OAuth Setup**:
   - Create a Google Cloud Project
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **OpenAI API Key**:
   - Get your API key from [OpenAI Platform](https://platform.openai.com/)

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment variables**:
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   OPENAI_API_KEY=your-openai-api-key
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables**:
   ```bash
   export GOOGLE_CLIENT_ID="your-google-client-id"
   export GOOGLE_CLIENT_SECRET="your-google-client-secret"
   export OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Run Flask server**:
   ```bash
   python app.py
   ```

## Usage

1. **Sign In**: Click "Continue with Google" to authenticate
2. **Grant Permissions**: Allow access to your Gmail account
3. **View Emails**: See your unread emails automatically loaded
4. **AI Classification**: Emails are automatically categorized
5. **Draft Replies**: Generate contextual replies using AI
6. **Send/Discard**: Choose to send replies or discard emails

## API Endpoints

- `POST /api/emails` - Fetch unread emails
- `POST /api/emails/classify` - Classify emails using AI
- `POST /api/emails/draft-replies` - Generate draft replies
- `POST /api/emails/send` - Send email replies
- `POST /api/emails/discard` - Discard emails
- `GET /api/emails/stats` - Get email statistics

## Security

- Uses Google OAuth 2.0 for secure authentication
- Tokens are stored locally and never shared
- All API calls require valid Google access tokens
- No email content is stored permanently

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Render/Railway)
1. Push your code to GitHub
2. Connect your repository to Render/Railway
3. Set environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
