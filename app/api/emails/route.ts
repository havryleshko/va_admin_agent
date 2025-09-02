import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    const googleToken = request.headers.get('X-Google-Access-Token')
    
    if (!googleToken) {
      return NextResponse.json(
        { success: false, error: 'Missing Google access token' },
        { status: 401 }
      )
    }

    if (action === 'fetch_unread') {
      // Mock response for now - in production this would call Gmail API
      const mockEmails = [
        {
          id: '1',
          subject: 'Invoice for Services',
          sender: 'billing@company.com',
          snippet: 'Please find attached invoice for the services provided...',
          category: 'Invoice/Payment' as const,
          isRead: false,
          timestamp: new Date().toISOString(),
          draftReply: ''
        },
        {
          id: '2',
          subject: 'Meeting Request',
          sender: 'sarah@company.com',
          snippet: 'Hi, would you be available for a meeting tomorrow at 2 PM?',
          category: 'Meeting' as const,
          isRead: false,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          draftReply: ''
        }
      ]

      return NextResponse.json({
        success: true,
        emails: mockEmails
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in emails API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
