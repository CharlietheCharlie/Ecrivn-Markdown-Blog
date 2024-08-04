import WelcomeTemplate from '@/emails/WelcomeTemplate'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'
const resend = new Resend(process.env.RESEND_API_KEY)
export async function POST() {
    await resend.emails.send({
        from: 'wEYJp@example.com',
        to: 'wEYJp@example.com',
        subject: 'Sending with Resend.js',
        react: <WelcomeTemplate name="Charlie"></WelcomeTemplate> 
    })
    return NextResponse.json({}); 
}