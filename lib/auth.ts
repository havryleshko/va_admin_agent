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
    console.log('🔍 AUTH DEBUG: Full session object:', session)
    console.log('🔍 AUTH DEBUG: Provider token:', session?.provider_token)
    console.log('🔍 AUTH DEBUG: Access token:', session?.access_token)
    console.log('🔍 AUTH DEBUG: Provider access token:', session?.provider_access_token)
    
    // Try different possible locations for Google OAuth tokens
    let accessToken = null
    
    // Method 1: Check provider_token (most common)
    if (session?.provider_token) {
      accessToken = session.provider_token
      console.log('🔍 AUTH DEBUG: Found token in provider_token')
    }
    // Method 2: Check provider_access_token
    else if (session?.provider_access_token) {
      accessToken = session.provider_access_token
      console.log('🔍 AUTH DEBUG: Found token in provider_access_token')
    }
    // Method 3: Check if access_token is a Google token
    else if (session?.access_token) {
      accessToken = session.access_token
      console.log('🔍 AUTH DEBUG: Using access_token as Google token')
    }
    
    if (!accessToken) {
      console.log('❌ AUTH DEBUG: No Google access token found in session')
      console.log('🔍 AUTH DEBUG: Available session keys:', Object.keys(session || {}))
      return null
    }

    // Validate token format (Google OAuth tokens are typically long)
    if (accessToken.length < 50) {
      console.log('⚠️ AUTH DEBUG: Token seems too short for Google OAuth:', accessToken.length)
      console.log('⚠️ AUTH DEBUG: Token preview:', accessToken.substring(0, 20) + '...')
    }

    // Create tokens object
    const tokens: GoogleTokens = {
      access_token: accessToken,
      expires_at: Date.now() + (3600 * 1000), // Assume 1 hour
    }

    console.log('🔍 AUTH DEBUG: Successfully extracted Google tokens from Supabase session')
    console.log('🔍 AUTH DEBUG: Token length:', accessToken.length)
    return tokens
  } catch (error) {
    console.error('❌ AUTH DEBUG: Error extracting Google tokens:', error)
    return null
  }
}

// Alternative method: Get tokens from user metadata
export function getGoogleTokensFromUserMetadata(user: any): GoogleTokens | null {
  try {
    if (!user?.user_metadata) {
      console.log('🔍 AUTH DEBUG: No user metadata available')
      return null
    }

    console.log('🔍 AUTH DEBUG: User metadata:', user.user_metadata)
    
    // Check if Google tokens are stored in user metadata
    const metadata = user.user_metadata
    
    if (metadata.google_access_token) {
      console.log('🔍 AUTH DEBUG: Found Google token in user metadata')
      return {
        access_token: metadata.google_access_token,
        expires_at: Date.now() + (3600 * 1000),
      }
    }
    
    return null
  } catch (error) {
    console.error('❌ AUTH DEBUG: Error extracting tokens from user metadata:', error)
    return null
  }
}

// Test if a token is valid by making a simple Gmail API call
export async function testGoogleToken(token: string): Promise<boolean> {
  try {
    console.log('🔍 AUTH DEBUG: Testing Google token validity...')
    
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const isValid = response.status === 200
    console.log(`🔍 AUTH DEBUG: Token test result: ${isValid ? 'VALID' : 'INVALID'} (${response.status})`)
    
    if (!isValid) {
      const errorText = await response.text()
      console.log('🔍 AUTH DEBUG: Token test error:', errorText)
    }
    
    return isValid
  } catch (error) {
    console.error('❌ AUTH DEBUG: Error testing token:', error)
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
    console.error('Error getting Supabase session:', error)
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
    console.error('Error getting current user:', error)
    return null
  }
}

// Sign out and clear all tokens
export async function signOut() {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
