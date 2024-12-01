'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { verifyEmail, resendVerification, user } = useAuth()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setStatus('error')
      setError('No verification token provided')
      return
    }

    verifyEmail(token)
      .then(() => {
        setStatus('success')
      })
      .catch((err) => {
        setStatus('error')
        setError(err.message)
      })
  }, [searchParams, verifyEmail])

  const handleResendVerification = async () => {
    try {
      await resendVerification()
      setError('New verification email has been sent!')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
      >
        {status === 'verifying' ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Verifying your email
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we verify your email address...
            </p>
          </>
        ) : status === 'success' ? (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your email has been successfully verified. You can now access all features of Backpack.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error}
            </p>
            {user && !user.isVerified && (
              <button
                onClick={handleResendVerification}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Verification Email
              </button>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
