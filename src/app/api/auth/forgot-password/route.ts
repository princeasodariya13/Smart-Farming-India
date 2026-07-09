import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Since we don't have a live DB connected in this codebase yet, we will mock the user check
    // In production, you would check if user exists: const user = await db.user.findUnique({ where: { email }})
    
    // Generate JWT token valid for 15 minutes
    const token = jwt.sign(
      { email }, 
      process.env.JWT_SECRET || 'fallback-secret', 
      { expiresIn: '15m' }
    )

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'
    const resetLink = `${clientUrl}/reset-password?token=${token}`

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"Smart Farming India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Smart Farming India Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #0f172a;">Password Reset Request</h2>
          <p style="color: #475569; font-size: 16px;">Hello,</p>
          <p style="color: #475569; font-size: 16px;">We received a request to reset your password for your Smart Farming India account. Click the button below to set a new password.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          <p style="color: #475569; font-size: 14px;">If you didn't request this, you can safely ignore this email. This link will expire in 15 minutes.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2026 Smart Farming India. All rights reserved.</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: 'Password reset link sent to your email.' }, { status: 200 })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 })
  }
}
