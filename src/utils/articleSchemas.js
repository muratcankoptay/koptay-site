/**
 * Makale Özel Schema Tanımları
 * Bazı makaleler için gelişmiş JSON-LD şemaları
 */

export const articleSchemas = {
  "trafik-kazasi-sonrasi-maluliyet-raporu-nasil-alinir": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": "https://koptay.av.tr/#organization",
        "name": "Koptay Hukuk Bürosu",
        "url": "https://koptay.av.tr",
        "logo": {
          "@type": "ImageObject",
          "url": "https://koptay.av.tr/logo.png",
          "caption": "Koptay Hukuk Bürosu"
        }
      },
      {
        "@type": "BlogPosting",
        "headline": "Trafik Kazası Sonrası Maluliyet (Heyet) Raporu Nasıl ve Nereden Alınır? (2025 Rehberi)",
        "description": "Trafik kazası sonrası sigorta tazminatı alabilmek için gerekli olan maluliyet (engelli) raporu nereden alınır? Başvuru süreci, iyileşme süresi kuralı ve gerekli evraklar hakkında 2025 güncel rehber.",
        "image": "https://passionate-basket-17f9c03fdf.media.strapiapp.com/trafik_kazasi_sonrasi_maluliyet_raporu_nasil_alinir_8b39bfa30f.jpg",
        "datePublished": "2025-01-01T09:00:00+03:00",
        "dateModified": "2025-01-01T09:00:00+03:00",
        "author": {
          "@type": "Organization",
          "name": "Koptay Hukuk Bürosu",
          "url": "https://koptay.av.tr"
        },
        "publisher": {
          "@id": "https://koptay.av.tr/#organization"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://koptay.av.tr/makale/trafik-kazasi-sonrasi-maluliyet-raporu-nasil-alinir"
        },
        "articleBody": "Trafik kazası sonucu yaralanan bir mağdurun, sigorta şirketinden tazminat talep edebilmesi için en önemli belge Maluliyet Raporu'dur...",
        "keywords": "trafik kazası maluliyet raporu, heyet raporu nasıl alınır, engelli sağlık kurulu raporu, sigorta tazminat hesaplama"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Trafik kazası heyet raporu ücretli mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet, eğer şahsi olarak (sigorta şirketi sevki veya mahkeme sevki olmadan) başvurursanız hastane döner sermayesi tarafından belirlenen bir ücret talep edilir. Ancak dava veya sigorta süreci sonunda bu masrafı karşı taraftan talep edebilirsiniz."
            }
          },
          {
            "@type": "Question",
            "name": "Rapor ne kadar sürede çıkar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hastanenin yoğunluğuna göre değişmekle birlikte, muayeneler tamamlandıktan sonra raporun yazılması ve e-Devlet sistemine düşmesi ortalama 1 hafta ile 3 hafta arasında sürmektedir."
            }
          },
          {
            "@type": "Question",
            "name": "Geçici raporla tazminat alınır mı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hayır. Sigorta şirketleri ve mahkemeler, tazminat hesabı için sakatlığın 'kalıcı' ve 'sürekli' olduğunu belgeleyen nihai raporu şart koşar."
            }
          }
        ]
      }
    ]
  }
};

/**
 * Slug'a göre özel schema döndürür
 * @param {string} slug - Makale slug'ı
 * @returns {object|null} - JSON-LD schema veya null
 */
export const getCustomArticleSchema = (slug) => {
  return articleSchemas[slug] || null;
};

/**
 * Makale için özel schema var mı kontrol eder
 * @param {string} slug - Makale slug'ı
 * @returns {boolean}
 */
export const hasCustomSchema = (slug) => {
  return slug in articleSchemas;
};
