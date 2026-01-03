import React, { useState, useEffect, useRef } from 'react';

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWorkingHours, setIsWorkingHours] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const menuRef = useRef(null);

  const phoneNumber = '905307111864';
  const whatsappMessage = 'Merhaba, hukuki danışmanlık almak istiyorum.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const emailAddress = 'info@koptay.av.tr';

  // Çalışma saatlerini kontrol et
  useEffect(() => {
    const checkWorkingHours = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Pazar, 6 = Cumartesi
      const hour = now.getHours();
      
      // Pazartesi-Cuma 09:00-18:00
      const isWeekday = day >= 1 && day <= 5;
      const isWorkTime = hour >= 9 && hour < 18;
      
      setIsWorkingHours(isWeekday && isWorkTime);
    };

    checkWorkingHours();
    const interval = setInterval(checkWorkingHours, 60000); // Her dakika kontrol et
    
    return () => clearInterval(interval);
  }, []);

  // İlk ziyarette tooltip göster
  useEffect(() => {
    const hasSeenTooltip = sessionStorage.getItem('contactTooltipSeen');
    if (!hasSeenTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        setTimeout(() => {
          setShowTooltip(false);
          sessionStorage.setItem('contactTooltipSeen', 'true');
        }, 5000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Dışarı tıklayınca menüyü kapat
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
      {/* Tooltip - İlk ziyarette görünür */}
      {showTooltip && !isOpen && (
        <div className="absolute bottom-full right-0 mb-4 animate-fade-in">
          <div className="bg-lawGray text-white px-4 py-3 rounded-xl shadow-2xl max-w-[200px] relative">
            <p className="text-sm font-medium">
              {isWorkingHours ? 'Şu an müsaitiz!' : 'Mesaj bırakın, döneriz'}
            </p>
            <p className="text-xs text-white/70 mt-1">
              Size nasıl yardımcı olabiliriz?
            </p>
            {/* Ok işareti */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-lawGray transform rotate-45"></div>
          </div>
        </div>
      )}

      {/* Açılır Menü */}
      <div className={`absolute bottom-20 right-0 transition-all duration-300 ease-out ${
        isOpen 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-w-[280px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-lawGray to-lawPrimary px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg">Bize Ulaşın</h3>
                <p className="text-white/80 text-xs mt-0.5">Size yardımcı olmaktan memnuniyet duyarız</p>
              </div>
              {/* Çevrimiçi Durumu */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                isWorkingHours 
                  ? 'bg-emerald-500/20 text-emerald-100' 
                  : 'bg-amber-500/20 text-amber-100'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  isWorkingHours ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}></span>
                {isWorkingHours ? 'Çevrimiçi' : 'Mesai Dışı'}
              </div>
            </div>
          </div>

          {/* İletişim Seçenekleri */}
          <div className="p-3 space-y-2">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 group-hover:text-[#128C7E] transition-colors">WhatsApp</p>
                <p className="text-sm text-gray-500">Hızlı yanıt için yazın</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#128C7E] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Telefon */}
            <a
              href="tel:+905307111864"
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-lawSecondary to-lawPrimary rounded-xl flex items-center justify-center shadow-lg shadow-lawSecondary/20 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 group-hover:text-lawPrimary transition-colors">Telefon</p>
                <p className="text-sm text-gray-500">0530 711 18 64</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-lawPrimary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* E-posta */}
            <a
              href={`mailto:${emailAddress}`}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg shadow-gray-500/20 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 group-hover:text-gray-700 transition-colors">E-posta</p>
                <p className="text-sm text-gray-500">Detaylı bilgi için</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* İletişim Formu */}
            <button
              onClick={scrollToContact}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group text-left"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-lawSecondary/80 to-lawSecondary rounded-xl flex items-center justify-center shadow-lg shadow-lawSecondary/20 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 group-hover:text-lawSecondary transition-colors">İletişim Formu</p>
                <p className="text-sm text-gray-500">Mesajınızı bırakın</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-lawSecondary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Footer - Çalışma Saatleri */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Pzt-Cuma: 09:00 - 18:00</span>
              <span className="text-lawSecondary font-medium">Ücretsiz Ön Görüşme</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ana Buton */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center group ${
          isOpen 
            ? 'bg-lawGray rotate-0' 
            : 'bg-gradient-to-br from-lawSecondary to-lawPrimary hover:shadow-lawSecondary/40'
        }`}
        style={{ 
          boxShadow: isOpen 
            ? '0 10px 40px rgba(53, 52, 65, 0.3)' 
            : '0 10px 40px rgba(141, 27, 84, 0.3)'
        }}
        aria-label="İletişim Menüsünü Aç"
      >
        {/* Çevrimiçi Göstergesi */}
        {!isOpen && (
          <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            isWorkingHours ? 'bg-emerald-500' : 'bg-amber-500'
          }`}>
            {isWorkingHours && (
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
            )}
          </span>
        )}

        {/* Subtle pulse ring - sadece kapalıyken */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-2xl bg-lawSecondary/30 animate-ping opacity-20"></span>
        )}

        {/* İkon - Açık/Kapalı duruma göre değişir */}
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
