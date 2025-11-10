// 2026 Avukatlık Asgari Ücret Tarifesi
// Kaynak: 4 Kasım 2025 tarihli Resmi Gazete

// MAKTU ÜCRETLER - Konusu Para Olmayan veya Para ile Değerlendirilemeyen İşler
export const maktuUcretler = {
  // İcra Daireleri
  icraDairesi: 9000,
  icraMahkemesi: 11000,
  icraMahkemesiDurusmali: 18000,
  tahliye: 20000,
  icraCeza: 15000,
  cocukTeslimi: 16000,
  
  // Soruşturma
  cezaSorusturma: 11000,
  
  // Mahkemeler
  sulhHukuk: 30000,
  sulhCeza: 18000,
  infazHakimligi: 18000,
  asliye: 45000,
  tuketici: 22500,
  fikriSinai: 55000,
  agirCeza: 65000,
  cocukMahkemesi: 45000,
  cocukAgirCeza: 65000,
  
  // İdari Yargı
  idareVergiDurusmasiz: 30000,
  idareVergiDurusmali: 40000,
  
  // Üst Mahkemeler - BAM/BİM
  bamBimIlkDerece: 35000,
  bamBimIstinafTek: 22000,
  bamBimIstinafCoklu: 42000,
  
  // Yüksek Mahkemeler
  sayistayDurusmasiz: 34000,
  sayistayDurusmali: 65000,
  yargitayIlkDerece: 65000,
  danistayDurusmasiz: 40000,
  danistayDurusmali: 65000,
  temyizDurusmasi: 40000,
  uyusmazlik: 40000,
  
  // Anayasa Mahkemesi
  anayasaYuceDivan: 120000,
  anayasaBireyselDurusmasiz: 40000,
  anayasaBireyselDurusmali: 80000,
  anayasaDiger: 90000,
  
  // İhtiyati İşlemler
  ihtiyatiIslemDurusmasiz: 10000,
  ihtiyatiIslemDurusmali: 12500,
  ortaklikGiderilmesi: 18000,
  ortaklikTaksim: 40000,
  tuketiciKredi: 20000
};

// NİSPİ ÜCRET KADEMELERİ - 2026 Tarifesi
export const nispiKademeler = [
  { limit: 600000, oran: 0.16, aciklama: 'İlk 600.000 TL için %16' },
  { limit: 600000, oran: 0.15, aciklama: 'Sonraki 600.000 TL için %15' },
  { limit: 1200000, oran: 0.14, aciklama: 'Sonraki 1.200.000 TL için %14' },
  { limit: 1200000, oran: 0.13, aciklama: 'Sonraki 1.200.000 TL için %13' },
  { limit: 1800000, oran: 0.11, aciklama: 'Sonraki 1.800.000 TL için %11' },
  { limit: 2400000, oran: 0.08, aciklama: 'Sonraki 2.400.000 TL için %8' },
  { limit: 3000000, oran: 0.05, aciklama: 'Sonraki 3.000.000 TL için %5' },
  { limit: 3600000, oran: 0.03, aciklama: 'Sonraki 3.600.000 TL için %3' },
  { limit: 4200000, oran: 0.02, aciklama: 'Sonraki 4.200.000 TL için %2' },
  { limit: Infinity, oran: 0.01, aciklama: '18.600.000 TL üzeri için %1' }
];

/**
 * Nispi ücret hesaplama fonksiyonu
 * @param {number} davaKonusuDeger - Davanın parasal değeri (TL)
 * @returns {object} - Hesaplama detayları ve toplam ücret
 */
export const calculateNispiUcret = (davaKonusuDeger) => {
  if (!davaKonusuDeger || davaKonusuDeger <= 0) {
    return {
      toplamUcret: 0,
      detaylar: [],
      hata: 'Lütfen geçerli bir dava değeri giriniz.'
    };
  }

  let kalanMiktar = davaKonusuDeger;
  let toplamUcret = 0;
  const detaylar = [];

  for (let i = 0; i < nispiKademeler.length; i++) {
    const kademe = nispiKademeler[i];
    
    if (kalanMiktar <= 0) break;

    const hesaplanacakMiktar = Math.min(kalanMiktar, kademe.limit);
    const kademUcreti = hesaplanacakMiktar * kademe.oran;
    
    toplamUcret += kademUcreti;
    detaylar.push({
      kademe: i + 1,
      aciklama: kademe.aciklama,
      miktar: hesaplanacakMiktar,
      oran: kademe.oran * 100,
      ucret: kademUcreti
    });

    kalanMiktar -= hesaplanacakMiktar;
  }

  return {
    toplamUcret: Math.round(toplamUcret * 100) / 100,
    detaylar,
    davaKonusuDeger
  };
};

/**
 * Maktu ücret hesaplama fonksiyonu
 * @param {string} mahkemeTuru - Seçilen mahkeme/işlem türü
 * @returns {object} - Maktu ücret bilgisi
 */
export const calculateMaktuUcret = (mahkemeTuru) => {
  const ucret = maktuUcretler[mahkemeTuru];
  
  if (!ucret) {
    return {
      toplamUcret: 0,
      hata: 'Lütfen geçerli bir mahkeme türü seçiniz.'
    };
  }

  return {
    toplamUcret: ucret,
    mahkemeTuru,
    aciklama: getMahkemeAciklama(mahkemeTuru)
  };
};

/**
 * Mahkeme türü açıklamalarını döndürür
 */
export const getMahkemeAciklama = (mahkemeTuru) => {
  const aciklamalar = {
    icraDairesi: 'İcra Dairelerinde yapılan takipler',
    icraMahkemesi: 'İcra Mahkemelerinde takip edilen işler',
    icraMahkemesiDurusmali: 'İcra Mahkemelerinde duruşmalı işler',
    tahliye: 'Tahliyeye ilişkin icra takipleri',
    icraCeza: 'İcra Mahkemelerinde takip edilen ceza işleri',
    cocukTeslimi: 'Çocuk teslimi ve kişisel ilişki kurulması',
    cezaSorusturma: 'Ceza soruşturma evresinde takip edilen işler',
    sulhHukuk: 'Sulh Hukuk Mahkemelerinde takip edilen davalar',
    sulhCeza: 'Sulh Ceza Hakimliklerinde takip edilen davalar',
    infazHakimligi: 'İnfaz Hakimliklerinde takip edilen davalar',
    asliye: 'Asliye Mahkemelerinde takip edilen davalar',
    tuketici: 'Tüketici Mahkemelerinde takip edilen davalar',
    fikriSinai: 'Fikri ve Sınai Haklar Mahkemelerinde takip edilen davalar',
    agirCeza: 'Ağır Ceza Mahkemelerinde takip edilen davalar',
    cocukMahkemesi: 'Çocuk Mahkemelerinde takip edilen davalar',
    cocukAgirCeza: 'Çocuk Ağır Ceza Mahkemelerinde takip edilen davalar',
    idareVergiDurusmasiz: 'İdare ve Vergi Mahkemelerinde duruşmasız işler',
    idareVergiDurusmali: 'İdare ve Vergi Mahkemelerinde duruşmalı işler',
    bamBimIlkDerece: 'BAM/BİM\'de ilk derecede görülen davalar',
    bamBimIstinafTek: 'BAM/BİM\'de istinaf yolu ile görülen tek duruşmalı işler',
    bamBimIstinafCoklu: 'BAM/BİM\'de istinaf yolu ile görülen çok duruşmalı işler',
    sayistayDurusmasiz: 'Sayıştay\'da hesap yargılamaları (duruşmasız)',
    sayistayDurusmali: 'Sayıştay\'da hesap yargılamaları (duruşmalı)',
    yargitayIlkDerece: 'Yargıtay\'da ilk derecede görülen davalar',
    danistayDurusmasiz: 'Danıştay\'da ilk derecede görülen davalar (duruşmasız)',
    danistayDurusmali: 'Danıştay\'da ilk derecede görülen davalar (duruşmalı)',
    temyizDurusmasi: 'Yargıtay, Danıştay ve Sayıştay\'da temyiz duruşmaları',
    uyusmazlik: 'Uyuşmazlık Mahkemesinde görülen davalar',
    anayasaYuceDivan: 'Anayasa Mahkemesi - Yüce Divan sıfatı ile bakılan davalar',
    anayasaBireyselDurusmasiz: 'Anayasa Mahkemesi - Bireysel başvuru (duruşmasız)',
    anayasaBireyselDurusmali: 'Anayasa Mahkemesi - Bireysel başvuru (duruşmalı)',
    anayasaDiger: 'Anayasa Mahkemesi - Diğer dava ve işler',
    ihtiyatiIslemDurusmasiz: 'İhtiyati haciz/tedbir, delil tespiti (duruşmasız)',
    ihtiyatiIslemDurusmali: 'İhtiyati haciz/tedbir, delil tespiti (duruşmalı)',
    ortaklikGiderilmesi: 'Ortaklığın giderilmesi için satış memurluğu işleri',
    ortaklikTaksim: 'Ortaklığın giderilmesi ve taksim davaları',
    tuketiciKredi: 'Tüketici Mahkemelerinde kredi taksit/faiz uyarlanması'
  };
  
  return aciklamalar[mahkemeTuru] || mahkemeTuru;
};

/**
 * Tüm mahkeme kategorilerini gruplar halinde döndürür
 */
export const getMahkemeKategorileri = () => {
  return [
    {
      kategori: 'İcra ve İflas Daireleri',
      mahkemeler: [
        { value: 'icraDairesi', label: 'İcra Dairesi Takibi', ucret: 9000 },
        { value: 'icraMahkemesi', label: 'İcra Mahkemesi', ucret: 11000 },
        { value: 'icraMahkemesiDurusmali', label: 'İcra Mahkemesi (Duruşmalı)', ucret: 18000 },
        { value: 'tahliye', label: 'Tahliye Takibi', ucret: 20000 },
        { value: 'icraCeza', label: 'İcra Mahkemesi Ceza İşleri', ucret: 15000 },
        { value: 'cocukTeslimi', label: 'Çocuk Teslimi/Kişisel İlişki', ucret: 16000 }
      ]
    },
    {
      kategori: 'İlk Derece Mahkemeleri',
      mahkemeler: [
        { value: 'sulhHukuk', label: 'Sulh Hukuk Mahkemesi', ucret: 30000 },
        { value: 'sulhCeza', label: 'Sulh Ceza Hakimliği', ucret: 18000 },
        { value: 'infazHakimligi', label: 'İnfaz Hakimliği', ucret: 18000 },
        { value: 'asliye', label: 'Asliye Mahkemesi', ucret: 45000 },
        { value: 'tuketici', label: 'Tüketici Mahkemesi', ucret: 22500 },
        { value: 'fikriSinai', label: 'Fikri ve Sınai Haklar Mahkemesi', ucret: 55000 },
        { value: 'agirCeza', label: 'Ağır Ceza Mahkemesi', ucret: 65000 },
        { value: 'cocukMahkemesi', label: 'Çocuk Mahkemesi', ucret: 45000 },
        { value: 'cocukAgirCeza', label: 'Çocuk Ağır Ceza Mahkemesi', ucret: 65000 }
      ]
    },
    {
      kategori: 'Ceza Soruşturma',
      mahkemeler: [
        { value: 'cezaSorusturma', label: 'Ceza Soruşturma Evresi', ucret: 11000 }
      ]
    },
    {
      kategori: 'İdari Yargı',
      mahkemeler: [
        { value: 'idareVergiDurusmasiz', label: 'İdare/Vergi Mahkemesi (Duruşmasız)', ucret: 30000 },
        { value: 'idareVergiDurusmali', label: 'İdare/Vergi Mahkemesi (Duruşmalı)', ucret: 40000 }
      ]
    },
    {
      kategori: 'Bölge Adliye ve İdare Mahkemeleri',
      mahkemeler: [
        { value: 'bamBimIlkDerece', label: 'BAM/BİM İlk Derece', ucret: 35000 },
        { value: 'bamBimIstinafTek', label: 'BAM/BİM İstinaf (Tek Duruşma)', ucret: 22000 },
        { value: 'bamBimIstinafCoklu', label: 'BAM/BİM İstinaf (Çoklu Duruşma)', ucret: 42000 }
      ]
    },
    {
      kategori: 'Yüksek Mahkemeler',
      mahkemeler: [
        { value: 'yargitayIlkDerece', label: 'Yargıtay İlk Derece', ucret: 65000 },
        { value: 'danistayDurusmasiz', label: 'Danıştay (Duruşmasız)', ucret: 40000 },
        { value: 'danistayDurusmali', label: 'Danıştay (Duruşmalı)', ucret: 65000 },
        { value: 'sayistayDurusmasiz', label: 'Sayıştay (Duruşmasız)', ucret: 34000 },
        { value: 'sayistayDurusmali', label: 'Sayıştay (Duruşmalı)', ucret: 65000 },
        { value: 'temyizDurusmasi', label: 'Temyiz Duruşması', ucret: 40000 },
        { value: 'uyusmazlik', label: 'Uyuşmazlık Mahkemesi', ucret: 40000 }
      ]
    },
    {
      kategori: 'Anayasa Mahkemesi',
      mahkemeler: [
        { value: 'anayasaYuceDivan', label: 'Yüce Divan Davası', ucret: 120000 },
        { value: 'anayasaBireyselDurusmasiz', label: 'Bireysel Başvuru (Duruşmasız)', ucret: 40000 },
        { value: 'anayasaBireyselDurusmali', label: 'Bireysel Başvuru (Duruşmalı)', ucret: 80000 },
        { value: 'anayasaDiger', label: 'Diğer Dava ve İşler', ucret: 90000 }
      ]
    },
    {
      kategori: 'İhtiyati İşlemler',
      mahkemeler: [
        { value: 'ihtiyatiIslemDurusmasiz', label: 'İhtiyati Haciz/Tedbir (Duruşmasız)', ucret: 10000 },
        { value: 'ihtiyatiIslemDurusmali', label: 'İhtiyati Haciz/Tedbir (Duruşmalı)', ucret: 12500 },
        { value: 'ortaklikGiderilmesi', label: 'Ortaklığın Giderilmesi (Satış)', ucret: 18000 },
        { value: 'ortaklikTaksim', label: 'Ortaklığın Giderilmesi ve Taksim', ucret: 40000 },
        { value: 'tuketiciKredi', label: 'Tüketici - Kredi Uyarlanması', ucret: 20000 }
      ]
    }
  ];
};

/**
 * Para formatlama yardımcı fonksiyonu
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
