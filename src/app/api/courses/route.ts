import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 })
    }

    const courseData = await request.json()
    
    // Validate required fields
    if (!courseData.title || !courseData.platform || !courseData.image || !courseData.link) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 400 })
    }

    // Create course in database with user information
    const newCourse = await prisma.course.create({
      data: {
        ...courseData,
        description: courseData.description || '',
        status: 'approved',
        visibility: 'public',
        createdBy: {
          connect: { 
            id: session.user.id 
          }
        }
      },
      include: {
        createdBy: {
          select: { 
            id: true, 
            name: true, 
            email: true 
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      course: {
        ...newCourse,
        createdBy: {
          id: newCourse.createdBy.id,
          name: newCourse.createdBy.name
        }
      }
    })

  } catch (error) {
    console.error('Failed to create course:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create course',
      error: String(error)
    }, { status: 500 })
  }
}

// Add a course to user's collection
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('Session in course addition:', session) // Debug logging
    
    if (!session) {
      console.error('No session found during course addition') // Additional logging
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized. Please log in.' 
      }, { status: 401 })
    }

    const body = await request.json()
    const { courseId } = body
    
    console.log('Received course ID:', courseId) // Debug logging
    console.log('User ID from session:', session.user.id) // Debug logging
    
    if (!courseId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Course ID is required' 
      }, { status: 400 })
    }

    // Verify course exists
    const courseExists = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!courseExists) {
      return NextResponse.json({ 
        success: false, 
        message: 'Course not found' 
      }, { status: 404 })
    }

    // Check if course is already in user's collection
    const existingUserCourse = await prisma.userCourse.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    })

    if (existingUserCourse) {
      return NextResponse.json({ 
        success: false, 
        message: 'Course already in your collection' 
      }, { status: 400 })
    }

    // Add course to user's collection
    const userCourse = await prisma.userCourse.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
        status: 'active'
      },
      include: {
        course: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    console.log('Course added successfully:', userCourse) // Success logging

    return NextResponse.json({ 
      success: true, 
      data: userCourse 
    })

  } catch (error) {
    console.error('Error adding course to collection:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to add course',
      error: String(error)
    }, { status: 500 })
  }
}

// Get courses by user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    const courses = await prisma.course.findMany({
      where: {
        OR: [
          { visibility: 'public' },
          userId ? { createdById: userId } : {}
        ]
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: courses 
    })

  } catch (error: any) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
}