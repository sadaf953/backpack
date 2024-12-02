import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON request body
    const courseData = await request.json()

    // Validate required fields
    if (!courseData.title || !courseData.author || !courseData.link) {
      return NextResponse.json(
        { error: 'Missing required course information' }, 
        { status: 400 }
      )
    }

    // Prepare course data for database
    const newCourseData = {
      title: courseData.title,
      author: courseData.author,
      platform: courseData.platform || 'YouTube',
      description: courseData.description || '',
      image: courseData.image || 'https://via.placeholder.com/300x200',
      link: courseData.link,
      duration: courseData.duration || '',
      level: courseData.level || 'Beginner',
      topics: courseData.topics || '',
      price: courseData.price || ''
    }

    // Save to database
    const savedCourse = await prisma.course.create({
      data: newCourseData
    })

    // Return the saved course
    return NextResponse.json({ 
      success: true, 
      course: savedCourse 
    }, { status: 200 })

  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create course' 
      }, 
      { status: 500 }
    )
  }
}