'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'
import type { Course, CourseStatus } from '@/lib/types'

export default function AdminPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedTab, setSelectedTab] = useState<CourseStatus>('pending')

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
      return
    }

    // Load courses from localStorage
    const storedCourses = JSON.parse(localStorage.getItem('courses') || '[]')
    setCourses(storedCourses)
  }, [isAdmin, router])

  const handleStatusChange = (courseId: string, status: CourseStatus, feedback?: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          status,
          feedback: feedback || course.feedback
        }
      }
      return course
    })

    localStorage.setItem('courses', JSON.stringify(updatedCourses))
    setCourses(updatedCourses)
  }

  const filteredCourses = courses.filter(course => course.status === selectedTab)

  const statusColors = {
    pending: 'text-yellow-500',
    approved: 'text-green-500',
    rejected: 'text-red-500'
  }

  const StatusIcon = ({ status }: { status: CourseStatus }) => {
    switch (status) {
      case 'pending':
        return <Clock className={`w-5 h-5 ${statusColors.pending}`} />
      case 'approved':
        return <CheckCircle className={`w-5 h-5 ${statusColors.approved}`} />
      case 'rejected':
        return <XCircle className={`w-5 h-5 ${statusColors.rejected}`} />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Review and manage course submissions
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
          {(['pending', 'approved', 'rejected'] as CourseStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedTab(status)}
              className={`pb-4 px-4 relative ${
                selectedTab === status
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <StatusIcon status={status} />
                <span className="capitalize">{status}</span>
                <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-sm">
                  {courses.filter(course => course.status === status).length}
                </span>
              </div>
              {selectedTab === status && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                />
              )}
            </button>
          ))}
        </div>

        {/* Course List */}
        <div className="space-y-6">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No {selectedTab} courses found</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <img
                        src={course.image || '/placeholder-course.jpg'}
                        alt={course.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {course.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">by {course.instructor}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Submitted by: {course.createdBy?.name || 'Unknown'}
                          </span>
                          
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">{course.description}</p>
                    
                    {course.feedback && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white">Feedback</h4>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">{course.feedback}</p>
                      </div>
                    )}
                  </div>

                  {selectedTab === 'pending' && (
                    <div className="flex gap-3 ml-6">
                      <button
                        onClick={() => {
                          const feedback = prompt('Add feedback for approval (optional):')
                          handleStatusChange(course.id, 'approved', feedback || undefined)
                        }}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200
                                 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50
                                 transition-colors duration-200"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          const feedback = prompt('Please provide a reason for rejection:')
                          if (feedback) {
                            handleStatusChange(course.id, 'rejected', feedback)
                          }
                        }}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200
                                 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50
                                 transition-colors duration-200"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
