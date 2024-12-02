import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Basic hardcoded credentials for simplicity
    if (email === 'admin@example.com' && password === 'password123') {
      // Create token
      const token = await new SignJWT({ 
        userId: '1',
        email: email,
        isAdmin: true
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(JWT_SECRET)

      // Set the token in cookies
      cookies().set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return NextResponse.json({ 
        success: true,
        user: {
          id: '1',
          email: email,
          isAdmin: true
        }
      })
    }

    // Invalid credentials
    return NextResponse.json({ 
      success: false, 
      message: 'Invalid credentials' 
    }, { status: 401 })

  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Authentication failed' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const sessionToken = cookies().get('session')?.value
  
  if (!sessionToken) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
  }

  try {
    // You would typically verify the JWT token here
    return NextResponse.json({ 
      success: true,
      user: {
        id: '1',
        email: 'admin@example.com',
        isAdmin: true
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 })
  }
}
