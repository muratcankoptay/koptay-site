import SEO from '../components/SEO'
import Services from '../components/Services'

const HizmetlerimizPage = () => {
  return (
    <>
      <SEO
        title="Çalışma Alanları — Koptay Hukuk Bürosu"
        description="Koptay Hukuk Bürosu çalışma alanları."
        url="/hizmetlerimiz"
      />

      {/* Hero Section */}
      <section className="page-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6 font-serif">
            Çalışma Alanları
          </h1>
        </div>
      </section>

      <Services />
    </>
  )
}

export default HizmetlerimizPage
