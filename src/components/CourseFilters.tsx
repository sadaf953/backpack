'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

type SortType = 'popular' | 'rating' | 'newest'

interface Filters {
  search: string
  platform: string
  rating: number | null
  sort: SortType
}

interface CourseFiltersProps {
  platforms: string[]
  onFilterChange: (filters: Filters) => void
}

export function CourseFilters({ platforms, onFilterChange }: CourseFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    platform: '',
    rating: null,
    sort: 'popular'
  })

  const handleChange = (
    key: keyof Filters,
    value: string | number | null
  ) => {
    const newFilters = {
      ...filters,
      [key]: value
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
    >
      <div className="space-y-6">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Courses
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search by title or author..."
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Platform Filter */}
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Platform
          </label>
          <select
            id="platform"
            value={filters.platform}
            onChange={(e) => handleChange('platform', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Rating
          </label>
          <select
            id="rating"
            value={filters.rating || ''}
            onChange={(e) => handleChange('rating', e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any Rating</option>
            {[4.5, 4, 3.5, 3].map((rating) => (
              <option key={rating} value={rating}>
                {rating}+ Stars
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value as SortType)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
    </motion.div>
  )
}
