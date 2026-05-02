import { Link } from 'react-router-dom'
import {
  Calculator, TrendingUp, Car, Building, Users, ArrowRight,
  Scale, Banknote, Hourglass, Briefcase, Stethoscope, Shield
} from 'lucide-react'
import SEO from '../components/SEO'

/**
 * Hesaplama Araçları İndex (Hub) Sayfası
 * - Tek görevi: ziyaretçiyi doğru hesaplayıcıya yönlendirmek + Google'a "hesaplama hub'ıyız" sinyali vermek.
 * - Önizleme formları kaldırıldı (UX kırığı + Helpful Content sinyali için).
 * - Üç kategori (İş Hukuku / Trafik & Sigorta / Ceza & Usul) altında 9 araç gruplandı.
 * - BreadcrumbList + ItemList JSON-LD eklendi.
 */
const HesaplamaAraclariPage = () => {
  // Üç kategoride 9 araç (bedeni-hasar broken link kaldırıldı; vercel.json 301 ile trafik-kazasi'ye yönlendirilir)
  const categories = [
    {
      id: 'is-hukuku',
      title: 'İş Hukuku Hesaplayıcıları',
      description: 'Kıdem, ihbar, fazla mesai, meslek hastalığı ve ilave tediye hesaplamaları. 2026 güncel mevzuat ve TRH-2010 esaslı.',
      tools: [
        {
          id: 'iscilik-alacaklari',
          title: 'İşçilik Alacakları Hesaplama',
          description: 'Kıdem tazminatı, ihbar tazminatı, yıllık izin ücreti ve fazla mesai alacaklarını 2026 oranlarıyla tek raporda hesaplayın.',
          icon: Briefcase,
          color: 'bg-orange-100 text-orange-600',
          link: '/hesaplama-araclari/iscilik-alacaklari'
        },
        {
          id: 'tazminat',
          title: 'İş Kazası Tazminat Hesaplama',
          description: 'Maluliyet, kusur ve TRH-2010 esaslı aktüerya. İş kazası nedeniyle maddi tazminatı hesaplayın.',
          icon: TrendingUp,
          color: 'bg-green-100 text-green-600',
          link: '/hesaplama-araclari/tazminat-hesaplama'
        },
        {
          id: 'meslek-hastaligi',
          title: 'Meslek Hastalığı Tazminatı',
          description: 'Yükümlülük süresi ve TRH-2010 tablosu kapsamında meslek hastalığı tazminatınızı hesaplayın.',
          icon: Stethoscope,
          color: 'bg-teal-100 text-teal-600',
          link: '/hesaplama-araclari/meslek-hastaligi'
        },
        {
          id: 'ilave-tediye',
          title: 'İlave Tediye Hesaplama',
          description: '6772 sayılı kanun kapsamında kamu işçileri için ilave tediye (ikramiye) hesaplama aracı.',
          icon: Banknote,
          color: 'bg-emerald-100 text-emerald-600',
          link: '/hesaplama-araclari/ilave-tediye'
        }
      ]
    },
    {
      id: 'trafik-sigorta',
      title: 'Trafik & Sigorta Hesaplayıcıları',
      description: 'Araç değer kaybı ve trafik kazası tazminatı için bilirkişi formatlı, sigorta tahkim ve mahkeme süreçlerine uygun hesaplama araçları.',
      tools: [
        {
          id: 'arac-deger-kaybi',
          title: 'Araç Değer Kaybı Hesaplama',
          description: '2026 Sigorta Genel Şartları, Baz Katsayı %19 ve A1-A4 hasar sınıflandırmasına göre değer kaybı hesabı.',
          icon: Car,
          color: 'bg-red-100 text-red-600',
          link: '/hesaplama-araclari/arac-deger-kaybi'
        },
        {
          id: 'trafik-kazasi',
          title: 'Trafik Kazası Tazminat Hesaplama',
          description: 'Sürekli sakatlık, geçici iş göremezlik, ikame araç ve manevi tazminat. KTK m.85 ve TBK m.49 uyumlu aktüerya.',
          icon: Shield,
          color: 'bg-slate-100 text-slate-600',
          link: '/hesaplama-araclari/trafik-kazasi'
        }
      ]
    },
    {
      id: 'ceza-usul',
      title: 'Ceza & Usul Hesaplayıcıları',
      description: 'İnfaz süresi, vekâlet ücreti ve dava süresi hesaplamaları. CGTİK, AAÜT 2026 ve usul kanunlarına uygun.',
      tools: [
        {
          id: 'infaz-yatar',
          title: 'İnfaz Yatar Hesaplama',
          description: 'CGTİK m.107 ve 11. Yargı Paketi kapsamında ceza infaz süresi, koşullu salıverilme ve denetimli serbestlik hesaplama.',
          icon: Calculator,
          color: 'bg-blue-100 text-blue-600',
          link: '/hesaplama-araclari/infaz-yatar'
        },
        {
          id: 'vekalet-ucreti',
          title: 'Vekâlet Ücreti Hesaplama',
          description: '2026 AAÜT (Avukatlık Asgari Ücret Tarifesi) kapsamında maktu ve nispi vekâlet ücretlerini hesaplayın.',
          icon: Scale,
          color: 'bg-indigo-100 text-indigo-600',
          link: '/hesaplama-araclari/vekalet-ucreti'
        },
        {
          id: 'dava-suresi',
          title: 'Dava Süresi & Zamanaşımı',
          description: 'Zamanaşımı, hak düşürücü süre, istinaf-temyiz ve ortalama dava süresi. TBK, TCK, HMK, CMK, İYUK ve İİK madde dayanaklı.',
          icon: Hourglass,
          color: 'bg-amber-100 text-amber-600',
          link: '/hesaplama-araclari/dava-suresi'
        }
      ]
    }
  ]

  const allTools = categories.flatMap(c => c.tools)
  const totalTools = allTools.length

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://koptay.av.tr/' },
      { '@type': 'ListItem', position: 2, name: 'Hesaplama Araçları', item: 'https://koptay.av.tr/hesaplama-araclari' }
    ]
  }

  // ItemList JSON-LD — Google'a "bu site bir hesaplayıcı koleksiyonudur" sinyali verir
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Koptay Hukuk Hesaplama Araçları',
    description: `${totalTools} adet ücretsiz hukuki hesaplama aracı`,
    numberOfItems: totalTools,
    itemListElement: allTools.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.title,
      url: `https://koptay.av.tr${tool.link}`,
      description: tool.description
    }))
  }

  // Sayfa altı SSS (FAQPage schema kaynağı)
  const faqs = [
    {
      q: 'Hesaplama araçlarınız ücretsiz mi?',
      a: 'Evet. Sitedeki dokuz hesaplama aracının tamamı ücretsizdir; üyelik veya kayıt gerekmez. Sonuçları PDF olarak indirebilir ve hukuki süreçte taslak olarak kullanabilirsiniz.'
    },
    {
      q: 'Hesaplama sonuçları mahkemeye sunulabilir mi?',
      a: 'Hesaplamalarımız bilirkişi raporu formatına yakın yapıdadır ve süreç başlangıcı için yön gösterici niteliktedir. Mahkemeye sunulacak nihai rapor için her zaman atanan bilirkişinin değerlendirmesi esastır; biz sürecin başında size somut bir aralık vermeyi hedefliyoruz.'
    },
    {
      q: 'Hesaplamaları kim hazırladı?',
      a: 'Tüm hesaplama araçları, Ankara Barosu tescilli avukat Av. Murat Can Koptay yönetiminde, ilgili kanun maddeleri (CGTİK, İş Kanunu, KTK, TBK, AAÜT vb.) ve Yargıtay yerleşik içtihatları esas alınarak hazırlanmıştır. 2026 mevzuat değişiklikleri ve TRH-2010 yaşam tablosu güncel olarak entegre edilmiştir.'
    },
    {
      q: 'Verilerim güvende mi?',
      a: 'Hesaplamalar tamamen tarayıcınızda çalışır; girdileriniz sunucuya gönderilmez. PDF rapor indirdiğinizde sadece e-posta adresiniz alınır (bültenimiz için, KVKK uyumlu açık rıza ile). E-postanızı istemiyorsanız PDF olmadan da hesaplama sonucunu ekrana görebilirsiniz.'
    },
    {
      q: 'Hangi hesaplama aracı bana uygun?',
      a: 'İşçi-işveren ilişkisi konularında İşçilik Alacakları, Tazminat veya Meslek Hastalığı sayfalarını; trafik kazası sonrası talepleriniz için Trafik Kazası ve Araç Değer Kaybı sayfalarını; ceza yargılaması konularında İnfaz Yatar sayfasını kullanabilirsiniz. Emin değilseniz iletişim bölümünden bize yazın, sizi doğru araca yönlendirelim.'
    }
  ]
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  }

  return (
    <>
      <SEO
        title="Hesaplama Araçları 2026 | 9 Avukat Onaylı Hukuki Hesaplama | Koptay Hukuk"
        description="Kıdem tazminatı, araç değer kaybı, infaz yatar, vekâlet ücreti, ilave tediye ve daha fazlası — 9 ücretsiz, avukat onaylı hesaplama aracı. 2026 güncel mevzuat, TRH-2010, AAÜT ve sigorta tahkim formülleriyle uyumlu."
        keywords="hukuki hesaplama araçları, kıdem tazminatı hesaplama, araç değer kaybı hesaplama, infaz yatar, vekalet ücreti, ilave tediye, iş kazası tazminatı, meslek hastalığı tazminatı, dava süresi, ankara avukat hesaplama"
        url="https://koptay.av.tr/hesaplama-araclari"
      />

      {/* JSON-LD: BreadcrumbList */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {/* JSON-LD: ItemList — hesaplama hub'ı sinyali */}
      <script type="application/ld+json">
        {JSON.stringify(itemListSchema)}
      </script>
      {/* JSON-LD: FAQPage */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      {/* Hero */}
      <section className="page-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <Calculator className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
            Avukat Onaylı Hukuki Hesaplama Araçları — 2026 Güncel
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            TRH-2010 yaşam tablosu, 2026 AAÜT ve sigorta tahkim formülleriyle uyumlu, bilirkişi raporu olarak yazdırılabilir 9 ücretsiz araç.
            Hukuki süreçlerinizde haklarınızın somut tutarını dakikalar içinde görün.
          </p>
        </div>
      </section>

      {/* Kategoriler */}
      {categories.map((cat) => (
        <section key={cat.id} className="py-12 odd:bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-lawDark mb-3">{cat.title}</h2>
              <p className="text-gray-600">{cat.description}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {cat.tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <Link
                    key={tool.id}
                    to={tool.link}
                    className="block p-6 rounded-xl bg-white border border-gray-200 hover:border-lawPrimary transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-lawDark mb-2">{tool.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                    <div className="flex items-center text-lawPrimary font-medium text-sm">
                      Hesaplamaya Başla
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      ))}

      {/* SSS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-lawDark mb-10">Sıkça Sorulan Sorular</h2>
            <div className="space-y-6">
              {faqs.map((f, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-lawDark mb-2">{f.q}</h3>
                  <p className="text-gray-700 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer + CTA */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 border-l-4 border-lawPrimary">
            <h2 className="text-lg font-semibold text-lawDark mb-3">Önemli Uyarı</h2>
            <p className="text-gray-700 mb-3">
              Bu hesaplama araçları genel bilgilendirme amaçlıdır ve her hukuki süreç kendi olgularına göre değerlendirilir.
              Mahkemeye sunulacak nihai rakam için bilirkişi raporu gereklidir; bu araçlar size sürecin başında somut bir aralık verir.
            </p>
            <p className="text-gray-700 mb-4">
              Davanız için kişiye özel hesaplama, dava stratejisi ve hak kayıplarına karşı koruma için
              <strong> Av. Murat Can Koptay</strong> ile iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+905307111864"
                className="bg-lawPrimary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-lawSecondary transition-colors inline-flex items-center"
              >
                Hemen Ara: 0530 711 18 64
              </a>
              <Link
                to="/iletisim"
                className="bg-white text-lawPrimary border border-lawPrimary px-5 py-2.5 rounded-lg font-medium hover:bg-lawPrimary hover:text-white transition-colors"
              >
                İletişim Formu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HesaplamaAraclariPage
