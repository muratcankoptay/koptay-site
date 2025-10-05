// Vercel serverless function for contact form
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
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'İsim, email ve mesaj alanları doldurulmalıdır' 
      });
    }

    // Log form submission
    console.log('📧 Contact form submission:', {
      name, email, phone, subject, message,
      timestamp: new Date().toISOString()
    });

    // Send email using Resend (if API key exists)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const emailResult = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: 'info@koptay.av.tr',
          subject: `Website İletişim: ${subject || 'Konu Belirtilmemiş'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
              <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #B8860B; border-bottom: 3px solid #B8860B; padding-bottom: 15px; margin-top: 0;">
                  🏛️ Yeni İletişim Formu Mesajı
                </h2>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #B8860B;">
                  <h3 style="margin-top: 0; color: #333; font-size: 18px;">📋 İletişim Bilgileri</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #555;">👤 İsim Soyisim:</td>
                      <td style="padding: 8px 0; color: #333;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #555;">📧 Email:</td>
                      <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #B8860B; text-decoration: none;">${email}</a></td>
                    </tr>
                    ${phone ? `
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #555;">📱 Telefon:</td>
                      <td style="padding: 8px 0; color: #333;">${phone}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #555;">📋 Konu:</td>
                      <td style="padding: 8px 0; color: #333;">${subject || 'Belirtilmemiş'}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="background-color: white; padding: 25px; border: 2px solid #e9ecef; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #333; font-size: 18px;">💬 Mesaj İçeriği</h3>
                  <div style="line-height: 1.8; color: #555; font-size: 16px; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #B8860B, #DAA520); border-radius: 8px; text-align: center;">
                  <p style="margin: 0; color: white; font-size: 14px; font-weight: 500;">
                    🌐 Bu mesaj <strong>koptay.av.tr</strong> web sitesinin iletişim formundan gönderilmiştir.
                  </p>
                  <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.9); font-size: 12px;">
                    📅 Gönderim Zamanı: ${new Date().toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
            </div>
          `
        });

        console.log('✅ Email sent successfully:', emailResult);
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        // Don't fail the form if email fails
      }
    } else {
      console.log('⚠️ RESEND_API_KEY not found - email not sent');
    }

    return res.status(200).json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi. En kısa sürede size döneceğiz.'
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    return res.status(500).json({ 
      error: 'Mesaj gönderilemedi. Lütfen tekrar deneyiniz.' 
    });
  }
}