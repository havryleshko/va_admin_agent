import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { emailId } = await request.json()
    const googleToken = request.headers.get('X-Google-Access-Token')
    
    if (!googleToken) {
      return NextResponse.json(
        { success: false, error: 'Missing Google access token' },
        { status: 401 }
      )
    }

    if (!emailId) {
      return NextResponse.json(
        { success: false, error: 'Missing email ID' },
        { status: 400 }
      )
    }

    // Mock email discarding - in production this would use Gmail API
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: 'Email discarded successfully'
    })
  } catch (error) {
    console.error('Error in discard email API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
