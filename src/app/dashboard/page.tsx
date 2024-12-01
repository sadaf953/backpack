'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Users, Trash2, ExternalLink, Search } from 'lucide-react'
import Link from 'next/link'

// This would normally come from a backend/database
const getSavedCourses = () => {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('savedCourses')
  return saved ? JSON.parse(saved) : []
}

export default function DashboardPage() {
  const [savedCourses, setSavedCourses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setSavedCourses(getSavedCourses())
  }, [])

  const removeCourse = (courseId: string) => {
    const updatedCourses = savedCourses.filter((course: any) => course.id.toString() !== courseId)
    setSavedCourses(updatedCourses)
    localStorage.setItem('savedCourses', JSON.stringify(updatedCourses))
  }

  const filteredCourses = savedCourses.filter((course: any) => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.platform.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            My Learning Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track and manage your educational journey
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your courses..."
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 
                       rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <img
                src="/icons/backpack.svg"
                alt="Empty backpack"
                className="w-24 h-24 mx-auto opacity-50"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No courses yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start adding courses to your dashboard to track your learning journey
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white rounded-xl font-medium shadow-lg shadow-blue-500/20
                       hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 
                       transition-all duration-200"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course: any) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Course Image */}
                <div className="relative h-48">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => removeCourse(course.id.toString())}
                      className="p-2 bg-red-500 bg-opacity-90 rounded-lg text-white
                               hover:bg-opacity-100 transition-all duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="text-gray-700 dark:text-gray-300">{course.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-1" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {course.learners.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {course.platform}
                      </p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {course.author}
                      </p>
                    </div>
                    <a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
                               text-white rounded-lg text-sm font-medium shadow-md shadow-blue-500/20
                               hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 
                               transition-all duration-200"
                    >
                      <span>Continue</span>
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
