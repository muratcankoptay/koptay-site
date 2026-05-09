import { Phone, MessageCircle, Mail } from 'lucide-react';
import { trackGA, GA_EVENTS } from '../utils/gaEvents';

/**
 * ArticleCTA
 *
 * Makalenin sonunda gosterilen "avukata danisin" cagrisi.
 * - Telefon, WhatsApp ve e-posta secenekleri
 * - GA4 event'leri tetikler (kaynak: article)
 * - article.category opsiyonel: "Bu konuda" cumlesinde kullanilir
 */
const ArticleCTA = ({ category, slug }) => {
  const phone = '+905307111864';
  const phoneDisplay = '0530 711 18 64';
  const waText = encodeURIComponent(
    `Merhaba, web siteniz uzerinden${category ? ' ' + category + ' alaninda' : ''} bilgi almak icin ulasiyorum.`
  );
  const wa = `https://wa.me/905307111864?text=${waText}`;
  const email = 'info@koptay.av.tr';

  return (
    <section
      className="my-12 rounded-2xl bg-gradient-to-br from-lawPrimary via-lawDark to-lawPrimary text-white p-8 md:p-10 shadow-xl"
      aria-label="Iletisim"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-light mb-3">
          Iletisim
        </h2>
        <p className="text-white/85 text-base md:text-lg leading-relaxed mb-7">
          Bilgi almak icin asagidaki kanallardan ulasabilirsiniz.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch">
          <a
            href={`tel:${phone}`}
            onClick={() => trackGA(GA_EVENTS.ARTICLE_CTA_CLICK, { channel: 'phone', slug })}
            className="inline-flex items-center justify-center gap-2 bg-lawSecondary hover:bg-white hover:text-lawPrimary text-white px-7 py-3.5 rounded-lg font-semibold text-base transition-colors"
            aria-label={`Telefon ile ara: ${phoneDisplay}`}
          >
            <Phone className="w-5 h-5" aria-hidden="true" />
            Hemen Ara · {phoneDisplay}
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGA(GA_EVENTS.ARTICLE_CTA_CLICK, { channel: 'whatsapp', slug })}
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:bg-[#25D366] hover:border-[#25D366] text-white px-6 py-3.5 rounded-lg font-semibold text-base transition-colors"
            aria-label="WhatsApp ile mesaj gonder"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            WhatsApp
          </a>
          <a
            href={`mailto:${email}`}
            onClick={() => trackGA(GA_EVENTS.ARTICLE_CTA_CLICK, { channel: 'email', slug })}
            className="inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:bg-white hover:text-lawPrimary text-white px-6 py-3.5 rounded-lg font-semibold text-base transition-colors"
            aria-label="E-posta ile yaz"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
            E-posta
          </a>
        </div>

        <p className="text-xs text-white/60 mt-6">
          Bu makale yalnizca bilgilendirme amaclidir; hukuki tavsiye
          niteliginde degildir.
        </p>
      </div>
    </section>
  );
};

export default ArticleCTA;
