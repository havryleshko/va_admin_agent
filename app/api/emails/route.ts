import { NextResponse } from 'next/server'
import { Email } from '@/types/email'

// Mock API endpoint - replace with actual backend calls
export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const mockEmails: Email[] = [
    {
      id: '1',
      subject: 'Invoice #12345 - Payment Due',
      sender: 'billing@company.com',
      snippet: 'Your invoice for services rendered is now due. Please process payment within 30 days.',
      category: 'Invoice/Payment',
      draftReply: 'Thank you for the invoice. I will process the payment within the next few days.',
      isRead: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      subject: 'Meeting Request - Q4 Planning',
      sender: 'manager@company.com',
      snippet: 'Hi, I would like to schedule a meeting to discuss our Q4 planning and strategy.',
      category: 'Meeting',
      draftReply: 'Sounds great! I\'m available this week. What time works best for you?',
      isRead: false,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '3',
      subject: 'New Lead - Potential Client',
      sender: 'sales@prospect.com',
      snippet: 'We are interested in your services and would like to learn more about your offerings.',
      category: 'Lead',
      draftReply: 'Thank you for your interest! I\'d be happy to schedule a call to discuss how we can help.',
      isRead: true,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ]

  return NextResponse.json({
    emails: mockEmails,
    stats: {
      total: mockEmails.length,
      unread: mockEmails.filter(e => !e.isRead).length,
      categorized: mockEmails.length
    }
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { action, emailId } = body

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  switch (action) {
    case 'send':
      return NextResponse.json({ 
        success: true, 
        message: `Email ${emailId} sent successfully` 
      })
    
    case 'discard':
      return NextResponse.json({ 
        success: true, 
        message: `Email ${emailId} discarded` 
      })
    
    default:
      return NextResponse.json(
        { error: 'Invalid action' }, 
        { status: 400 }
      )
  }
}
