import { trackGA, GA_EVENTS } from '../utils/gaEvents';

/**
 * Hero — sade gradient + tipografi.
 * Arka plan resmi yok; LCP yuku sifir, marka teal/lacivert kimligi domine ediyor.
 * Ince dekoratif SVG geometri (~1KB inline) gorseli kismen renklendirir.
 */
const Hero = () => {
  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen min-h-[100svh] flex items-center overflow-hidden bg-gradient-to-br from-lawDark via-lawPrimary to-[#395d61]"
      aria-label="Koptay Hukuk Burosu — Ana giris"
    >
      {/* Dekoratif geometrik desen — sag tarafta hafif teal ipucu */}
      <svg
        className="absolute inset-y-0 right-0 h-full w-1/2 opacity-25 pointer-events-none"
        viewBox="0 0 600 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#548c8d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#548c8d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="500" cy="200" r="220" stroke="url(#heroGrad)" strokeWidth="1.5" />
        <circle cx="500" cy="200" r="320" stroke="url(#heroGrad)" strokeWidth="1" />
        <circle cx="500" cy="200" r="420" stroke="url(#heroGrad)" strokeWidth="0.5" />
        <line x1="0" y1="640" x2="600" y2="500" stroke="#548c8d" strokeOpacity="0.15" strokeWidth="1" />
        <line x1="0" y1="700" x2="600" y2="580" stroke="#548c8d" strokeOpacity="0.1" strokeWidth="1" />
      </svg>

      {/* Sol kenarda dikey ince teal cubuk — marka aksanı */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-lawSecondary/60 hidden md:block" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="max-w-4xl">
          <div className="hero-fade-in">
            {/* Ust mini etiket */}
            <p className="text-lawSecondary text-sm md:text-base font-semibold tracking-[0.2em] uppercase mb-6">
              Ankara · Koptay Hukuk Burosu
            </p>

            {/* Ana baslik */}
            <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-light text-white uppercase leading-[1.05] mb-8">
              <span className="block">Avukatlik <span className="text-lawSecondary italic font-serif normal-case">&amp;</span></span>
              <span className="block">Hukuk Hizmetleri</span>
            </h1>

            {/* Kisa aciklama — bilgilendirme dilinde */}
            <p className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
              Is hukuku, trafik kazasi, ceza, aile ve tazminat davalarinda
              hukuki danismanlik. Iletisim icin asagidaki kanallari
              kullanabilirsiniz.
            </p>

            {/* Telefon & Calisma saatleri */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <a
                href="tel:+905307111864"
                onClick={() => trackGA(GA_EVENTS.PHONE_CLICK, { source: 'hero' })}
                aria-label="Telefon ile ara: 0530 711 18 64"
                className="flex items-center gap-3 text-white hover:text-lawSecondary transition-colors group"
              >
                <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center group-hover:bg-lawSecondary transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-medium">0530 711 18 64</p>
                  <p className="text-sm text-white/70">Telefon</p>
                </div>
              </a>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm">Hafta ici 09:00 - 18:00</p>
                  <p className="text-xs text-white/60">Cumartesi randevu ile</p>
                </div>
              </div>
            </div>

            {/* CTA Butonlari */}
            <div className="flex flex-col sm:flex-row justify-start space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                type="button"
                onClick={scrollToContact}
                className="group relative bg-lawSecondary px-8 py-4 font-sans font-medium text-white uppercase tracking-wide overflow-hidden transition-all duration-300 transform hover:scale-[1.02]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                <span className="relative flex items-center justify-center gap-2">
                  Iletisim
                </span>
              </button>
              <button
                type="button"
                onClick={scrollToServices}
                className="group relative border-2 border-white/80 px-8 py-4 font-sans font-medium text-white uppercase tracking-wide overflow-hidden transition-all duration-300"
              >
                <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <span className="relative flex items-center justify-center gap-2 group-hover:text-lawPrimary transition-colors duration-300">
                  Hizmetler
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
