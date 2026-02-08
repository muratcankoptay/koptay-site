import SEO from '../components/SEO'
import Services from '../components/Services'

const HizmetlerimizPage = () => {
  return (
    <>
      <SEO 
        title="Hizmetlerimiz - Koptay Hukuk Bürosu"
        description="İş hukuku, ticaret hukuku, aile hukuku, ceza hukuku ve gayrimenkul hukuku alanlarında profesyonel hukuki hizmetler. Ankara'da uzman avukat kadrosu ile yanınızdayız."
        keywords="avukat ankara, iş hukuku, ticaret hukuku, aile hukuku, ceza hukuku, gayrimenkul hukuku, hukuk bürosu ankara"
        url="/hizmetlerimiz"
      />
      
      {/* Hero Section for Services */}
      <section className="page-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6 font-serif">
            Hizmetlerimiz
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Geniş bir yelpazede profesyonel hukuki hizmet sunuyoruz. 
            Her alanda uzmanlaşmış deneyimli kadromuzla yanınızdayız.
          </p>
        </div>
      </section>

      <Services />
    </>
  )
}

export default HizmetlerimizPage