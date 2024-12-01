'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CourseCard } from '@/components/CourseCard'
import { CourseFilters } from '@/components/CourseFilters'
import { courses, type Course } from '@/lib/courses'
import { Plus } from 'lucide-react'
import Link from 'next/link'

type SortType = 'popular' | 'rating' | 'newest'

interface Filters {
  search: string
  platform: string
  rating: number | null
  sort: SortType
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    platform: '',
    rating: null,
    sort: 'popular'
  })

  useEffect(() => {
    try {
      console.log('Initial render')
      setIsLoading(false)
    } catch (err) {
      console.error('Error loading courses:', err)
      setError(err?.message || 'Failed to load courses')
      setIsLoading(false)
    }
  }, [])

  const platforms = useMemo(() => {
    try {
      return Array.from(new Set(courses?.map(course => course.platform) || []))
    } catch (err) {
      console.error('Error computing platforms:', err)
      return []
    }
  }, [])

  const filteredCourses = useMemo(() => {
    try {
      if (!Array.isArray(courses)) {
        console.error('Courses is not an array:', courses)
        return []
      }

      return courses
        .filter((course: Course) => {
          const matchesSearch = !filters.search || 
            course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            course.author.toLowerCase().includes(filters.search.toLowerCase())
          
          const matchesPlatform = !filters.platform || 
            course.platform === filters.platform
          
          const matchesRating = !filters.rating || 
            course.rating >= filters.rating

          return matchesSearch && matchesPlatform && matchesRating
        })
        .sort((a: Course, b: Course) => {
          switch (filters.sort) {
            case 'popular':
              return b.learners - a.learners
            case 'rating':
              return b.rating - a.rating
            case 'newest':
              return b.id - a.id
            default:
              return 0
          }
        })
    } catch (err) {
      console.error('Error filtering courses:', err)
      return []
    }
  }, [filters])

  const handleFilterChange = (newFilters: Filters) => {
    console.log('Updating filters:', newFilters)
    setFilters(newFilters)
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 dark:border-blue-400 rounded-full 
                        animate-spin border-t-transparent"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Error Loading Courses
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar with Filters */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="sticky top-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Filters
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Refine your course search
            </p>
          </motion.div>

          <CourseFilters
            platforms={platforms}
            onFilterChange={handleFilterChange}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Available Courses
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {filteredCourses.length} courses found
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/courses/create"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white rounded-xl font-medium shadow-lg shadow-blue-500/20
                       hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 
                       transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Course
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course: Course, index: number) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your filters or search terms
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
