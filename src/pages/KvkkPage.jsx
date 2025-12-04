import React from 'react';
import SEO from '../components/SEO';

const KvkkPage = () => {
  return (
    <div className="pt-24 pb-16">
      <SEO 
        title="KVKK Aydınlatma Metni | Koptay Hukuk Bürosu" 
        description="Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni ve çerez politikamız."
      />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold mb-8 font-serif text-gray-900">KVKK Aydınlatma Metni ve Çerez Politikası</h1>
          
          <div className="prose prose-lg text-gray-600">
            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">1. Veri Sorumlusu</h3>
            <p className="mb-4">
              Koptay Hukuk Bürosu olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, 
              kişisel verilerinizin güvenliği ve gizliliği konusuna azami hassasiyet göstermekteyiz.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">2. Kişisel Verilerin İşlenme Amacı</h3>
            <p className="mb-4">
              Web sitemizi ziyaretiniz sırasında elde edilen verileriniz; hizmet kalitemizi artırmak, 
              iletişim faaliyetlerini yürütmek, istatistiksel analizler yapmak ve yasal yükümlülüklerimizi 
              yerine getirmek amacıyla işlenmektedir.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">3. Çerez (Cookie) Kullanımı</h3>
            <p className="mb-4">
              Sitemizde kullanıcı deneyimini geliştirmek, site trafiğini analiz etmek ve performans takibi yapmak 
              amacıyla çerezler kullanılmaktadır. Microsoft Clarity ve Google Analytics gibi araçlar vasıtasıyla 
              anonim kullanım verileri (tıklama, gezinme hareketleri vb.) toplanabilir.
            </p>
            
            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">4. Haklarınız</h3>
            <p className="mb-4">
              KVKK'nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, yanlış işlenmişse 
              düzeltilmesini isteme, verilerin silinmesini veya yok edilmesini talep etme haklarına sahipsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KvkkPage;
