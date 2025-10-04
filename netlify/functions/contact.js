const { Resend } = require('resend');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, phone, subject, message } = JSON.parse(event.body);
    
    // Validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'İsim, email ve mesaj alanları doldurulmalıdır' 
        })
      };
    }

    // Initialize Resend (only if API key exists)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Send email
      const emailResult = await resend.emails.send({
        from: 'İletişim Formu <noreply@koptay.av.tr>',
        to: ['info@koptay.av.tr'],
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
    } else {
      // Fallback when no API key
      console.log('Contact form submission (no email sent - missing API key):', {
        name, email, phone, subject, message
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Mesajınız başarıyla gönderildi. En kısa sürede size döneceğiz.'
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Mesaj gönderilemedi. Lütfen tekrar deneyiniz.' 
      })
    };
  }
};