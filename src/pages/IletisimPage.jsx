import { useState } from 'react'
import { 
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  Award,
  Users
} from 'lucide-react'
import SEO from '../components/SEO'
import { api } from '../utils/api'

const IletisimPage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitStatus, setSubmitStatus] = useState('') // 'success' or 'error'

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    setSubmitStatus('')

    try {
      const response = await api.submitContact(contactForm)
      if (response.success) {
        setSubmitMessage(response.message)
        setSubmitStatus('success')
        setContactForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
        
        // 5 saniye sonra mesajı temizle
        setTimeout(() => {
          setSubmitMessage('')
          setSubmitStatus('')
        }, 5000)
      }
    } catch (error) {
      setSubmitMessage('Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin veya telefon/e-posta ile iletişime geçin.')
      setSubmitStatus('error')
      
      // 7 saniye sonra hata mesajını temizle
      setTimeout(() => {
        setSubmitMessage('')
        setSubmitStatus('')
      }, 7000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SEO 
        title="İletişim - Koptay Hukuk Bürosu"
        description="Ankara'da avukatlık hizmeti için bizimle iletişime geçin. Uzman avukat kadromuzla yanınızdayız."
        keywords="avukat ankara, hukuk bürosu ankara, profesyonel hizmet, aziziye mahallesi avukat"
        url="/iletisim"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lawPrimary to-lawSecondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6 font-serif">
            İletişim
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Hukuki sorunlarınız için bizimle iletişime geçin
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Phone */}
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-lawPrimary rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif text-lawDark mb-4">Telefon</h3>
              <a 
                href="tel:+905307111864" 
                className="text-lg text-lawPrimary hover:text-lawSecondary transition-colors"
              >
                +90 530 711 18 64
              </a>
            </div>

            {/* Email */}
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-lawSecondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif text-lawDark mb-4">E-posta</h3>
              <a 
                href="mailto:info@koptay.av.tr" 
                className="text-lg text-lawPrimary hover:text-lawSecondary transition-colors"
              >
                info@koptay.av.tr
              </a>
            </div>

            {/* Address */}
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-lawGreen rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif text-lawDark mb-4">Adres</h3>
              <p className="text-lg text-gray-700">
                Aziziye Mah. Willy Bran Sk.<br />
                No:7/1 Çankaya/ANKARA
              </p>
            </div>
          </div>

          {/* Contact Form and Map */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-lawDark mb-8">
                Bize Ulaşın
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lawDark font-medium mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lawDark font-medium mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                      placeholder="E-posta adresiniz"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lawDark font-medium mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                      placeholder="Telefon numaranız"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lawDark font-medium mb-2">
                      Konu
                    </label>
                    <select
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
                    >
                      <option value="">Konu seçiniz</option>
                      <option value="is-hukuku">İş Hukuku</option>
                      <option value="ticaret-hukuku">Ticaret Hukuku</option>
                      <option value="aile-hukuku">Aile Hukuku</option>
                      <option value="ceza-hukuku">Ceza Hukuku</option>
                      <option value="gayrimenkul-hukuku">Gayrimenkul Hukuku</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-lawDark font-medium mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent resize-none"
                    placeholder="Hukuki sorunuzu detaylı olarak açıklayın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-lawPrimary text-white py-4 px-8 font-medium uppercase tracking-wide hover:bg-lawSecondary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Mesaj Gönder
                    </>
                  )}
                </button>

                {submitMessage && (
                  <div className={`p-4 rounded-lg border-2 animate-fade-in-up ${
                    submitStatus === 'success' 
                      ? 'bg-green-50 border-green-500 text-green-800' 
                      : 'bg-red-50 border-red-500 text-red-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      {submitStatus === 'success' ? (
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <p className="font-medium">{submitMessage}</p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Map and Office Info */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-lawDark mb-8">
                Ofis Konumumuz
              </h2>

              {/* Map */}
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-video">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.474957!2d32.851064!3d39.890109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDUzJzI0LjQiTiAzMsKwNTEnMTIuOCJF!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Koptay Hukuk Bürosu Konum"
                  ></iframe>
                </div>
                <div className="bg-lawPrimary text-white p-4 text-center">
                  <a 
                    href="https://www.google.com/maps/place/39%C2%B053'24.4%22N+32%C2%B051'12.8%22E/@39.890109,32.851064,17z" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-lawSecondary transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    Yol Tarifi Al
                  </a>
                </div>
              </div>

              {/* Office Hours and Info */}
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                  <Clock className="w-6 h-6 text-lawPrimary mt-1" />
                  <div>
                    <h3 className="font-serif text-xl text-lawDark mb-2">Çalışma Saatleri</h3>
                    <p className="text-gray-700">
                      Pazartesi - Cuma: 09:00 - 18:00<br />
                      Cumartesi: 09:00 - 14:00<br />
                      Pazar: Kapalı
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                  <Award className="w-6 h-6 text-lawPrimary mt-1" />
                  <div>
                    <h3 className="font-serif text-xl text-lawDark mb-2">Profesyonel Değerlendirme</h3>
                    <p className="text-gray-700">
                      Hukuki sorunlarınızı değerlendirip size en iyi çözümü sunuyoruz.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                  <Users className="w-6 h-6 text-lawPrimary mt-1" />
                  <div>
                    <h3 className="font-serif text-xl text-lawDark mb-2">Uzman Kadro</h3>
                    <p className="text-gray-700">
                      Tüm hukuk alanlarında uzmanlaşmış deneyimli avukat kadromuzla yanınızdayız.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default IletisimPage