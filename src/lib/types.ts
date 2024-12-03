export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  topics: string[]
  image: string
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
  visibility: 'public' | 'private'
  createdBy: {
    id: number
    name: string
    email: string
  }
  feedback?: string
  price?: number
}

export type CourseStatus = 'pending' | 'approved' | 'rejected'
export type CourseVisibility = 'public' | 'private'

export interface User {
  id: number
  name: string
  email: string
  isAdmin: boolean
}
