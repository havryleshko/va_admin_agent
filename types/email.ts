export type EmailCategory = 
  | 'Invoice/Payment'
  | 'Meeting'
  | 'Lead'
  | 'Recruitment'
  | 'Customer Support'
  | 'Internal'
  | 'General'
  | 'Other'

export interface Email {
  id: string
  subject: string
  sender: string
  snippet: string
  category: EmailCategory
  draftReply?: string
  isRead: boolean
  timestamp: Date | string
}

export interface EmailStats {
  total: number
  unread: number
  categorized: number
}

// API response types
export interface EmailApiResponse {
  success: boolean
  emails?: Email[]
  error?: string
}

export interface EmailStatsApiResponse {
  success: boolean
  stats?: EmailStats
  error?: string
}
