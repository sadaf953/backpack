export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image skeleton */}
        <div className="relative h-64 sm:h-96 bg-gray-200" />
        
        <div className="p-8">
          {/* Title skeleton */}
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          
          {/* Rating skeleton */}
          <div className="flex items-center mb-4">
            <div className="h-4 bg-gray-200 rounded w-24 mr-2" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
          
          {/* Instructor skeleton */}
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-48" />
          </div>
          
          {/* Platform skeleton */}
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-40" />
          </div>
          
          {/* Description skeleton */}
          <div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
          
          {/* Button skeleton */}
          <div className="mt-8">
            <div className="h-12 bg-gray-200 rounded w-40" />
          </div>
        </div>
      </div>
    </div>
  )
}
