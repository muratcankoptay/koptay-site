import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a small delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
    
    // Here you would typically initialize your analytics scripts if they weren't already loaded
    // or if you were blocking them until consent.
    // For this implementation, we assume scripts are loaded but this banner fulfills the notification requirement.
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 text-white p-4 z-50 backdrop-blur-sm border-t border-gray-800 shadow-2xl animate-fadeInUp">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-300 flex-1">
          <p>
            Sizlere daha iyi hizmet sunabilmek adına sitemizde çerezler (cookies) kullanılmaktadır. 
            Detaylı bilgi için <Link to="/kvkk" className="text-primary-400 hover:text-primary-300 underline">KVKK ve Çerez Politikamızı</Link> inceleyebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
