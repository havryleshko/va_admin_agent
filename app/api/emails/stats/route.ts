import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const googleToken = request.headers.get('X-Google-Access-Token')
    
    if (!googleToken) {
      return NextResponse.json(
        { success: false, error: 'Missing Google access token' },
        { status: 401 }
      )
    }

    // Mock email stats - in production this would use Gmail API
    const stats = {
      total: 15,
      unread: 8,
      categorized: 12
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error in email stats API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
