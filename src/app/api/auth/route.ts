import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

// In-memory storage (replace with database in production)
let users: any[] = []
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    // Handle signup
    if (action === 'signup') {
      const { email, password, name } = data

      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      // Check if user already exists
      if (users.find(u => u.email === email)) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
      }

      // Create new user
      const newUser = {
        id: users.length + 1,
        email,
        password,
        name,
        isEmailVerified: true,
        isAdmin: false
      }
      users.push(newUser)

      // Create and sign JWT token
      const token = await new SignJWT({ 
        userId: newUser.id,
        email: newUser.email,
        isAdmin: newUser.isAdmin 
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

      return NextResponse.json({ success: true })
    }

    // Handle login
    if (action === 'login') {
      const { email, password } = data

      const user = users.find(u => u.email === email && u.password === password)
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const token = await new SignJWT({ 
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin 
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(JWT_SECRET)

      cookies().set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// Handle GET requests for session validation
export async function GET(request: NextRequest) {
  try {
    const session = cookies().get('session')
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    const { payload } = await jwtVerify(session.value, JWT_SECRET)
    return NextResponse.json({ user: payload })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
}
