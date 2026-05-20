import { useEffect } from "react"
import TeamMember from "../components/TeamMember"
import SEO from "../components/SEO"
import { OG_IMAGES } from '../config/ogImages'

const EkibimizPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Ekip üyeleri
  const teamMembers = [
    {
      id: 1,
      name: "Av. Murat Can Koptay",
      title: "Kurucu Avukat",
      specialization: "Ankara 2 Nolu Barosu - Sicil No: 3560",
      bio: "Ankara 2 Nolu Barosu'na kayıtlı avukat. Ceza Hukuku, İş Hukuku ve Tazminat Davaları alanlarında çalışmaktadır.",
      image: "/images/team/murat-can-koptay.jpeg",
      education: [
        "Ankara Yıldırım Beyazıt Üniversitesi Hukuk Fakültesi"
      ],
      expertise: [
        "Ceza Hukuku",
        "İş Hukuku",
        "Tazminat Davaları",
        "İcra İflas Hukuku",
        "Ticaret Hukuku",
        "Sözleşmeler Hukuku"
      ],
      email: "info@koptay.av.tr",
      phone: "0 (530) 711 18 64",
      linkedin: ""
    }
  ]

  return (
    <>
      <SEO
        title="Ekibimiz — Koptay Hukuk Bürosu | Av. Murat Can Koptay"
        description="Av. Murat Can Koptay — Ankara 2 Nolu Barosu, Sicil No: 3560. Ceza, iş hukuku ve tazminat davaları."
        image={OG_IMAGES.ekibimiz}
        url="/ekibimiz"
      />

      {/* Hero Section */}
      <section className="page-hero">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <p className="page-hero-eyebrow">Koptay Hukuk Bürosu</p>
            <h1 className="page-hero-title">Ekibimiz</h1>
            <p className="page-hero-subtitle">
              Ankara Barosu kayıtlı kurucu avukatımız ve uzmanlık
              alanlarımız hakkında bilgi.
            </p>
          </div>
        </div>
      </section>

      {/* Ekip Üyeleri */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-lawDark mb-4">
              Kurucu Avukat
            </h2>
          </div>

          <div className="flex justify-center">
            <div className="max-w-md w-full">
              {teamMembers.map((member) => (
                <TeamMember key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* İletişim — slim CTA (Home ile uyumlu) */}
      <section className="py-12 bg-lawLight border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/iletisim"
                className="inline-flex items-center justify-center gap-2 bg-lawPrimary text-white px-6 py-3 rounded-md font-medium hover:bg-lawSecondary transition-colors"
              >
                İletişim Formu
              </a>
              <a
                href="tel:+905307111864"
                className="inline-flex items-center justify-center gap-2 border border-lawPrimary text-lawPrimary px-6 py-3 rounded-md font-medium hover:bg-lawPrimary hover:text-white transition-colors"
              >
                Hemen Ara
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Hafta içi 09:00 – 18:00 · Cumartesi randevu ile
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default EkibimizPage
