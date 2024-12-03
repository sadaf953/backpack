'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { Logo } from './Logo'

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Logo />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/courses"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium
                  ${pathname === '/courses'
                    ? 'border-b-2 border-blue-500 text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                Courses
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Sign Up
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
