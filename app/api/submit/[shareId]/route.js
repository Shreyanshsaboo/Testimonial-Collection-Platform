import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import Testimonial from '@/models/Testimonial'
import { testimonialSchema } from '@/lib/validations/schemas'

// Public endpoint - Submit testimonial via shareable form
export async function POST(request, { params }) {
  try {
    const { shareId } = params
    const body = await request.json()

    // Validate input
    const validatedData = testimonialSchema.parse(body)

    await connectDB()

    // Find project by shareId
    const project = await Project.findOne({ shareId, active: true })

    if (!project) {
      return NextResponse.json(
        { error: 'Invalid or inactive testimonial form' },
        { status: 404 }
      )
    }

    // Get IP address and user agent for spam protection
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create testimonial
    const testimonial = await Testimonial.create({
      userId: project.userId,
      projectId: project._id,
      name: validatedData.name,
      email: validatedData.email,
      company: validatedData.company || '',
      position: validatedData.position || '',
      rating: validatedData.rating,
      testimonial: validatedData.testimonial,
      photo: validatedData.photo || '',
      video: validatedData.video || '',
      status: project.formSettings.requireApproval ? 'pending' : 'approved',
      ipAddress,
      userAgent,
    })

    // Update project stats
    await Project.findByIdAndUpdate(project._id, {
      $inc: { 'stats.totalSubmissions': 1 },
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your testimonial has been submitted.',
      testimonial: {
        id: testimonial._id,
        status: testimonial.status,
      },
    }, { status: 201 })

  } catch (error) {
    console.error('Submit testimonial error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit testimonial' },
      { status: 500 }
    )
  }
}

// Public endpoint - Get project form settings
export async function GET(request, { params }) {
  try {
    const { shareId } = params

    await connectDB()

    const project = await Project.findOne({ shareId, active: true })
      .select('name description formSettings widgetSettings')

    if (!project) {
      return NextResponse.json(
        { error: 'Invalid or inactive testimonial form' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      project: {
        name: project.name,
        description: project.description,
        formSettings: project.formSettings,
        theme: project.widgetSettings.theme,
      },
    })

  } catch (error) {
    console.error('Get form settings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form settings' },
      { status: 500 }
    )
  }
}
