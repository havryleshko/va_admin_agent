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
  draftReply: string
  isRead: boolean
  timestamp: Date
}

export interface EmailStats {
  total: number
  unread: number
  categorized: number
}
