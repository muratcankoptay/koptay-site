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
        "@type": "Article",
        "headline": "TRAMER Kusur Oranına İtiraz: %100 Kusurlu Çıkarsanız Ne Yapmalısınız? (Adım Adım Rehber)",
        "description": "Kaza tespit tutanağında %100 kusurlu mu bulundunuz? SBM itiraz süresi, Sigorta Tahkim Komisyonu başvuru adımları ve kusur oranını değiştirmek için yapılması gerekenler.",
        "image": "https://koptay.av.tr/images/articles/tramer-kusur-orani-itiraz-kaza-tutanagi.jpg",
        "datePublished": "2025-01-01T09:00:00+03:00",
        "dateModified": "2025-12-31T19:45:00+03:00",
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
        "keywords": "tramer itiraz, kusur oranı itiraz süresi, sbm itiraz, sigorta tahkim komisyonu, kaza tespit tutanağı, polis tutanağı itiraz"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Kusur oranına itiraz süresi kaç gündür?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kaza tespit tutanağı sisteme girildikten ve kusur oranları belirlendikten sonra, sonucun tarafınıza bildirilmesinden itibaren 5 iş günü içinde SBM (sbm.org.tr) üzerinden itiraz etme hakkınız vardır."
            }
          },
          {
            "@type": "Question",
            "name": "SBM itirazım reddedildi, ne yapmalıyım?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SBM üzerinden yapılan itirazda sigorta şirketleri anlaşamazsa veya itirazınız reddedilirse, bir sonraki ve en etkili adım Sigorta Tahkim Komisyonu'na başvurmaktır. Buradan çıkan karar mahkeme hükmündedir."
            }
          },
          {
            "@type": "Question",
            "name": "Polis tutanağına nasıl itiraz edilir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Eğer kaza tutanağını polis veya jandarma tuttuysa, bu tutanağa karşı Sulh Ceza Hakimliği'ne başvurarak itiraz edebilirsiniz. Anlaşmalı tutanaklarda ise süreç SBM ve Tahkim üzerinden yürür."
            }
          },
          {
            "@type": "Question",
            "name": "Kamera kaydı sonradan bulunursa kusur oranı değişir mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet. Kazaya ilişkin yeni bir delil (kamera kaydı, şahit ifadesi vb.) ortaya çıkarsa, 2 yıllık zamanaşımı süresi içinde Sigorta Tahkim Komisyonu'na başvurarak kusur oranının değiştirilmesini talep edebilirsiniz."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "TRAMER Kusur Oranına İtiraz Adımları",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "SBM Üzerinden Kontrol",
            "text": "sbm.org.tr adresindeki 'Kaza Tespit Tutanağı Sorgulama' ekranından raporunuzu ve belirlenen kusur oranını kontrol edin."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "5 Gün İçinde İtiraz",
            "text": "Sonuç açıklandıktan sonraki 5 gün içinde, sistem üzerindeki 'İtiraz Et' butonunu kullanarak itiraz nedeninizi yazın ve varsa fotoğraf/video ekleyin."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Sigorta Tahkim Komisyonu Başvurusu",
            "text": "SBM itirazından sonuç alamazsanız; başvuru formu, kaza raporu ve ruhsat fotokopisi ile Sigorta Tahkim Komisyonu'na başvurun."
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
  },

  // =====================================================
  // Meslek Hastalığı Tazminatı 2025 Uzman Rehberi
  // =====================================================
  "meslek-hastaligi-tazminati-hukuki-sartlari-surec-ve-hesaplama-yontemi-2025-uzman-rehberi": {
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
        "headline": "Meslek Hastalığı Tazminatı: Hukuki Şartları, Süreç ve Hesaplama Yöntemi (2025 Uzman Rehberi)",
        "description": "Meslek hastalığı nedir, şartları nelerdir? Maddi ve manevi tazminat davası nasıl açılır? 2025 yılı hesaplama kriterleri ve zamanaşımı süreleri hakkında uzman avukat rehberi.",
        "image": "https://koptay.av.tr/images/articles/meslek-hastaligi-tazminati-dava-sureci.jpg",
        "datePublished": "2025-01-01T09:00:00+03:00",
        "dateModified": "2025-12-31T19:00:00+03:00",
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
          "@id": "https://koptay.av.tr/makale/meslek-hastaligi-tazminati-hukuki-sartlari-surec-ve-hesaplama-yontemi-2025-uzman-rehberi"
        },
        "keywords": "meslek hastalığı tazminatı, iş kazası davası, bel fıtığı meslek hastalığı, SGK maluliyet, işçi tazminat hesaplama"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Bel fıtığı meslek hastalığı sayılır mı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Evet, Yargıtay kararlarına göre; yapılan işin niteliği sürekli ağır yük kaldırmayı veya hareketsiz kalmayı gerektiriyorsa ve hastalık ile iş arasında illiyet bağı (neden-sonuç ilişkisi) tıbbi raporla kurulabiliyorsa, bel fıtığı meslek hastalığı olarak kabul edilir."
            }
          },
          {
            "@type": "Question",
            "name": "Meslek hastalığı tazminat davası zamanaşımı süresi ne kadardır?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Meslek hastalıklarında zamanaşımı süresi kural olarak 10 yıldır. Bu süre, hastalığın meslek hastalığı olduğunun tıbbi raporla kesinleştiği (öğrenildiği) tarihten itibaren başlar."
            }
          },
          {
            "@type": "Question",
            "name": "Meslek hastalığı tespitini hangi hastaneler yapar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Meslek hastalığı tanısı koymaya yetkili hastaneler; Meslek Hastalıkları Hastaneleri, Devlet Üniversite Hastaneleri ve Eğitim ve Araştırma Hastaneleridir. Özel hastane raporları SGK ve mahkemeler nezdinde tek başına yeterli değildir."
            }
          },
          {
            "@type": "Question",
            "name": "İşveren meslek hastalığı nedeniyle işçiyi işten çıkarabilir mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hayır. İşçinin meslek hastalığına yakalanması tek başına geçerli fesih nedeni (tazminatsız çıkış) sayılamaz. Aksine, işveren gözetim borcunu yerine getirmediği için işçiye kıdem tazminatı ve şartları oluşmuşsa kötü niyet tazminatı ödemek zorunda kalabilir."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "Adım Adım Meslek Hastalığı Tazminat Süreci",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Tıbbi Tespit Başvurusu",
            "text": "Yetkili bir hastaneye (Meslek Hastalıkları veya Eğitim Araştırma Hastanesi) başvurarak hastalığın işle ilgili olduğuna dair tıbbi rapor alınır."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "SGK Bildirimi ve Tahkikat",
            "text": "Alınan raporla birlikte Sosyal Güvenlik Kurumu'na (SGK) başvurulur. SGK müfettişleri iş yerinde inceleme yaparak hastalığın mesleki olup olmadığına karar verir."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Maluliyet Oranının Belirlenmesi",
            "text": "SGK Sağlık Kurulu, işçinin meslekte kazanma gücü kayıp oranını (maluliyet oranı) belirler. %10 ve üzeri kayıplarda sürekli iş göremezlik geliri bağlanır."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Arabuluculuk ve Dava",
            "text": "İşverenle tazminat konusunda anlaşma sağlanamazsa önce zorunlu arabulucuya başvurulur, anlaşamama durumunda İş Mahkemesi'nde maddi ve manevi tazminat davası açılır."
          }
        ]
      }
    ]
  },

  // =====================================================
  // Sigorta Tahkim Komisyonu Başvurusu 2026 Rehberi
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
        "@type": "Article",
        "headline": "Sigorta Tahkim Komisyonu Başvurusu ve Süreci: 2026 Güncel Rehber",
        "description": "Sigorta şirketinden tazminatınızı alamadınız mı? Mahkemeden çok daha hızlı sonuçlanan Sigorta Tahkim Komisyonu başvuru süreci, ücretleri ve gerekli evraklar hakkında uzman avukat rehberi.",
        "image": "https://koptay.av.tr/images/articles/sigorta-tahkim-komisyonu-basvuru-adimlari.jpg",
        "datePublished": "2025-01-01T08:30:00+03:00",
        "dateModified": "2025-12-31T20:15:00+03:00",
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
        "keywords": "sigorta tahkim komisyonu, tahkim başvurusu, sigorta tazminatı, hakem heyeti kararı, sigorta uyuşmazlığı, tahkim ücreti"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Sigorta Tahkim Komisyonu kararları kesin midir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Belirli bir tutarın altındaki uyuşmazlıklarda (örneğin 2026 yılı için belirlenen alt sınır) Hakem Heyeti kararları kesindir. Bu tutarın üzerindeki kararlara karşı önce Komisyon nezdinde İtiraz Hakem Heyeti'ne, oradan da sonuç alınamazsa Temyiz (Yargıtay) yoluna gidilebilir."
            }
          },
          {
            "@type": "Question",
            "name": "Tahkim başvurusu ne kadar sürede sonuçlanır?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sigorta Tahkim Komisyonu, mahkemelere göre çok daha hızlıdır. Kanunen dosya hakeme tevdi edildikten sonra en geç 4 ay içinde karar verilmesi gerekir. İtiraz süreçleri hariç ortalama 4-6 ay içinde sonuç alınmaktadır."
            }
          },
          {
            "@type": "Question",
            "name": "Başvuru ücreti ne kadardır?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Başvuru ücreti, uyuşmazlık konusu olan tazminat miktarına göre kademeli olarak değişir. Mahkeme harçlarına kıyasla çok daha düşük ve maktudur. Güncel 2026 tarifesi üzerinden hesaplanan ücret, başvuru sırasında Vakıfbank hesabına yatırılır."
            }
          },
          {
            "@type": "Question",
            "name": "Doğrudan komisyona başvurabilir miyim?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hayır. Komisyona başvurmadan önce mutlaka ilgili sigorta şirketine yazılı olarak başvurmanız ve talebinizin reddedildiğini belgelemeniz (veya 15 iş günü içinde cevap alamamanız) gerekmektedir. Bu 'dava şartı' niteliğindedir."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "Adım Adım Sigorta Tahkim Komisyonu Başvuru Süreci",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Sigorta Şirketine Başvuru",
            "text": "Öncelikle ilgili sigorta şirketine yazılı (mail, iadeli taahhütlü posta veya KEP) başvuru yapın ve 15 iş günü bekleyin."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Evrakların Hazırlanması",
            "text": "Olumsuz cevap aldıysanız; Başvuru Formu, sigortaya başvuru kanıtı, poliçe örneği, hasar evrakları ve kimlik fotokopisini hazırlayın."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Başvuru Ücretinin Yatırılması",
            "text": "Uyuşmazlık tutarına göre hesaplanan başvuru ücretini Komisyonun banka hesabına yatırın ve dekontu saklayın."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Dosyanın Gönderilmesi",
            "text": "Tüm evrakları taratarak online sistem üzerinden (varsa) veya fiziki olarak İstanbul'daki Komisyon merkezine kargo/elden teslim yoluyla iletin."
          }
        ]
      }
    ]
  },

  // =====================================================
  // Araç Değer Kaybı 2026 Güncel Başvuru Rehberi
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
        "@type": "Article",
        "headline": "Araç Değer Kaybı Nedir? Nasıl Hesaplanır? (2026 Güncel Başvuru Rehberi)",
        "description": "Araç değer kaybı hesaplama tablosu 2026. Kazalı aracın piyasa değeri ne kadar düşer? Kilometre ve yaş sınırı kalktı mı? Değer kaybı başvurusu ve tazminat alma süreci.",
        "image": "https://koptay.av.tr/images/articles/arac-deger-kaybi-hesaplama-tablosu.jpg",
        "datePublished": "2025-01-01T08:45:00+03:00",
        "dateModified": "2025-12-31T20:45:00+03:00",
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
        "keywords": "araç değer kaybı, değer kaybı hesaplama, trafik kazası tazminat, sigorta değer kaybı, ekspertiz raporu, değer kaybı başvurusu"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Araç değer kaybında kilometre sınırı var mı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Anayasa Mahkemesi'nin verdiği iptal kararları sonrası, araç değer kaybı hesaplamasında 165.000 km sınırı gibi kesin engeller kaldırılmıştır. Kilometresi yüksek araçlar da değer kaybı alabilir, ancak aracın kilometresinin yüksek olması alınacak tazminat miktarını düşüren bir faktördür."
            }
          },
          {
            "@type": "Question",
            "name": "Hangi parçalar değer kaybı kapsamına girmez?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Aracın kaporta aksamı dışındaki plastik tampon, cam, far, silecek, jant ve lastik gibi değiştirilebilir parçalarda meydana gelen hasarlar genellikle değer kaybı hesaplamasına dahil edilmez. Değer kaybı, aracın iskeletindeki ve kaportasındaki boya/değişim işlemlerinden kaynaklanır."
            }
          },
          {
            "@type": "Question",
            "name": "Değer kaybı başvurusu nereye yapılır?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Değer kaybı tazminatı için öncelikle kazada kusurlu olan tarafın Trafik Sigortası (ZMSS) şirketine yazılı başvuru yapılmalıdır. Sigorta şirketi 15 gün içinde ödeme yapmazsa veya eksik ödeme yaparsa Sigorta Tahkim Komisyonu'na başvurulur."
            }
          },
          {
            "@type": "Question",
            "name": "Kazadan kaç yıl sonraya kadar değer kaybı istenebilir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Araç değer kaybı taleplerinde zamanaşımı süresi, kazanın öğrenildiği tarihten itibaren 2 yıldır. Kaza üzerinden 2 yıl geçmemişse geriye dönük olarak tazminat talep edebilirsiniz."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "5 Adımda Araç Değer Kaybı Tazminatı Alma Süreci",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Ekspertiz Raporunun Temini",
            "text": "Kazadan sonra aracınızdaki hasarı ve onarım işlemlerini gösteren ekspertiz raporunu ve kaza tespit tutanağını temin edin."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Değer Kaybı Hesaplaması",
            "text": "Bağımsız bir eksperden veya uzman bir avukattan destek alarak, aracınızın 2. el piyasasındaki reel değer kaybını hesaplatın."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Sigorta Şirketine Başvuru",
            "text": "Hazırladığınız talep dilekçesi, hesaplama raporu ve banka bilgilerinizle birlikte kusurlu tarafın sigorta şirketine başvurun."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Tahkim Komisyonu Süreci",
            "text": "Sigorta şirketi başvurunuzu reddederse veya düşük ödeme yaparsa, Sigorta Tahkim Komisyonu'na online veya fiziki olarak başvurun."
          },
          {
            "@type": "HowToStep",
            "position": 5,
            "name": "Ödemenin Tahsili",
            "text": "Komisyonun hakem kararı kesinleştikten sonra, ilamlı icra takibi yoluyla veya sigorta şirketinin doğrudan ödemesiyle tazminatınızı alın."
          }
        ]
      }
    ]
  },

  // =====================================================
  // 2026 Avukatlık Asgari Ücret Tarifesi Rehberi
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
        "@type": "Article",
        "headline": "2026 Avukatlık Asgari Ücret Tarifesi: Detaylı Analiz ve Uygulama Rehberi",
        "description": "2026 yılı avukatlık asgari ücret tarifesi ne kadar oldu? Dava türlerine göre vekalet ücretleri, danışmanlık ücretleri ve icra takip ücretleri hakkında güncel rehber.",
        "image": "https://koptay.av.tr/images/articles/2026-avukatlik-asgari-ucret-tarifesi.jpg",
        "datePublished": "2026-01-01T00:00:00+03:00",
        "dateModified": "2026-01-01T00:00:00+03:00",
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
        "keywords": "avukatlık asgari ücret tarifesi 2026, vekalet ücreti hesaplama, avukat ücreti, dava masrafları, icra vekalet ücreti"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "2026 avukatlık asgari ücret tarifesi ne kadar arttı?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "2026 yılı Avukatlık Asgari Ücret Tarifesi, Türkiye Barolar Birliği tarafından belirlenerek Resmi Gazete'de yayımlanmıştır. Tarifede önceki yıla göre ortalama %35-40 oranında artış yapılmıştır."
            }
          },
          {
            "@type": "Question",
            "name": "Avukat ücretini kim öder?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Dava sonunda haklı çıkan tarafın avukatına, karşı tarafça 'nispi vekalet ücreti' ödenir. Ancak müvekkil ile avukat arasındaki sözleşmeye dayalı ücret (akdi vekalet ücreti) her halükarda müvekkil tarafından ödenir."
            }
          },
          {
            "@type": "Question",
            "name": "Boşanma davası avukatlık ücreti 2026'da ne kadar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "2026 tarifesine göre anlaşmalı boşanma davaları için asgari ücret belirlenmiş olup, çekişmeli boşanma davalarında bu ücret daha yüksektir. Ayrıca nafaka, velayet ve mal paylaşımı gibi ek talepler ücrete eklenir."
            }
          },
          {
            "@type": "Question",
            "name": "Avukat tarifenin altında ücret alabilir mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hayır. Avukatlık Kanunu'na göre avukatlar, Türkiye Barolar Birliği tarafından belirlenen asgari ücret tarifesinin altında ücret kararlaştıramazlar. Bu kural hem avukatı hem de müvekkili koruma amacı taşır."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "Avukatlık Ücreti Nasıl Belirlenir?",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Dava Türünün Belirlenmesi",
            "text": "Açılacak davanın türü (hukuk, ceza, idare, icra vb.) ve konusu belirlenerek ilgili tarife bölümüne bakılır."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Maktu veya Nispi Ücret Kontrolü",
            "text": "Bazı davalar için sabit (maktu) ücret, bazıları için dava değerinin yüzdesi (nispi) ücret uygulanır. Hangi sistemin geçerli olduğu kontrol edilir."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Asgari Ücretin Hesaplanması",
            "text": "Tarife üzerinden asgari ücret hesaplanır. Bu tutar, avukatın talep edebileceği en düşük ücrettir."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Sözleşme ile Belirleme",
            "text": "Avukat ve müvekkil, asgari ücretin altında kalmamak şartıyla karşılıklı anlaşarak ücreti belirler ve yazılı sözleşme imzalar."
          }
        ]
      }
    ]
  },

  // =====================================================
  // İlave Tediye Alacak Tahsili ve Dava Süreci Makalesi
  // =====================================================
  "ilave-tediye-alacak-tahsili-ve-dava-sureci-2026": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "İlave Tediye Alacaklarının Tahsili ve Dava Süreci (2026)",
        "description": "Kamu işçilerinin eksik ödenen ilave tediye alacakları için izlemesi gereken hukuki yollar, zamanaşımı süreleri ve arabuluculuk süreci.",
        "image": [
          "https://koptay.av.tr/uploads/ilave-tediye-hukuki-surec.jpg"
        ],
        "datePublished": "2026-01-03T16:00:00+03:00",
        "dateModified": "2026-01-03T16:00:00+03:00",
        "author": {
          "@type": "Person",
          "name": "Av. Murat Can Koptay",
          "url": "https://koptay.av.tr/avukat/murat-can-koptay"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Koptay Hukuk Bürosu",
          "logo": {
            "@type": "ImageObject",
            "url": "https://koptay.av.tr/logo.svg"
          }
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "İlave tediye alacaklarında zamanaşımı süresi ne kadardır?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "İlave tediye, İş Kanunu ve Borçlar Kanunu kapsamında ücret niteliğinde olduğundan 5 yıllık zamanaşımı süresine tabidir. Dava tarihinden geriye doğru 5 yıl içindeki alacaklar talep edilebilir."
            }
          },
          {
            "@type": "Question",
            "name": "Doğrudan İş Mahkemesine dava açılabilir mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hayır. 7036 sayılı İş Mahkemeleri Kanunu uyarınca, ücret alacaklarına ilişkin davalarda dava şartı olarak öncelikle arabuluculuğa başvurulması zorunludur."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "İlave Tediye Alacakları İçin Hukuki Süreç",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Hukuki Değerlendirme",
            "text": "Maaş bordrolarının ve hizmet dökümünün incelenerek alacak miktarının ve hukuki durumun tespit edilmesi."
          },
          {
            "@type": "HowToStep",
            "name": "Arabuluculuk Başvurusu",
            "text": "Uyuşmazlığın çözümü için ilgili kuruma karşı zorunlu arabuluculuk sürecinin başlatılması."
          },
          {
            "@type": "HowToStep",
            "name": "Yargı Yolu",
            "text": "Arabuluculuk sürecinde anlaşma sağlanamaması halinde, İş Mahkemesi nezdinde alacak davasının açılması."
          }
        ]
      }
    ]
  },

  // =====================================================
  // Araç Mahrumiyet Tazminatı Makalesi
  // =====================================================
  "arac-mahrumiyet-tazminati-hesaplama-sartlari-2026": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://koptay.av.tr/makale/arac-mahrumiyet-tazminati-hesaplama-sartlari-2026"
        },
        "headline": "Araç Mahrumiyet Tazminatı Nedir? Kaza Sonrası Araçsız Kalınan Günlerin Bedeli (2026)",
        "description": "Trafik kazası sonrası aracın onarım süresince kullanılamamasından doğan zarar nasıl tazmin edilir? Araç mahrumiyet tazminatı hesaplama ve 2026 güncel kriterleri.",
        "image": "https://koptay.av.tr/images/articles/kaza-sonrasi-arac-mahrumiyet-bedeli-2026.jpg",
        "author": {
          "@type": "Person",
          "name": "Av. Murat Can Koptay",
          "url": "https://koptay.av.tr/ekibimiz"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Koptay Hukuk Bürosu",
          "logo": {
            "@type": "ImageObject",
            "url": "https://koptay.av.tr/logo.png"
          }
        },
        "datePublished": "2026-01-20",
        "dateModified": "2026-01-20",
        "articleSection": "Sigorta Hukuku",
        "keywords": "araç mahrumiyet tazminatı, ikame araç bedeli, araç mahrumiyet tazminatı hesaplama, kaza sonrası araçsız kalma, trafik kazası tazminat",
        "inLanguage": "tr-TR"
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Araç mahrumiyet tazminatı sigorta şirketinden istenir mi?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Standart trafik sigortası (ZMSS) genellikle bu zararı karşılamaz. Tazminat, kusurlu araç sürücüsü veya ruhsat sahibinden talep edilir."
            }
          },
          {
            "@type": "Question",
            "name": "İkame araç faturası sunmak zorunlu mu?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hayır, Yargıtay'ın güncel kararlarına göre aracın serviste kaldığı sürenin tespiti tazminat için yeterlidir; fatura sunma zorunluluğu yoktur."
            }
          },
          {
            "@type": "Question",
            "name": "Araç mahrumiyet tazminatı zamanaşımı süresi ne kadardır?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kaza tarihinden itibaren 2 yıllık zamanaşımı süresi bulunmaktadır."
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
