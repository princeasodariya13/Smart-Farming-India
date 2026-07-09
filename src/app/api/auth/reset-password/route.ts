import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
    }

    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { email: string }
      
      // Hash the new password and save it to the database
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await prisma.user.update({ 
        where: { email: decoded.email }, 
        data: { password: hashedPassword }
      })

      return NextResponse.json({ message: 'Password successfully reset.' }, { status: 200 })
      
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 })
    }

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 })
  }
}
