'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Edit, Save } from 'lucide-react'
import { redirect } from 'next/navigation'

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/login')
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(session?.user?.name || '')

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading profile...
          </h2>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated (additional safety)
  if (status === 'unauthenticated') {
    redirect('/auth/login')
  }

  const handleSave = async () => {
    if (session?.user) {
      try {
        // Implement profile update logic here
        setIsEditing(false)
      } catch (error) {
        console.error('Failed to update profile', error)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent border-b border-white/50 text-2xl font-bold focus:outline-none focus:border-white"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold">{session.user?.name}</h2>
                  )}
                  <p className="text-sm text-white/80">{session.user?.email}</p>
                </div>
              </div>
              <button 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
              >
                {isEditing ? <Save className="w-6 h-6" /> : <Edit className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl">
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Email</h3>
                    <p className="text-gray-900 dark:text-white">{session.user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl">
                <div className="flex items-center space-x-4">
                  <Calendar className="w-6 h-6 text-green-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Member Since</h3>
                    <p className="text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Profile Sections */}
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Account Settings
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    Notifications
                  </span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                      type="checkbox" 
                      name="toggle" 
                      id="toggle" 
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label 
                      htmlFor="toggle" 
                      className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    ></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}