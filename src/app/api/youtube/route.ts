import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('YouTube API route called')
    const { url } = await request.json()
    console.log('Received URL:', url)

    // Extract video ID from various YouTube URL formats
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    
    if (!videoIdMatch) {
      console.log('Invalid YouTube URL')
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid YouTube URL' 
      }, { status: 400 })
    }

    const videoId = videoIdMatch[1]
    console.log('Extracted Video ID:', videoId)
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
      console.error('YouTube API key is not configured')
      return NextResponse.json({ 
        success: false, 
        message: 'YouTube API key is not configured' 
      }, { status: 500 })
    }

    // Fetch video details
    console.log('Fetching video details...')
    const videoResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    )

    console.log('Video Response Status:', videoResponse.status)

    if (!videoResponse.ok) {
      const errorText = await videoResponse.text()
      console.error('Failed to fetch video details:', errorText)
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to fetch video details' 
      }, { status: 500 })
    }

    const videoData = await videoResponse.json()
    console.log('Video Data:', JSON.stringify(videoData, null, 2))

    if (!videoData.items || videoData.items.length === 0) {
      console.log('No video items found')
      return NextResponse.json({ 
        success: false, 
        message: 'Video not found' 
      }, { status: 404 })
    }

    const snippet = videoData.items[0].snippet

    return NextResponse.json({ 
      success: true,
      data: {
        title: snippet.title,
        description: snippet.description,
        channelTitle: snippet.channelTitle,
        thumbnails: snippet.thumbnails,
        channelId: snippet.channelId
      }
    })

  } catch (error) {
    console.error('Unexpected YouTube API error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'An unexpected error occurred' 
    }, { status: 500 })
  }
}
