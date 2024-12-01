import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import crypto from 'crypto'
import { sendVerificationCode } from '@/lib/email'

// In-memory storage (replace with database in production)
let users: any[] = []
let verificationCodes: Map<string, { code: string, email: string, userId: number }> = new Map()
let verificationAttempts = new Map<string, { code: string; password: string; timestamp: number; attempts: number }>()

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

// Maximum attempts allowed
const MAX_VERIFICATION_ATTEMPTS = 5
// Time window for attempts (in milliseconds) - 15 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    console.log('Received auth request:', { action, ...data, password: '[REDACTED]' })

    // Handle signup
    if (action === 'signup') {
      try {
        console.log('Processing signup request...')
        const { email, password, name } = data

        if (!email || !password || !name) {
          console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name })
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = users.find(u => u.email === email)
        if (existingUser) {
          console.log('User already exists:', email)
          return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
        }

        // Create new user immediately
        const newUser = {
          id: Date.now(),
          email,
          password,
          name,
          isAdmin: email === 'admin@backpack.edu',
          isEmailVerified: false,
        }
        users.push(newUser)
        console.log('Created new user:', { ...newUser, password: '[REDACTED]' })
        console.log('Current users:', users.map(u => ({ ...u, password: '[REDACTED]' })))

        // Create verification code (6 digits)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const codeId = crypto.randomBytes(16).toString('hex')
        
        // Store verification data BEFORE sending email
        verificationCodes.set(codeId, {
          code: verificationCode,
          email,
          userId: newUser.id
        })

        // Debug log for verification storage
        console.log('Stored verification data:', {
          codeId,
          storedData: verificationCodes.get(codeId),
          allCodes: Array.from(verificationCodes.entries())
        })

        // Send verification email
        await sendVerificationCode(email, verificationCode)
        console.log('Sent verification code to:', email)

        return NextResponse.json({ 
          message: 'Verification code sent',
          codeId,
          user: {
            email: newUser.email,
            name: newUser.name,
            isEmailVerified: newUser.isEmailVerified
          }
        })
      } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
      }
    }

    // Handle verification
    if (action === 'verify') {
      try {
        const { codeId, code, password } = data
        
        // Debug logs for verification attempt
        console.log('Verifying code:', { 
          codeId: codeId,
          code: code,
          hasPassword: !!password 
        })

        // Check if verification data exists
        const verificationData = verificationAttempts.get(codeId)
        if (!verificationData) {
          console.log('No verification data found for codeId:', codeId)
          return NextResponse.json({ 
            error: 'Invalid or expired verification code',
            debug: { codeId }
          }, { status: 400 })
        }

        // Check if too many attempts
        if (verificationData.attempts >= MAX_VERIFICATION_ATTEMPTS) {
          return NextResponse.json({ 
            error: 'Too many verification attempts. Please request a new code.',
          }, { status: 429 })
        }

        // Check if code has expired
        const now = Date.now()
        if (now - verificationData.timestamp > ATTEMPT_WINDOW) {
          verificationAttempts.delete(codeId)
          return NextResponse.json({ 
            error: 'Verification code has expired. Please request a new code.',
          }, { status: 400 })
        }

        // Increment attempt counter
        verificationData.attempts++
        verificationAttempts.set(codeId, verificationData)

        // Verify code and password
        const isCodeValid = verificationData.code === code
        const isPasswordValid = verificationData.password === password

        if (!isCodeValid || !isPasswordValid) {
          return NextResponse.json({ 
            error: 'Invalid verification code or password',
            attemptsRemaining: MAX_VERIFICATION_ATTEMPTS - verificationData.attempts
          }, { status: 400 })
        }

        // Success! Remove the used code
        verificationAttempts.delete(codeId)
        
        return NextResponse.json({
          success: true,
          message: 'Verification successful'
        })

      } catch (error) {
        console.error('Verification error:', error)
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
      }
    }

    // Handle login
    if (action === 'login') {
      const { email, password } = data

      const user = users.find(u => u.email === email && u.password === password)
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      if (!user.isEmailVerified) {
        return NextResponse.json({ error: 'Please verify your email first' }, { status: 403 })
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
        maxAge: 86400 // 24 hours
      })

      return NextResponse.json({ 
        message: 'Logged in successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle GET requests for session validation
export async function GET(request: NextRequest) {
  try {
    const token = cookies().get('session')?.value
    if (!token) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const user = users.find(u => u.id === payload.userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      }
    })
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
}
