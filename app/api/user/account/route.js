import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Project from '@/models/Project'
import Testimonial from '@/models/Testimonial'

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const userProjects = await Project.find({ userId: session.user.id })
    const projectIds = userProjects.map(p => p._id)

    await Testimonial.deleteMany({ projectId: { $in: projectIds } })

    await Project.deleteMany({ userId: session.user.id })

    await User.findByIdAndDelete(session.user.id)

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
