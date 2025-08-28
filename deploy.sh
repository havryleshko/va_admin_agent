#!/bin/bash

# VA Admin Agent Frontend Deployment Script

echo "🚀 Starting deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Your Next.js app is ready for deployment!"
    echo ""
    echo "📋 Next steps:"
    echo "1. For Vercel: Push to GitHub and connect to Vercel"
    echo "2. For Netlify: Deploy the 'out' directory"
    echo "3. For local testing: Run 'npm start'"
    echo ""
    echo "🌐 To test locally:"
    echo "   npm start"
else
    echo "❌ Build failed!"
    exit 1
fi
