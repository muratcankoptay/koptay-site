// Vercel serverless function for contact form
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();
    
    // Email validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Tüm alanlar doldurulmalıdır' },
        { status: 400 }
      );
    }

    // Here we'll integrate with SendGrid or Resend
    const emailData = {
      to: 'info@koptay.av.tr', // Your email
      from: 'noreply@koptay.av.tr',
      subject: `Website İletişim: ${subject}`,
      html: `
        <h3>Yeni İletişim Formu Mesajı</h3>
        <p><strong>İsim:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // TODO: Add SendGrid/Resend integration
    console.log('Email would be sent:', emailData);

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Mesaj gönderilemedi' },
      { status: 500 }
    );
  }
}