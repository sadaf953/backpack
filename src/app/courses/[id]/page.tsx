'use client'

import { courses } from '@/lib/courses'
import { notFound, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ExternalLink, Plus, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function CoursePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const course = courses.find(c => c.id.toString() === params.id)
  const [isAdded, setIsAdded] = useState(false)
  
  useEffect(() => {
    // Check if course is already in dashboard
    const savedCourses = localStorage.getItem('savedCourses')
    if (savedCourses) {
      const courses = JSON.parse(savedCourses)
      setIsAdded(courses.some((c: any) => c.id.toString() === params.id))
    }
  }, [params.id])

  if (!course) {
    notFound()
  }

  const handleDashboardAction = () => {
    if (isAdded) {
      router.push('/dashboard')
    } else {
      // Add course to dashboard
      const savedCourses = localStorage.getItem('savedCourses')
      const courses = savedCourses ? JSON.parse(savedCourses) : []
      courses.push(course)
      localStorage.setItem('savedCourses', JSON.stringify(courses))
      setIsAdded(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Course Image */}
            <div className="p-4 lg:p-6">
              <div className="sticky top-8">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>

            {/* Right Column - Course Info */}
            <div className="p-4 lg:p-8 lg:pr-12">
              {/* Course Title and Stats */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  {course.title}
                </h1>
                

                {/* Instructor & Platform */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                        <p className="font-medium text-gray-900 dark:text-white">{course.author}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Platform</p>
                        <p className="font-medium text-gray-900 dark:text-white">{course.platform}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="prose dark:prose-invert max-w-none mb-8">
                  <h2 className="text-xl font-semibold mb-4">About this course</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{course.description}</p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 
                             text-white rounded-xl font-medium shadow-lg shadow-blue-500/20
                             hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 
                             transition-all duration-200 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <span>Start Learning</span>
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </a>
                  
                  <button
                    onClick={handleDashboardAction}
                    className={`inline-flex items-center justify-center px-8 py-4 
                             text-white rounded-xl font-medium shadow-lg
                             transform hover:-translate-y-0.5 transition-all duration-200 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                             ${isAdded 
                               ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 focus:ring-purple-500'
                               : 'bg-gradient-to-r from-green-600 to-green-700 shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/40 focus:ring-green-500'
                             }`}
                  >
                    <span>{isAdded ? 'Go to Dashboard' : 'Add to Dashboard'}</span>
                    {isAdded ? <CheckCircle className="w-5 h-5 ml-2" /> : <Plus className="w-5 h-5 ml-2" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
