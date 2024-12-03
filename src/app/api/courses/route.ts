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