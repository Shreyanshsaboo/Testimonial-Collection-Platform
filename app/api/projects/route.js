import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'

// GET all projects for authenticated user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const projects = await Project.find({ userId: session.user.id })
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      projects,
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST create new project
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    await connectDB()

    const project = await Project.create({
      userId: session.user.id,
      name: body.name,
      description: body.description || '',
      website: body.website || '',
    })

    return NextResponse.json({
      success: true,
      project,
      message: 'Project created successfully',
    }, { status: 201 })

  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
