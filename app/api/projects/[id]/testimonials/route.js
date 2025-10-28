import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'
import Project from '@/models/Project'

// GET testimonials for a project
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Verify project ownership
    const project = await Project.findOne({
      _id: params.id,
      userId: session.user.id,
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'

    const query = { projectId: params.id }
    if (status !== 'all') {
      query.status = status
    }

    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      testimonials,
    })
  } catch (error) {
    console.error('Get testimonials error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// PATCH update testimonial status (approve/reject/feature)
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { testimonialId, status, featured } = body

    await connectDB()

    // Verify project ownership
    const project = await Project.findOne({
      _id: params.id,
      userId: session.user.id,
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const updateData = {}
    if (status !== undefined) updateData.status = status
    if (featured !== undefined) updateData.featured = featured

    const testimonial = await Testimonial.findOneAndUpdate(
      { _id: testimonialId, projectId: params.id },
      updateData,
      { new: true }
    )

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    // Update project stats
    const stats = await Testimonial.aggregate([
      { $match: { projectId: project._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])

    const totalSubmissions = stats.reduce((sum, s) => sum + s.count, 0)
    const approvedCount = stats.find(s => s._id === 'approved')?.count || 0
    const rejectedCount = stats.find(s => s._id === 'rejected')?.count || 0

    await Project.findByIdAndUpdate(params.id, {
      'stats.totalSubmissions': totalSubmissions,
      'stats.approvedCount': approvedCount,
      'stats.rejectedCount': rejectedCount,
    })

    return NextResponse.json({
      success: true,
      testimonial,
    })
  } catch (error) {
    console.error('Update testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// DELETE testimonial
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const testimonialId = searchParams.get('testimonialId')

    await connectDB()

    // Verify project ownership
    const project = await Project.findOne({
      _id: params.id,
      userId: session.user.id,
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const testimonial = await Testimonial.findOneAndDelete({
      _id: testimonialId,
      projectId: params.id,
    })

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    // Update project stats
    const stats = await Testimonial.aggregate([
      { $match: { projectId: project._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ])

    const totalSubmissions = stats.reduce((sum, s) => sum + s.count, 0)
    const approvedCount = stats.find(s => s._id === 'approved')?.count || 0
    const rejectedCount = stats.find(s => s._id === 'rejected')?.count || 0

    await Project.findByIdAndUpdate(params.id, {
      'stats.totalSubmissions': totalSubmissions,
      'stats.approvedCount': approvedCount,
      'stats.rejectedCount': rejectedCount,
    })

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully',
    })
  } catch (error) {
    console.error('Delete testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}

