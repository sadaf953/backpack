'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setError('Invalid reset link')
      return
    }

    // Verify token
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find((u: any) => u.resetToken === token)

    if (!user || !user.resetExpiry || Date.now() > user.resetExpiry) {
      setError('This reset link has expired or is invalid')
      return
    }

    setIsValidToken(true)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    try {
      const token = searchParams.get('token')
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = users.map((user: any) => {
        if (user.resetToken === token) {
          return {
            ...user,
            password,
            resetToken: null,
            resetExpiry: null
          }
        }
        return user
      })

      localStorage.setItem('users', JSON.stringify(updatedUsers))
      setSuccess(true)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  if (error && !isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              {error}
            </h3>
            <Link
              href="/auth/login"
              className="mt-4 inline-block text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <Link
            href="/auth/login"
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl">
            {error}
          </div>
        )}

        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl text-center"
          >
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
              Password reset successful!
            </h3>
            <p className="mt-2 text-green-700 dark:text-green-300">
              Redirecting you to login...
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="sr-only">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="New password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl
                       text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              Reset password
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
