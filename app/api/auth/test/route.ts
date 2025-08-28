import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  const config = {
    clientId: clientId ? '✅ Set' : '❌ Missing',
    clientSecret: clientSecret ? '✅ Set' : '❌ Missing',
    appUrl: appUrl ? '✅ Set' : '❌ Missing',
    redirectUri: `${appUrl}/api/auth/callback`
  }

  return NextResponse.json({
    message: 'OAuth Configuration Status',
    config,
    instructions: 'Check the config object above. All values should show "✅ Set"'
  })
}
