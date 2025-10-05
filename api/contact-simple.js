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

    // For now, just log the data (no email sending yet)
    console.log('Contact form submission:', {
      name, email, phone, subject, message
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