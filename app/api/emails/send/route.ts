import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { emailId, replyText } = await request.json()
    const googleToken = request.headers.get('X-Google-Access-Token')
    
    if (!googleToken) {
      return NextResponse.json(
        { success: false, error: 'Missing Google access token' },
        { status: 401 }
      )
    }

    if (!emailId || !replyText) {
      return NextResponse.json(
        { success: false, error: 'Missing email ID or reply text' },
        { status: 400 }
      )
    }

    // Mock email sending - in production this would use Gmail API
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully'
    })
  } catch (error) {
    console.error('Error in send email API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
