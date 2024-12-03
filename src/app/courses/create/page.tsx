'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, Upload, Link, Lock } from 'lucide-react'
import { addCourse, Course } from '@/lib/courses'

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
  const [error, setError] = useState('')
  const [youtubeLoading, setYoutubeLoading] = useState(false)
  const [youtubeError, setYoutubeError] = useState('')
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
  })
  const [imagePreview, setImagePreview] = useState<string>('')

  

  // Fetch YouTube video details
  const fetchYouTubeDetails = async () => {
    setYoutubeLoading(true)
    setYoutubeError('')

    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formData.url })
      })

      const result = await response.json()

      if (result.success) {
        // Custom parsing for title and instructor
        const rawTitle = result.data.title
        const rawChannelTitle = result.data.channelTitle

        // Try to extract instructor name from channel title
        const parseInstructor = (channelTitle: string) => {
          // Remove common words or suffixes
          const cleanedTitle = channelTitle
            .replace(/\s*(?:Official|Channel|Studio)\s*$/i, '')
            .trim()
          return cleanedTitle
        }

        setFormData(prev => ({
          ...prev,
          title: rawTitle,
          instructor: parseInstructor(rawChannelTitle),
          description: result.data.description.length > 200 
            ? result.data.description.substring(0, 200) + '...' 
            : result.data.description,
          imageUrl: result.data.thumbnails.high.url
        }))
        setImagePreview(result.data.thumbnails.high.url)
      } else {
        setYoutubeError(result.message || 'Failed to fetch video details')
      }
    } catch (error) {
      console.error('YouTube fetch error:', error)
      setYoutubeError('Failed to fetch video details')
    } finally {
      setYoutubeLoading(false)
    }
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
    setError('')
    try {
      // Validate form data
      if (!formData.title.trim()) {
        setError('Title is required')
        return
      }
      if (!formData.description.trim()) {
        setError('Description is required')
        return
      }
      if (!formData.instructor.trim()) {
        setError('Instructor name is required')
        return
      }
      if (!formData.url.trim()) {
        setError('URL is required')
        return
      }
      if (!isYouTubeUrl(formData.url)) {
        setError('Please enter a valid YouTube URL')
        return
      }

      // Add course using the backend function
      const result = await addCourse({
        title: formData.title.trim(),
        description: formData.description.trim(),
        author: formData.instructor.trim(),
        platform: 'YouTube',
        link: formData.url.trim(),
        image: formData.imageUrl || imagePreview || 'https://via.placeholder.com/300x200',
        price: formData.price ? parseFloat(formData.price) : undefined
      })

      if (!result.success) {
        setError(result.error || 'Failed to create course')
        return
      }

      // Reset form and show success
      setFormData({
        title: '',
        description: '',
        instructor: '',
        url: '',
        duration: '',
        topics: '',
        price: '',
        level: 'Beginner',
        imageUrl: '',
        imageFile: null,
        isLocal: false
      })
      setImagePreview('')
      setYoutubeError('')
      setError('Course added successfully!')
      
      // Redirect to courses page
      router.push('/courses')
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
                Duration (optional)
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
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

          <div className="mb-6 flex items-center space-x-4">
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              className="flex-grow px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="Course URL or YouTube Link"
            />
            <button
              type="button"
              onClick={fetchYouTubeDetails}
              disabled={!formData.url || youtubeLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl 
                       hover:bg-blue-700 transition disabled:opacity-50"
            >
              {youtubeLoading ? 'Fetching...' : 'Fetch Details'}
            </button>
          </div>

          {youtubeError && (
            <div className="mb-4 text-red-600 dark:text-red-400">
              {youtubeError}
            </div>
          )}

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
                placeholder="450"
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

            {/* Submit Button */}
            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="w-full px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400
                         transition-colors duration-200"
              >
                {formData.isLocal ? "Publish Now" : "Add to Courses List"}
              </button>
            </div>
         
        </form>
      </motion.div>
    </div>
  )
}
