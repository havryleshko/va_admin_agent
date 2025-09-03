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
    const url = `${API_BASE_URL}/api/emails`
    
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

    if (!response.ok) {
      const errorText = await response.text()
      
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
    const emails = result.emails || []
    return emails
  } catch (error) {
    throw error
  }
}

// Classify emails using AI
export async function classifyEmails(emails: Email[], googleTokens: GoogleTokens): Promise<Email[]> {
  try {
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
    return result.emails || emails
  } catch (error) {
    return emails // Return original emails if classification fails
  }
}

// Generate draft replies
export async function generateDraftReplies(emails: Email[], googleTokens: GoogleTokens): Promise<Email[]> {
  try {
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
    return result.emails || emails
  } catch (error) {
    return emails // Return original emails if draft generation fails
  }
}

// Send email reply
export async function sendEmailReply(emailId: string, replyText: string, googleTokens: GoogleTokens): Promise<boolean> {
  try {
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
    return result.success || false
  } catch (error) {
    throw error
  }
}

// Discard email
export async function discardEmail(emailId: string, googleTokens: GoogleTokens): Promise<boolean> {
  try {
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
    return result.success || false
  } catch (error) {
    throw error
  }
}

// Get email statistics
export async function getEmailStats(googleTokens: GoogleTokens): Promise<EmailStats> {
  try {
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
    return result.stats || { total: 0, unread: 0, categorized: 0 }
  } catch (error) {
    return { total: 0, unread: 0, categorized: 0 }
  }
}
