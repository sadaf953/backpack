 'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Plus } from 'lucide-react'

interface CourseCardProps {
  course: {
    id: number
    title: string
    author: string
    platform: string
    image: string
    description: string
    price?: number
    createdBy?: {
      name: string
      id: string
    }
  }
  index: number
  onAddToCourse?: (courseId: number) => void
}

export function CourseCard({ course, index, onAddToCourse }: CourseCardProps) {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    console.log('Rendering CourseCard:', { course, index })
  }, [course, index])

  const handleAddToCourse = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click event
    if (!session) {
      router.push('/auth/login')
      return
    }
    if (onAddToCourse) {
      onAddToCourse(course.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group cursor-pointer relative"
      onClick={() => router.push(`/courses/${course.id}`)}
    >
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 
                    transform hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-sm font-medium">{course.platform}</p>
          </div>
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 
                       transition-colors duration-300 text-ellipsis overflow-hidden">
                {course.title}
              </h3>
              {/* Shared by badge */}
              {course.createdBy && (
                <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  Shared by {course.createdBy.name}
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              by {course.createdBy?.name || course.author}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-3">
              {course.description}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              {course.price ? `$${course.price.toLocaleString()}` : 'Free'}
            </p>
          </div>
        </div>

        <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 
                      transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}
