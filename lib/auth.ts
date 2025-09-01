export interface GoogleTokens {
  access_token: string
  refresh_token?: string
  expires_at: number
}

export interface AuthTokens {
  supabase_token: string
  google_tokens: GoogleTokens
}

// Get Google OAuth tokens from URL parameters (after OAuth callback)
export function getGoogleTokensFromUrl(): GoogleTokens | null {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get('google_access_token')
    const refreshToken = urlParams.get('google_refresh_token')
    const expiresIn = urlParams.get('expires_in')
    
    if (!accessToken) {
      console.log('🔍 AUTH DEBUG: No Google access token in URL')
      return null
    }
    
    const expiresAt = Date.now() + (parseInt(expiresIn || '3600') * 1000)
    
    const tokens: GoogleTokens = {
      access_token: accessToken,
      refresh_token: refreshToken || undefined,
      expires_at: expiresAt
    }
    
    console.log('🔍 AUTH DEBUG: Extracted Google tokens from URL')
    return tokens
  } catch (error) {
    console.error('❌ AUTH DEBUG: Error extracting Google tokens from URL:', error)
    return null
  }
}

// Store Google tokens in localStorage
export function storeGoogleTokens(tokens: GoogleTokens): void {
  try {
    localStorage.setItem('google_tokens', JSON.stringify(tokens))
    console.log('🔍 AUTH DEBUG: Stored Google tokens in localStorage')
  } catch (error) {
    console.error('❌ AUTH DEBUG: Error storing Google tokens:', error)
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
      console.log('🔍 AUTH DEBUG: Google tokens expired, removed from storage')
      return null
    }
    
    console.log('🔍 AUTH DEBUG: Retrieved stored Google tokens')
    return tokens
  } catch (error) {
    console.error('❌ AUTH DEBUG: Error getting stored Google tokens:', error)
    return null
  }
}

// Clear stored Google tokens
export function clearGoogleTokens(): void {
  try {
    localStorage.removeItem('google_tokens')
    console.log('🔍 AUTH DEBUG: Cleared Google tokens from storage')
  } catch (error) {
    console.error('❌ AUTH DEBUG: Error clearing Google tokens:', error)
  }
}

// Sign out and clear all tokens
export async function signOut() {
  try {
    clearGoogleTokens()
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
