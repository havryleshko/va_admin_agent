

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get current session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }
    
    // Return session info for debugging (without sensitive data)
    const debugInfo = {
      user: {
        id: session.user?.id,
        email: session.user?.email,
        user_metadata: session.user?.user_metadata
      },
      session: {
        access_token: session.access_token ? 'Present' : 'Missing',
        refresh_token: session.refresh_token ? 'Present' : 'Missing',
        provider_token: session.provider_token ? 'Present' : 'Missing',
        token_type: session.token_type,
        expires_at: session.expires_at
      },
      available_keys: Object.keys(session)
    }
    
    return NextResponse.json(debugInfo)
    
  } catch (error) {
    console.error('Debug tokens error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
