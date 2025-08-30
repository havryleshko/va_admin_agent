import { Email } from '@/types/email'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

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
export async function fetchEmails(accessToken: string): Promise<Email[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        action: 'fetch_unread'
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.emails || []
  } catch (error) {
    console.error('Error fetching emails:', error)
    throw error
  }
}

// Classify emails using AI
export async function classifyEmails(emails: Email[], accessToken: string): Promise<Email[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ emails })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.emails || emails
  } catch (error) {
    console.error('Error classifying emails:', error)
    return emails // Return original emails if classification fails
  }
}

// Generate draft replies
export async function generateDraftReplies(emails: Email[], accessToken: string): Promise<Email[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails/draft-replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ emails })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.emails || emails
  } catch (error) {
    console.error('Error generating draft replies:', error)
    return emails // Return original emails if draft generation fails
  }
}

// Send email reply
export async function sendEmailReply(emailId: string, replyText: string, accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
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
    console.error('Error sending email reply:', error)
    throw error
  }
}

// Discard email
export async function discardEmail(emailId: string, accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails/discard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ emailId })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.success || false
  } catch (error) {
    console.error('Error discarding email:', error)
    throw error
  }
}

// Get email statistics
export async function getEmailStats(accessToken: string): Promise<EmailStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.stats || { total: 0, unread: 0, categorized: 0 }
  } catch (error) {
    console.error('Error fetching email stats:', error)
    return { total: 0, unread: 0, categorized: 0 }
  }
}
