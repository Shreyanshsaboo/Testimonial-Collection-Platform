import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { signupSchema } from '@/lib/validations/schemas'

export async function POST(request) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = signupSchema.parse(body)

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create new user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      company: validatedData.company || '',
    })

    // Return user without password
    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      plan: user.plan,
      createdAt: user.createdAt,
    }

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Account created successfully',
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
