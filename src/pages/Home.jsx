import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Quote,
  Star,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Briefcase,
  Building,
  Heart,
  Shield,
  Home as HomeIcon,
  Calculator,
  TrendingUp,
  Car,
  HeartHandshake,
  BookOpen,
  Clock,
  User,
  Eye
} from 'lucide-react'

import SEO from '../components/SEO'
import Hero from '../components/Hero'
import { api, formatDate } from '../utils/api'
import { getAllArticleViews } from '../services/articleViewsService'

const Home = () => {
  const [featuredArticles, setFeaturedArticles] = useState([])
  const [loadingArticles, setLoadingArticles] = useState(true)

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        // Paralel olarak makaleleri ve view sayılarını çek
        const [articlesResponse, viewsData] = await Promise.all([
          api.getArticles(),
          getAllArticleViews()
        ])
        
        if (articlesResponse.success) {
          // View sayılarını makalelere ekle
          const articlesWithViews = articlesResponse.data.map(article => ({
            ...article,
            views: viewsData[article.slug] || article.views || 0
          }))
          
          // Get featured articles or first 3 articles
          const featured = articlesWithViews
            .filter(article => article.featured)
            .slice(0, 3)
          
          // If no featured articles, get first 3
          const articles = featured.length > 0 ? featured : articlesWithViews.slice(0, 3)
          setFeaturedArticles(articles)
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoadingArticles(false)
      }
    }

    fetchFeaturedArticles()
  }, [])

  const getCategoryColor = (category) => {
    const colors = {
      'İş Hukuku': 'bg-blue-100 text-blue-800',
      'Ticaret Hukuku': 'bg-green-100 text-green-800',
      'Aile Hukuku': 'bg-pink-100 text-pink-800',
      'Ceza Hukuku': 'bg-red-100 text-red-800',
      'Gayrimenkul Hukuku': 'bg-yellow-100 text-yellow-800',
      'İcra ve İflas Hukuku': 'bg-purple-100 text-purple-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }
  // NOT: TBB Reklam Yasağı Yönetmeliği Madde 7/d gereği müvekkil yorumu / referans
  // paylaşımı yasaktır. Eski testimonials verisi bu nedenle kaldırılmıştır.

  return (
    <>
      <SEO />
      
      {/* Hero Section */}
      <Hero />

      {/* Hesaplama Araçları Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Calculator className="w-16 h-16 text-lawPrimary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-light text-lawDark mb-6 font-serif">
              Hesaplama Araçları
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: 'İnfaz Süresi Hesaplama',
                description: 'Ceza infazı süresi, koşullu salıverme ve denetimli serbestlik hesaplama',
                icon: Calculator,
                color: 'bg-blue-100 text-blue-600',
                link: '/hesaplama-araclari/infaz-yatar'
              },
              {
                title: 'Tazminat Hesaplama',
                description: 'İş kazası ve meslek hastalığı tazminat hesaplama',
                icon: TrendingUp,
                color: 'bg-green-100 text-green-600',
                link: '/hesaplama-araclari/tazminat-hesaplama'
              },
              {
                title: 'Değer Kaybı Hesaplama',
                description: 'Araç kazalarında değer kaybı tazminat hesaplama',
                icon: Car,
                color: 'bg-red-100 text-red-600',
                link: '/hesaplama-araclari/deger-kaybi'
              },
              {
                title: 'Bedeni Hasar Hesaplama',
                description: 'Trafik kazalarında bedeni hasar tazminat hesaplama',
                icon: HeartHandshake,
                color: 'bg-purple-100 text-purple-600',
                link: '/hesaplama-araclari/bedeni-hasar'
              }
            ].map((tool, index) => (
              <Link 
                key={index} 
                to={tool.link}
                className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-4`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-lawDark mb-3">{tool.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{tool.description}</p>
                <div className="flex items-center text-lawPrimary font-medium text-sm">
                  Hesapla
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/hesaplama-araclari"
              className="inline-flex items-center bg-lawPrimary text-white px-8 py-4 rounded-lg font-semibold hover:bg-lawSecondary transition-all duration-300 hover:shadow-lg"
            >
              Tüm Hesaplama Araçları
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Kamulastirma Haritasi - Essiz Farklilastirici */}
      <section className="py-20 bg-gradient-to-br from-lawPrimary via-lawDark to-lawPrimary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 Q200,100 400,200 T800,200" stroke="white" strokeWidth="1" fill="none" />
            <path d="M0,250 Q200,150 400,250 T800,250" stroke="white" strokeWidth="1" fill="none" />
            <circle cx="400" cy="200" r="8" fill="white" />
            <circle cx="200" cy="180" r="4" fill="white" />
            <circle cx="600" cy="220" r="4" fill="white" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-lawSecondary/30 text-lawSecondary text-xs font-semibold tracking-wider uppercase mb-4">
                Turkiye'de Tek
              </span>
              <h2 className="text-4xl md:text-5xl font-light mb-6 font-serif leading-tight">
                Ankara Kamulastirma <span className="text-lawSecondary italic">Haritasi</span>
              </h2>
              <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-6">
                Ankara ve cevresindeki guncel kamulastirma davalarini, idari surecleri ve emsal Yargitay kararlarini harita uzerinden takip edebileceginiz interaktif bir arac. Mulkunuz risk altinda mi, hemen gorun.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-start gap-2 text-white/85">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-lawSecondary shrink-0" aria-hidden="true"></span>
                  <span>Bolge bazli dava emsalleri ve surec takibi</span>
                </li>
                <li className="flex items-start gap-2 text-white/85">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-lawSecondary shrink-0" aria-hidden="true"></span>
                  <span>Idari ve yargisal asamalar icin pratik rehber</span>
                </li>
                <li className="flex items-start gap-2 text-white/85">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-lawSecondary shrink-0" aria-hidden="true"></span>
                  <span>Bedel artirim ve deger tespiti emsalleri</span>
                </li>
              </ul>
              <Link
                to="/kamulastirma-haritasi"
                className="inline-flex items-center gap-2 bg-lawSecondary hover:bg-white hover:text-lawPrimary text-white px-7 py-3.5 rounded-lg font-semibold text-base transition-colors"
              >
                <MapPin className="w-5 h-5" aria-hidden="true" />
                Haritayi Incele
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="w-72 h-72 rounded-full bg-white/5 border border-white/15 flex items-center justify-center backdrop-blur-sm">
                <div className="w-56 h-56 rounded-full bg-lawSecondary/20 border border-lawSecondary/40 flex items-center justify-center">
                  <MapPin className="w-24 h-24 text-lawSecondary" strokeWidth={1.2} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-lawDark mb-6 font-serif">
              Makaleler
            </h2>
          </div>

          {loadingArticles ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredArticles.map((article, index) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Article Image */}
                  <div className="relative h-48 bg-gradient-to-br from-lawPrimary to-lawSecondary overflow-hidden">
                    {article.image ? (
                      <img
                        src={typeof article.image === 'object' ? article.image.url : article.image}
                        alt={(typeof article.image === 'object' && article.image.alternativeText) ? article.image.alternativeText : article.title}
                        className="w-full h-full object-cover"
                        width="640"
                        height="360"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-white text-center p-6">
                          <BookOpen className="w-12 h-12 mx-auto mb-2" />
                          <div className="text-sm opacity-75">Hukuk Makalesi</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {article.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-lawSecondary text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Öne Çıkan
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    {/* Article Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <span className="text-xs">{formatDate(article.publishDate)}</span>
                    </div>

                    {/* Article Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight font-serif line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Article Excerpt */}
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* View Count & Read More */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.views?.toLocaleString('tr-TR') || 0} görüntülenme
                      </div>
                      <Link
                        to={`/makaleler/${article.slug}`}
                        className="inline-flex items-center text-lawPrimary font-medium hover:text-lawSecondary transition-colors"
                      >
                        Devamını Oku
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link 
              to="/makaleler"
              className="inline-flex items-center bg-lawPrimary text-white px-8 py-4 rounded-lg font-semibold hover:bg-lawSecondary transition-all duration-300 hover:shadow-lg"
            >
              Tüm Makaleleri Görüntüle
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-lawDark mb-6 font-serif">
              Çalışma Alanları
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-16">
            {[
              { title: 'İş Hukuku', icon: Briefcase, color: 'bg-lawPrimary' },
              { title: 'Ticaret Hukuku', icon: Building, color: 'bg-lawSecondary' },
              { title: 'Aile Hukuku', icon: Heart, color: 'bg-lawGreen' },
              { title: 'Ceza Hukuku', icon: Shield, color: 'bg-lawGray' },
              { title: 'Gayrimenkul Hukuku', icon: HomeIcon, color: 'bg-lawDark' }
            ].map((service, index) => (
              <div key={index} className="text-center">
                <div className={`${service.color} h-32 flex items-center justify-center mb-4 rounded-lg transition-transform duration-300 hover:scale-105`}>
                  <service.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-lg font-serif text-lawDark">
                  {service.title}
                </h3>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/hizmetlerimiz"
              className="inline-flex items-center gap-2 bg-lawPrimary text-white px-8 py-4 font-medium uppercase tracking-wide hover:bg-lawSecondary transition-all duration-300"
            >
              Tüm Çalışma Alanları
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* İletişim */}
      <section className="py-20 bg-lawDark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 font-serif">
            İletişim
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <div className="flex items-center gap-3 text-white">
              <Phone className="w-6 h-6 text-lawSecondary" />
              <a 
                href="tel:+905307111864" 
                className="text-lg hover:text-lawSecondary transition-colors"
              >
                +90 530 711 18 64
              </a>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <Mail className="w-6 h-6 text-lawSecondary" />
              <a 
                href="mailto:info@koptay.av.tr" 
                className="text-lg hover:text-lawSecondary transition-colors"
              >
                info@koptay.av.tr
              </a>
            </div>
            
            <div className="flex items-center gap-3 text-white">
              <MapPin className="w-6 h-6 text-lawSecondary" />
              <span className="text-lg">Çankaya/ANKARA</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/iletisim"
              className="bg-lawSecondary text-white px-8 py-4 font-medium uppercase tracking-wide hover:bg-lawPrimary transition-all duration-300"
            >
              İletişim Formu
            </Link>
            <a
              href="tel:+905307111864"
              className="border-2 border-white text-white px-8 py-4 font-medium uppercase tracking-wide hover:bg-white hover:text-lawDark transition-all duration-300"
            >
              Telefon
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home