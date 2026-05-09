import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * KVKK uyumlu çerez/analitik onay banner'ı.
 *
 * Davranış:
 *  - Kullanıcı "Kabul Et" demediği sürece GA4 ve Microsoft Clarity yüklenmez.
 *  - "Reddet" seçeneği reddi kalıcı olarak kaydeder; analitik scriptler hiç yüklenmez.
 *  - "Kabul Et" tıklanınca anında window.__loadAnalytics() çağrılır.
 *  - Mevcut onay localStorage'da `cookieConsent` (accepted | rejected) anahtarında saklanır.
 */
const CONSENT_KEY = 'cookieConsent';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem(CONSENT_KEY);
    } catch {
      // localStorage erişilemezse banner gösterilir, ancak onay saklanamaz
    }

    if (stored === 'accepted' || stored === 'rejected') {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
    } catch { /* yoksay */ }
    if (typeof window !== 'undefined' && typeof window.__loadAnalytics === 'function') {
      window.__loadAnalytics();
    }
    setIsVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'rejected');
    } catch { /* yoksay */ }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-gray-900/95 text-white p-4 z-50 backdrop-blur-sm border-t border-gray-800 shadow-2xl"
      role="dialog"
      aria-live="polite"
      aria-label="Çerez tercihleri"
    >
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-sm text-gray-300 flex-1">
          <p>
            Sitemizde ziyaretçi sayısını ve kullanıcı deneyimini iyileştirmek için
            anonim analitik araçlar (Google Analytics, Microsoft Clarity) kullanmak istiyoruz.
            Onayınız olmadan bu araçlar yüklenmez. Detaylar için{' '}
            <Link to="/kvkk" className="text-lawSecondary hover:text-white underline">
              KVKK ve Çerez Politikamızı
            </Link>{' '}
            inceleyebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReject}
            className="border border-gray-500 hover:border-white text-gray-200 hover:text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap"
          >
            Reddet
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="bg-lawSecondary hover:bg-lawPrimary text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
