import { NextResponse } from 'next/server'
import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'

export async function POST(req: Request) {
  try {
    const { toEmail, toName, subject, content } = await req.json()

    const api = new TransactionalEmailsApi()
    ;(api as any).authentications.apiKey.apiKey = process.env.BREVO_API_KEY

    const email = new SendSmtpEmail()
    email.subject = subject
    email.htmlContent = `<p>${content}</p>`
    email.sender = {
      name: process.env.BREVO_SENDER_NAME!,
      email: process.env.BREVO_SENDER_EMAIL!,
    }
    email.to = [
      {
        email: toEmail,
        name: toName,
      },
    ]

    await api.sendTransacEmail(email)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}