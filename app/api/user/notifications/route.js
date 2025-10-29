import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      notificationSettings: user.notificationSettings || {
        emailOnNewTestimonial: true,
        emailOnApproval: false,
        emailWeeklyReport: true,
        emailMonthlyReport: false
      }
    })
  } catch (error) {
    console.error('Notification settings fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notification settings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const notificationSettings = await request.json()

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { 
        notificationSettings: {
          emailOnNewTestimonial: notificationSettings.emailOnNewTestimonial || false,
          emailOnApproval: notificationSettings.emailOnApproval || false,
          emailWeeklyReport: notificationSettings.emailWeeklyReport || false,
          emailMonthlyReport: notificationSettings.emailMonthlyReport || false
        }
      },
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      notificationSettings: user.notificationSettings
    })
  } catch (error) {
    console.error('Notification settings update error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification settings' },
      { status: 500 }
    )
  }
}
