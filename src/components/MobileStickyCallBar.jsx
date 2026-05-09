import { useEffect, useState } from 'react';

/**
 * MobileStickyCallBar
 * Mobilde alt kosede surekli gorunur "Hemen Ara" + WhatsApp cubugu.
 */

const PHONE = '+905307111864';
const PHONE_DISPLAY = '0530 711 18 64';
const WA_TEXT = encodeURIComponent('Merhaba, web siteniz uzerinden ulasiyorum. Bilgi almak istiyorum.');
const WHATSAPP_URL = `https://wa.me/905307111864?text=${WA_TEXT}`;

const MobileStickyCallBar = () => {
  const [hidden, setHidden] = useState(false);
  const [consentPending, setConsentPending] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin') || path.startsWith('/web-admin')) {
      setHidden(true);
      return;
    }
    const checkConsent = () => {
      try {
        const c = localStorage.getItem('cookieConsent');
        setConsentPending(!(c === 'accepted' || c === 'rejected'));
      } catch { setConsentPending(false); }
    };
    checkConsent();
    const onConsentChange = () => checkConsent();
    window.addEventListener('koptay:consent-change', onConsentChange);
    return () => window.removeEventListener('koptay:consent-change', onConsentChange);
  }, []);

  if (hidden || consentPending) return null;

  const fireEvent = (name, payload) => {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, payload || {});
      }
    } catch { /* yoksay */ }
  };

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="region"
      aria-label="Hizli iletisim"
    >
      <div className="flex">
        <a
          href={`tel:${PHONE}`}
          onClick={() => fireEvent('phone_click', { source: 'mobile_sticky_bar' })}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-lawSecondary text-white font-semibold text-sm active:bg-lawPrimary transition-colors"
          aria-label={`Hemen ara: ${PHONE_DISPLAY}`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>Hemen Ara</span>
          <span className="hidden sm:inline opacity-90">{` · ${PHONE_DISPLAY}`}</span>
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => fireEvent('whatsapp_click', { source: 'mobile_sticky_bar' })}
          className="w-16 flex items-center justify-center bg-[#25D366] text-white active:bg-[#1ea857] transition-colors"
          aria-label="WhatsApp uzerinden mesaj gonder"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
            <path d="M20.52 3.48A12 12 0 0 0 3.5 20.5L2 22l1.5-1.5A12 12 0 0 0 20.52 3.48zM12 20.3a8.3 8.3 0 0 1-4.2-1.15l-.3-.18-3.1.81.83-3.02-.2-.31A8.3 8.3 0 1 1 20.3 12 8.3 8.3 0 0 1 12 20.3zm4.6-6.2c-.25-.13-1.5-.74-1.73-.82-.23-.08-.4-.13-.57.13s-.65.82-.8.99c-.15.17-.3.18-.55.06a6.85 6.85 0 0 1-2-1.24 7.5 7.5 0 0 1-1.39-1.72c-.15-.25 0-.39.11-.51.11-.11.25-.3.38-.45a1.66 1.66 0 0 0 .25-.42.46.46 0 0 0 0-.45c-.07-.13-.57-1.36-.78-1.86s-.41-.43-.57-.43h-.49a.94.94 0 0 0-.68.32 2.85 2.85 0 0 0-.9 2.13 5 5 0 0 0 1.04 2.65 11.36 11.36 0 0 0 4.34 3.85c.6.26 1.07.41 1.43.53a3.45 3.45 0 0 0 1.58.1 2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .15-1.2c-.07-.1-.23-.17-.48-.3z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default MobileStickyCallBar;
