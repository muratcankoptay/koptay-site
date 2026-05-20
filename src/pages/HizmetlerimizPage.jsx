import SEO from '../components/SEO'
import Services from '../components/Services'
import { OG_IMAGES } from '../config/ogImages'

const HizmetlerimizPage = () => {
  return (
    <>
      <SEO
        title="Çalışma Alanları — Koptay Hukuk Bürosu | Ankara"
        description="İş, ticaret, aile, ceza ve gayrimenkul hukuku alanlarında danışmanlık ve dava takibi. Her alan için süreç ve SSS sayfaları."
        image={OG_IMAGES.hizmetler}
        url="/hizmetlerimiz"
      />

      {/* Hero Section */}
      <section className="page-hero">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl">
            <p className="page-hero-eyebrow">Koptay Hukuk Bürosu</p>
            <h1 className="page-hero-title">Çalışma Alanları</h1>
            <p className="page-hero-subtitle">
              Bireyler ve kurumlar için danışmanlık ve dava takibi
              sağladığımız hukuk alanları.
            </p>
          </div>
        </div>
      </section>

      <Services />
    </>
  )
}

export default HizmetlerimizPage
