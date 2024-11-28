'use client'

import { courses } from '@/lib/courses'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'

export default function CoursePage({ params }: { params: { id: string } }) {
  const course = courses.find(c => c.id.toString() === params.id)
  
  if (!course) {
    notFound()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      >
        <div className="relative h-64 sm:h-96 group">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="p-8"
        >
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{course.title}</h1>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex items-center mb-6 bg-gray-50 p-4 rounded-lg"
          >
            <span className="text-yellow-400 text-2xl mr-2">★</span>
            <span className="font-medium text-gray-800">{course.rating}</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-gray-600">{course.learners.toLocaleString()} learners</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-blue-800">Instructor</h2>
              <p className="text-gray-700">{course.author}</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-purple-800">Platform</h2>
              <p className="text-gray-700">{course.platform}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="bg-gray-50 p-6 rounded-lg mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Description</h2>
            <p className="text-gray-600 leading-relaxed">{course.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="flex justify-center md:justify-start"
          >
            <a
              href={course.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold 
                       hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span>Go to Course</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
