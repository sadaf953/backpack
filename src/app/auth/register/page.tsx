"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerSchema, type RegisterSchema } from "@/lib/validations/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterSchema) => {
    try {
      setLoading(true)
      setError("")

      console.log("Form data being submitted:", data)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      })

      console.log("Response status:", response.status)
      const responseData = await response.json()
      console.log("Response data:", responseData)

      if (!response.ok) {
        if (responseData.errors) {
          const errorMessages = responseData.errors
            .map((err: { path: string, message: string }) => err.message)
            .join(", ")
          throw new Error(errorMessages)
        }
        
        throw new Error(responseData.message || "Registration failed")
      }

      router.push("/auth/login?registered=true")
    } catch (error) {
      console.error("Registration error:", error)
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(222.2,84%,4.9%)] p-6 sm:p-8 lg:p-12">
      <div className="w-full max-w-xl space-y-10 bg-white p-8 sm:p-10 rounded-xl shadow-xl">
        <div className="space-y-6">
          <h2 className="text-center text-4xl font-extrabold text-gray-900">
            Sign up for an account
          </h2>
          <p className="text-center text-lg text-gray-600">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              log in to your account
            </Link>
          </p>
        </div>
        <form className="mt-12 space-y-8" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="space-y-6">
            <div className="space-y-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-transparent placeholder-white text-white bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg disabled:bg-[#2563eb] disabled:opacity-100"
                placeholder="Full Name"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-transparent placeholder-white text-white bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg disabled:bg-[#2563eb] disabled:opacity-100"
                placeholder="Email address"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-transparent placeholder-white text-white bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg disabled:bg-[#2563eb] disabled:opacity-100"
                placeholder="Password"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-transparent placeholder-white text-white bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg disabled:bg-[#2563eb] disabled:opacity-100"
                placeholder="Confirm password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-medium rounded-lg text-white bg-[#2563eb] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-100"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 001 1h2a1 1 0 100-2h-1V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
          {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  )
}