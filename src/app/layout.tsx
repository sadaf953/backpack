'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { Fredoka } from 'next/font/google'
import { Providers } from './providers'
import { AuthProvider } from '@/contexts/AuthContext'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })
const fredoka = Fredoka({ 
  weight: ['500', '600'],
  subsets: ['latin'] 
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} ${fredoka.className} bg-gray-50 dark:bg-gray-900 min-h-screen`}>
        <Providers>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
