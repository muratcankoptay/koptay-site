/**
 * Makale Özel Schema Tanımları
 * Bazı makaleler için gelişmiş JSON-LD şemaları
 * Google arama sonuçlarında zengin snippet'ler için FAQPage şemaları
 */

export const articleSchemas = {
  // =====================================================
  // TRAMER Kusur Oranına İtiraz Makalesi
  // =====================================================
  "tramer-kusur-oranina-itiraz-rehberi-yuzde-100-kusurlu": {
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
        "headline": "TRAMER Kusur Oranına İtiraz: %100 Kusurlu Çıkarsanız Ne Yapmalısınız?",
        "description": "Kaza sonrası %100 kusurlu mu bulundunuz? Hemen kabullenmeyin. SBM itiraz süreci, Sigorta Tahkim Komisyonu ve kusur oranını değiştirmek için yapmanız gerekenler bu rehberde.",
        "image": "https://koptay.av.tr/images/articles/tramer-kusur-orani-itiraz-kaza-tutanagi.jpg",
        "datePublished": "2025-12-26T00:00:00+03:00",
        "dateModified": "2025-12-26T20:15:30+03:00",
        "author": {
          "@type": "Person",
          "name": "Av. Murat Can Koptay",
          "url": "https://koptay.av.tr/ekibimiz"
        },
        "publisher": {
          "@id": "https://koptay.av.tr/#organization"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://koptay.av.tr/makale/tramer-kusur-oranina-itiraz-rehberi-yuzde-100-kusurlu"
        },
        "keywords": "tramer itiraz, kaza tespit tutanağı, sigorta tahkim komisyonu, trafik kazası kusur oranları, sbm itiraz, araç değer kaybı"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Polis tutanağına itiraz edebilir miyim?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet, polis tarafından tutulan kaza tespit tutanağına karşı Sulh Ceza Hakimliği'ne başvurarak itiraz etme hakkınız bulunmaktadır."
            }
          },
          {
            "@type": "Question",
            "name": "İtiraz için avukata ihtiyacım var mı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SBM ve Sigorta Tahkim Komisyonu süreçlerini bireysel olarak yürütebilirsiniz. Ancak hukuki terimler ve süreç takibi karmaşık olabileceğinden, özellikle yüksek hasarlı kazalarda bir avukattan destek almak faydalı olabilir."
            }
          },
          {
            "@type": "Question",
            "name": "Kazadan 1 yıl sonra itiraz edebilir miyim?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SBM üzerinden online itiraz süresi 5 gün olsa da, yasal zamanaşımı süresi (genellikle 2 yıl) içerisinde Sigorta Tahkim Komisyonu'na başvurma veya dava açma hakkınız saklıdır."
            }
          },
          {
            "@type": "Question",
            "name": "TRAMER itiraz süresi ne kadar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kaza tespit tutanağı sisteme girildikten sonra SBM (Sigorta Bilgi ve Gözetim Merkezi) kusur oranlarını belirler. Sonuç size ulaştığı andan itibaren 5 iş günü içinde itiraz etme hakkınız vardır."
            }
          }
        ]
      }
    ]
  },

  // =====================================================
  // Trafik Kazası Maluliyet Raporu Makalesi
  // =====================================================
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
        "image": "https://koptay.av.tr/images/articles/trafik-kazasi-sonrasi-maluliyet-raporu-nasil-alinir.jpg",
        "datePublished": "2025-11-20T10:00:00+03:00",
        "dateModified": "2025-12-26T19:01:13+03:00",
        "author": {
          "@type": "Person",
          "name": "Av. Murat Can Koptay",
          "url": "https://koptay.av.tr/ekibimiz"
        },
        "publisher": {
          "@id": "https://koptay.av.tr/#organization"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://koptay.av.tr/makale/trafik-kazasi-sonrasi-maluliyet-raporu-nasil-alinir"
        },
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
          },
          {
            "@type": "Question",
            "name": "Maluliyet raporu almak için ne zaman başvurulmalı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Vücuttaki hasarın kalıcı olup olmadığının anlaşılması için, kazanın üzerinden (uzuv kopmaları gibi istisnai durumlar hariç) en az 12 ay geçmesi beklenir. Sigorta şirketleri ve mahkemeler, iyileşme süreci tamamlanmadan alınan raporları genellikle kabul etmemektedir."
            }
          },
          {
            "@type": "Question",
            "name": "Alınan rapora itiraz edilebilir mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet. Eğer hastanenin verdiği oranın, gerçekteki sakatlığınızı yansıtmadığını düşünüyorsanız, raporun size tebliğ tarihinden itibaren 30 gün içinde İl Sağlık Müdürlüğü'ne itiraz etme hakkınız vardır."
            }
          }
        ]
      }
    ]
  },

  // =====================================================
  // Meslek Hastalığı Tazminatı Makalesi
  // =====================================================
  "meslek-hastaligi-tazminati-hesaplama-ve-sartlari": {
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
        "headline": "Meslek Hastalığı Tazminatı: Hukuki Şartları, Süreç ve Hesaplama Yöntemi (2025 Uzman Rehberi)",
        "description": "Meslek hastalığı tazminatı nedir? İşverenin kusur sorumluluğu, yükümlülük süresi, ispat yükü ve TRH-2010 yaşam tablosuna göre aktüeryal hesaplama yöntemlerini içeren kapsamlı hukuki bilirkişi rehberi.",
        "image": "https://koptay.av.tr/images/articles/meslek-hastaligi-tazminati-hesaplama.jpg",
        "datePublished": "2025-12-02T12:00:00+03:00",
        "dateModified": "2025-12-26T19:17:44+03:00",
        "author": {
          "@type": "Person",
          "name": "Av. Murat Can Koptay",
          "url": "https://koptay.av.tr/ekibimiz"
        },
        "publisher": {
          "@id": "https://koptay.av.tr/#organization"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://koptay.av.tr/makale/meslek-hastaligi-tazminati-hesaplama-ve-sartlari"
        },
        "keywords": "meslek hastalığı, tazminat hesaplama, iş hukuku, trh-2010, iş kazası"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "İşten ayrıldıktan yıllar sonra meslek hastalığı tazminatı alınır mı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet. Her hastalığın bir 'yükümlülük süresi' vardır. Bu süre dolmuş olsa bile, hastalık ile iş arasındaki illiyet bağı tıbben ispatlanabilirse, Sosyal Sigorta Yüksek Sağlık Kurulu onayı ile dava açılabilir."
            }
          },
          {
            "@type": "Question",
            "name": "İşten ayrıldıktan yıllar sonra dava açabilir miyim?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet. Yükümlülük süresi (genellikle 10 yıl) dolsa bile, tıbbi illiyet bağı kurulabiliyorsa Yüksek Sağlık Kurulu onayı ile meslek hastalığı sayılabilir. Zamanaşımı süresi (10 yıl) ise hastalığın kesin teşhis konulduğu tarihten itibaren başlar."
            }
          },
          {
            "@type": "Question",
            "name": "Tazminat hesabında hangi yaşam tablosu kullanılır?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yargıtay kararları uyarınca PMF-1931 yerine, daha güncel olan ve Türkiye İstatistik Kurumu verilerine dayanan TRH-2010 (Türkiye Hayat Tablosu) kullanılmaktadır."
            }
          },
          {
            "@type": "Question",
            "name": "Emekli olduktan sonraki dönem için tazminat alabilir miyim?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet. Yargıtay'a göre emeklilik döneminde de (Pasif Dönem) efor kaybı devam ettiği için, genellikle asgari ücret üzerinden tazminat hesaplanır."
            }
          }
        ]
      }
    ]
  },

  // =====================================================
  // Araç Değer Kaybı Makalesi
  // =====================================================
  "arac-deger-kaybi-nedir-nasil-hesaplanir": {
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
        "headline": "Araç Değer Kaybı Nedir, Nasıl Hesaplanır? (Güncel Hukuki Rehber)",
        "description": "Trafik kazası sonrası aracınızın değeri düştü mü? Araç değer kaybı nedir, şartları nelerdir ve nasıl hesaplanır? Tüm hukuki başvuru süreçleri.",
        "image": "https://passionate-basket-17f9c03fdf.media.strapiapp.com/arac_deger_kaybi_hesaplama_3fe103015c.jpg",
        "datePublished": "2025-11-14T09:18:08+03:00",
        "dateModified": "2025-11-14T09:41:25+03:00",
        "author": {
          "@type": "Person",
          "name": "Av. Murat Can Koptay",
          "url": "https://koptay.av.tr/ekibimiz"
        },
        "publisher": {
          "@id": "https://koptay.av.tr/#organization"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://koptay.av.tr/makale/arac-deger-kaybi-nedir-nasil-hesaplanir"
        },
        "keywords": "Araç Değer Kaybı, Araç Değer Kaybı Hesaplama, Değer Kaybı Tazminatı, Trafik Kazası, Değer Kaybı Şartları, Sigorta Tahkim Komisyonu"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Değer kaybı talebi TRAMER kaydına işler mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hayır. Değer kaybı tazminatı almanız, aracınızın TRAMER kaydına 'değer kaybı ödemesi yapıldı' şeklinde ekstra bir kayıt olarak işlenmez. Mevcut kaza kaydı zaten vardır, siz sadece bu kaydın yarattığı zararı tazmin edersiniz."
            }
          },
          {
            "@type": "Question",
            "name": "Çift taraflı kazada %50-%50 kusur varsa değer kaybı alınır mı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet, alabilirsiniz. Eğer %50 kusurluysanız, hesaplanan toplam değer kaybı zararınızın %50'sini karşı tarafın sigortasından talep edebilirsiniz."
            }
          },
          {
            "@type": "Question",
            "name": "Zincirleme kazada değer kaybı kimden istenir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Zincirleme kazalarda kusur oranları çok önemlidir. Aracınıza çarpan ve kusurlu bulunan aracın (veya araçların) trafik sigortalarından, kusurları oranında değer kaybı talep edilir."
            }
          },
          {
            "@type": "Question",
            "name": "165.000 km üzerindeki araçlarda değer kaybı alınır mı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet alınır. Sigorta Genel Şartları'nda yer alan bu eski uygulama, güncel Yargıtay kararları ile aşılmıştır. Yargıtay, yüksek kilometredeki bir aracın da kaza sonrası değer kaybedeceğini kabul etmektedir."
            }
          },
          {
            "@type": "Question",
            "name": "Plastik aksam (tampon) değişiminde değer kaybı ödenir mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet. Yargıtay, tampon ve benzeri aksamların da aracın bir parçası olduğunu, bu parçalardaki değişimin TRAMER kaydına işlediğini ve ikinci el satışta değeri düşürdüğünü kabul etmektedir."
            }
          }
        ]
      }
    ]
  },

  // =====================================================
  // 2026 Avukatlık Asgari Ücret Tarifesi Makalesi
  // =====================================================
  "2026-avukatlik-asgari-ucret-tarifesi-detayli-analiz-ve-uygulama-rehberi": {
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
        "headline": "2026 Avukatlık Asgari Ücret Tarifesi: Detaylı Analiz, 2025 Karşılaştırması ve Uygulama Rehberi",
        "description": "Türkiye Barolar Birliği'nin 4 Kasım 2025 Resmi Gazete'de yayınladığı 2026 AAÜT'de maktu ücretler %36 arttı. Avukatlar için nispi/maktu ücret detayları, hesaplama örnekleri ve yasal dayanaklar.",
        "image": "https://passionate-basket-17f9c03fdf.media.strapiapp.com/Gemini_Generated_Image_f4kbh8f4kbh8f4kb_1_1_af2c7c98a0.jpg",
        "datePublished": "2025-11-05T17:56:26+03:00",
        "dateModified": "2025-11-06T08:17:33+03:00",
        "author": {
          "@type": "Person",
          "name": "Av. Murat Can Koptay",
          "url": "https://koptay.av.tr/ekibimiz"
        },
        "publisher": {
          "@id": "https://koptay.av.tr/#organization"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://koptay.av.tr/makale/2026-avukatlik-asgari-ucret-tarifesi-detayli-analiz-ve-uygulama-rehberi"
        },
        "keywords": "2026 avukatlık asgari ücret tarifesi, 2025-2026 ücret karşılaştırması, tbb avukat ücretleri, resmi gazete avukatlık tarifesi"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "2026 Tarifesi ne zaman yürürlüğe girecek?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tarife, 4 Kasım 2025 tarihinden itibaren açılacak veya devralınacak tüm yeni işlerde uygulanacaktır. 2025'te açılmış dosyalar, yeni yılda devam etse bile eski tarife üzerinden yürütülür."
            }
          },
          {
            "@type": "Question",
            "name": "Nispi ücretlerdeki yeni %13 kademe ne işe yarıyor?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "%13'lük yeni oran, 1.200.000 TL ile 3.000.000 TL arasındaki dava değerleri için getirilmiştir. Bu kademe, orta ölçekli davalarda ücret artışını daha dengeli hale getirir."
            }
          },
          {
            "@type": "Question",
            "name": "Sözleşmeli avukatlıkta fark ücreti nasıl hesaplanır?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tarifedeki yıllık sabit ücret aşılırsa, aradaki fark tarifeye göre hesaplanarak ayrıca ödenir. Bu durum, özellikle anonim şirketler ve kooperatiflerde sık görülür (Avukatlık Kanunu m.164/3)."
            }
          },
          {
            "@type": "Question",
            "name": "2025 ile 2026 arasında ortalama artış oranı nedir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Maktu ücretlerde ortalama %36,15, nispi kademelerde ise %10–13 arası artış söz konusudur. Böylece hem düşük hem yüksek değerli dosyalar için adaletli bir gelir dengesi sağlanmıştır."
            }
          }
        ]
      }
    ]
  },

  // =====================================================
  // Sigorta Tahkim Komisyonu Makalesi
  // =====================================================
  "sigorta-tahkim-komisyonu-basvurusu-ve-sureci": {
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
        "headline": "Sigorta Tahkim Komisyonu Nedir? Başvuru Nasıl Yapılır? (2025 Hızlı Çözüm Rehberi)",
        "description": "Sigorta şirketi tazminat talebinizi reddetti veya eksik mi ödedi? Sigorta Tahkim Komisyonu ile uyuşmazlıkların nasıl 4-6 ayda çözülebileceğini öğrenin.",
        "image": "https://koptay.av.tr/images/articles/sigorta-tahkim-komisyonu-basvurusu.jpg",
        "datePublished": "2025-11-23T21:01:29+03:00",
        "dateModified": "2025-12-26T19:18:15+03:00",
        "author": {
          "@type": "Person",
          "name": "Av. Murat Can Koptay",
          "url": "https://koptay.av.tr/ekibimiz"
        },
        "publisher": {
          "@id": "https://koptay.av.tr/#organization"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://koptay.av.tr/makale/sigorta-tahkim-komisyonu-basvurusu-ve-sureci"
        },
        "keywords": "Sigorta Tahkim Komisyonu, Tahkim Başvurusu, Sigorta Tazminat Davası, Değer Kaybı Tahkim, Uyuşmazlık Hakem Heyeti"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Sigorta Tahkim Komisyonu başvurusu ne kadar sürer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sigorta Tahkim Komisyonu'ndaki yargılama süreci, dosyanın hakem heyetine tevdi edilmesinden itibaren en geç 4 ay içinde sonuçlandırılmak zorundadır. İtiraz süreçleriyle birlikte ortalama 4-6 ay sürmektedir."
            }
          },
          {
            "@type": "Question",
            "name": "Sigorta Tahkim Komisyonuna başvurmadan önce ne yapılmalı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tahkim Komisyonuna başvurmadan önce, uyuşmazlık konusuyla ilgili sigorta şirketine yazılı olarak başvurmak ve talebin reddedildiğini veya 15 gün içinde cevap verilmediğini belgelemek yasal bir zorunluluktur."
            }
          },
          {
            "@type": "Question",
            "name": "Sigorta Tahkim kararları kesin midir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Belirli bir parasal sınırın (her yıl güncellenir) altındaki kararlar kesindir. Bu tutarın üzerindeki kararlara karşı bir defaya mahsus itiraz edilebilir ve çok yüksek tutarlı davalarda Temyiz yolu açıktır."
            }
          },
          {
            "@type": "Question",
            "name": "Hangi sigorta uyuşmazlıkları için başvurulabilir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Araç değer kaybı tazminatı, hasar onarım bedeli eksikliği, yaralanmalı kazalarda maddi tazminat (sürekli sakatlık), destekten yoksun kalma tazminatları ve pert araç rayiç bedel uyuşmazlıkları için başvurulabilir."
            }
          }
        ]
      }
    ]
  },

  // =====================================================
  // 2026 İlave Tediye Rehberi Makalesi
  // =====================================================
  "2026-ilave-tediye-hesaplama-ve-hukuki-nitelik-rehberi": {
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
        "@type": "Article",
        "headline": "2026 İlave Tediye Rehberi: Kamu İşçileri İçin Hesaplama ve Ödeme Tarihleri",
        "description": "2026 yılı ilave tediye ödemeleri ne kadar oldu? Kamu işçileri için 52 günlük tediye hesabı, 6772 sayılı Kanun detayları ve otomatik hesaplama aracı bu rehberde.",
        "image": "https://koptay.av.tr/images/articles/2026-ilave-tediye-hesaplama-kamu-iscisi-bordro-1.jpg",
        "author": {
          "@type": "Person",
          "name": "Av. Murat Can Koptay",
          "url": "https://koptay.av.tr/ekibimiz"
        },
        "publisher": {
          "@id": "https://koptay.av.tr/#organization"
        },
        "datePublished": "2026-01-01T08:00:00+03:00",
        "dateModified": "2026-01-01T09:00:00+03:00",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://koptay.av.tr/makale/2026-ilave-tediye-hesaplama-ve-hukuki-nitelik-rehberi"
        },
        "keywords": "ilave tediye 2026, kamu işçisi tediye hesaplama, 6772 sayılı kanun, tediye ne zaman yatar, taşeron işçi tediye"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "2026 ilave tediye ne zaman yatar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "İlave tediye ödemeleri Cumhurbaşkanı Kararı ile belirlenir. Genellikle yılın ilk yarısında (Ocak-Nisan) ve ikinci yarısında (Temmuz-Aralık) olmak üzere 4 taksit halinde ödenmesi beklenmektedir."
            }
          },
          {
            "@type": "Question",
            "name": "Taşeron işçiler (4/D) ilave tediye alabilir mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet, 696 sayılı KHK ile kadroya geçen sürekli işçiler (4/D statüsü) 6772 sayılı Kanun kapsamında oldukları için yılda 52 günlük ilave tediye hakkına sahiptir."
            }
          },
          {
            "@type": "Question",
            "name": "İlave tediye hesaplamasına yol ve yemek ücreti dahil edilir mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hayır. İlave tediye hesaplaması sadece 'çıplak brüt ücret' üzerinden yapılır. Yol, yemek, sosyal yardımlar ve fazla mesai ücretleri hesaplamaya dahil edilmez."
            }
          },
          {
            "@type": "Question",
            "name": "Belediye şirket işçileri tediye alabilir mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yargıtay'ın güncel kararlarına göre, sermayesinin %50'sinden fazlası belediyeye ait olan şirketlerde çalışan işçiler de 6772 sayılı Kanun kapsamında ilave tediye hakkından yararlanabilir."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "2026 İlave Tediye Nasıl Hesaplanır?",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "text": "Aylık brüt çıplak ücretinizi 30'a bölerek günlük brüt yevmiyenizi bulun."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "text": "Bulduğunuz günlük tutarı, taksit günü sayısı olan 13 ile çarpın."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "text": "Çıkan brüt tutardan %15 oranında SGK ve İşsizlik primi düşün."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "text": "Kalan tutardan %15, %20 veya %27 oranındaki Gelir Vergisini ve Damga Vergisini keserek net tutara ulaşın."
          }
        ]
      }
    ]
  },

  // =====================================================
  // Trafik Kazası Maluliyet Heyet Raporu 2025 Rehberi
  // =====================================================
  "trafik-kazasi-sonrasi-maluliyet-heyet-raporu-nasil-ve-nereden-alinir-2025-rehberi": {
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
        "@type": "NewsArticle",
        "headline": "Trafik Kazası Sonrası Maluliyet Heyet Raporu Nasıl ve Nereden Alınır? 2025 Rehberi",
        "description": "Trafik kazası sonrası sigorta tazminatı almak için gerekli maluliyet (heyet) raporu nereden alınır? İyileşme süresi, gerekli evraklar ve yetkili hastaneler listesi bu rehberde.",
        "image": "https://koptay.av.tr/images/articles/trafik-kazasi-heyet-raporu-nasil-alinir.jpg",
        "datePublished": "2025-01-01T09:00:00+03:00",
        "dateModified": "2025-12-31T18:30:00+03:00",
        "author": {
          "@type": "Person",
          "name": "Av. Murat Can Koptay",
          "url": "https://koptay.av.tr/ekibimiz"
        },
        "publisher": {
          "@id": "https://koptay.av.tr/#organization"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://koptay.av.tr/makale/trafik-kazasi-sonrasi-maluliyet-heyet-raporu-nasil-ve-nereden-alinir-2025-rehberi"
        },
        "keywords": "maluliyet raporu, heyet raporu, trafik kazası tazminat, engelli raporu, sigorta maluliyet"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Maluliyet raporu kazadan ne kadar süre sonra alınmalıdır?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tıbbi olarak 'iyileşme süreci' (nekahat dönemi) tamamlanmadan alınan raporlar geçersiz sayılabilir veya düşük oranlı çıkabilir. Genellikle ortopedik yaralanmalarda kazadan en az 6 ay, nörolojik durumlarda ise 12 ay geçtikten sonra heyet raporuna başvurulması önerilir."
            }
          },
          {
            "@type": "Question",
            "name": "Heyet raporu hangi hastanelerden alınır?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sigorta şirketleri ve mahkemeler nezdinde geçerli olması için raporun; tam teşekküllü Devlet Hastaneleri, Eğitim ve Araştırma Hastaneleri, Üniversite Hastanelerinin Adli Tıp Anabilim Dalları veya Adli Tıp Kurumu'ndan alınması gerekmektedir. Özel hastane raporları genellikle kabul edilmez."
            }
          },
          {
            "@type": "Question",
            "name": "Rapor almak için hangi evraklar gereklidir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Başvuru için genellikle kaza tespit tutanağı, olay yeri fotoğrafları, ilk müdahale edildiği hastaneden alınan epikriz raporları, ameliyat notları, varsa MR/Röntgen görüntüleri ve kimlik belgesi gerekmektedir."
            }
          },
          {
            "@type": "Question",
            "name": "Maluliyet raporu ücretli midir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Eğer raporu bireysel olarak hastaneden talep ederseniz (engelli raporu vb. statüsünde değilse) hastane döner sermayesi tarafından belirlenen bir ücret talep edilebilir. Ancak dava aşamasında mahkeme sevki ile gidildiğinde ücret genellikle yargılama giderlerine dahil edilir."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "Adım Adım Trafik Kazası Maluliyet Raporu Alma Süreci",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Tedavi Sürecinin Tamamlanması",
            "text": "Kazadan sonra kalıcı hasarın netleşmesi için tıbbi iyileşme sürecinin (ortalama 6-12 ay) tamamlanmasını bekleyin."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Evrakların Hazırlanması",
            "text": "Epikriz raporları, kaza tutanağı, ameliyat notları ve kimlik belgenizi eksiksiz hazırlayın."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Yetkili Hastaneye Başvuru",
            "text": "Sağlık Bakanlığı tarafından yetkilendirilmiş bir Eğitim Araştırma Hastanesi veya Üniversite Hastanesinin 'Sağlık Kurulu' (Heyet) birimine başvurun."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Heyet Muayenesi",
            "text": "Randevu gününde ilgili branş doktorlarına (Ortopedi, Nöroloji vb.) tek tek muayene olun ve son olarak Kurul karşısına çıkın."
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
