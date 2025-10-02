import SEO from '../components/SEO'
import ClientPanel from '../components/ClientPanel'

const MuvekkilPaneliPage = () => {
  return (
    <>
      <SEO 
        title="Müvekkil Paneli - Koptay Hukuk Bürosu"
        description="Müvekkillerimizin dava takibi, belge paylaşımı ve hukuki süreçlerin yönetimi için güvenli müvekkil paneli."
        keywords="müvekkil paneli, dava takibi, hukuki süreç yönetimi, belge paylaşımı, avukat müvekkil iletişimi"
        url="/muvekkil-paneli"
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lawPrimary to-lawSecondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6 font-serif">
            Müvekkil Paneli
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Davalarınızı takip edin, belgelerinizi görüntüleyin ve hukuki süreçlerinizi yönetin
          </p>
        </div>
      </section>

      <ClientPanel />
    </>
  )
}

export default MuvekkilPaneliPage