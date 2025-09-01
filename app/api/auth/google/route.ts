import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/google/callback'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 OAUTH DEBUG: Starting Google OAuth flow...')
    console.log('🔍 OAUTH DEBUG: GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID ? 'Set' : 'Missing')
    console.log('🔍 OAUTH DEBUG: GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing')
    console.log('🔍 OAUTH DEBUG: NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'Missing')
    console.log('🔍 OAUTH DEBUG: REDIRECT_URI:', REDIRECT_URI)
    
    // Check if required environment variables are set
    if (!GOOGLE_CLIENT_ID) {
      console.error('❌ OAUTH ERROR: GOOGLE_CLIENT_ID is not set')
      return NextResponse.json({ 
        error: 'Google OAuth not configured. GOOGLE_CLIENT_ID is missing.' 
      }, { status: 500 })
    }
    
    if (!GOOGLE_CLIENT_SECRET) {
      console.error('❌ OAUTH ERROR: GOOGLE_CLIENT_SECRET is not set')
      return NextResponse.json({ 
        error: 'Google OAuth not configured. GOOGLE_CLIENT_SECRET is missing.' 
      }, { status: 500 })
    }
    
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('❌ OAUTH ERROR: NEXT_PUBLIC_APP_URL is not set')
      return NextResponse.json({ 
        error: 'App URL not configured. NEXT_PUBLIC_APP_URL is missing.' 
      }, { status: 500 })
    }
    
    // Generate Google OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile')
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('prompt', 'consent')
    
    // Generate state parameter for security
    const state = Math.random().toString(36).substring(7)
    authUrl.searchParams.set('state', state)
    
    console.log('🔍 OAUTH DEBUG: Generated auth URL:', authUrl.toString())
    console.log('🔍 OAUTH DEBUG: Redirecting to Google OAuth...')
    
    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error('❌ OAUTH ERROR: Unexpected error in OAuth flow:', error)
    return NextResponse.json({ 
      error: 'Failed to generate OAuth URL. Please check server logs.' 
    }, { status: 500 })
  }
}
