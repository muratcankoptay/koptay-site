import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Bilgilendirici çerez banner'ı (KVKK aydınlatma yükümlülüğü için).
 * Analitik (GA4 + Clarity) her ziyaretçi için yüklenir; banner sadece kullanıcıyı
 * bilgilendirir ve dismiss edilebilir. Bir daha gösterilmemesi için
 * localStorage'da bir flag set edilir.
 */
const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('cookieNoticeDismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('cookieNoticeDismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 text-white p-4 z-50 backdrop-blur-sm border-t border-gray-800 shadow-2xl animate-fadeInUp">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-300 flex-1">
          <p>
            Sitemizde ziyaretçi sayısını ve kullanıcı deneyimini iyileştirmek amacıyla
            anonim analitik araçlar (Google Analytics, Microsoft Clarity) kullanıyoruz.
            Kişisel bilgileriniz toplanmaz. Detaylar için{' '}
            <Link to="/kvkk" className="text-primary-400 hover:text-primary-300 underline">
              KVKK ve Çerez Politikamızı
            </Link>{' '}
            inceleyebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDismiss}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap"
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
