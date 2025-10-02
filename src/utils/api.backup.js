// API utility functions for the law firm website

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Mock data for articles/insights - SEO optimized
const mockArticles = [
  {
    id: 1,
    slug: 'is-hukuku-yeni-duzenlemeler-2024',
    title: 'İş Hukuku Alanındaki Yeni Düzenlemeler 2024',
    excerpt: 'İş hukuku alanında yapılan son değişiklikler ve bunların işçi-işveren ilişkilerine etkileri. Esnek çalışma, uzaktan çalışma hakları ve tazminat düzenlemeleri.',
    content: `
      <h2>İş Hukuku Alanındaki Son Gelişmeler</h2>
      <p>2024 yılında iş hukuku alanında önemli değişiklikler yaşanmaktadır. Bu yazıda bu değişiklikleri ve işçi-işveren ilişkilerine etkilerini detayıyla inceleyeceğiz.</p>
      
      <h3>Yeni Düzenlemelerin Ana Başlıkları</h3>
      <ul>
        <li><strong>Esnek çalışma modelleri:</strong> Hibrit çalışma düzenlemeleri ve yasal çerçevesi</li>
        <li><strong>Uzaktan çalışma hakları:</strong> Dijital çağda çalışan hakları</li>
        <li><strong>İş sözleşmesi feshi koşulları:</strong> Güncel yasal gereklilikler</li>
        <li><strong>İşçi hakları ve tazminatlar:</strong> 2024 tazminat hesaplama kriterleri</li>
      </ul>
      
      <h3>Esnek Çalışma Modelleri</h3>
      <p>COVID-19 sonrası dönemde hibrit çalışma modelleri yaygınlaştı. İş Kanunu'nda yapılan düzenlemeler ile esnek çalışma saatleri ve uzaktan çalışma hakları güvence altına alındı.</p>
      
      <h3>Tazminat Hesaplama Kriterleri</h3>
      <p>2024 yılında kıdem tazminatı tavanı güncellendi. Yeni düzenlemeler çerçevesinde tazminat hesaplamalarında nelere dikkat edilmeli?</p>
      
      <blockquote>
        <p>"İş hukuku alanındaki değişiklikler hem işçi hem de işveren açısından önemli haklar ve yükümlülükler getirmektedir." - Av. Koptay</p>
      </blockquote>
      
      <p>Bu konularda detaylı bilgi ve hukuki destek için <a href="/iletisim">hukuk büromuzla iletişime geçebilirsiniz</a>.</p>
    `,
    author: 'Av. Koptay',
    publishDate: '2024-10-01',
    updatedDate: '2024-10-15',
    readTime: '7 dakika',
    category: 'İş Hukuku',
    tags: ['iş hukuku', 'yasal düzenlemeler', 'işçi hakları', 'esnek çalışma', 'tazminat'],
    image: '/images/is-hukuku-2024.jpg',
    featured: true,
    views: 1250,
    metaDescription: 'İş hukuku 2024 yılı değişiklikleri: Esnek çalışma, uzaktan çalışma hakları, tazminat hesaplama. Uzman avukat görüşleri ve yasal danışmanlık.',
    metaKeywords: 'iş hukuku 2024, esnek çalışma, uzaktan çalışma hakları, kıdem tazminatı, işçi hakları'
  },
  {
    id: 2,
    slug: 'ceza-infaz-sistemi-kosullu-saliverilme',
    title: 'Ceza İnfaz Sistemi ve Koşullu Salıverilme Hakları',
    excerpt: 'Ceza infaz sistemi, koşullu salıverilme koşulları ve denetimli serbestlik uygulamaları hakkında kapsamlı rehber.',
    content: `
      <h2>Ceza İnfaz Sistemi ve Koşullu Salıverilme</h2>
      <p>Ceza ve Güvenlik Tedbirlerinin İnfazı Hakkında Kanun çerçevesinde koşullu salıverilme hakları ve infaz süreci hakkında bilmeniz gerekenler.</p>
      
      <h3>Koşullu Salıverilme Koşulları</h3>
      <ul>
        <li><strong>Genel suçlar:</strong> Ceza süresinin 1/2'sinin çekilmesi</li>
        <li><strong>Ağır suçlar:</strong> Ceza süresinin 3/4'ünün çekilmesi</li>
        <li><strong>İyi hal gösterme:</strong> Disiplin cezası almama</li>
        <li><strong>Toplumsal uyum:</strong> Sosyal uyum programları</li>
      </ul>
      
      <h3>Denetimli Serbestlik Uygulaması</h3>
      <p>30 Mart 2020 sonrası işlenen suçlarda son 1 yıl, öncesinde ise son 3 yıl denetimli serbestlik olarak geçirilir.</p>
      
      <h3>İnfaz Süresi Hesaplama</h3>
      <p>İnfaz süresi hesaplamalarında suç tarihi, suç türü ve mahsup edilecek günler önemli faktörlerdir. <a href="/hesaplama-araclari/infaz-yatar">İnfaz hesaplama aracımızı</a> kullanarak tahmini süreleri öğrenebilirsiniz.</p>
      
      <p>Ceza hukuku konularında profesyonel hukuki destek için <a href="/iletisim">bizimle iletişime geçin</a>.</p>
    `,
    author: 'Av. Koptay',
    publishDate: '2024-09-28',
    updatedDate: '2024-10-10',
    readTime: '6 dakika',
    category: 'Ceza Hukuku',
    tags: ['ceza hukuku', 'koşullu salıverilme', 'infaz', 'denetimli serbestlik', 'CGTİK'],
    image: '/images/ceza-infaz.jpg',
    featured: true,
    views: 980,
    metaDescription: 'Ceza infaz sistemi, koşullu salıverilme koşulları ve denetimli serbestlik hakları. CGTİK kapsamında infaz süreci rehberi.',
    metaKeywords: 'ceza infaz, koşullu salıverilme, denetimli serbestlik, CGTİK, infaz süresi hesaplama'
  },
  {
    id: 3,
    slug: 'ticaret-hukuku-sozlesme-rehberi',
    title: 'Ticaret Hukuku: Sözleşme Düzenleme Rehberi 2024',
    excerpt: 'Ticari sözleşmelerde dikkat edilmesi gereken hususlar, yasal yükümlülükler ve risk yönetimi.',
    content: `
      <h2>Ticari Sözleşmelerde Dikkat Edilmesi Gerekenler</h2>
      <p>Ticari hayatta sözleşmeler iş ilişkilerinin temelini oluşturur. Doğru hazırlanmış sözleşmeler hem hukuki güvence sağlar hem de ticari riskleri minimize eder.</p>
      
      <h3>Sözleşme Türleri</h3>
      <ul>
        <li><strong>Alım-Satım Sözleşmeleri:</strong> Mal ve hizmet ticaretinde temel sözleşme türü</li>
        <li><strong>Bayi Sözleşmeleri:</strong> Distribütörlük ve bayilik ilişkileri</li>
        <li><strong>Franchise Sözleşmeleri:</strong> Marka kullanım hakları</li>
        <li><strong>İş Ortaklığı Sözleşmeleri:</strong> Şirket kuruluşu ve ortaklık</li>
      </ul>
      
      <h3>Sözleşmede Bulunması Gereken Hususlar</h3>
      <p>Her ticari sözleşmede mutlaka yer alması gereken temel maddeler:</p>
      <ul>
        <li>Tarafların tam kimlik bilgileri</li>
        <li>Sözleşmenin konusu ve kapsamı</li>
        <li>Ödeme koşulları ve vadeler</li>
        <li>Fesih koşulları</li>
        <li>Mücbir sebep halleri</li>
        <li>Uyuşmazlık çözüm yolları</li>
      </ul>
      
      <h3>Risk Yönetimi</h3>
      <p>Ticari sözleşmelerde riskleri minimize etmek için:</p>
      <ul>
        <li>Teminat mekanizmaları kurulmalı</li>
        <li>Cezai şart düzenlemeleri yapılmalı</li>
        <li>Sigorta kapsamları belirlenmeli</li>
        <li>Yasal mevzuat değişiklikleri öngörülmeli</li>
      </ul>
      
      <h3>2024 Güncel Düzenlemeler</h3>
      <p>Ticaret Kanunu'nda yapılan son değişiklikler ve e-ticaret düzenlemeleri sözleşme hazırlığında dikkate alınmalıdır.</p>
    `,
    author: 'Av. Koptay',
    updatedDate: '2024-10-15',
    publishDate: '2024-09-28',
    readTime: '7 dakika',
    category: 'Ticaret Hukuku',
    tags: ['ticaret hukuku', 'sözleşme', 'ticari hukuk', 'risk yönetimi', '2024'],
    image: '/images/hero.jpg',
    featured: false,
    views: 654,
    metaDescription: '2024 ticaret hukuku güncellemeleri ve ticari sözleşme hazırlama rehberi. Risk yönetimi ve yasal yükümlülükler.',
    metaKeywords: 'ticaret hukuku, ticari sözleşme, sözleşme hazırlama, risk yönetimi, ticaret kanunu 2024'
  },
  {
    id: 4,
    slug: 'aile-hukuku-bosanma-sureci',
    title: 'Aile Hukuku: Boşanma Süreci ve Haklar 2024',
    excerpt: 'Boşanma sürecinde bilinmesi gereken haklar, yasal prosedürler ve 2024 güncellemeleri.',
    content: `
      <h2>Boşanma Sürecinde Bilinmesi Gerekenler</h2>
      <p>Boşanma süreci hem duygusal hem de hukuki açıdan karmaşık bir süreçtir. Bu süreçte haklarınızı bilmek ve doğru adımları atmak önemlidir.</p>
      
      <h3>Boşanma Türleri</h3>
      <ul>
        <li><strong>Anlaşmalı Boşanma:</strong> Eşlerin anlaşarak yaptığı boşanma</li>
        <li><strong>Çekişmeli Boşanma:</strong> Eşlerden birinin diğerinden boşanma talep ettiği dava</li>
        <li><strong>Evlilik Birliğinin Temelinden Sarsılması:</strong> Ortak hayatın sürdürülemez hale gelmesi</li>
      </ul>
      
      <h3>Çocuk Velayeti ve Nafaka</h3>
      <p>Çocuklu ailelerde velayet ve nafaka konuları özel önem taşır:</p>
      <ul>
        <li><strong>Velayet:</strong> Çocuğun yüksek yararı gözetilerek karar verilir</li>
        <li><strong>Nafaka:</strong> Çocuk nafakası ve eş nafakası ayrı değerlendirilir</li>
        <li><strong>Görüş Hakkı:</strong> Velayeti olmayan ebeveynin çocukla görüşme hakkı</li>
      </ul>
      
      <h3>Mal Rejimi ve Paylaşım</h3>
      <p>Boşanmada malvarlığının paylaşımı:</p>
      <ul>
        <li>Yasal mal rejimi (edinilmiş mallara katılma)</li>
        <li>Sözleşmeli mal rejimi</li>
        <li>Mal varlığının tespiti ve değerlemesi</li>
      </ul>
      
      <h3>2024 Güncellemeleri</h3>
      <p>Aile hukukunda yapılan son değişiklikler ve Yargıtay içtihatları ışığında güncel yaklaşımlar.</p>
    `,
    author: 'Av. Koptay',
    updatedDate: '2024-10-12',
    publishDate: '2024-09-25',
    readTime: '8 dakika',
    category: 'Aile Hukuku',
    tags: ['aile hukuku', 'boşanma', 'velayet', 'nafaka', 'mal rejimi', '2024'],
    image: '/images/hero.jpg',
    featured: false,
    views: 823,
    metaDescription: '2024 aile hukuku güncellemeleri: boşanma süreci, velayet hakları, nafaka hesaplaması ve mal paylaşımı rehberi.',
    metaKeywords: 'aile hukuku, boşanma süreci, velayet hakları, nafaka hesaplama, mal rejimi, boşanma davası 2024'
  },
  {
    id: 5,
    slug: 'gayrimenkul-hukuku-tapu-islemleri',
    title: 'Gayrimenkul Hukuku: Tapu İşlemleri ve Satış Rehberi',
    excerpt: 'Gayrimenkul alım-satımında dikkat edilmesi gerekenler, tapu işlemleri ve hukuki güvence.',
    content: `
      <h2>Gayrimenkul Alım-Satımında Dikkat Edilecekler</h2>
      <p>Gayrimenkul yatırımı hayatımızın en büyük kararlarından biridir. Bu süreçte hukuki güvence almak ve riskleri minimize etmek kritik önem taşır.</p>
      
      <h3>Ön İnceleme Aşaması</h3>
      <ul>
        <li><strong>Tapu Araştırması:</strong> Gayrimenkulün hukuki durumunun tespiti</li>
        <li><strong>İmar Durumu:</strong> Yapı kullanma izni ve imar planına uygunluk</li>
        <li><strong>Borç Araştırması:</strong> Emlak vergisi, aidat borçları kontrolü</li>
        <li><strong>Belediye Belgelerı:</strong> İskan ruhsatı ve yapı ruhsatı kontrolü</li>
      </ul>
      
      <h3>Sözleşme Süreci</h3>
      <p>Gayrimenkul satış sözleşmesinde yer alması gerekenler:</p>
      <ul>
        <li>Gayrimenkulün tam kimlik bilgileri</li>
        <li>Satış fiyatı ve ödeme planı</li>
        <li>Teslim koşulları ve tarihi</li>
        <li>Ayıp ve kabul şartları</li>
        <li>Cayma hakları ve cezai şartlar</li>
      </ul>
      
      <h3>Tapu Devir İşlemi</h3>
      <p>Tapu devri sırasında dikkat edilecek hususlar:</p>
      <ul>
        <li>Harç ve vergi hesaplamaları</li>
        <li>Yetki belgesi kontrolü</li>
        <li>Son tapu araştırması</li>
        <li>Borç sorgulama güncellemesi</li>
      </ul>
      
      <h3>Vergi ve Harçlar</h3>
      <p>Gayrimenkul alım-satımında karşılaşılacak mali yükümlülükler ve 2024 tarifeleri.</p>
    `,
    author: 'Av. Koptay',
    updatedDate: '2024-10-08',
    publishDate: '2024-09-20',
    readTime: '6 dakika',
    category: 'Gayrimenkul Hukuku',
    tags: ['gayrimenkul hukuku', 'tapu işlemleri', 'emlak satışı', 'tapu devri', 'vergi'],
    image: '/images/hero.jpg',
    featured: true,
    views: 1245,
    metaDescription: 'Gayrimenkul alım-satım rehberi: tapu işlemleri, satış sözleşmesi, vergi hesaplamaları ve hukuki güvence.',
    metaKeywords: 'gayrimenkul hukuku, tapu işlemleri, emlak satışı, tapu devri, gayrimenkul vergi, tapu araştırması'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Get all articles
  getArticles: async () => {
    await delay(500); // Simulate API delay
    return {
      success: true,
      data: mockArticles
    };
  },

  // Get single article by slug
  getArticle: async (slug) => {
    await delay(300);
    const article = mockArticles.find(article => article.slug === slug);
    if (article) {
      return {
        success: true,
        data: article
      };
    } else {
      return {
        success: false,
        error: 'Makale bulunamadı'
      };
    }
  },

  // Submit contact form
  submitContact: async (formData) => {
    await delay(1000);
    // In a real app, this would send to your backend
    console.log('Contact form submitted:', formData);
    return {
      success: true,
      message: 'Mesajınız başarıyla gönderildi. En kısa sürede size döneceğiz.'
    };
  },

  // Get practice areas
  getPracticeAreas: async () => {
    await delay(200);
    return {
      success: true,
      data: [
        {
          id: 1,
          title: 'İş Hukuku',
          description: 'İşçi-işveren ilişkileri, iş sözleşmeleri, tazminat davaları',
          icon: 'briefcase'
        },
        {
          id: 2,
          title: 'Ticaret Hukuku',
          description: 'Şirket kurulumu, ticari sözleşmeler, ticari uyuşmazlıklar',
          icon: 'building'
        },
        {
          id: 3,
          title: 'Aile Hukuku',
          description: 'Boşanma, velayet, nafaka, miras hukuku',
          icon: 'heart'
        },
        {
          id: 4,
          title: 'Ceza Hukuku',
          description: 'Ceza davaları, müdafilik, hukuki danışmanlık',
          icon: 'shield'
        },
        {
          id: 5,
          title: 'Gayrimenkul Hukuku',
          description: 'Tapu işlemleri, kira sözleşmeleri, gayrimenkul uyuşmazlıkları',
          icon: 'home'
        },
        {
          id: 6,
          title: 'İcra ve İflas Hukuku',
          description: 'Alacak takibi, icra takipleri, iflas işlemleri',
          icon: 'scale'
        }
      ]
    };
  }
};

// Helper functions
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Europe/Istanbul'
  };
  return new Date(dateString).toLocaleDateString('tr-TR', options);
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};