/** Çalışma alanları — hizmet detay sayfaları, SEO ve OG için tek kaynak */
export const PRACTICE_AREAS = [
  {
    slug: 'is-hukuku',
    title: 'İş Hukuku',
    icon: 'Briefcase',
    shortDescription:
      'İşçi-işveren uyuşmazlıkları, iş sözleşmeleri, tazminat davaları ve işe iade süreçleri.',
    description:
      'İş hukuku alanında işçi ve işveren tarafında danışmanlık, sözleşme incelemesi, arabuluculuk ve dava takibi hizmeti sunulmaktadır. Kıdem ve ihbar tazminatı, fazla mesai, işe iade ve iş kazası kaynaklı uyuşmazlıklarda sürecin başından sonuna kadar hukuki destek sağlanır.',
    features: [
      'İş sözleşmesi hazırlama ve inceleme',
      'İşe iade davaları',
      'Kıdem ve ihbar tazminatı',
      'İş kazası ve meslek hastalığı',
      'Fazla mesai alacağı',
      'Mobbing davaları'
    ],
    seoTitle: 'İş Hukuku Avukatı Ankara | Kıdem, İşe İade — Koptay Hukuk',
    seoDescription:
      'Ankara iş hukuku avukatı: kıdem ve ihbar tazminatı, işe iade, fazla mesai, iş kazası ve mobbing davalarında danışmanlık ve dava takibi.',
    ogImage: '/images/og/is-hukuku.jpg',
    process: [
      {
        step: 1,
        title: 'Ön değerlendirme',
        description:
          'İş sözleşmesi, bordro kayıtları ve fesih bildirimi incelenerek hakların kapsamı belirlenir.'
      },
      {
        step: 2,
        title: 'Arabuluculuk / ihtar',
        description:
          'Zorunlu arabuluculuk veya ihtar süreçleri tamamlanır; uzlaşma imkânı değerlendirilir.'
      },
      {
        step: 3,
        title: 'Dava veya tahkim',
        description:
          'İş mahkemesinde veya ilgili mercide dava açılır; delil ve bilirkişi süreçleri yürütülür.'
      },
      {
        step: 4,
        title: 'İcra ve sonuç',
        description:
          'Kesinleşen kararların icrası ve alacakların tahsili için gerekli adımlar atılır.'
      }
    ],
    faq: [
      {
        question: 'Kıdem tazminatına hak kazanmak için ne kadar çalışmak gerekir?',
        answer:
          'En az bir yıl aynı işveren nezdinde çalışmış olmak ve kanunda sayılan fesih hallerinden biriyle iş sözleşmesinin sona ermesi gerekir. Süre ve şartlar somut olaya göre değişir.'
      },
      {
        question: 'İşe iade davası ne kadar sürer?',
        answer:
          'Yoğunluğa ve delil durumuna göre değişmekle birlikte ilk derece genellikle birkaç ay ile bir yıl arasında sonuçlanabilir. Süreç işverenin işe başlatma yükümlülüğüne göre şekillenir.'
      },
      {
        question: 'Fazla mesai alacağı nasıl ispatlanır?',
        answer:
          'Puantaj, giriş-çıkış kayıtları, tanık beyanı ve yazılı deliller birlikte değerlendirilir. İşverenin kayıt tutma yükümlülüğü dikkate alınır.'
      },
      {
        question: 'İş kazası sonrası hangi alacaklar talep edilebilir?',
        answer:
          'Geçici ve sürekli iş göremezlik, bakıcı gideri, manevi tazminat ve destekten yoksun kalma gibi kalemler olayın niteliğine göre gündeme gelebilir.'
      }
    ],
    relatedCalculators: [
      { title: 'İşçilik Alacakları Hesaplama', href: '/hesaplama-araclari/iscilik-alacaklari' },
      { title: 'Tazminat Hesaplama', href: '/hesaplama-araclari/tazminat-hesaplama' },
      { title: 'Meslek Hastalığı Tazminatı', href: '/hesaplama-araclari/meslek-hastaligi' }
    ]
  },
  {
    slug: 'ticaret-hukuku',
    title: 'Ticaret Hukuku',
    icon: 'Building',
    shortDescription:
      'Şirket kuruluşu, ticari sözleşmeler, ticari uyuşmazlıklar ve alacak takibi.',
    description:
      'Ticaret hukuku kapsamında şirketler hukuku, sözleşme hazırlığı, ortaklık uyuşmazlıkları ve ticari alacakların tahsiline yönelik danışmanlık ve dava takibi yapılır.',
    features: [
      'Şirket kuruluş işlemleri',
      'Ticari sözleşme hazırlama',
      'Ortaklık uyuşmazlıkları',
      'Ticari alacak takibi',
      'Rekabet hukuku danışmanlığı',
      'Marka ve patent süreçleri'
    ],
    seoTitle: 'Ticaret Hukuku Avukatı Ankara | Şirket & Sözleşme — Koptay Hukuk',
    seoDescription:
      'Ankara ticaret hukuku: şirket kuruluşu, ticari sözleşmeler, ortaklık uyuşmazlıkları ve alacak takibinde hukuki danışmanlık.',
    ogImage: '/images/og/ticaret-hukuku.jpg',
    process: [
      {
        step: 1,
        title: 'Durum analizi',
        description: 'Sözleşmeler, ticari defter kayıtları ve uyuşmazlığın kaynağı incelenir.'
      },
      {
        step: 2,
        title: 'Hukuki strateji',
        description: 'Uzlaşma, ihtar veya dava yolu seçilir; risk ve maliyet değerlendirilir.'
      },
      {
        step: 3,
        title: 'Dava / icra',
        description: 'Ticaret mahkemesi veya icra takibi başlatılır; deliller toplanır.'
      },
      {
        step: 4,
        title: 'Sonuçlandırma',
        description: 'Karar veya sulh sonrası tahsilat ve sözleşme revizyonları tamamlanır.'
      }
    ],
    faq: [
      {
        question: 'Limited şirket kuruluşu ne kadar sürer?',
        answer:
          'Evrakların eksiksiz olması hâlinde ticaret sicili tescili genellikle birkaç iş günü içinde tamamlanabilir.'
      },
      {
        question: 'Ticari alacak için zamanaşımı süresi nedir?',
        answer:
          'Alacağın türüne göre genel zamanaşımı süreleri uygulanır; kesilme ve durma halleri ayrıca değerlendirilmelidir.'
      },
      {
        question: 'Ortaklık pay devri nasıl yapılır?',
        answer:
          'Pay devri sözleşmesi, genel kurul kararı ve sicil tescili adımları birlikte yürütülür.'
      }
    ],
    relatedCalculators: [
      { title: 'Vekâlet Ücreti Hesaplama', href: '/hesaplama-araclari/vekalet-ucreti' },
      { title: 'Dava Süresi Hesaplama', href: '/hesaplama-araclari/dava-suresi' }
    ]
  },
  {
    slug: 'aile-hukuku',
    title: 'Aile Hukuku',
    icon: 'Heart',
    shortDescription:
      'Boşanma, velayet, nafaka, mal paylaşımı ve miras uyuşmazlıkları.',
    description:
      'Aile hukuku alanında boşanma davaları, velayet ve kişisel ilişki düzenlemeleri, nafaka, mal rejimi ve miras paylaşımı konularında danışmanlık ve temsil hizmeti verilir.',
    features: [
      'Boşanma davaları',
      'Velayet ve kişisel ilişki',
      'Nafaka davaları',
      'Mal paylaşımı',
      'Evlilik sözleşmesi',
      'Miras davaları'
    ],
    seoTitle: 'Aile Hukuku Avukatı Ankara | Boşanma, Velayet — Koptay Hukuk',
    seoDescription:
      'Ankara aile hukuku avukatı: boşanma, velayet, nafaka ve mal paylaşımı davalarında danışmanlık ve dava takibi.',
    ogImage: '/images/og/aile-hukuku.jpg',
    process: [
      {
        step: 1,
        title: 'Görüşme ve bilgi',
        description: 'Evlilik birliği, çocuklar ve malvarlığı hakkında bilgi alınır.'
      },
      {
        step: 2,
        title: 'Dava veya anlaşmalı boşanma',
        description: 'Anlaşmalı protokol hazırlanır veya çekişmeli dava yolu izlenir.'
      },
      {
        step: 3,
        title: 'Geçici önlemler',
        description: 'Nafaka, velayet ve konut düzenlemeleri için tedbir talepleri değerlendirilir.'
      },
      {
        step: 4,
        title: 'Kesin karar',
        description: 'Kararın kesinleşmesi ve gerekirse icra işlemleri tamamlanır.'
      }
    ],
    faq: [
      {
        question: 'Anlaşmalı boşanma için ne gerekir?',
        answer:
          'En az bir yıllık evlilik ve tarafların mahkemede hazır bulunması ile protokol onaylanması gerekir; şartlar somut dosyada kontrol edilir.'
      },
      {
        question: 'Velayet kararı hangi kriterlere göre verilir?',
        answer:
          'Çocuğun üstün yararı esas alınır; yaş, eğitim, bakım koşulları ve tarafların durumu değerlendirilir.'
      },
      {
        question: 'Mal paylaşımı davası ne zaman açılır?',
        answer:
          'Boşanma kararı kesinleştikten sonra, kanuni süre içinde mal rejimine göre paylaşım davası açılabilir.'
      }
    ],
    relatedCalculators: []
  },
  {
    slug: 'ceza-hukuku',
    title: 'Ceza Hukuku',
    icon: 'Shield',
    shortDescription:
      'Soruşturma ve kovuşturma süreçlerinde müdafilik ve mağdur temsili.',
    description:
      'Ceza hukuku kapsamında soruşturma aşamasından itibaren müşteki veya sanık vekili olarak temsil, ifade ve sorgu hazırlığı, tutukluluk ve adli kontrol itirazları ile temyiz süreçleri yürütülür.',
    features: [
      'Ceza davalarında müdafilik',
      'Soruşturma aşaması danışmanlık',
      'Tutukluluk ve adli kontrol',
      'Temyiz başvuruları',
      'Uzlaştırma süreçleri',
      'Mağdur vekili temsili'
    ],
    seoTitle: 'Ceza Avukatı Ankara | Soruşturma & Müdafilik — Koptay Hukuk',
    seoDescription:
      'Ankara ceza avukatı: soruşturma, kovuşturma, tutukluluk itirazı ve temyiz süreçlerinde müdafilik hizmeti.',
    ogImage: '/images/og/ceza-hukuku.jpg',
    process: [
      {
        step: 1,
        title: 'Acil müdahale',
        description: 'Gözaltı, ifade veya sorgu öncesi hukuki hazırlık ve hakların korunması.'
      },
      {
        step: 2,
        title: 'Soruşturma takibi',
        description: 'Delil toplama, müdafilik ve itiraz dilekçelerinin sunulması.'
      },
      {
        step: 3,
        title: 'Kovuşturma',
        description: 'Duruşmalara katılım, savunma ve lehe delillerin sunulması.'
      },
      {
        step: 4,
        title: 'Kesin hüküm sonrası',
        description: 'Temyiz, infaz ve denetimli serbestlik süreçlerinin değerlendirilmesi.'
      }
    ],
    faq: [
      {
        question: 'Gözaltında avukat ne zaman devreye girer?',
        answer:
          'Şüpheli veya sanık avukat talep etme hakkına sahiptir; müdafilik gözaltı sürecinden itibaren sağlanmalıdır.'
      },
      {
        question: 'Tutukluluk itirazı ne kadar sürede sonuçlanır?',
        answer:
          'Sulh ceza hakimliği incelemesinde genellikle kısa sürede karar verilir; somut dosyaya göre değişir.'
      },
      {
        question: 'Uzlaştırma ceza davasını sonlandırır mı?',
        answer:
          'Suçun uzlaştırmaya tabi olması ve şartların gerçekleşmesi hâlinde kamu davası düşebilir.'
      }
    ],
    relatedCalculators: [
      { title: 'İnfaz Yatar Hesaplama', href: '/hesaplama-araclari/infaz-yatar' }
    ]
  },
  {
    slug: 'gayrimenkul-hukuku',
    title: 'Gayrimenkul Hukuku',
    icon: 'Home',
    shortDescription:
      'Tapu, kira, kamulaştırma ve imar kaynaklı uyuşmazlıklar.',
    description:
      'Gayrimenkul hukuku alanında tapu iptal-tescil, kira uyuşmazlıkları, kamulaştırma bedel artırımı ve imar davalarında danışmanlık ile dava takibi yapılır.',
    features: [
      'Tapu devir işlemleri',
      'Kira sözleşmeleri',
      'Gayrimenkul satış sözleşmeleri',
      'Kat mülkiyeti uyuşmazlıkları',
      'İmar hukuku',
      'Kamulaştırma işlemleri'
    ],
    seoTitle: 'Gayrimenkul Avukatı Ankara | Tapu, Kira, Kamulaştırma — Koptay Hukuk',
    seoDescription:
      'Ankara gayrimenkul avukatı: tapu, kira, kamulaştırma bedel artırımı ve imar davalarında hukuki danışmanlık.',
    ogImage: '/images/og/gayrimenkul-hukuku.jpg',
    process: [
      {
        step: 1,
        title: 'Tapu ve belge inceleme',
        description: 'Tapu kaydı, imar durumu ve sözleşmeler incelenir.'
      },
      {
        step: 2,
        title: 'İdari başvuru',
        description: 'Kamulaştırma veya idari işlemlere karşı süre içinde başvuru yapılır.'
      },
      {
        step: 3,
        title: 'Yargı süreci',
        description: 'Asliye hukuk veya idare mahkemesinde dava açılır.'
      },
      {
        step: 4,
        title: 'Tescil / tahsilat',
        description: 'Karar sonrası tapu işlemleri veya bedel tahsili tamamlanır.'
      }
    ],
    faq: [
      {
        question: 'Kamulaştırma bedeline itiraz süresi nedir?',
        answer:
          'Bedel tespiti ve tescil işlemine karşı kanunda öngörülen süre içinde dava açılmalıdır; süre kaçırılırsa hak kaybı riski doğar.'
      },
      {
        question: 'Kira artışı nasıl belirlenir?',
        answer:
          'Sözleşme hükümleri ve TÜFE sınırları birlikte değerlendirilir; aşırı artış talepleri hukuka aykırı olabilir.'
      },
      {
        question: 'Tapu iptal-tescil davası ne kadar sürer?',
        answer:
          'Dosyanın karmaşıklığına göre değişir; delil ve bilirkişi incelemesi süreyi uzatabilir.'
      }
    ],
    relatedCalculators: [
      { title: 'Kamulaştırma Haritası', href: '/kamulastirma-haritasi' }
    ]
  }
]

export function getServiceBySlug(slug) {
  return PRACTICE_AREAS.find((s) => s.slug === slug) || null
}

export function getAllServiceSlugs() {
  return PRACTICE_AREAS.map((s) => s.slug)
}
