import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    if (error) {
      console.error('❌ OAUTH ERROR: Google OAuth error:', error)
      return NextResponse.redirect(`${request.nextUrl.origin}/login?error=${error}`)
    }
    
    if (!code) {
      console.error('❌ OAUTH ERROR: No authorization code received')
      return NextResponse.redirect(`${request.nextUrl.origin}/login?error=no_code`)
    }
    
    console.log('🔍 OAUTH DEBUG: Received authorization code, exchanging for tokens...')
    
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${request.nextUrl.origin}/api/auth/google/callback`,
      }),
    })
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ OAUTH ERROR: Token exchange failed:', errorText)
      return NextResponse.redirect(`${request.nextUrl.origin}/login?error=token_exchange_failed`)
    }
    
    const tokenData = await tokenResponse.json()
    console.log('🔍 OAUTH DEBUG: Successfully obtained Google tokens')
    
    // Store tokens in localStorage via URL parameters (for development)
    // In production, you'd store these securely
    const redirectUrl = new URL(`${request.nextUrl.origin}/dashboard`)
    redirectUrl.searchParams.set('google_access_token', tokenData.access_token)
    if (tokenData.refresh_token) {
      redirectUrl.searchParams.set('google_refresh_token', tokenData.refresh_token)
    }
    redirectUrl.searchParams.set('expires_in', tokenData.expires_in.toString())
    
    return NextResponse.redirect(redirectUrl.toString())
    
  } catch (error) {
    console.error('❌ OAUTH ERROR: Unexpected error in callback:', error)
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=callback_failed`)
  }
}
