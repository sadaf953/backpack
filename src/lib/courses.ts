import { prisma } from './prisma'

export interface Course {
  id?: string
  title: string
  author?: string
  platform: string
  description?: string
  image: string
  link: string
  price?: number
  createdBy?: {
    id?: string
    name?: string
  }
}

export interface CourseResult {
  success: boolean;
  course?: Course;
  error?: string;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Accelerated Student Memory Mastery",
    author: "Dr. Rama Mehta",
    platform: "Udemy",
    description: "Memory Mastery, Memory Retention, Enhancing Self-Esteem & Confidence",
    image: "https://img-b.udemycdn.com/course/240x135/3695326_2d39_3.jpg",
    link: "https://www.udemy.com/course/accelerated-student-memory-mastery/learn/lecture/23763580?start=0#overview",
    
  },
  {
    id: "2",
    title: "Complete Python Bootcamp",
    author: "Jose Portilla",
    platform: "Udemy",
    description: "Learn Python Programming from Beginner to Advanced",
    image: "https://img-b.udemycdn.com/course/240x135/1565838_e54e_11.jpg",
    link: "https://www.udemy.com/course/complete-python-bootcamp/",
    
  },
  
  {
    id: "3",
    title: " Python Bootcamp",
    author: "Josephhhh Portilla",
    platform: "YouTube",
    description: "Learn calculus from Beginner to Advanced",
    image: "https://i.ytimg.com/vi/MDL384gsAk0/hqdefault.jpg",
    link: "https://www.youtube.com/watch?v=MDL384gsAk0&list=PLD80i8An1OEGZ2tYimemzwC3xqkU0jKUg&index=4/",
    
  }

]






export function getCourses(): Course[] {
  return courses
}

export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id)
}

export async function addCourse(courseData: Omit<Course, 'id' | 'createdBy'>): Promise<CourseResult> {
  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      credentials: 'include', // This is crucial for sending cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...courseData,
        description: courseData.description || '',
        author: courseData.author || ''
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.message || 'Failed to create course'
      };
    }

    return {
      success: true,
      course: result.course
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create course'
    };
  }
}