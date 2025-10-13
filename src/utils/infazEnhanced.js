// ============== ENHANCED INFAZ CALCULATOR ==============
// Based on 5275 SK, 5237 TCK, and related regulations
// Includes historical changes, lehe provisions (TCK Art. 7), and exceptions

export function tarihEkleGelismis(dateStr, days) {
  const base = new Date(`${dateStr}T00:00:00`)
  if (isNaN(base.getTime())) return ''
  const d = new Date(base)
  d.setDate(d.getDate() + (parseInt(days || 0, 10)))
  return d.toLocaleDateString('tr-TR')
}

export function gunHesaplaGelismis(yil, ay, gun) {
  const y = parseInt(yil || 0, 10)
  const m = parseInt(ay || 0, 10)
  const d = parseInt(gun || 0, 10)
  return (y * 365) + (m * 30) + d
}

// Enhanced crime type mapping for dropdown
export function getSucTipiSeçenekleri() {
  return [
    // === ULUSLARARASI SUÇLAR (Madde 76-80) ===
    { value: 'soykırım', label: 'Soykırım (TCK 76)', oran: 'Ağırlaştırılmış Müebbet', kategori: 'uluslararasi' },
    { value: 'insanliga_karsi', label: 'İnsanlığa Karşı Suçlar (TCK 77)', oran: 'Ağırlaştırılmış Müebbet', kategori: 'uluslararasi' },
    { value: 'orgut_uluslararasi', label: 'Örgüt - Soykırım/İnsanlığa Karşı (TCK 78)', oran: '3/4', kategori: 'uluslararasi' },
    { value: 'gocmen_kacakciligi', label: 'Göçmen Kaçakçılığı (TCK 79)', oran: '2/3', kategori: 'uluslararasi' },
    { value: 'insan_ticareti', label: 'İnsan Ticareti (TCK 80)', oran: '2/3', kategori: 'uluslararasi' },
    
    // === KİŞİLERE KARŞI SUÇLAR (Madde 81-124) ===
    // Hayata Karşı Suçlar
    { value: 'kasten_oldurme', label: 'Kasten Öldürme (TCK 81)', oran: '2/3', kategori: 'kişilere_karsi' },
    { value: 'nitelikli_oldurme', label: 'Nitelikli Kasten Öldürme (TCK 82)', oran: '2/3', kategori: 'kişilere_karsi' },
    { value: 'ihmali_oldurme', label: 'İhmali Davranışla Öldürme (TCK 83)', oran: '2/3', kategori: 'kişilere_karsi' },
    { value: 'intihara_yonlendirme', label: 'İntihara Yönlendirme (TCK 84)', oran: '1/2', kategori: 'kişilere_karsi' },
    { value: 'taksirle_oldurme', label: 'Taksirle Öldürme (TCK 85)', oran: '1/2', kategori: 'kişilere_karsi' },
    
    // Vücut Dokunulmazlığına Karşı Suçlar
    { value: 'kasten_yaralama', label: 'Kasten Yaralama (TCK 86)', oran: '1/2', kategori: 'kişilere_karsi' },
    { value: 'nitelikli_yaralama', label: 'Nitelikli Kasten Yaralama (TCK 87)', oran: '1/2', kategori: 'kişilere_karsi' },
    { value: 'neticesi_agirlasmis_yaralama', label: 'Neticesi Sebebiyle Ağırlaşmış Yaralama (TCK 88)', oran: '1/2', kategori: 'kişilere_karsi' },
    { value: 'taksirle_yaralama', label: 'Taksirle Yaralama (TCK 89)', oran: '1/2', kategori: 'kişilere_karsi' },
    { value: 'insan_uzerinde_deney', label: 'İnsan Üzerinde Deney (TCK 90)', oran: '1/2', kategori: 'kişilere_karsi' },
    { value: 'organ_ticareti', label: 'Organ veya Doku Ticareti (TCK 91)', oran: '2/3', kategori: 'kişilere_karsi' },
    
    // İşkence ve Eziyet
    { value: 'işkence', label: 'İşkence (TCK 94)', oran: '2/3', kategori: 'kişilere_karsi' },
    { value: 'eziyet', label: 'Eziyet (TCK 95)', oran: '2/3', kategori: 'kişilere_karsi' },
    { value: 'ihmal_gozetim', label: 'İhmal ve Kötü Muamele (TCK 96)', oran: '2/3', kategori: 'kişilere_karsi' },
    
    // Diğer Kişilere Karşı Suçlar
    { value: 'terk', label: 'Terk (TCK 97)', oran: '1/2', kategori: 'kişilere_karsi' },
    { value: 'yardim_etmeme', label: 'Yardım Etmekten Kaçınma (TCK 98)', oran: '1/2', kategori: 'kişilere_karsi' },
    { value: 'cocuk_dusurtme', label: 'Çocuk Düşürtme (TCK 99)', oran: '1/2', kategori: 'kişilere_karsi' },
    
    // Cinsel Dokunulmazlığa Karşı Suçlar
    { value: 'cinsel_saldiri', label: 'Cinsel Saldırı (TCK 102)', oran: '2/3', kategori: 'cinsel' },
    { value: 'cocuk_cinsel_istismar', label: 'Çocukların Cinsel İstismarı (TCK 103)', oran: '3/4', kategori: 'cinsel' },
    { value: 'reşit_olmayan_cinsel', label: 'Reşit Olmayanla Cinsel İlişki (TCK 104)', oran: '2/3', kategori: 'cinsel' },
    { value: 'cinsel_taciz', label: 'Cinsel Taciz (TCK 105)', oran: '2/3', kategori: 'cinsel' },
    
    // Hürriyete Karşı Suçlar
    { value: 'hurriyet_yoksun_kilma', label: 'Kişiyi Hürriyetinden Yoksun Kılma (TCK 109)', oran: '1/2', kategori: 'kişilere_karsi' },
    { value: 'tehdit', label: 'Tehdit (TCK 106)', oran: '1/2', kategori: 'kişilere_karsi' },
    { value: 'şantaj', label: 'Şantaj (TCK 107)', oran: '1/2', kategori: 'kişilere_karsi' },
    { value: 'zorla_calıştırma', label: 'Zorla Çalıştırma (TCK 117)', oran: '1/2', kategori: 'kişilere_karsi' },
    { value: 'adam_kacirma', label: 'Adam Kaçırma (TCK 123)', oran: '2/3', kategori: 'kişilere_karsi' },
    
    // === ŞEREFE KARŞI SUÇLAR (Madde 125-131) ===
    { value: 'hakaret', label: 'Hakaret (TCK 125)', oran: '1/2', kategori: 'şeref' },
    { value: 'iftira_şeref', label: 'İftira (Şeref) (TCK 126)', oran: '1/2', kategori: 'şeref' },
    { value: 'hatiraya_hakaret', label: 'Kişinin Hatırasına Hakaret (TCK 130)', oran: '1/2', kategori: 'şeref' },
    
    // === ÖZEL HAYATA KARŞI SUÇLAR (Madde 132-140) ===
    { value: 'haberlesme_ihlali', label: 'Haberleşmenin Gizliliğini İhlal (TCK 132)', oran: '2/3', kategori: 'ozel_hayat' },
    { value: 'özel_hayat_ihlali', label: 'Özel Hayatın Gizliliğini İhlal (TCK 134)', oran: '2/3', kategori: 'ozel_hayat' },
    { value: 'kişisel_veri_ihlali', label: 'Kişisel Verilerin İhlali (TCK 135)', oran: '2/3', kategori: 'ozel_hayat' },
    { value: 'kişisel_veri_ele_gecirme', label: 'Kişisel Verileri Hukuka Aykırı Ele Geçirme (TCK 136)', oran: '2/3', kategori: 'ozel_hayat' },
    
    // === MALVARLIĞINA KARŞI SUÇLAR (Madde 141-169) ===
    { value: 'hirsizlik', label: 'Hırsızlık (TCK 141)', oran: '1/2', kategori: 'malvarligina_karsi' },
    { value: 'nitelikli_hirsizlik', label: 'Nitelikli Hırsızlık (TCK 142)', oran: '1/2', kategori: 'malvarligina_karsi' },
    { value: 'dolandiricilik', label: 'Dolandırıcılık (TCK 157)', oran: '1/2', kategori: 'malvarligina_karsi' },
    { value: 'nitelikli_dolandiricilik', label: 'Nitelikli Dolandırıcılık (TCK 158)', oran: '1/2', kategori: 'malvarligina_karsi' },
    { value: 'guven_kotuye_kullanma', label: 'Güveni Kötüye Kullanma (TCK 155)', oran: '1/2', kategori: 'malvarligina_karsi' },
    { value: 'yagma', label: 'Yağma (TCK 148)', oran: '1/2', kategori: 'malvarligina_karsi' },
    { value: 'nitelikli_yagma', label: 'Nitelikli Yağma (TCK 149)', oran: '2/3', kategori: 'malvarligina_karsi' },
    { value: 'gasp', label: 'Gasp (TCK 150)', oran: '1/2', kategori: 'malvarligina_karsi' },
    { value: 'mala_zarar_verme', label: 'Mala Zarar Verme (TCK 151)', oran: '1/2', kategori: 'malvarligina_karsi' },
    
    // === TOPLUMA KARŞI SUÇLAR (Madde 170-189) ===
    // Genel Tehlike Suçları
    { value: 'genel_tehlike', label: 'Genel Tehlike Yaratma (TCK 170)', oran: '1/2', kategori: 'topluma_karsi' },
    { value: 'nükleer_madde_kaçakçılığı', label: 'Nükleer Madde Kaçakçılığı (TCK 171)', oran: '2/3', kategori: 'topluma_karsi' },
    
    // Çevre Suçları
    { value: 'cevre_kirletme', label: 'Çevreyi Kirletme (TCK 181)', oran: '1/2', kategori: 'cevre' },
    { value: 'gürültüye_neden_olma', label: 'Gürültüye Neden Olma (TCK 183)', oran: '1/2', kategori: 'cevre' },
    { value: 'imar_kirletme', label: 'İmar Kirliliği (TCK 184)', oran: '1/2', kategori: 'cevre' },
    
    // Kamu Sağlığı Suçları
    { value: 'uyusturucu_kullanma', label: 'Uyuşturucu veya Uyarıcı Madde Kullanma (TCK 191)', oran: '1/2', kategori: 'kamu_sagligi' },
    { value: 'uyusturucu_imal_ticaret', label: 'Uyuşturucu veya Uyarıcı Madde İmal ve Ticareti (TCK 188)', oran: '3/4', kategori: 'uyusturucu' },
    { value: 'uyusturucu_uyarici_madde_verme', label: 'Uyuşturucu veya Uyarıcı Madde Verme (TCK 190)', oran: '2/3', kategori: 'uyusturucu' },
    
    // === AİLE DÜZENİNE KARŞI SUÇLAR (Madde 230-233) ===
    { value: 'evlilik_engeli_gizleme', label: 'Evlilik Engeli Gizleme (TCK 230)', oran: '1/2', kategori: 'aile' },
    { value: 'soybagi_degistirme', label: 'Çocuğun Soybağını Değiştirme (TCK 231)', oran: '1/2', kategori: 'aile' },
    { value: 'kotu_muamele', label: 'Kötü Muamele (TCK 232)', oran: '1/2', kategori: 'aile' },
    
    // === EKONOMİ SANAYİ TİCARET SUÇLARI (Madde 235-241) ===
    { value: 'ihaleye_fesat', label: 'İhaleye Fesat Karıştırma (TCK 235)', oran: '1/2', kategori: 'ekonomi' },
    { value: 'edimin_ifasina_fesat', label: 'Edimin İfasına Fesat Karıştırma (TCK 236)', oran: '1/2', kategori: 'ekonomi' },
    { value: 'tefecilik', label: 'Tefecilik (TCK 241)', oran: '1/2', kategori: 'ekonomi' },
    
    // === BİLİŞİM SUÇLARI (Madde 243-246) ===
    { value: 'bilişim_sistemine_girme', label: 'Bilişim Sistemine Girme (TCK 243)', oran: '1/2', kategori: 'bilişim' },
    { value: 'bilişim_sistemini_engelleme', label: 'Bilişim Sistemini Engelleme (TCK 244)', oran: '1/2', kategori: 'bilişim' },
    { value: 'kredi_karti_kotuye_kullanma', label: 'Kredi Kartının Kötüye Kullanılması (TCK 245)', oran: '1/2', kategori: 'bilişim' },
    { value: 'bilişim_sisteminde_hile', label: 'Bilişim Sisteminde Hile (TCK 244)', oran: '1/2', kategori: 'bilişim' },
    
    // === KAMU İDARESİNE KARŞI SUÇLAR (Madde 247-266) ===
    { value: 'zimmet', label: 'Zimmet (TCK 247)', oran: '1/2', kategori: 'kamu_idaresi' },
    { value: 'irtikap', label: 'İrtikap (TCK 250)', oran: '1/2', kategori: 'kamu_idaresi' },
    { value: 'rusvet', label: 'Rüşvet (TCK 252)', oran: '1/2', kategori: 'kamu_idaresi' },
    { value: 'gorevi_kotuye_kullanma', label: 'Görevi Kötüye Kullanma (TCK 257)', oran: '1/2', kategori: 'kamu_idaresi' },
    { value: 'kamu_gorevlisine_mukavemet', label: 'Kamu Görevlisine Mukavemet (TCK 265)', oran: '1/2', kategori: 'kamu_idaresi' },
    
    // === ADLİYEYE KARŞI SUÇLAR (Madde 267-285) ===
    { value: 'iftira', label: 'İftira (TCK 267)', oran: '1/2', kategori: 'adliye' },
    { value: 'yalanci_tanıklık', label: 'Yalancı Tanıklık (TCK 272)', oran: '1/2', kategori: 'adliye' },
    { value: 'bilirkişide_yalan', label: 'Bilirkişide Yalan (TCK 275)', oran: '1/2', kategori: 'adliye' },
    { value: 'adliyeye_karsi_diğer', label: 'Diğer Adliyeye Karşı Suçlar (TCK 276-285)', oran: '1/2', kategori: 'adliye' },
    
    // === MİLLETE ve DEVLETE KARŞI SUÇLAR (Madde 302-339) ===
    // Devletin Güvenliğine Karşı Suçlar
    { value: 'devletin_birligini_bozma', label: 'Devletin Birliğini ve Ülke Bütünlüğünü Bozma (TCK 302)', oran: 'Ağırlaştırılmış Müebbet', kategori: 'devlet_guvenlik' },
    { value: 'anayasal_duzen_ihlali', label: 'Anayasal Düzeni İhlal (TCK 304)', oran: '3/4', kategori: 'devlet_guvenlik' },
    
    // Terör ve Örgüt Suçları
    { value: 'silahli_orgut', label: 'Silahlı Örgüt Kurma (TCK 314)', oran: '3/4', kategori: 'terror_orgut' },
    { value: 'silahli_orgut_uyelik', label: 'Silahlı Örgüte Üye Olma (TCK 314)', oran: '3/4', kategori: 'terror_orgut' },
    { value: 'orgut_kurma', label: 'Örgüt Kurma (TCK 220)', oran: '3/4', kategori: 'terror_orgut' },
    { value: 'orgute_uye_olma', label: 'Örgüte Üye Olma (TCK 221)', oran: '3/4', kategori: 'terror_orgut' },
    
    // Devlet Sırları ve Casusluk
    { value: 'devlet_sirlari', label: 'Devlet Sırlarına Karşı Suçlar (TCK 326)', oran: '2/3', kategori: 'devlet_sirlari' },
    { value: 'casusluk', label: 'Casusluk (TCK 328)', oran: '2/3', kategori: 'devlet_sirlari' },
    { value: 'siyasi_casusluk', label: 'Siyasi Casusluk (TCK 330)', oran: '2/3', kategori: 'devlet_sirlari' },
    { value: 'askeri_casusluk', label: 'Askeri Casusluk (TCK 332)', oran: '2/3', kategori: 'devlet_sirlari' },
    
    // === ÖZEL KANUNLAR ===
    // Terörle Mücadele Kanunu (TMK)
    { value: 'teror_orgut_kurma', label: 'Terör Örgütü Kurma (TMK 7)', oran: '3/4', kategori: 'tmk' },
    { value: 'teror_orgut_uyeligik', label: 'Terör Örgütü Üyeliği (TMK 7)', oran: '3/4', kategori: 'tmk' },
    { value: 'teror_propaganda', label: 'Terör Propagandası (TMK 7)', oran: '3/4', kategori: 'tmk' },
    { value: 'teror_finansman', label: 'Terör Finansmanı (TMK 8)', oran: '3/4', kategori: 'tmk' },
    
    // Ateşli Silahlar Kanunu
    { value: 'ruhsatsiz_silah', label: 'Ruhsatsız Silah Taşıma (ASK)', oran: '1/2', kategori: 'silah' },
    { value: 'silah_kacakciligi', label: 'Silah Kaçakçılığı (ASK)', oran: '2/3', kategori: 'silah' },
    
    // Kaçakçılık Kanunu
    { value: 'mal_kacakciligi', label: 'Mal Kaçakçılığı (5607 SK)', oran: '1/2', kategori: 'kacakcilik' },
    { value: 'orgutlu_kacakcilik', label: 'Örgütlü Kaçakçılık (5607 SK)', oran: '2/3', kategori: 'kacakcilik' },
    
    // === MÜEBBET CEZALAR ===
    { value: 'muebbet', label: 'Müebbet Hapis (24 yıl infaz)', oran: '24 yıl', kategori: 'muebbet' },
    { value: 'agirlaştirilmiş_muebbet', label: 'Ağırlaştırılmış Müebbet (30 yıl infaz)', oran: '30 yıl', kategori: 'muebbet' },
    
    // === GENEL KATEGORI (GERİYE UYUMLULUK) ===
    { value: 'genel', label: 'Genel Suçlar (Diğer)', oran: '1/2', kategori: 'genel' }
  ]
}

// Enhanced ratio calculation with historical changes and lehe provisions
export function infazOraniGelismis(sucTipi, isRecidivist, sucTarihi, iyiHal, yas) {
  const sucDate = new Date(`${sucTarihi}T00:00:00`)
  
  // Find the crime option from the comprehensive list
  const suçOpsiyon = getSucTipiSeçenekleri().find(s => s.value === sucTipi)
  
  if (!suçOpsiyon) {
    return { oran: 0.5, aciklamalar: ['Genel oran (1/2) - Suç tipi bulunamadı'] }
  }

  let oran = 0.5 // Default
  let aciklamalar = []
  
  // Apply the specific ratio based on crime type
  switch (suçOpsiyon.oran) {
    case '1/2':
      oran = 0.5
      aciklamalar.push(`${suçOpsiyon.label}: 1/2 oranı (5275 SK m. 107/1)`)
      break
      
    case '2/3':
      oran = 2/3
      aciklamalar.push(`${suçOpsiyon.label}: 2/3 oranı - Ağır suçlar kategorisi`)
      break
      
    case '3/4':
      oran = 0.75
      aciklamalar.push(`${suçOpsiyon.label}: 3/4 oranı - Çok ağır suçlar/örgüt suçları`)
      break
      
    case 'Ağırlaştırılmış Müebbet':
      return { oran: 1, yatarYil: 30, aciklamalar: [`${suçOpsiyon.label}: Ağırlaştırılmış müebbet - 30 yıl infaz`] }
      
    case '24 yıl':
      return { oran: 1, yatarYil: 24, aciklamalar: [`${suçOpsiyon.label}: Müebbet hapis - 24 yıl infaz`] }
      
    case '30 yıl':
      return { oran: 1, yatarYil: 30, aciklamalar: [`${suçOpsiyon.label}: Ağırlaştırılmış müebbet - 30 yıl infaz`] }
      
    case 'Uygulanmaz':
      return { oran: 1, yatarYil: null, aciklamalar: [`${suçOpsiyon.label}: Koşullu salıverilme uygulanmaz`] }
      
    case '1/2 veya 2/3':
      // Çocuk hükümlü için yaş kontrolü
      if (yas && yas < 15) {
        oran = 0.5
        aciklamalar.push(`${suçOpsiyon.label}: 15 yaş altı - 1/2 oranı + gün sayısı 2 katı`)
      } else {
        oran = 2/3
        aciklamalar.push(`${suçOpsiyon.label}: 15-18 yaş arası - 2/3 oranı`)
      }
      break
      
    case 'Özel Düzenleme':
      oran = 0.5
      aciklamalar.push(`${suçOpsiyon.label}: Özel düzenleme - Bireysel değerlendirme gerekir`)
      break
      
    default:
      oran = 0.5
      aciklamalar.push(`${suçOpsiyon.label}: Varsayılan 1/2 oranı`)
  }
  
  // Mükerrir (tekerrür) kontrolü - koşullu salıverilme uygulanmaz
  if (isRecidivist || sucTipi === 'mukerrir') {
    return { oran: 1, yatarYil: null, aciklamalar: ['Mükerrir hükümlü: Koşullu salıverilme uygulanmaz (CGTİHK m. 107/son)'] }
  }
  
  // TCK Madde 7 - Lehe olan hükümler (geriye yürüme)
  const guncelHukum = new Date('2020-03-30T00:00:00')
  if (sucDate < guncelHukum) {
    aciklamalar.push('30 Mart 2020 öncesi suç: Lehe olan hükümler uygulanabilir (TCK m. 7)')
  }
  
  // İyi hal şartı
  if (!iyiHal) {
    aciklamalar.push('İyi hal şartı sağlanmadığı takdirde koşullu salıverilme uygulanmaz')
    return { oran: 1, yatarYil: null, aciklamalar }
  }
  
  return { oran, aciklamalar }
}

// Enhanced supervised release calculation
export function denetimliSerbestlikGelismis(sucTipi, sucTarihi, cinsiyetKadin, dogumYapti) {
  const sucDate = new Date(`${sucTarihi}T00:00:00`)
  const is2020Once = sucDate < new Date('2020-03-30T00:00:00')
  
  let yil = is2020Once ? 3 : 1 // 30 Mart 2020 öncesi 3 yıl, sonrası 1 yıl
  let aciklamalar = []
  
  if (is2020Once) {
    aciklamalar.push('30 Mart 2020 öncesi suç: 3 yıl denetimli serbestlik (7242 sayılı Kanun)')
  } else {
    aciklamalar.push('30 Mart 2020 sonrası suç: 1 yıl denetimli serbestlik')
  }
  
  // Özel durumlar için kontrol
  const suçOpsiyon = getSucTipiSeçenekleri().find(s => s.value === sucTipi)
  
  // Müebbet cezalar için özel düzenleme
  if (suçOpsiyon && (suçOpsiyon.oran === '24 yıl' || suçOpsiyon.oran === '30 yıl' || suçOpsiyon.oran === 'Ağırlaştırılmış Müebbet')) {
    yil = 5 // Müebbet cezalar için 5 yıl denetimli serbestlik
    aciklamalar.push('Müebbet cezalar: 5 yıl denetimli serbestlik süresi')
  }
  
  // Terör ve örgüt suçları için uzatılmış süre
  if (suçOpsiyon && suçOpsiyon.kategori === 'terror_orgut' || suçOpsiyon && suçOpsiyon.kategori === 'tmk') {
    yil = Math.max(yil, 3) // En az 3 yıl
    aciklamalar.push('Terör/örgüt suçları: En az 3 yıl denetimli serbestlik')
  }
  
  // Cinsel suçlar için uzatılmış süre
  if (suçOpsiyon && suçOpsiyon.kategori === 'cinsel') {
    yil = Math.max(yil, 2) // En az 2 yıl
    aciklamalar.push('Cinsel suçlar: En az 2 yıl denetimli serbestlik')
  }
  
  // Mükerrir için uygulanmaz
  if (sucTipi === 'mukerrir') {
    return { yil: 0, aciklamalar: ['Mükerrir hükümlü: Denetimli serbestlik uygulanmaz'] }
  }
  
  return { yil, aciklamalar }
}

// Open prison transition calculation
export function acikCezaeviGecisi(sucTipi, toplamGun, isRecidivist) {
  let gecisOrani = 1/3 // General rule: last 1/3 in open prison
  let minKalanYil = 0
  let aciklamalar = []
  
  // Exceptions for specific crime types
  if (['teror', 'silahlı_orgut', 'orgut_kurma', 'orgut_uye'].includes(sucTipi)) {
    gecisOrani = 2/3 // Must serve 2/3 in closed prison
    aciklamalar.push('Terör/örgüt suçları: 2/3 kapalı cezaevinde geçirilir')
  } else if (['cinsel_saldiri', 'cocuk_istismar', 'reşit_olmayan'].includes(sucTipi)) {
    minKalanYil = 3
    aciklamalar.push('Cinsel suçlar: Salıverilmeye 3 yıl kala açık cezaevine geçiş')
  } else if (isRecidivist) {
    gecisOrani = 1 // Recidivists stay in closed prison
    aciklamalar.push('Mükerrirler kapalı cezaevinde kalır')
  }
  
  const acikGecisGunu = Math.floor(toplamGun * gecisOrani)
  
  return { acikGecisGunu, gecisOrani, minKalanYil, aciklamalar }
}

// Main enhanced calculation function
export function calculateInfazGelismis(form) {
  const {
    years, months, days,
    convictionDate, // mahkumiyet tarihi
    preTrialDays, // gözaltı/tutukluluk günleri
    crimeType, // suç türü
    birthDate, // doğum tarihi
    age, // hesaplanmış yaş
    gender, // cinsiyet
    isPregnant = false, // hamile mi
    hasGivenBirth = false, // doğum yapmış mı
    goodBehavior = 'evet', // iyi hal
    isRecidivist = false, // mükerrir
    isJuvenile = false, // çocuk (otomatik hesaplanmış)
    specialConditions = [], // özel durumlar
    // Backward compatibility
    crimeDate,
    startDate
  } = form

  const sucTarihi = convictionDate || crimeDate
  const infazBaslangic = startDate || convictionDate || crimeDate
  
  if (!sucTarihi) {
    return { error: 'Mahkumiyet tarihi zorunludur.' }
  }

  const toplamGun = gunHesaplaGelismis(years, months, days)
  const tutukluGun = parseInt(preTrialDays || 0, 10)
  const yas = age || 18
  const cinsiyetKadin = gender === 'kadın'
  
  // Özel durumları belirle
  let effectiveCrimeType = crimeType
  
  // Çocuk hükümlü için özel durum
  if (isJuvenile && crimeType !== 'cocuk_hukumlu') {
    // Çocuk hükümlü özel kategorisi varsa onu kullan, yoksa mevcut suçta çocuk kurallarını uygula
  }
  
  // Mükerrir kontrolü
  if (isRecidivist) {
    effectiveCrimeType = 'mukerrir'
  }
  
  // Calculate ratios with all special conditions
  const oranSonuc = infazOraniGelismis(effectiveCrimeType, isRecidivist, sucTarihi, goodBehavior === 'evet', yas)
  
  // Calculate basic terms
  let yatarGun = Math.floor(toplamGun * oranSonuc.oran) - tutukluGun
  yatarGun = Math.max(0, yatarGun)
  
  // Special case for life sentences
  if (oranSonuc.yatarYil) {
    yatarGun = oranSonuc.yatarYil * 365 - tutukluGun
  }
  
  // Calculate open prison transition
  const acikGecis = acikCezaeviGecisi(effectiveCrimeType, toplamGun, isRecidivist)
  
  // Calculate supervised release with special conditions
  const denetimli = denetimliSerbestlikGelismis(effectiveCrimeType, sucTarihi, cinsiyetKadin, hasGivenBirth)
  
  // Date calculations
  const infazSuresi = Math.floor(toplamGun * oranSonuc.oran)
  const cezaevindeGecen = infazSuresi - (denetimli.yil * 365)
  
  // Calculate actual dates
  const kosulluSaliverme = tarihEkleGelismis(infazBaslangic, infazSuresi)
  const denetimliSerbestlik = tarihEkleGelismis(infazBaslangic, Math.max(0, cezaevindeGecen))
  const tamTahliyeTarihi = tarihEkleGelismis(infazBaslangic, toplamGun)
  const acikCezaeviTarihi = acikGecis.acikGecisGunu > 0 ? tarihEkleGelismis(infazBaslangic, acikGecis.acikGecisGunu) : null

  // Enhanced legal explanations including special conditions
  const allExplanations = [
    ...oranSonuc.aciklamalar || [],
    ...acikGecis.aciklamalar || [],
    ...denetimli.aciklamalar || []
  ]
  
  // Add special condition explanations
  if (isJuvenile) {
    allExplanations.push(`Çocuk hükümlü: ${yas} yaşında olduğu için özel infaz kuralları uygulanır`)
  }
  
  if (cinsiyetKadin && isPregnant) {
    allExplanations.push('Hamile kadın hükümlü: Özel infaz düzenlemeleri uygulanabilir')
  }
  
  if (cinsiyetKadin && hasGivenBirth) {
    allExplanations.push('Doğum yapmış kadın hükümlü: İnfaz erteleme veya özel düzenlemeler uygulanabilir')
  }

  return {
    // Basic info
    sucTuru: getSucTipiSeçenekleri().find(s => s.value === crimeType)?.label || 'Belirtilmemiş',
    toplamCezaGun: toplamGun,
    mahsupGun: tutukluGun,
    infazOrani: Math.round(oranSonuc.oran * 100),
    denetimliSerbestlikYil: denetimli.yil,
    
    // Personal info
    yas: yas,
    cinsiyet: gender,
    ozelDurumlar: specialConditions,
    
    // Calculated periods
    infazSuresi,
    cezaevindeGecen: Math.max(0, cezaevindeGecen),
    acikGecisGunu: acikGecis.acikGecisGunu,
    
    // Dates
    kosulluSaliverme,
    denetimliSerbestlik,
    tamTahliyeTarihi,
    acikCezaeviTarihi,
    
    // Legal explanations
    yasalAciklama: allExplanations.join(' '),
    leheHukmumUygulandiMi: false, // Would need more complex logic
    leheAciklama: '',
    
    // Special situations
    ozelDurumlarDetay: allExplanations,
    
    // Backward compatibility
    fraction: Math.round(oranSonuc.oran * 100),
    crimeTypeText: getSucTipiSeçenekleri().find(s => s.value === crimeType)?.label || 'Belirtilmemiş',
    denetimliYears: denetimli.yil,
    tahliyeDate: tamTahliyeTarihi,
    kosulluDate: kosulluSaliverme,
    dsDate: denetimliSerbestlik,
    fullTerm: toplamGun,
    kosullu: infazSuresi,
    denetimliS: Math.max(0, cezaevindeGecen),
    mahsupDays: tutukluGun
  }
}

// Input validation
export function validateInfazInput(form) {
  const errors = []
  const warnings = []
  
  // Required fields check
  const convictionDate = form.convictionDate || form.crimeDate
  if (!convictionDate) {
    errors.push('Mahkumiyet tarihi zorunludur.')
  }
  
  // Sentence validation
  const totalDays = gunHesaplaGelismis(form.years, form.months, form.days)
  if (totalDays === 0) {
    errors.push('Ceza süresi girilmelidir.')
  }
  
  // Date validations
  if (convictionDate) {
    const sucDate = new Date(convictionDate)
    const today = new Date()
    
    if (sucDate > today) {
      errors.push('Mahkumiyet tarihi gelecekte olamaz.')
    }
    
    if (sucDate < new Date('1900-01-01')) {
      warnings.push('1900 öncesi mahkumiyet tarihi kontrol ediniz.')
    }
  }
  
  // Age validations
  const age = parseInt(form.age || 18)
  if (age < 12) {
    warnings.push('12 yaş altı için ayrı ceza infaz sistemi geçerlidir.')
  }
  
  if (age > 80) {
    warnings.push('Yaşlı hükümlüler için özel düzenlemeler bulunabilir.')
  }
  
  if (totalDays > 365 * 50) {
    warnings.push('50 yıl üzeri cezalar için müebbet olarak değerlendirilmelidir.')
  }
  
  return { errors, warnings, valid: errors.length === 0 }
}