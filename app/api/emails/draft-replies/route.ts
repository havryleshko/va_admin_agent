import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { emails } = await request.json()
    const googleToken = request.headers.get('X-Google-Access-Token')
    
    if (!googleToken) {
      return NextResponse.json(
        { success: false, error: 'Missing Google access token' },
        { status: 401 }
      )
    }

    // Mock AI draft generation - in production this would call OpenAI API
    const emailsWithDrafts = emails.map((email: any) => {
      let draftReply = ''
      
      // Generate context-appropriate draft replies based on category
      switch (email.category) {
        case 'Invoice/Payment':
          draftReply = 'Thank you for your invoice. I will review it and process the payment accordingly. Please let me know if you need any additional information.'
          break
        case 'Meeting':
          draftReply = 'Thank you for the meeting request. I would be happy to meet with you. Please let me know if you have any specific agenda items you\'d like to discuss.'
          break
        case 'Lead':
          draftReply = 'Thank you for reaching out. I\'m interested in learning more about your services. Could you please provide additional details about your offerings?'
          break
        case 'Customer Support':
          draftReply = 'I understand your concern and I\'m here to help. Let me investigate this issue and get back to you with a solution as soon as possible.'
          break
        default:
          draftReply = 'Thank you for your email. I appreciate you reaching out and will respond in detail shortly.'
      }
      
      return {
        ...email,
        draftReply
      }
    })

    return NextResponse.json({
      success: true,
      emails: emailsWithDrafts
    })
  } catch (error) {
    console.error('Error in draft replies API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
