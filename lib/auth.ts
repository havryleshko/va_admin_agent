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

// Get Google OAuth tokens directly from the URL after OAuth callback
export function getGoogleTokensFromUrl(): GoogleTokens | null {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get('access_token')
    const refreshToken = urlParams.get('refresh_token')
    const expiresIn = urlParams.get('expires_in')
    
    if (!accessToken) return null
    
    const expiresAt = Date.now() + (parseInt(expiresIn || '3600') * 1000)
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken || undefined,
      expires_at: expiresAt
    }
  } catch (error) {
    console.error('Error parsing Google tokens from URL:', error)
    return null
  }
}

// Store Google tokens in localStorage (in production, use secure storage)
export function storeGoogleTokens(tokens: GoogleTokens): void {
  try {
    localStorage.setItem('google_tokens', JSON.stringify(tokens))
  } catch (error) {
    console.error('Error storing Google tokens:', error)
  }
}

// Get stored Google tokens
export function getStoredGoogleTokens(): GoogleTokens | null {
  try {
    const stored = localStorage.getItem('google_tokens')
    if (!stored) return null
    
    const tokens = JSON.parse(stored) as GoogleTokens
    
    // Check if tokens are expired
    if (Date.now() > tokens.expires_at) {
      localStorage.removeItem('google_tokens')
      return null
    }
    
    return tokens
  } catch (error) {
    console.error('Error getting stored Google tokens:', error)
    return null
  }
}

// Clear stored Google tokens
export function clearGoogleTokens(): void {
  try {
    localStorage.removeItem('google_tokens')
  } catch (error) {
    console.error('Error clearing Google tokens:', error)
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
    clearGoogleTokens()
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
