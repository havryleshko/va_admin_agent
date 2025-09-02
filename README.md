# VA Admin Agent

An AI-powered email management assistant built with Next.js, Supabase, and TypeScript. The application helps users manage their emails by automatically categorizing them and generating draft replies using AI.

## Features

- 🔐 **Google OAuth Authentication** via Supabase
- 📧 **Email Management** with Gmail integration
- 🤖 **AI-Powered Classification** of emails by category
- ✍️ **Auto-Generated Draft Replies** based on email context
- 📊 **Email Statistics** and analytics
- 🎨 **Modern UI** with Tailwind CSS and Lucide icons

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Authentication**: Supabase Auth with Google OAuth
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Utilities**: clsx for conditional classes

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Google OAuth credentials (for Gmail integration)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd va_admin_agent
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: OpenAI API Key for enhanced AI features
OPENAI_API_KEY=your-openai-api-key
```

### 4. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Enable Google OAuth in Authentication > Providers
3. Configure Google OAuth with these scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
4. Copy your project URL and anon key to `.env.local`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
va_admin_agent/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── emails/        # Email management endpoints
│   │   └── auth/          # Authentication endpoints
│   ├── dashboard/         # Main dashboard page
│   ├── login/             # Login page
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── EmailCard.tsx      # Individual email display
│   ├── EmailDetail.tsx    # Email detail view
│   └── SupabaseLoginForm.tsx # Login form
├── contexts/               # React contexts
│   └── SupabaseAuthContext.tsx # Authentication context
├── lib/                    # Utility libraries
│   ├── api.ts             # API client functions
│   ├── auth.ts            # Authentication utilities
│   └── supabase.ts        # Supabase client
├── types/                  # TypeScript type definitions
│   └── email.ts           # Email-related types
└── package.json            # Dependencies and scripts
```

## API Endpoints

The application includes the following API routes:

- `POST /api/emails` - Fetch emails from Gmail
- `POST /api/emails/classify` - Classify emails using AI
- `POST /api/emails/draft-replies` - Generate draft replies
- `POST /api/emails/send` - Send email replies
- `POST /api/emails/discard` - Discard unwanted emails
- `GET /api/emails/stats` - Get email statistics

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Email Categories**: Update the `EmailCategory` type in `types/email.ts`
2. **New API Endpoints**: Create new route files in `app/api/`
3. **New Components**: Add components in the `components/` directory
4. **Styling**: Use Tailwind CSS classes for consistent design

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include your environment details and error messages

## Roadmap

- [ ] Real Gmail API integration
- [ ] Enhanced AI classification
- [ ] Email templates
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] Mobile app
