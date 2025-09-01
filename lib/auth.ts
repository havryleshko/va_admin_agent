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
    if (!session?.provider_token) {
      console.log('🔍 AUTH DEBUG: No provider token in Supabase session')
      return null
    }

    // Supabase stores the Google OAuth token in provider_token
    // This should work with Gmail API
    const tokens: GoogleTokens = {
      access_token: session.provider_token,
      expires_at: Date.now() + (3600 * 1000), // Assume 1 hour
    }

    console.log('🔍 AUTH DEBUG: Extracted Google tokens from Supabase session')
    return tokens
  } catch (error) {
    console.error('❌ AUTH DEBUG: Error extracting Google tokens:', error)
    return null
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
