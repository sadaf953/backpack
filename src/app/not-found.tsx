'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center px-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                   inline-block transition-colors duration-200 focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                   dark:focus:ring-offset-gray-900"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
