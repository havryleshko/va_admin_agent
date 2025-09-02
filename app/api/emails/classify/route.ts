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

    // Mock AI classification - in production this would call OpenAI API
    const classifiedEmails = emails.map((email: any) => ({
      ...email,
      category: email.category || 'General' // Keep existing category or default to General
    }))

    return NextResponse.json({
      success: true,
      emails: classifiedEmails
    })
  } catch (error) {
    console.error('Error in email classification API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
