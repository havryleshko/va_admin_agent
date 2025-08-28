# VA Admin Agent - Frontend

A modern Next.js frontend for the VA Admin Agent, an AI-powered email management system.

## Features

- 🔐 **Gmail OAuth Authentication**: Secure login with Google accounts
- 📧 **Email Management**: View and manage unread emails from Gmail
- 🤖 **AI Classification**: Automatically categorize emails using OpenAI
- ✍️ **AI Draft Replies**: Generate contextual email responses
- 📊 **Dashboard Stats**: Overview of email metrics
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Real-time Updates**: Live email status and actions
- 🛡️ **Protected Routes**: Secure access to email management features

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Utilities**: clsx

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── EmailCard.tsx      # Email list item
│   └── EmailDetail.tsx    # Email detail view
├── types/                 # TypeScript types
│   └── email.ts           # Email interfaces
├── config/                # Configuration files
└── public/                # Static assets
```

## Key Components

### EmailCard
Displays individual emails in the inbox list with:
- Sender information
- Subject and snippet
- AI classification badge
- Quick action buttons (Send/Discard)
- Read/unread status

### EmailDetail
Shows detailed email information including:
- Full email content
- AI-generated draft reply
- Timestamp and metadata
- Action buttons for sending or discarding

## Data Flow

1. **Email Fetching**: Backend fetches unread emails from Gmail API
2. **AI Classification**: Each email is categorized using OpenAI
3. **Draft Generation**: AI creates contextual reply drafts
4. **Frontend Display**: Emails are displayed with categories and drafts
5. **User Actions**: Users can send replies or discard emails

## Integration with Backend

The frontend is designed to work with the Python backend that provides:
- Gmail OAuth integration
- OpenAI API for email classification and reply drafting
- Email sending capabilities
- Queue management

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Use `npm run build` and deploy `out` directory
- **Railway**: Connect GitHub repository
- **AWS Amplify**: Connect repository and build

## Environment Variables

Create a `.env.local` file for local development:

```env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback` (for development)
   - `https://yourdomain.com/api/auth/callback` (for production)
6. Copy Client ID and Client Secret to your `.env.local` file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
