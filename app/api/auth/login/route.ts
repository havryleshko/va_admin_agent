import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Mock authentication - replace with actual backend integration
    if (email && password) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock successful login
      const user = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        image: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=3b82f6&color=fff`
      }

      const token = 'mock-jwt-token-' + Date.now()

      return NextResponse.json({
        user,
        token,
        message: 'Login successful'
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
