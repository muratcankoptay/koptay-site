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
      aria-label="Koptay Hukuk Bürosu — Ana giriş"
    >
      {/* Hafif dekoratif gradient — fotoğrafın arkasında subtle teal sızıntı */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 opacity-30 pointer-events-none hidden lg:block"
        style={{
          background: 'radial-gradient(circle at 70% 30%, rgba(84, 140, 141, 0.25), transparent 60%)'
        }}
        aria-hidden="true"
      />

      {/* Sol kenarda dikey ince teal cubuk — marka aksanı */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-lawSecondary/60 hidden md:block" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full py-24 lg:py-0">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Sol: Metin içerik */}
          <div className="lg:col-span-7 hero-fade-in">
            {/* Ust mini etiket */}
            <p className="text-lawSecondary text-sm md:text-base font-semibold tracking-[0.2em] uppercase mb-6">
              Ankara · Koptay Hukuk Bürosu
            </p>

            {/* Ana baslik */}
            <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-light text-white uppercase leading-[1.05] mb-8" lang="tr">
              <span className="block">Avukatlık <span className="text-lawSecondary italic font-serif normal-case">&amp;</span></span>
              <span className="block">Hukuk Hizmetleri</span>
            </h1>

            {/* Kisa aciklama — tek cumle, daha kisa ve odakli */}
            <p className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
              İş hukuku, trafik kazası, ceza, aile ve tazminat davalarında
              danışmanlık ve dava takibi.
            </p>

            {/* Telefon & calisma saati — tek satirli meta strip */}
            <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-white/85">
              <a
                href="tel:+905307111864"
                onClick={() => trackGA(GA_EVENTS.PHONE_CLICK, { source: 'hero' })}
                aria-label="Telefon ile ara: 0530 711 18 64"
                className="inline-flex items-center gap-2 text-lg md:text-xl font-medium hover:text-lawSecondary transition-colors"
              >
                <svg className="w-5 h-5 text-lawSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                0530 711 18 64
              </a>
              <span className="text-white/30" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-2 text-sm md:text-base text-white/70">
                <svg className="w-4 h-4 text-lawSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Hafta içi 09:00 – 18:00 · Cumartesi randevu ile
              </span>
            </div>

            {/* CTA Butonlari — sayfa ici butonlarla uyumlu rounded-md */}
            <div className="flex flex-col sm:flex-row justify-start gap-3 sm:gap-4">
              <button
                type="button"
                onClick={scrollToContact}
                className="inline-flex items-center justify-center gap-2 bg-lawSecondary hover:bg-white hover:text-lawPrimary text-white px-7 py-3.5 rounded-md font-medium transition-colors duration-300"
              >
                İletişim
              </button>
              <button
                type="button"
                onClick={scrollToServices}
                className="group inline-flex items-center justify-center gap-2 border border-white/60 hover:border-white text-white px-7 py-3.5 rounded-md font-medium transition-colors duration-300"
              >
                Hizmetler
                <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sağ: Kurucu fotoğrafı (sadece lg+ ekranlarda görünür) */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="relative">
              {/* Arka plan teal aksan bloğu */}
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-lawSecondary/40 rounded-md" aria-hidden="true" />
              <div className="absolute -top-5 -left-5 w-20 h-20 border-2 border-lawSecondary/50 rounded-md" aria-hidden="true" />
              {/* Fotoğraf */}
              <div className="relative overflow-hidden rounded-md shadow-2xl ring-1 ring-white/10">
                <img
                  src="/images/team/murat-can-koptay.jpeg"
                  alt="Av. Murat Can Koptay — Kurucu Avukat"
                  className="w-full h-auto object-cover aspect-[4/5]"
                  width="480"
                  height="600"
                  fetchpriority="high"
                  decoding="async"
                />
                {/* İnce alt overlay — kontrast/derinlik */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-lawDark/70 to-transparent pointer-events-none" aria-hidden="true" />
                {/* İsim plakası */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-base font-semibold">Av. Murat Can Koptay</p>
                  <p className="text-white/80 text-xs tracking-wider uppercase mt-0.5">Kurucu Avukat · Ankara 2 Nolu Barosu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
