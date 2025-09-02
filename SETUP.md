# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to **Authentication** → **Providers**
3. Enable **Google** provider
4. Add your Google OAuth credentials
5. Copy the **Project URL** and **Anon Key** to `.env.local`

## 🎯 What You'll See

- **Login Page**: Google OAuth sign-in
- **Dashboard**: Email management interface with mock data
- **Email Cards**: Categorized emails with AI-generated draft replies
- **Email Detail**: Full email view with action buttons

## 🐛 Troubleshooting

### "Missing Supabase credentials"
- Check that `.env.local` exists and has correct values
- Restart the development server after adding environment variables

### "Build errors"
- Run `npm run build` to see detailed error messages
- Ensure all dependencies are installed with `npm install`

### "API errors"
- Check browser console for detailed error messages
- Verify that all API routes are working in the Network tab

## 📚 Next Steps

- [Read the full README](README.md) for detailed information
- [Check the project structure](README.md#project-structure)
- [Learn about the API endpoints](README.md#api-endpoints)
- [Deploy to production](README.md#deployment)

## 🆘 Need Help?

1. Check the [README](README.md) for comprehensive documentation
2. Look at existing issues in the repository
3. Create a new issue with your specific problem
4. Include your environment details and error messages
