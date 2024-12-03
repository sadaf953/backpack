'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CourseCard } from '@/components/CourseCard'
import { CourseFilters } from '@/components/CourseFilters'
import { getCourses, type Course } from '@/lib/courses'
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
  const [courses] = useState<Course[]>(getCourses())
  const [filters, setFilters] = useState<Filters>({
    search: '',
    platform: '',
    rating: null,
    sort: 'popular'
  })

  const platforms = useMemo(() => {
    return Array.from(new Set(courses.map(course => course.platform)))
  }, [courses])

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = 
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.author.toLowerCase().includes(filters.search.toLowerCase())
      const matchesPlatform = !filters.platform || course.platform === filters.platform
      const matchesRating = !filters.rating || (course.rating || 0) >= filters.rating
      
      return matchesSearch && matchesPlatform && matchesRating
    }).sort((a, b) => {
      switch(filters.sort) {
        case 'popular':
          return (b.learners || 0) - (a.learners || 0)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
          return (b.id || 0) - (a.id || 0)
        default:
          return 0
      }
    })
  }, [courses, filters])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Courses</h1>
        <Link 
          href="/courses/create" 
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="mr-2" /> Add Course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Column */}
        <div className="md:col-span-1">
          <CourseFilters 
            filters={filters} 
            onFilterChange={setFilters} 
            platforms={platforms}
          />
        </div>

        {/* Courses Column */}
        <div className="md:col-span-3">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
              />
            ))}
          </motion.div>

          {filteredCourses.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              No courses found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
