import './globals.css'
import { Inter } from 'next/font/google'
import { Fredoka } from 'next/font/google'
import { Navbar } from '@/components/Navbar'
import { ThemeProvider } from 'next-themes'
import { NextAuthProvider } from './providers'

const inter = Inter({ subsets: ['latin'] })
const fredoka = Fredoka({ 
  subsets: ['latin'],
  variable: '--font-fredoka'
})

export const metadata = {
  title: 'Backpack',
  description: 'Learning Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${fredoka.className}`}>
        <NextAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
