'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { AlertCircle, Upload, Link, Lock } from 'lucide-react'

// YouTube URL validation and thumbnail extraction
const isYouTubeUrl = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/).+/
  return youtubeRegex.test(url)
}

const getYouTubeThumbnail = (url: string): string => {
  let videoId = ''
  
  try {
    // Extract video ID from different URL formats
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split(/[?#]/)[0]
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('shorts/')[1].split(/[?#]/)[0]
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1].split(/[?#]/)[0]
    } else if (url.includes('youtube.com/v/')) {
      videoId = url.split('v/')[1].split(/[?#]/)[0]
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search)
      videoId = urlParams.get('v') || ''
    }

    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ''
  } catch (error) {
    console.error('Error parsing YouTube URL:', error)
    return ''
  }
}

export default function CreateCoursePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    level: 'Beginner',
    topics: '',
    price: '',
    url: '',
    imageUrl: '',
    imageFile: null as File | null,
    isLocal: false,
    submitForReview: false
  })
  const [imagePreview, setImagePreview] = useState<string>('')

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  // Update image preview when URL changes
  useEffect(() => {
    const updateThumbnail = () => {
      if (formData.url && isYouTubeUrl(formData.url)) {
        const thumbnail = getYouTubeThumbnail(formData.url)
        if (thumbnail) {
          console.log('Setting thumbnail:', thumbnail)
          setFormData(prev => ({ ...prev, imageUrl: thumbnail }))
          setImagePreview(thumbnail)
        }
      }
    }
    updateThumbnail()
  }, [formData.url])

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData(prev => ({ ...prev, imageUrl: url }))
    setImagePreview(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData(prev => ({ ...prev, imageFile: file, imageUrl: '' }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Validate form data
      if (!formData.title || !formData.description || !formData.instructor || !formData.duration || !formData.url) {
        setError('Please fill in all required fields')
        return
      }

      // Determine course image
      let courseImage = '/placeholder-course.jpg'
      if (isYouTubeUrl(formData.url)) {
        courseImage = getYouTubeThumbnail(formData.url)
      } else if (formData.imageUrl) {
        courseImage = formData.imageUrl
      } else if (formData.imageFile) {
        courseImage = imagePreview
      }

      // Create new course
      const newCourse = {
        id: Date.now(),
        ...formData,
        topics: formData.topics ? formData.topics.split(',').map(topic => topic.trim()) : [],
        price: formData.price === '' ? 0 : parseFloat(formData.price),
        image: courseImage,
        createdAt: new Date().toISOString(),
        visibility: formData.isLocal ? 'private' : 'public',
        status: formData.isLocal ? 'active' : (formData.submitForReview ? 'pending_review' : 'draft'),
        createdBy: {
          id: user!.id,
          name: user!.name,
          email: user!.email
        }
      }

      // Save to appropriate storage based on visibility
      if (formData.isLocal) {
        // For local courses, save to savedCourses
        const savedCourses = JSON.parse(localStorage.getItem('savedCourses') || '[]')
        savedCourses.push(newCourse)
        localStorage.setItem('savedCourses', JSON.stringify(savedCourses))
        router.push('/dashboard')
      } else {
        // For public courses, save to courses
        const courses = JSON.parse(localStorage.getItem('courses') || '[]')
        courses.push(newCourse)
        localStorage.setItem('courses', JSON.stringify(courses))
        router.push('/courses')
      }
    } catch (err) {
      console.error('Error creating course:', err)
      setError('Failed to create course. Please try again.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create a New Course</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Share your knowledge with the world
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="e.g., Introduction to Web Development"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="Describe your course content and learning outcomes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instructor Name
            </label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="Your name or organization"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                placeholder="e.g., 6 weeks"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="e.g., https://www.coursera.org/learn/web-development"
            />
          </div>

          {/* Local Course Toggle */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isLocal"
                  name="isLocal"
                  checked={formData.isLocal}
                  onChange={(e) => {
                    const isLocal = e.target.checked;
                    setFormData(prev => ({ 
                      ...prev, 
                      isLocal,
                      submitForReview: isLocal ? false : prev.submitForReview 
                    }))
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-400
                           dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="isLocal" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Lock className="w-4 h-4" />
                  Add to My Dashboard Only
                </label>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This course will only be visible in your personal dashboard
              </p>
            </div>

            {/* Course Image Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Image
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <img 
                    src={imagePreview} 
                    alt="Course preview" 
                    className="w-full max-w-md h-48 object-cover rounded-xl"
                  />
                </div>
              )}

              {/* Show image options only if not YouTube URL */}
              {!isYouTubeUrl(formData.url) && (
                <div className="space-y-4">
                  {/* Image URL input */}
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <Link className="w-4 h-4" />
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={handleImageUrlChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter image URL"
                    />
                  </div>

                  {/* File upload */}
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <Upload className="w-4 h-4" />
                      Or upload an image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                               file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0
                               file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                               hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Topics (comma-separated)
              </label>
              <input
                type="text"
                name="topics"
                value={formData.topics}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                placeholder="e.g., HTML, CSS, JavaScript (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price ($)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="29.99"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, price: '' }))}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl
                           hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500
                           dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                >
                  Make Free
                </button>
              </div>
            </div>

            {/* Submit for Review Option - Only show if not local */}
            {!formData.isLocal && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="submitForReview"
                    name="submitForReview"
                    checked={formData.submitForReview}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      submitForReview: e.target.checked 
                    }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-400
                             dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label htmlFor="submitForReview" className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                    Submit for Review
                  </label>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Your course will be reviewed before being published to all users
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="w-full px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400
                         transition-colors duration-200"
              >
                {formData.isLocal ? "Publish Now" : (formData.submitForReview ? "Submit for Review" : "Save as Draft")}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
