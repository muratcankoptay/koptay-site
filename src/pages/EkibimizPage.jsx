import { useEffect } from "react"
import { Scale, Award, Heart } from "lucide-react"
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
      title: "Kurucu Ortak & Yönetici Avukat",
      specialization: "Ankara 2 Nolu Barosu - Sicil No: 3560",
      bio: "KOPTAY Hukuk Bürosu'nun kurucusu olarak, müvekkillerine en yüksek kalitede hukuki hizmet sunmayı ve onların haklarını en iyi şekilde korumayı ilke edinmiştir. Ceza hukuku, iş hukuku ve tazminat davaları alanlarında uzmanlaşmış olup, adalet ve etik değerlere bağlı kalarak çözüm odaklı yaklaşımıyla müvekkillerinin güvenini kazanmıştır.",
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
        title="Ekibimiz - KOPTAY Hukuk Bürosu"
        description="Deneyimli avukat kadromuz ve profesyonel ekibimizle tanışın. KOPTAY Hukuk Bürosu'nda her alanda uzman hukuk danışmanları."
        keywords="hukuk ekibi, avukatlar, hukuk danışmanı, profesyonel avukat"
      />

      {/* Hero Section */}
      <section className="page-hero py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 animate-fade-in-up">
              Ekibimiz
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Deneyimli, uzman ve çözüm odaklı kadromuzla<br />
              hukuki ihtiyaçlarınızda yanınızdayız
            </p>
          </div>
        </div>
      </section>

      {/* Vizyonumuz */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-lawDark mb-6">
              Vizyonumuz
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              KOPTAY Hukuk Bürosu olarak, müvekkillerimize en yüksek kalitede hukuki hizmet sunmayı 
              ve onların haklarını en iyi şekilde korumayı amaçlıyoruz.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ekibimiz, farklı hukuk alanlarında uzmanlaşmış, deneyimli avukatlardan ve destek 
              personelinden oluşmaktadır. Her bir üyemiz, adalet ve etik değerlere bağlı kalarak, 
              müvekkillerimizin çıkarlarını korumak için özverili bir şekilde çalışmaktadır.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-lawPrimary/5 to-lawSecondary/5 border border-lawPrimary/10">
              <div className="w-16 h-16 bg-lawPrimary rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-lawDark mb-3">Profesyonellik</h3>
              <p className="text-gray-600">
                Her davaya profesyonel ve titiz bir yaklaşımla çözüm üretiyoruz.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-lawPrimary/5 to-lawSecondary/5 border border-lawPrimary/10">
              <div className="w-16 h-16 bg-lawSecondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-lawDark mb-3">Müvekkil Odaklı</h3>
              <p className="text-gray-600">
                Müvekkillerimizin ihtiyaçlarını anlar ve en iyi çözümü sunarız.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-lawPrimary/5 to-lawSecondary/5 border border-lawPrimary/10">
              <div className="w-16 h-16 bg-lawPrimary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-lawDark mb-3">Uzmanlık</h3>
              <p className="text-gray-600">
                Her alanda uzman kadromuzla geniş hizmet yelpazesi sunuyoruz.
              </p>
            </div>
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
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              KOPTAY Hukuk Bürosu'nun kurucusu ve yöneticisi ile tanışın
            </p>
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-lawPrimary to-lawSecondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Hukuki İhtiyaçlarınız İçin Bizimle İletişime Geçin
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Profesyonel ekibimiz, size en iyi hukuki çözümü sunmak için hazır
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/iletisim"
              className="inline-block bg-white text-lawPrimary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Randevu Alın
            </a>
            <a
              href="tel:+905307111864"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-lawPrimary transition-all duration-300 transform hover:scale-105"
            >
              Hemen Arayın
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default EkibimizPage
