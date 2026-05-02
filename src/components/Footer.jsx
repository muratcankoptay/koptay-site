import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const practiceAreas = [
    'İş Hukuku',
    'Ticaret Hukuku',
    'Aile Hukuku',
    'Ceza Hukuku',
    'Gayrimenkul Hukuku',
    'İcra ve İflas Hukuku'
  ]

  const quickLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hizmetlerimiz', href: '/#services' },
    { name: 'Makaleler', href: '/makaleler' },
    { name: 'Ekibimiz', href: '/ekibimiz' },
    { name: 'İletişim', href: '/iletisim' }
  ]

  const calculators = [
    { name: 'Kıdem Tazminatı Hesaplama', href: '/hesaplama-araclari/iscilik-alacaklari' },
    { name: 'İş Kazası Tazminatı', href: '/hesaplama-araclari/tazminat-hesaplama' },
    { name: 'Meslek Hastalığı Tazminatı', href: '/hesaplama-araclari/meslek-hastaligi' },
    { name: 'İlave Tediye Hesaplama', href: '/hesaplama-araclari/ilave-tediye' },
    { name: 'Araç Değer Kaybı', href: '/hesaplama-araclari/arac-deger-kaybi' },
    { name: 'Trafik Kazası Tazminatı', href: '/hesaplama-araclari/trafik-kazasi' },
    { name: 'İnfaz Yatar Hesaplama', href: '/hesaplama-araclari/infaz-yatar' },
    { name: 'Vekalet Ücreti Hesaplama', href: '/hesaplama-araclari/vekalet-ucreti' },
    { name: 'Dava Süresi & Zamanaşımı', href: '/hesaplama-araclari/dava-suresi' }
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ]

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLinkClick = (href) => {
    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '')
      scrollToSection(sectionId)
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <img src="/logo.svg" alt="Koptay Hukuk Bürosu Logo" width="40" height="40" loading="lazy" decoding="async" className="w-10 h-10" />
              <span className="text-2xl font-bold font-serif">Koptay Hukuk</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Hukuki haklarınızı korumak ve adaletin yerini bulması için buradayız.
              Her müvekkilimize özel çözümler sunan güvenilir hukuki partneriniz.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} aria-label={social.label}
                   className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-300">
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-serif">Uzmanlık Alanlarımız</h3>
            <ul className="space-y-3">
              {practiceAreas.map((area, index) => (
                <li key={index}>
                  <button onClick={() => scrollToSection('services')}
                          className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-left">
                    {area}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-serif">Hızlı Erişim</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('/#') ? (
                    <button onClick={() => handleLinkClick(link.href)}
                            className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-left">
                      {link.name}
                    </button>
                  ) : (
                    <Link to={link.href} className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Hesaplama Araçları — site-wide internal linking */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-serif">Hesaplama Araçları</h3>
            <ul className="space-y-2.5">
              {calculators.map((calc, index) => (
                <li key={index}>
                  <Link to={calc.href} className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm">
                    {calc.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/hesaplama-araclari" className="text-primary-400 hover:text-primary-300 transition-colors duration-200 text-sm font-medium">
                  → Tüm Hesaplama Araçları
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-serif">İletişim Bilgileri</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>Aziziye Mah. Willy Bran Sk.</p>
                  <p>No:7/1 Çankaya/ANKARA</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href={`tel:${import.meta.env.VITE_PHONE || '+90 530 711 18 64'}`}
                   className="text-gray-400 hover:text-primary-400 transition-colors">
                  {import.meta.env.VITE_PHONE || '+90 530 711 18 64'}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'info@koptay.av.tr'}`}
                   className="text-gray-400 hover:text-primary-400 transition-colors">
                  {import.meta.env.VITE_CONTACT_EMAIL || 'info@koptay.av.tr'}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>Pazartesi - Cuma</p>
                  <p>09:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Koptay Hukuk Bürosu. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/kvkk" className="text-gray-400 hover:text-primary-400 transition-colors">
                KVKK / Çerez Politikası
              </Link>
              <Link to="/iletisim" className="text-gray-400 hover:text-primary-400 transition-colors">
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
