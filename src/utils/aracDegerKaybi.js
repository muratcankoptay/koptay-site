// Araç Değer Kaybı Hesaplama - 2025 Sigorta Genel Şartları
export const BAZ_KATSAYI = 0.19;

export const getKmKatsayisi = (km) => {
  if (km <= 14999) return 0.90;
  if (km <= 29999) return 0.80;
  if (km <= 44999) return 0.60;
  if (km <= 59999) return 0.40;
  if (km <= 74999) return 0.30;
  if (km <= 149999) return 0.20;
  return 0.10;
};

export const hasarBoyutuKatsayilari = {
  A1: 0.90,
  A2: 0.75,
  A3: 0.50,
  A4: 0.25
};

export const getHasarKodu = (hasarOrani, rayicDeger) => {
  const oran = hasarOrani * 100;
  if (rayicDeger <= 75000) {
    if (oran >= 25.01) return 'A1';
    if (oran >= 15.01) return 'A2';
    if (oran >= 5.01) return 'A3';
    return 'A4';
  } else if (rayicDeger <= 150000) {
    if (oran >= 20.01) return 'A1';
    if (oran >= 12.01) return 'A2';
    if (oran >= 4.01) return 'A3';
    return 'A4';
  } else if (rayicDeger <= 300000) {
    if (oran >= 20.01) return 'A1';
    if (oran >= 10.01) return 'A2';
    if (oran >= 3.01) return 'A3';
    return 'A4';
  } else {
    if (oran >= 20.01) return 'A1';
    if (oran >= 8.01) return 'A2';
    if (oran >= 2.01) return 'A3';
    return 'A4';
  }
};
export const hesaplaDegerKaybi = ({ aracDegeri, modelYili, kazaTarihi, kilometre, hasarlar = [], kusurOrani = 0 }) => {
  const bazDegerKaybi = aracDegeri * BAZ_KATSAYI;
  const kmKatsayisi = getKmKatsayisi(kilometre);
  let toplamDegerKaybi = 0;
  const hasarDetaylari = [];
  
  hasarlar.forEach((hasar, index) => {
    const hasarOrani = hasar.hasarTutari / aracDegeri;
    
    // Kullanıcı A1-A4 seçmişse onu kullan, yoksa otomatik hesapla
    const hasarKodu = hasar.hasarKodu || getHasarKodu(hasarOrani, aracDegeri);
    const hasarBoyutuKatsayisi = hasarBoyutuKatsayilari[hasarKodu];
    
    let hasarDegerKaybi = bazDegerKaybi * hasarBoyutuKatsayisi * kmKatsayisi;
    
    if (hasarOrani < 0.02) {
      hasarDegerKaybi = Math.min(hasarDegerKaybi, hasar.hasarTutari);
    }
    
    toplamDegerKaybi += hasarDegerKaybi;
    
    hasarDetaylari.push({
      hasarNo: index + 1,
      hasarTutari: hasar.hasarTutari,
      hasarOrani: hasarOrani * 100,
      hasarKodu,
      hasarBoyutuKatsayisi,
      degerKaybiTutari: hasarDegerKaybi,
      parcalar: hasar.parcalar || []
    });
  });
  if (kusurOrani > 0) {
    const kusurKatsayisi = (100 - kusurOrani) / 100;
    toplamDegerKaybi = toplamDegerKaybi * kusurKatsayisi;
  }
  const maksimumDegerKaybi = aracDegeri * 0.35;
  const sinirliDegerKaybi = Math.min(toplamDegerKaybi, maksimumDegerKaybi);
  return {
    aracDegeri,
    bazDegerKaybi,
    kmKatsayisi,
    kilometre,
    kusurOrani,
    toplamDegerKaybi: sinirliDegerKaybi,
    toplamDegerKaybiOrani: (sinirliDegerKaybi / aracDegeri) * 100,
    hasarDetaylari,
    hesaplamaTarihi: new Date().toISOString(),
    yargitaySiniri: maksimumDegerKaybi,
    sinirAsildiMi: toplamDegerKaybi > maksimumDegerKaybi
  };
};
export const parcaListesi = [
  { id: 'onBumper', ad: 'Ön Tampon', konum: 'on' },
  { id: 'kaput', ad: 'Motor Kaputu', konum: 'on' },
  { id: 'tavan', ad: 'Tavan', konum: 'ust' },
  { id: 'onCamurlukSag', ad: 'Sağ Ön Çamurluk', konum: 'sag' },
  { id: 'onKapiSag', ad: 'Sağ Ön Kapı', konum: 'sag' },
  { id: 'arkaKapiSag', ad: 'Sağ Arka Kapı', konum: 'sag' },
  { id: 'arkaCamurlukSag', ad: 'Sağ Arka Çamurluk', konum: 'sag' },
  { id: 'onCamurlukSol', ad: 'Sol Ön Çamurluk', konum: 'sol' },
  { id: 'onKapiSol', ad: 'Sol Ön Kapı', konum: 'sol' },
  { id: 'arkaKapiSol', ad: 'Sol Arka Kapı', konum: 'sol' },
  { id: 'arkaCamurlukSol', ad: 'Sol Arka Çamurluk', konum: 'sol' },
  { id: 'bagajKapagi', ad: 'Bagaj Kapağı', konum: 'arka' },
  { id: 'arkaBumper', ad: 'Arka Tampon', konum: 'arka' }
];

export const islemTurleri = [
  { id: 'lokalBoya', ad: 'Lokal Boyalı', renk: 'bg-yellow-400' },
  { id: 'boyali', ad: 'Boyalı', renk: 'bg-red-400' },
  { id: 'degisen', ad: 'Değişen', renk: 'bg-red-800' }
];

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (value) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '%0.00';
  }
  return `%${value.toFixed(2)}`;
};

export const hasarKoduAciklamalari = {
  A1: 'Büyük Hasar - Aracın değerinin %20+ oranında hasar',
  A2: 'Orta Hasar - Aracın değerinin %8-20 arası hasar',
  A3: 'Küçük Hasar - Aracın değerinin %2-8 arası hasar',
  A4: 'Basit Hasar - Aracın değerinin %2 den az hasar'
};
