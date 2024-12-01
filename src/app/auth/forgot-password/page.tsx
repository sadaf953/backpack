'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find((u: any) => u.email === email)

      if (!user) {
        setError('No account found with this email address')
        return
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15)
      const resetExpiry = Date.now() + 3600000 // 1 hour from now

      // Update user with reset token
      const updatedUsers = users.map((u: any) => {
        if (u.email === email) {
          return {
            ...u,
            resetToken,
            resetExpiry
          }
        }
        return u
      })

      localStorage.setItem('users', JSON.stringify(updatedUsers))

      // In a real app, send email here
      console.log(`Reset link: /auth/reset-password?token=${resetToken}`)

      setSuccess(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
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
            Enter your email address and we'll send you a link to reset your password
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
              Check your email
            </h3>
            <p className="mt-2 text-green-700 dark:text-green-300">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
            <Link
              href="/auth/login"
              className="mt-4 inline-block text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200"
            >
              Return to login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl
                       text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              Send reset link
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
