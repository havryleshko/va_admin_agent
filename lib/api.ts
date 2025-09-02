import { Email } from '@/types/email'
import { GoogleTokens } from './auth'

// Use local Next.js API routes instead of external backend
const API_BASE_URL = ''

export interface EmailStats {
  total: number
  unread: number
  categorized: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Fetch unread emails from Gmail
export async function fetchEmails(googleTokens: GoogleTokens): Promise<Email[]> {
  try {
    console.log('🔍 API DEBUG: fetchEmails called')
    console.log('🔍 API DEBUG: API_BASE_URL:', API_BASE_URL)
    console.log('🔍 API DEBUG: Google tokens available:', !!googleTokens)
    console.log('🔍 API DEBUG: Token length:', googleTokens.access_token?.length || 0)
    console.log('🔍 API DEBUG: Token preview:', googleTokens.access_token?.substring(0, 20) + '...')
    
    const url = `${API_BASE_URL}/api/emails`
    console.log('🔍 API DEBUG: Making request to:', url)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Google-Access-Token': googleTokens.access_token
      },
      body: JSON.stringify({
        action: 'fetch_unread'
      })
    })

    console.log('🔍 API DEBUG: Response status:', response.status)
    console.log('🔍 API DEBUG: Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ API DEBUG: Response not ok:', errorText)
      
      // Check if it's a token-related error
      if (response.status === 401) {
        throw new Error('Invalid or expired Google OAuth token. Please re-authenticate.')
      } else if (response.status === 403) {
        throw new Error('Insufficient permissions to access Gmail. Please check OAuth scopes.')
      } else {
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }
    }

    const result = await response.json()
    console.log('🔍 API DEBUG: Response data:', result)
    
    const emails = result.emails || []
    console.log('🔍 API DEBUG: Returning emails:', emails)
    return emails
  } catch (error) {
    console.error('❌ API DEBUG: Error in fetchEmails:', error)
    throw error
  }
}

// Classify emails using AI
export async function classifyEmails(emails: Email[], googleTokens: GoogleTokens): Promise<Email[]> {
  try {
    console.log('🔍 API DEBUG: classifyEmails called with', emails.length, 'emails')
    
    const response = await fetch(`${API_BASE_URL}/api/emails/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Google-Access-Token': googleTokens.access_token
      },
      body: JSON.stringify({ emails })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('🔍 API DEBUG: Classification result:', result)
    return result.emails || emails
  } catch (error) {
    console.error('❌ API DEBUG: Error in classifyEmails:', error)
    return emails // Return original emails if classification fails
  }
}

// Generate draft replies
export async function generateDraftReplies(emails: Email[], googleTokens: GoogleTokens): Promise<Email[]> {
  try {
    console.log('🔍 API DEBUG: generateDraftReplies called with', emails.length, 'emails')
    
    const response = await fetch(`${API_BASE_URL}/api/emails/draft-replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Google-Access-Token': googleTokens.access_token
      },
      body: JSON.stringify({ emails })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('🔍 API DEBUG: Draft replies result:', result)
    return result.emails || emails
  } catch (error) {
    console.error('❌ API DEBUG: Error in generateDraftReplies:', error)
    return emails // Return original emails if draft generation fails
  }
}

// Send email reply
export async function sendEmailReply(emailId: string, replyText: string, googleTokens: GoogleTokens): Promise<boolean> {
  try {
    console.log('🔍 API DEBUG: sendEmailReply called for email:', emailId)
    
    const response = await fetch(`${API_BASE_URL}/api/emails/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Google-Access-Token': googleTokens.access_token
      },
      body: JSON.stringify({
        emailId,
        replyText
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('🔍 API DEBUG: Send result:', result)
    return result.success || false
  } catch (error) {
    console.error('❌ API DEBUG: Error in sendEmailReply:', error)
    throw error
  }
}

// Discard email
export async function discardEmail(emailId: string, googleTokens: GoogleTokens): Promise<boolean> {
  try {
    console.log('🔍 API DEBUG: discardEmail called for email:', emailId)
    
    const response = await fetch(`${API_BASE_URL}/api/emails/discard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Google-Access-Token': googleTokens.access_token
      },
      body: JSON.stringify({ emailId })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('🔍 API DEBUG: Discard result:', result)
    return result.success || false
  } catch (error) {
    console.error('❌ API DEBUG: Error in discardEmail:', error)
    throw error
  }
}

// Get email statistics
export async function getEmailStats(googleTokens: GoogleTokens): Promise<EmailStats> {
  try {
    console.log('🔍 API DEBUG: getEmailStats called')
    
    const response = await fetch(`${API_BASE_URL}/api/emails/stats`, {
      method: 'GET',
      headers: {
        'X-Google-Access-Token': googleTokens.access_token
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log('🔍 API DEBUG: Stats result:', result)
    return result.stats || { total: 0, unread: 0, categorized: 0 }
  } catch (error) {
    console.error('❌ API DEBUG: Error in getEmailStats:', error)
    return { total: 0, unread: 0, categorized: 0 }
  }
}
