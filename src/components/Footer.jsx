import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const practiceAreas = [
    { name: 'İş Hukuku', href: '/hizmetler/is-hukuku' },
    { name: 'Ticaret Hukuku', href: '/hizmetler/ticaret-hukuku' },
    { name: 'Aile Hukuku', href: '/hizmetler/aile-hukuku' },
    { name: 'Ceza Hukuku', href: '/hizmetler/ceza-hukuku' },
    { name: 'Gayrimenkul Hukuku', href: '/hizmetler/gayrimenkul-hukuku' },
    { name: 'İcra ve İflas Hukuku', href: '/hizmetlerimiz' }
  ]

  const quickLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Çalışma Alanları', href: '/hizmetlerimiz' },
    { name: 'Ekibimiz', href: '/ekibimiz' },
    { name: 'Makaleler', href: '/makaleler' },
    { name: 'Kamulaştırma Haritası', href: '/kamulastirma-haritasi' },
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

  return (
    <footer className="bg-lawDark text-white relative">
      {/* Üst teal aksan çizgisi — marka süreklilik ipucu */}
      <div className="h-[3px] bg-lawSecondary" aria-hidden="true" />

      <div className="container mx-auto px-4 py-14">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo.svg" alt="Koptay Hukuk Bürosu Logo" width="40" height="40" loading="lazy" decoding="async" className="w-10 h-10" />
              <span className="text-xl font-serif">Koptay Hukuk</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Av. Murat Can Koptay<br />
              Ankara 2 Nolu Barosu<br />
              Sicil No: 3560
            </p>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="text-xs font-semibold mb-5 uppercase tracking-[0.15em] text-lawSecondary">Çalışma Alanları</h3>
            <ul className="space-y-2.5">
              {practiceAreas.map((area) => (
                <li key={area.href}>
                  <Link to={area.href}
                          className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold mb-5 uppercase tracking-[0.15em] text-lawSecondary">Hızlı Erişim</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hesaplama Araçları — site-wide internal linking */}
          <div>
            <h3 className="text-xs font-semibold mb-5 uppercase tracking-[0.15em] text-lawSecondary">Hesaplama Araçları</h3>
            <ul className="space-y-2.5">
              {calculators.map((calc, index) => (
                <li key={index}>
                  <Link to={calc.href} className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                    {calc.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/hesaplama-araclari" className="inline-flex items-center gap-1 text-lawSecondary hover:text-white transition-colors duration-200 text-sm font-medium">
                  Tüm Hesaplama Araçları →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-semibold mb-5 uppercase tracking-[0.15em] text-lawSecondary">İletişim</h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-lawSecondary mt-0.5 shrink-0" />
                <div className="text-gray-400 leading-relaxed">
                  Aziziye Mah. Willy Brandt Sk.<br />
                  No:7/1 Çankaya/ANKARA
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-lawSecondary shrink-0" />
                <a href={`tel:${import.meta.env.VITE_PHONE || '+90 530 711 18 64'}`}
                   className="text-gray-400 hover:text-white transition-colors">
                  {import.meta.env.VITE_PHONE || '+90 530 711 18 64'}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-lawSecondary shrink-0" />
                <a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'info@koptay.av.tr'}`}
                   className="text-gray-400 hover:text-white transition-colors">
                  {import.meta.env.VITE_CONTACT_EMAIL || 'info@koptay.av.tr'}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-lawSecondary mt-0.5 shrink-0" />
                <div className="text-gray-400 leading-relaxed">
                  Pazartesi – Cuma · 09:00 – 18:00<br />
                  <span className="text-gray-500 text-xs">Cumartesi randevu ile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-500 text-xs">
              © {currentYear} Koptay Hukuk Bürosu. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-6 text-xs">
              <Link to="/kvkk" className="text-gray-500 hover:text-white transition-colors">
                KVKK / Çerez Politikası
              </Link>
              <Link to="/iletisim" className="text-gray-500 hover:text-white transition-colors">
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
