import nodemailer from 'nodemailer'

// For development, we'll use Gmail. In production, you might want to use a service like SendGrid
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD // This should be an App Password, not your regular password
  }
})

export async function sendVerificationCode(to: string, code: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Backpack Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Backpack!</h1>
        <p>Thank you for signing up. Here's your verification code:</p>
        <div style="margin: 30px 0; text-align: center;">
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; font-size: 32px; letter-spacing: 5px; font-weight: bold;">
            ${code}
          </div>
        </div>
        <p>Enter this code on the verification page to complete your registration.</p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          If you didn't create an account with Backpack, you can safely ignore this email.
        </p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>This is an automated email from Backpack. Please do not reply to this email.</p>
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Verification code email sent successfully')
  } catch (error) {
    console.error('Error sending verification code email:', error)
    throw new Error('Failed to send verification code')
  }
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Reset your Backpack password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Password Reset Request</h1>
        <p>We received a request to reset your password. Click the button below to create a new password.</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
          <p>This is an automated email from Backpack. Please do not reply to this email.</p>
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Password reset email sent successfully')
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}
