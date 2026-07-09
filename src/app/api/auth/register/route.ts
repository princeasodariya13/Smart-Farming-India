import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { name, phone, email, password } = await req.json()
    
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields (Name, Email, Password).' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a personal "Company" (Farm) and the User simultaneously
    await prisma.company.create({
      data: {
        name: `${name}'s Farm`,
        users: {
          create: {
            name,
            email,
            password: hashedPassword,
            role: 'COMPANY_ADMIN'
          }
        }
      }
    })

    return NextResponse.json({ message: 'Account created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Registration Error:', error)
    return NextResponse.json({ error: 'Internal server error while creating account.' }, { status: 500 })
  }
}
