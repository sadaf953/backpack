'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const codeId = searchParams.get('codeId')

  useEffect(() => {
    if (!codeId) {
      router.push('/auth/signup')
    }
  }, [codeId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Ensure code is exactly 6 digits and trim any whitespace
      const cleanCode = verificationCode.trim()
      console.log('Verification attempt:', {
        codeId,
        originalCode: verificationCode,
        cleanCode,
        codeLength: cleanCode.length
      })

      if (cleanCode.length !== 6) {
        throw new Error('Verification code must be 6 digits')
      }

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify',
          codeId,
          code: cleanCode,
        }),
      })

      const data = await response.json()
      console.log('Server response:', {
        status: response.status,
        data
      })

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      // On success, redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Verification error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle code input
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 6 characters
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
    setVerificationCode(value)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the 6-digit code sent to your email
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="verification-code" className="sr-only">
                Verification Code
              </label>
              <input
                id="verification-code"
                name="code"
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={verificationCode}
                onChange={handleCodeChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit code"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading || verificationCode.length !== 6
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
