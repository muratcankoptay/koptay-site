import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted',
      });
    }
    if (typeof window.__initClarity === 'function') {
      window.__initClarity();
    }
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 text-white p-4 z-50 backdrop-blur-sm border-t border-gray-800 shadow-2xl animate-fadeInUp">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-300 flex-1">
          <p>
            Sizlere daha iyi hizmet sunabilmek için sitemizde analitik çerezler (Microsoft Clarity, Google Analytics) kullanmak istiyoruz.
            Detaylı bilgi için <Link to="/kvkk" className="text-primary-400 hover:text-primary-300 underline">KVKK ve Çerez Politikamızı</Link> inceleyebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReject}
            className="bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white px-5 py-2 rounded-lg text-sm font-medium border border-gray-600 transition-colors duration-200 whitespace-nowrap"
          >
            Reddet
          </button>
          <button
            onClick={handleAccept}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
