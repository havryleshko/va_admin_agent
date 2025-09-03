import { supabase } from './supabase'

export interface GoogleTokens {
  access_token: string
  refresh_token?: string
  expires_at: number
}

export interface AuthTokens {
  supabase_token: string
  google_tokens: GoogleTokens
}

// Get Google OAuth tokens from Supabase session
export function getGoogleTokensFromSupabaseSession(session: any): GoogleTokens | null {
  try {
    // Try different possible locations for Google OAuth tokens
    let accessToken = null
    
    // Method 1: Check provider_token (most common)
    if (session?.provider_token) {
      accessToken = session.provider_token
    }
    // Method 2: Check provider_access_token
    else if (session?.provider_access_token) {
      accessToken = session.provider_access_token
    }
    // Method 3: Check if access_token is a Google token
    else if (session?.access_token) {
      accessToken = session.access_token
    }
    
    if (!accessToken) {
      return null
    }

    // Validate token format (Google OAuth tokens are typically long)
    if (accessToken.length < 50) {
      return null
    }

    // Create tokens object
    const tokens: GoogleTokens = {
      access_token: accessToken,
      expires_at: Date.now() + (3600 * 1000), // Assume 1 hour
    }

    return tokens
  } catch (error) {
    return null
  }
}

// Alternative method: Get tokens from user metadata
export function getGoogleTokensFromUserMetadata(user: any): GoogleTokens | null {
  try {
    if (!user?.user_metadata) {
      return null
    }
    
    // Check if Google tokens are stored in user metadata
    const metadata = user.user_metadata
    
    if (metadata.google_access_token) {
      return {
        access_token: metadata.google_access_token,
        expires_at: Date.now() + (3600 * 1000),
      }
    }
    
    return null
  } catch (error) {
    return null
  }
}

// Test if a token is valid by making a simple Gmail API call
export async function testGoogleToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response.status === 200
  } catch (error) {
    return false
  }
}

// Get current Supabase session
export async function getSupabaseSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    return null
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    return null
  }
}

// Sign out and clear all tokens
export async function signOut() {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    // Silent fail in production
  }
}
