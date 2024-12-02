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
  createdBy: {
    id: number
    name: string
    email: string
  }
  feedback?: string
}

export type CourseStatus = 'pending' | 'approved' | 'rejected'

export interface User {
  id: number
  name: string
  email: string
  isAdmin: boolean
}
