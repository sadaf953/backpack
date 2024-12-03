'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Search, Filter, ChevronDown } from 'lucide-react'

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
  filters: Filters
}

export function CourseFilters({ 
  platforms, 
  onFilterChange, 
  filters 
}: CourseFiltersProps) {
  const handleChange = (
    key: keyof Filters,
    value: string | number | null
  ) => {
    const newFilters = {
      ...filters,
      [key]: value
    }
    onFilterChange(newFilters)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h3>

        {/* Search Input */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Courses
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Title or author..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Platform Filter */}
        <div className="mb-4">
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Platform
          </label>
          <select
            id="platform"
            value={filters.platform}
            onChange={(e) => handleChange('platform', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        

        {/* Sort By */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value as SortType)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
