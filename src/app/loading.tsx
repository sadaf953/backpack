export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 dark:border-blue-400 rounded-full 
                        animate-spin border-t-transparent"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  )
}