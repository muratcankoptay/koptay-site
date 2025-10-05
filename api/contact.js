export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Email validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'İsim, email ve mesaj alanları doldurulmalıdır' 
      });
    }

    // Send email using Resend (only if API key exists)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const emailResult = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: 'info@koptay.av.tr',
          subject: `Website İletişim: ${subject || 'Konu Belirtilmemiş'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #B8860B; border-bottom: 2px solid #B8860B; padding-bottom: 10px;">
                🏛️ Yeni İletişim Formu Mesajı
              </h2>
              
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #333;">İletişim Bilgileri:</h3>
                <p><strong>👤 İsim Soyisim:</strong> ${name}</p>
                <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
                ${phone ? `<p><strong>📱 Telefon:</strong> ${phone}</p>` : ''}
                <p><strong>📋 Konu:</strong> ${subject || 'Belirtilmemiş'}</p>
              </div>
              
              <div style="background-color: #fff; padding: 20px; border-left: 4px solid #B8860B; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #333;">💬 Mesaj:</h3>
                <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <div style="margin-top: 30px; padding: 15px; background-color: #f0f8ff; border-radius: 5px; text-align: center;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  🌐 Bu mesaj <strong>koptay.av.tr</strong> web sitesinin iletişim formundan gönderilmiştir.
                </p>
              </div>
            </div>
          `
        });

        console.log('Email sent successfully:', emailResult);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the form submission if email fails
      }
    } else {
      console.log('RESEND_API_KEY not found - email not sent');
    }

    // Always log the submission
    console.log('Contact form submission:', {
      name, email, phone, subject, message, timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi. En kısa sürede size döneceğiz.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return res.status(500).json({ 
      error: 'Mesaj gönderilemedi. Lütfen tekrar deneyiniz.' 
    });
  }
}