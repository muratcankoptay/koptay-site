import { useEffect } from "react"
import TeamMember from "../components/TeamMember"
import SEO from "../components/SEO"

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
        title="Ekibimiz — Koptay Hukuk Bürosu"
        description="Av. Murat Can Koptay - Ankara 2 Nolu Barosu, Sicil No: 3560."
      />

      {/* Hero Section */}
      <section className="page-hero py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 animate-fade-in-up">
              Ekibimiz
            </h1>
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

      {/* İletişim */}
      <section className="py-16 bg-gradient-to-r from-lawPrimary to-lawSecondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            İletişim
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/iletisim"
              className="inline-block bg-white text-lawPrimary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              İletişim Formu
            </a>
            <a
              href="tel:+905307111864"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-lawPrimary transition-all duration-300 transform hover:scale-105"
            >
              Telefon
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default EkibimizPage
