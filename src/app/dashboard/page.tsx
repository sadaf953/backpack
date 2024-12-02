'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, ExternalLink, Search, Plus, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// This would normally come from a backend/database
const getSavedCourses = () => {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem('savedCourses')
  return saved ? JSON.parse(saved) : []
}

export default function DashboardPage() {
  const [savedCourses, setSavedCourses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [youtubeVideoDetails, setYoutubeVideoDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSavedCourses(getSavedCourses())
  }, [])

  const removeCourse = (courseId: string) => {
    const updatedCourses = savedCourses.filter((course: any) => course.id.toString() !== courseId)
    setSavedCourses(updatedCourses)
    localStorage.setItem('savedCourses', JSON.stringify(updatedCourses))
  }

  const handleYouTubeUrlSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setYoutubeVideoDetails(null)

    try {
      console.log('Submitting YouTube URL:', youtubeUrl)
      
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl })
      })

      console.log('Response status:', response.status)

      const result = await response.json()
      console.log('API Response:', result)

      if (result.success) {
        setYoutubeVideoDetails(result.data)
      } else {
        console.error('API Error:', result.message)
        alert(result.message || 'Failed to fetch video details')
      }
    } catch (error) {
      console.error('Fetch Error:', error)
      alert('Failed to fetch video details. Check the URL and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const addYoutubeCourse = () => {
    if (youtubeVideoDetails) {
      const newCourse = {
        id: Date.now().toString(),
        title: youtubeVideoDetails.title,
        platform: 'YouTube',
        instructor: youtubeVideoDetails.channelTitle,
        image: youtubeVideoDetails.thumbnails.high.url,
        link: youtubeUrl,
        description: youtubeVideoDetails.description
      }

      const updatedCourses = [...savedCourses, newCourse]
      setSavedCourses(updatedCourses)
      localStorage.setItem('savedCourses', JSON.stringify(updatedCourses))
      
      // Reset modal
      setIsYouTubeModalOpen(false)
      setYoutubeUrl('')
      setYoutubeVideoDetails(null)
    }
  }

  const filteredCourses = savedCourses.filter((course: any) => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.platform.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                My Learning Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Track and manage your educational journey
              </p>
            </div>
            <button 
              onClick={() => setIsYouTubeModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5 mr-2" /> Add YouTube Video
            </button>
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
              <button 
                onClick={() => setIsYouTubeModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                           text-white rounded-xl font-medium shadow-lg shadow-blue-500/20
                           hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 
                           transition-all duration-200"
              >
                Add YouTube Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course: any) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={course.image || '/placeholder-course.jpg'}
                      alt={course.title}
                      fill
                      onError={(e) => {
                        console.error('Image load error:', course.image);
                        e.currentTarget.src = '/placeholder-course.jpg';
                      }}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {course.instructor}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {course.platform}
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

      {/* YouTube Video Modal */}
      {isYouTubeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md relative">
            <button 
              onClick={() => setIsYouTubeModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Add YouTube Video
            </h2>
            <form onSubmit={handleYouTubeUrlSubmit} className="space-y-4">
              <input 
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Enter YouTube Video URL"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                required
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isLoading ? 'Fetching...' : 'Fetch Video Details'}
              </button>
            </form>

            {youtubeVideoDetails && (
              <div className="mt-6">
                <img 
                  src={youtubeVideoDetails.thumbnails.high.url} 
                  alt={youtubeVideoDetails.title} 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {youtubeVideoDetails.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {youtubeVideoDetails.channelTitle}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-3 mb-4">
                  {youtubeVideoDetails.description}
                </p>
                <button 
                  onClick={addYoutubeCourse}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Add to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
