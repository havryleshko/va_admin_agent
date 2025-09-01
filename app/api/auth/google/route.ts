import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get the current origin for redirect
    const origin = request.headers.get('origin') || 'http://localhost:3000'
    
    // Generate Google OAuth URL with proper scopes for Gmail
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!)
    authUrl.searchParams.set('redirect_uri', `${origin}/api/auth/google/callback`)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile')
    authUrl.searchParams.set('access_type', 'offline')
    authUrl.searchParams.set('prompt', 'consent')
    
    // Generate state parameter for security
    const state = Math.random().toString(36).substring(7)
    authUrl.searchParams.set('state', state)
    
    console.log('🔍 OAUTH DEBUG: Redirecting to Google OAuth:', authUrl.toString())
    
    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error('❌ OAUTH ERROR:', error)
    return NextResponse.json({ error: 'Failed to initiate OAuth flow' }, { status: 500 })
  }
}
