import React, { useState, useEffect, useRef } from 'react';
import { trackGA, GA_EVENTS } from '../utils/gaEvents';

/**
 * Sabit iletişim menüsü — Madde 7/c-7/e gereği "çevrimiçi/mesai dışı" canlı durum,
 * pulse animasyonu, "Şu an müsaitiz!" tooltip'i ve "Profesyonel Hizmet" yazısı
 * kaldırılmıştır. Sade, statik bir iletişim ikonu olarak yer alır.
 */
const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const phoneNumber = '905307111864';
  const waText = encodeURIComponent('Merhaba, web siteniz uzerinden ulasiyorum. Bilgi almak istiyorum.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${waText}`;
  const emailAddress = 'info@koptay.av.tr';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToContact = () => {
    setIsOpen(false);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#contact';
    }
  };

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50">
      {/* Açılır Menü */}
      <div className={`absolute bottom-20 right-0 transition-all duration-300 ease-out ${
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-w-[280px]">
          {/* Header */}
          <div className="bg-lawDark px-5 py-4">
            <h3 className="text-white font-semibold text-lg">İletişim</h3>
          </div>

          {/* İletişim Seçenekleri */}
          <div className="p-3 space-y-2">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
              onClick={() => {
                trackGA(GA_EVENTS.WHATSAPP_CLICK, { source: 'floating_menu' });
                setIsOpen(false);
              }}
            >
              <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">WhatsApp</p>
              </div>
            </a>

            {/* Telefon */}
            <a
              href="tel:+905307111864"
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
              onClick={() => {
                trackGA(GA_EVENTS.PHONE_CLICK, { source: 'floating_menu' });
                setIsOpen(false);
              }}
            >
              <div className="w-12 h-12 bg-lawSecondary rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Telefon</p>
                <p className="text-sm text-gray-500">0530 711 18 64</p>
              </div>
            </a>

            {/* E-posta */}
            <a
              href={`mailto:${emailAddress}`}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
              onClick={() => {
                trackGA(GA_EVENTS.EMAIL_CLICK, { source: 'floating_menu' });
                setIsOpen(false);
              }}
            >
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">E-posta</p>
                <p className="text-sm text-gray-500">{emailAddress}</p>
              </div>
            </a>

            {/* İletişim Formu */}
            <button
              onClick={scrollToContact}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-left"
            >
              <div className="w-12 h-12 bg-lawSecondary/80 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">İletişim Formu</p>
              </div>
            </button>
          </div>

          {/* Footer - Çalışma Saatleri */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <span className="text-xs text-gray-500">Pzt-Cuma: 09:00 - 18:00</span>
          </div>
        </div>
      </div>

      {/* Ana Buton */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 rounded-2xl shadow-md transition-colors duration-300 flex items-center justify-center ${
          isOpen ? 'bg-lawDark' : 'bg-lawSecondary'
        }`}
        aria-label="İletişim Menüsü"
      >
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          {isOpen ? (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
};

export default FloatingContact;
