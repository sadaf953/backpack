'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: number
  email: string
  name: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<{ verificationToken: string }>
  logout: () => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  resendVerification: (email: string) => Promise<{ verificationToken: string }>
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check session on mount
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user as User)
        }
      })
      .catch(console.error)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error)
    }

    setUser(data.user)
  }

  const signup = async (email: string, password: string, name: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signup', email, password, name })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error)
    }

    return { verificationToken: data.verificationToken }
  }

  const logout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    })

    setUser(null)
  }

  const verifyEmail = async (token: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', token })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error)
    }
  }

  const resendVerification = async (email: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resend-verification', email })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error)
    }

    return { verificationToken: data.verificationToken }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout,
      verifyEmail,
      resendVerification,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
