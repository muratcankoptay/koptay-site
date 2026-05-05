/**
 * İnfaz Yatar Hesap Motoru — 2026 Güncel
 *
 * Mevzuat dayanakları:
 *  - 5275 sayılı Ceza ve Güvenlik Tedbirlerinin İnfazına Dair Kanun
 *  - 647 sayılı (Mülga) Cezaların İnfazı Hakkında Kanun (01/06/2005 öncesi suçlarda lehe uygulama)
 *  - 5402 sayılı Denetimli Serbestlik Hizmetleri Kanunu
 *  - 3713 sayılı Terörle Mücadele Kanunu (m.17)
 *  - 7242 sayılı Kanun (5275 SK Geçici 6)
 *  - 7456 sayılı Kanun (5275 SK Geçici 10)
 *  - Açık Ceza İnfaz Kurumlarına Ayrılma Yönetmeliği
 *
 * Kaynak referans: Cumhuriyet Savcısı Utku Salih Dinçer — "İnfaz Hukuku Uygulamaları (Soru ve Yanıtlarla)"
 */

// ---------- SABITLER ----------

export const GECIS_TARIHLERI = Object.freeze({
  SK_5275_YURURLUK: '2005-06-01',     // 5275 SK yürürlük (öncesi 647 SK lehe)
  SK_5739_DEGISIM: '2008-03-01',       // Adli para çevrili hapiste KS kalktı
  YASA_108_9_DEGISIM: '2014-06-28',    // 108/9 öncesi 3/4 yerine 2/3
  GECICI_6: '2020-03-30',              // 7242 SK Geçici 6 milat
  GECICI_9_BITIS: '2022-05-31',        // Geçici 9/6 son uygulama
  GECICI_10: '2023-07-31',             // 7456 SK Geçici 10 kriter tarihi
});

export const ESIK = Object.freeze({
  CAGRI_KASTEN_GUN: 3 * 365,           // ≤3 yıl kasten → çağrı kağıdı, açık kurum
  CAGRI_TAKSIRLI_GUN: 5 * 365,         // ≤5 yıl taksirli → çağrı kağıdı, açık kurum
  ERTELEME_KASTEN_YIL: 3,              // 5275 SK 17 erteleme üst sınır
  ERTELEME_TAKSIRLI_YIL: 5,
});

// Koşullu salıverme oranlarına göre suç kategorileri
export const SUC_KATEGORILERI = Object.freeze([
  // 1/2 — Genel
  { kod: 'genel',                  label: 'Genel suçlar',                                                  oran: 1/2, istisna: '5275 SK 107/2 (genel kural)' },

  // 2/3 — 5275 SK 107/2 istisnaları
  { kod: 'kasten_oldurme',         label: 'Kasten öldürme (TCK 81, 82, 83)',                                oran: 2/3, istisna: '5275 SK 107/2' },
  { kod: 'agirlasmis_yaralama',    label: 'Neticesi sebebiyle ağırlaşmış yaralama (TCK 87/2-d)',            oran: 2/3, istisna: '5275 SK 107/2' },
  { kod: 'iskence_eziyet',         label: 'İşkence ve eziyet (TCK 94, 95, 96)',                             oran: 2/3, istisna: '5275 SK 107/2' },
  { kod: 'cinsel_saldiri_basit',   label: 'Cinsel saldırı – basit (TCK 102/1) / Cinsel taciz (TCK 105)',    oran: 2/3, istisna: '5275 SK 107/2' },
  { kod: 'resit_olmayanla_basit',  label: 'Reşit olmayanla cinsel ilişki – basit (TCK 104/1)',              oran: 2/3, istisna: '5275 SK 107/2' },
  { kod: 'ozel_hayat',             label: 'Özel hayata karşı suçlar (TCK 132–138)',                          oran: 2/3, istisna: '5275 SK 107/2' },
  { kod: 'devlet_sirlari',         label: 'Devlet sırlarına karşı suçlar / Casusluk (TCK 326–339)',           oran: 2/3, istisna: '5275 SK 107/2' },

  // 2/3 — 5275 SK 107/4 (örgüt)
  { kod: 'orgut',                  label: 'Suç işlemek için örgüt kurmak/yönetmek/üye olmak/örgüt faaliyeti (TCK 220 vb.)', oran: 2/3, istisna: '5275 SK 107/4' },

  // 2/3 — 5275 SK 108/1 (tekerrür)
  { kod: 'tekerrur',               label: 'Tekerrür uygulanan suç',                                          oran: 2/3, istisna: '5275 SK 108/1' },

  // 3/4 — 5275 SK 108/9
  { kod: 'nitelikli_cinsel',       label: 'Nitelikli cinsel saldırı (TCK 102/2)',                            oran: 3/4, istisna: '5275 SK 108/9' },
  { kod: 'cocuk_istismar',         label: 'Çocukların cinsel istismarı (TCK 103)',                           oran: 3/4, istisna: '5275 SK 108/9' },
  { kod: 'resit_olmayanla_nitelikli', label: 'Reşit olmayanla cinsel ilişki – nitelikli (TCK 104/2–3)',      oran: 3/4, istisna: '5275 SK 108/9' },
  { kod: 'uyusturucu_ticaret',     label: 'Uyuşturucu/uyarıcı madde imal ve ticareti (TCK 188)',             oran: 3/4, istisna: '5275 SK 108/9' },

  // 3/4 — 3713 SK 17 (terör)
  { kod: 'teror',                  label: 'Terör suçları (3713 sayılı Terörle Mücadele Kanunu kapsamı)',     oran: 3/4, istisna: '3713 SK 17' },
]);

// Geçici 6/1 istisna suçlar (kategoriye göre eşleştirme)
const GECICI_6_ISTISNA_KODLAR = new Set([
  'kasten_oldurme', 'agirlasmis_yaralama', 'iskence_eziyet',
  'cinsel_saldiri_basit', 'resit_olmayanla_basit',
  'nitelikli_cinsel', 'cocuk_istismar', 'resit_olmayanla_nitelikli',
  'uyusturucu_ticaret', 'orgut', 'teror',
]);

// Müebbet/Ağ.müebbet KS yılları
export const MUEBBET_KS_YIL = Object.freeze({
  GENEL:        { muebbet: 24, agirlastirilmis: 30 }, // 5275 SK 107/2
  ORGUT_TEROR:  { muebbet: 30, agirlastirilmis: 36 }, // 107/4 ve 3713 SK 17
});

export const AZAMI_KS_YIL = Object.freeze({
  SURELI_GENEL: 28,
  SURELI_ORGUT_TEKERRUR: 32,
  AGIRLASMIS_MUEBBET_BIRDEN_FAZLA: 36,
  AGIRLASMIS_MUEBBET_ORGUT: 40,
  MUEBBET_BIRDEN_FAZLA: 30,
  MUEBBET_ORGUT: 34,
});

// ---------- YARDIMCI FONKSIYONLAR ----------

export const yilAyGunToplam = (yil = 0, ay = 0, gun = 0) =>
  Math.max(0, Math.floor(Number(yil) || 0)) * 365
  + Math.max(0, Math.floor(Number(ay) || 0)) * 30
  + Math.max(0, Math.floor(Number(gun) || 0));

export const gunuYilAyGuneCevir = (toplamGun) => {
  const t = Math.max(0, Math.floor(Number(toplamGun) || 0));
  const yil = Math.floor(t / 365);
  const kalan1 = t - (yil * 365);
  const ay = Math.floor(kalan1 / 30);
  const gun = kalan1 - (ay * 30);
  return { yil, ay, gun };
};

export const formatYilAyGun = ({ yil, ay, gun }) => {
  const parcalar = [];
  if (yil) parcalar.push(`${yil} yıl`);
  if (ay) parcalar.push(`${ay} ay`);
  if (gun) parcalar.push(`${gun} gün`);
  return parcalar.length ? parcalar.join(' ') : '0 gün';
};

export const tarihEkle = (baslangicTarihi, eklenenGun) => {
  if (!baslangicTarihi) return null;
  const t = new Date(baslangicTarihi);
  if (Number.isNaN(t.getTime())) return null;
  t.setDate(t.getDate() + Math.floor(Number(eklenenGun) || 0));
  return t;
};

export const formatTarih = (date) => {
  if (!date) return '-';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  const gg = String(d.getDate()).padStart(2, '0');
  const aa = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${gg}.${aa}.${yyyy}`;
};

export const tarihKarsilastir = (a, b) => {
  const t1 = new Date(a).getTime();
  const t2 = new Date(b).getTime();
  if (Number.isNaN(t1) || Number.isNaN(t2)) return 0;
  return t1 < t2 ? -1 : t1 > t2 ? 1 : 0;
};

export const yasHesapla = (dogumTarihi, referansTarihi) => {
  if (!dogumTarihi || !referansTarihi) return null;
  const d = new Date(dogumTarihi);
  const r = new Date(referansTarihi);
  if (Number.isNaN(d.getTime()) || Number.isNaN(r.getTime())) return null;
  let yas = r.getFullYear() - d.getFullYear();
  const m = r.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && r.getDate() < d.getDate())) yas--;
  return yas;
};

export const sucKategorisiBul = (kod) =>
  SUC_KATEGORILERI.find(k => k.kod === kod) || SUC_KATEGORILERI[0];

// ---------- ORAN BELİRLEME ----------

/**
 * Hükümlünün suç türü, suç tarihi ve özel durumlarına göre koşullu salıvermeye
 * esas oranı belirler.
 *
 *  - Suç tarihinde çocuk ise 3/4 oranı 2/3'e çevrilir (PDF s.27 DİKKAT)
 *  - 108/9 kapsamı 28/06/2014 öncesi suçlara 2/3 uygulanır (PDF s.27 DİKKAT)
 */
export const kosulluSalivermeOraniBelirle = ({ sucKategoriKodu, sucTarihinde18AltindaMi, sucTarihi }) => {
  const kategori = sucKategorisiBul(sucKategoriKodu);
  let oran = kategori.oran;
  let aciklama = kategori.istisna;

  // 108/9 ve 28/06/2014 milat
  if (kategori.istisna === '5275 SK 108/9' && sucTarihi) {
    if (tarihKarsilastir(sucTarihi, GECIS_TARIHLERI.YASA_108_9_DEGISIM) < 0) {
      oran = 2/3;
      aciklama = `${kategori.istisna} (28/06/2014 öncesi suç → 2/3 uygulanır)`;
    }
  }

  // Çocuk hükümlü: 3/4 → 2/3
  if (sucTarihinde18AltindaMi && oran === 3/4) {
    oran = 2/3;
    aciklama = `${aciklama} (suç tarihinde çocuk → 2/3 uygulanır)`;
  }

  return { oran, aciklama, kategori };
};

// ---------- KOŞULLU SALIVERME SÜRESİ HESAPLAMA ----------

/**
 * 647 sayılı (mülga) Kanun lehe uygulama hesabı (1 Haziran 2005 öncesi suçlar):
 *   - Genel: bakiye = (toplam/2) - (bakiye_ay × 6 gün)
 *   - Terör (3/4): bakiye = toplam × 3/4 (ek 2 indirimi YOK)
 */
const ks647SkHesapla = (toplamGun, terorMu) => {
  if (terorMu) {
    return Math.ceil(toplamGun * 3 / 4);
  }
  const yarisi = Math.floor(toplamGun / 2);
  const bakiyeAy = Math.floor(yarisi / 30);
  const ekIndirim = bakiyeAy * 6;
  return Math.max(0, yarisi - ekIndirim);
};

/**
 * Süreli hapis cezası için koşullu salıvermeye esas süreyi gün cinsinden hesaplar.
 */
export const ksSureSureliHapis = ({ toplamCezaGun, sucKategoriKodu, sucTarihinde18AltindaMi, sucTarihi, lehe647Uygula }) => {
  const { oran, kategori } = kosulluSalivermeOraniBelirle({ sucKategoriKodu, sucTarihinde18AltindaMi, sucTarihi });

  // 1 Haziran 2005 öncesi suç + lehe 647 SK
  if (lehe647Uygula && sucTarihi && tarihKarsilastir(sucTarihi, GECIS_TARIHLERI.SK_5275_YURURLUK) < 0) {
    const terorMu = kategori.kod === 'teror';
    return {
      ksGun: ks647SkHesapla(toplamCezaGun, terorMu),
      kullanilanOran: terorMu ? '3/4 (647 SK + Ek 2 yok)' : '1/2 + ayda 6 gün ek indirim (647 SK 19 ve Ek 2)',
      mevzuat: terorMu ? '3713 SK 17' : '647 SK 19 ve Ek 2',
    };
  }

  return {
    ksGun: Math.ceil(toplamCezaGun * oran),
    kullanilanOran: `${formatOran(oran)}`,
    mevzuat: kategori.istisna,
  };
};

const formatOran = (oran) => {
  if (Math.abs(oran - 1/2) < 0.001) return '1/2';
  if (Math.abs(oran - 2/3) < 0.001) return '2/3';
  if (Math.abs(oran - 3/4) < 0.001) return '3/4';
  return oran.toFixed(3);
};

// ---------- ÇOCUK MAHSUBU ----------

/**
 * Çocuk mahsubu (5275 SK 107/5 ve Geçici 6/4):
 *   - 107/5: 15 yaşına kadar 1 gün = 2 gün
 *   - Geçici 6/4 (30/03/2020 öncesi suçlar): 15 yaşa kadar 1 gün = 3 gün, 18 yaşa kadar 1 gün = 2 gün
 */
export const cocukMahsubuHesapla = ({ tutukluGunSayisi = 0, sucTarihi, dogumTarihi, sucMahsupBaslangic }) => {
  if (!tutukluGunSayisi || !dogumTarihi || !sucTarihi) {
    return { ekMahsupGun: 0, aciklama: 'Çocuk mahsubu uygulanmadı' };
  }

  const yas = yasHesapla(dogumTarihi, sucMahsupBaslangic || sucTarihi);
  if (yas === null || yas >= 18) {
    return { ekMahsupGun: 0, aciklama: 'Hükümlü 18 yaşından büyük — çocuk mahsubu uygulanmaz' };
  }

  // Geçici 6/4 (30/03/2020 öncesi suçlar)
  if (tarihKarsilastir(sucTarihi, GECIS_TARIHLERI.GECICI_6) < 0) {
    if (yas < 15) {
      // 1 gün = 3 gün → ek 2 gün
      return {
        ekMahsupGun: tutukluGunSayisi * 2,
        aciklama: `Geçici 6/4: 15 yaş altı için 1 gün = 3 gün sayılır (${tutukluGunSayisi} × 2 = ${tutukluGunSayisi * 2} gün ek mahsup)`,
      };
    }
    // 15-18 yaş arası → 1 gün = 2 gün → ek 1 gün
    return {
      ekMahsupGun: tutukluGunSayisi,
      aciklama: `Geçici 6/4: 18 yaş altı için 1 gün = 2 gün sayılır (${tutukluGunSayisi} × 1 = ${tutukluGunSayisi} gün ek mahsup)`,
    };
  }

  // 30/03/2020 sonrası → sadece 5275 SK 107/5 (15 yaş altı)
  if (yas < 15) {
    return {
      ekMahsupGun: tutukluGunSayisi,
      aciklama: `5275 SK 107/5: 15 yaş altı için 1 gün = 2 gün sayılır (${tutukluGunSayisi} × 1 = ${tutukluGunSayisi} gün ek mahsup)`,
    };
  }

  return { ekMahsupGun: 0, aciklama: 'Suç tarihinde 15 yaş üstü — ek çocuk mahsubu yok' };
};

// ---------- DENETİMLİ SERBESTLİK ----------

/**
 * 5275 SK 105/A — denetimli serbestlik tedbiri uygulanmak suretiyle infaz.
 *
 * Genel kural: KS'ye 1 yıl veya daha az süre kalmış olmak.
 * İstisnalar:
 *   - 0-6 yaş çocuğu olan kadın hükümlüler: 2 yıl
 *   - Ağır hastalık/engellilik/koca nedeniyle hayatını yalnız idame ettiremeyenler: 3 yıl
 *
 * Geçici 6/1 (7242 SK): 30/03/2020 öncesi işlenen ve istisna olmayan suçlarda 3 yıl
 * Geçici 10/6 (7456 SK): 31/07/2023 itibariyle kapalıda olanlar için ek 3 yıl avantaj
 */
export const denetimliSerbestlikSureBelirle = ({ sucTarihi, sucKategoriKodu, ozelDurum, gecici10Uygula }) => {
  let suregun = 365; // Genel: 1 yıl
  let aciklama = '5275 SK 105/A: koşullu salıvermeye 1 yıl kala denetime geçilir.';

  // Özel durumlar
  if (ozelDurum === 'kadin_0_6_cocuk') {
    suregun = 2 * 365;
    aciklama = '5275 SK 105/A: 0-6 yaş çocuğu olan kadın hükümlü → KS\'ye 2 yıl kala denetim.';
  } else if (ozelDurum === 'agir_hastalik') {
    suregun = 3 * 365;
    aciklama = '5275 SK 105/A: ağır hastalık/engellilik nedeniyle hayatını yalnız idame ettiremeyen → KS\'ye 3 yıl kala denetim.';
  }

  // Geçici 6/1 (30/03/2020 öncesi + istisna olmayan suç)
  if (sucTarihi && tarihKarsilastir(sucTarihi, GECIS_TARIHLERI.GECICI_6) < 0
      && !GECICI_6_ISTISNA_KODLAR.has(sucKategoriKodu)) {
    if (suregun < 3 * 365) {
      suregun = 3 * 365;
      aciklama = '7242 SK Geçici 6/1: 30/03/2020 öncesi suç ve istisna kapsamında olmadığı için → KS\'ye 3 yıl kala denetim.';
    }
  }

  // Geçici 10/6: 31/07/2023'te kapalıda + istisna olmayan suç
  if (gecici10Uygula && !GECICI_6_ISTISNA_KODLAR.has(sucKategoriKodu)) {
    suregun += 3 * 365;
    aciklama += ' Ayrıca 7456 SK Geçici 10/6 ile 3 yıl ek erken denetim.';
  }

  return { denetimGun: suregun, aciklama };
};

// ---------- AÇIĞA AYRILMA SÜRESİ ----------

/**
 * Açık ceza infaz kurumuna geçiş tarihi.
 * Açık Ceza İnfaz Kurumlarına Ayrılma Yönetmeliği:
 *   - Toplam ceza < 10 yıl → 1/10 kapalıda
 *   - Toplam ceza ≥ 10 yıl → 1/3 kapalıda
 *   - Geçici 10/6: 10 yıldan az 1 ay, 10+ yıl 3 ay kapalıda + 3 yıl erken açığa
 *
 * Direkt açık (ilk girişten):
 *   - Toplam ceza ≤ 3 yıl (kasten) veya ≤ 5 yıl (taksirli)
 *   - Adli para cezasından çevrili hapis
 *   - İİK tazyik hapsi
 */
export const acigaCikmaHesapla = ({ toplamCezaGun, sucKategoriKodu, taksirliMi, gecici10Uygula }) => {
  // Daima kapalıda kalanlar
  const dailyKapali = ['orgut', 'teror', 'nitelikli_cinsel', 'cocuk_istismar', 'resit_olmayanla_nitelikli'];
  if (dailyKapali.includes(sucKategoriKodu)) {
    return {
      kapaliGun: Math.floor(toplamCezaGun / 3),
      direktAcik: false,
      aciklama: `${sucKategorisiBul(sucKategoriKodu).label} → yüksek güvenlikli rejim, toplam cezanın 1/3'ü kapalıda geçirilir.`,
    };
  }

  // Direkt açık (≤3 yıl kasten veya ≤5 yıl taksirli)
  const direktAcikEsik = taksirliMi ? 5 * 365 : 3 * 365;
  if (toplamCezaGun <= direktAcikEsik) {
    return {
      kapaliGun: 0,
      direktAcik: true,
      aciklama: `Toplam ceza ${taksirliMi ? '5 yıldan az (taksirli)' : '3 yıldan az (kasten)'} → doğrudan açık ceza infaz kurumuna alınır.`,
    };
  }

  // Geçici 10/6 — 31/07/2023'te kapalıda olan istisna olmayan hükümlüler
  if (gecici10Uygula && !GECICI_6_ISTISNA_KODLAR.has(sucKategoriKodu)) {
    const onYil = 10 * 365;
    const kapaliGun = toplamCezaGun < onYil ? 30 : 90;
    return {
      kapaliGun,
      direktAcik: false,
      aciklama: `7456 SK Geçici 10/6: ${toplamCezaGun < onYil ? '10 yıldan az ceza için 1 ay' : '10 yıl ve üzeri ceza için 3 ay'} kapalıda kalınır + 3 yıl erken açığa ayrılma.`,
    };
  }

  // Genel kural
  const onYil = 10 * 365;
  if (toplamCezaGun < onYil) {
    return {
      kapaliGun: Math.floor(toplamCezaGun / 10),
      direktAcik: false,
      aciklama: 'Toplam ceza 10 yıldan az → 1/10\'u kapalıda geçirilir (Açığa Ayrılma Yönetmeliği 6).',
    };
  }
  return {
    kapaliGun: Math.floor(toplamCezaGun / 3),
    direktAcik: false,
    aciklama: 'Toplam ceza 10 yıl ve üstü → 1/3\'ü kapalıda geçirilir (Açığa Ayrılma Yönetmeliği 6).',
  };
};

// ---------- ANA HESAPLAMA ----------

/**
 * Süreli hapis cezası için tam infaz hesabı.
 *
 * @param {object} input
 * @param {number} input.cezaYil
 * @param {number} input.cezaAy
 * @param {number} input.cezaGun
 * @param {string} input.sucTarihi          ISO tarih
 * @param {string} input.sucKategoriKodu    SUC_KATEGORILERI içindeki kod
 * @param {boolean} input.taksirliMi
 * @param {string|null} input.dogumTarihi   ISO tarih (opsiyonel — çocuk mahsubu için)
 * @param {number} input.tutukluGun         tutukluluk/gözaltı toplam gün
 * @param {string|null} input.cezaevineGirisTarihi  ISO tarih
 * @param {string} input.ozelDurum          'normal' | 'kadin_0_6_cocuk' | 'agir_hastalik'
 * @param {boolean} input.gecici10Uygula    31/07/2023'te kapalıda mı (Geçici 10/6)
 * @param {boolean} input.lehe647Uygula     01/06/2005 öncesi suçlarda lehe 647 SK uygula
 *
 * @returns {object} { ksGun, ksTarih, hakEderekTahliyeTarih, denetimSure, denetimBaslangicTarih,
 *                     acikGun, acikGirisTarih, kapaliGun, mahsupGun, ozet, adimlar, uyarilar }
 */
export const hesapla = (input) => {
  const {
    cezaYil = 0, cezaAy = 0, cezaGun = 0,
    sucTarihi,
    sucKategoriKodu = 'genel',
    taksirliMi = false,
    dogumTarihi = null,
    tutukluGun = 0,
    cezaevineGirisTarihi = null,
    ozelDurum = 'normal',
    gecici10Uygula = false,
    lehe647Uygula = true,
  } = input;

  const adimlar = [];
  const uyarilar = [];

  // 1) Toplam ceza günü
  const toplamCezaGun = yilAyGunToplam(cezaYil, cezaAy, cezaGun);
  if (toplamCezaGun <= 0) {
    return { hata: 'Geçerli bir ceza miktarı giriniz.' };
  }
  adimlar.push({
    baslik: '1) Toplam ceza miktarı',
    metin: `${cezaYil} yıl ${cezaAy} ay ${cezaGun} gün = ${toplamCezaGun} gün`,
  });

  // 2) Kategori ve oran
  const yas = dogumTarihi && sucTarihi ? yasHesapla(dogumTarihi, sucTarihi) : null;
  const sucTarihinde18AltindaMi = yas !== null && yas < 18;
  const ks = ksSureSureliHapis({
    toplamCezaGun, sucKategoriKodu, sucTarihinde18AltindaMi, sucTarihi, lehe647Uygula,
  });
  adimlar.push({
    baslik: '2) Koşullu salıvermeye esas süre',
    metin: `Suç türü: ${sucKategorisiBul(sucKategoriKodu).label}. Uygulanan oran: ${ks.kullanilanOran} (${ks.mevzuat}). KS'ye esas süre: ${toplamCezaGun} gün × oran = ${ks.ksGun} gün (${formatYilAyGun(gunuYilAyGuneCevir(ks.ksGun))}).`,
  });

  // 3) Çocuk mahsubu
  const cocuk = cocukMahsubuHesapla({
    tutukluGunSayisi: tutukluGun,
    sucTarihi,
    dogumTarihi,
    sucMahsupBaslangic: sucTarihi,
  });

  // 4) Tutukluluk + çocuk mahsubu
  const toplamMahsupGun = (Number(tutukluGun) || 0) + (cocuk.ekMahsupGun || 0);
  const ksGunMahsupSonrasi = Math.max(0, ks.ksGun - toplamMahsupGun);
  if (toplamMahsupGun > 0) {
    adimlar.push({
      baslik: '3) Mahsup (TCK 63 + 5275 SK 107/5 / Geçici 6/4)',
      metin: `Tutukluluk/gözaltı: ${tutukluGun} gün${cocuk.ekMahsupGun > 0 ? `; ${cocuk.aciklama}` : ''}. Toplam mahsup: ${toplamMahsupGun} gün. KS'ye esas net süre: ${ks.ksGun} − ${toplamMahsupGun} = ${ksGunMahsupSonrasi} gün.`,
    });
  }

  // 5) Denetimli serbestlik süresi
  const denetim = denetimliSerbestlikSureBelirle({
    sucTarihi, sucKategoriKodu, ozelDurum, gecici10Uygula,
  });
  // Denetim, KS süresinden büyük olamaz (toplam ks içinden çıkar)
  const denetimGun = Math.min(denetim.denetimGun, ksGunMahsupSonrasi);
  adimlar.push({
    baslik: '4) Denetimli serbestlik (5275 SK 105/A)',
    metin: `${denetim.aciklama} Hükümlü cezasının son ${denetimGun} gününü (${formatYilAyGun(gunuYilAyGuneCevir(denetimGun))}) denetimli serbestlik tedbiri altında geçirir.`,
  });

  // 6) Açığa ayrılma
  // Yönetmelik 6: kapalıda geçirilmesi gereken minimum süre toplam ceza üzerinden hesaplanır.
  // Tutukluluk zaten kapalıda geçirildiği için minimum süreden mahsup edilir.
  const acikSonuc = acigaCikmaHesapla({
    toplamCezaGun, sucKategoriKodu, taksirliMi, gecici10Uygula,
  });
  const kapaliMinimum = acikSonuc.kapaliGun;
  const kapaliEkGun = acikSonuc.direktAcik
    ? 0
    : Math.max(0, Math.min(kapaliMinimum - (Number(tutukluGun) || 0), ksGunMahsupSonrasi - denetimGun));
  const acikGun = Math.max(0, ksGunMahsupSonrasi - kapaliEkGun - denetimGun);
  const kapaliGun = kapaliEkGun;
  adimlar.push({
    baslik: '5) İlk infaz kurumu (Açığa Ayrılma Yönetmeliği)',
    metin: `${acikSonuc.aciklama} Yönetmelik gereği kapalıda geçirilmesi gereken minimum süre: ${kapaliMinimum} gün${tutukluGun > 0 ? ` (tutukluluk ${tutukluGun} gün kapalıda sayılır)` : ''}. Cezaevine girişten itibaren ek kapalı süre: ${kapaliGun} gün (${formatYilAyGun(gunuYilAyGuneCevir(kapaliGun))}); ardından açıkta: ${acikGun} gün (${formatYilAyGun(gunuYilAyGuneCevir(acikGun))}).`,
  });

  // 7) Tarihler (cezaevine giriş varsa)
  let ksTarih = null, denetimBaslangicTarih = null, acikGirisTarih = null, hakEderekTahliyeTarih = null;
  if (cezaevineGirisTarihi) {
    // Hak ederek tahliye = cezaevine giriş + (toplam ceza - mahsup)
    const hakEderekGun = Math.max(0, toplamCezaGun - toplamMahsupGun);
    hakEderekTahliyeTarih = tarihEkle(cezaevineGirisTarihi, hakEderekGun);
    // KS = giriş + ks (mahsup düşülmüş)
    ksTarih = tarihEkle(cezaevineGirisTarihi, ksGunMahsupSonrasi);
    // Denetim başlangıç = KS - denetim süresi
    denetimBaslangicTarih = tarihEkle(cezaevineGirisTarihi, ksGunMahsupSonrasi - denetimGun);
    // Açığa giriş = giriş + kapalı süresi
    acikGirisTarih = tarihEkle(cezaevineGirisTarihi, kapaliGun);
  }

  // Uyarılar
  if (sucKategoriKodu === 'tekerrur') {
    uyarilar.push('Tekerrür halinde 5275 SK 108/1 gereği eklenecek miktar, tekerrüre esas alınan cezaların en ağırını geçemez.');
  }
  if (lehe647Uygula && sucTarihi && tarihKarsilastir(sucTarihi, GECIS_TARIHLERI.SK_5275_YURURLUK) < 0) {
    uyarilar.push('Suç tarihi 01/06/2005 öncesidir; TCK 7/3 lehe uygulama ilkesi gereği 647 sayılı (mülga) Kanun hükümleri uygulandı.');
  }
  if (gecici10Uygula) {
    uyarilar.push('7456 SK Geçici 10/6 avantajı uygulandı; bu avantaj, ihaleye girdiği istisnalar dışında 31/07/2023 itibariyle kapalı kurumda bulunan hükümlüler için geçerlidir.');
  }
  if (sucKategoriKodu === 'orgut' || sucKategoriKodu === 'teror') {
    uyarilar.push('Örgüt veya terör suçu hükümlüleri ceza süresine bakılmaksızın kapalı ceza infaz kurumuna alınır.');
  }

  return {
    toplamCezaGun,
    ks: {
      oran: ks.kullanilanOran,
      mevzuat: ks.mevzuat,
      ksGunBrut: ks.ksGun,
      ksGunNet: ksGunMahsupSonrasi,
      ksTarih: ksTarih ? formatTarih(ksTarih) : null,
    },
    mahsup: {
      tutukluGun,
      cocukMahsupGun: cocuk.ekMahsupGun,
      cocukAciklama: cocuk.aciklama,
      toplamMahsupGun,
    },
    denetim: {
      gun: denetimGun,
      yilAyGun: gunuYilAyGuneCevir(denetimGun),
      baslangicTarih: denetimBaslangicTarih ? formatTarih(denetimBaslangicTarih) : null,
      aciklama: denetim.aciklama,
    },
    kurum: {
      kapaliGun,
      kapaliYilAyGun: gunuYilAyGuneCevir(kapaliGun),
      acikGun,
      acikYilAyGun: gunuYilAyGuneCevir(acikGun),
      acikGirisTarih: acikGirisTarih ? formatTarih(acikGirisTarih) : null,
      direktAcik: acikSonuc.direktAcik,
      aciklama: acikSonuc.aciklama,
    },
    hakEderekTahliyeTarih: hakEderekTahliyeTarih ? formatTarih(hakEderekTahliyeTarih) : null,
    adimlar,
    uyarilar,
    ozet: {
      kapaliFormat: formatYilAyGun(gunuYilAyGuneCevir(kapaliGun)),
      acikFormat: formatYilAyGun(gunuYilAyGuneCevir(acikGun)),
      denetimFormat: formatYilAyGun(gunuYilAyGuneCevir(denetimGun)),
      ksFormat: formatYilAyGun(gunuYilAyGuneCevir(ksGunMahsupSonrasi)),
    },
  };
};

// ---------- MÜEBBET HESAPLAMA ----------

/**
 * Müebbet ve ağırlaştırılmış müebbet hapis cezalarında koşullu salıverme süresi.
 */
export const muebbetHesapla = ({ muebbetTuru, sucKategoriKodu = 'genel', cezaevineGirisTarihi = null, tutukluGun = 0 }) => {
  // 5275 SK 107/16: TCK 2.kitap 4.kısım 4-5-6.bölüm + ağ. müebbet → KS yok
  // Bu programatik kontrol yerine kullanıcıya uyarı olarak veriyoruz
  const orgutVeyaTeror = sucKategoriKodu === 'orgut' || sucKategoriKodu === 'teror';
  const ksYil = muebbetTuru === 'agirlastirilmis'
    ? (orgutVeyaTeror ? MUEBBET_KS_YIL.ORGUT_TEROR.agirlastirilmis : MUEBBET_KS_YIL.GENEL.agirlastirilmis)
    : (orgutVeyaTeror ? MUEBBET_KS_YIL.ORGUT_TEROR.muebbet : MUEBBET_KS_YIL.GENEL.muebbet);

  const ksGun = ksYil * 365 - (Number(tutukluGun) || 0);
  let ksTarih = null;
  if (cezaevineGirisTarihi) ksTarih = tarihEkle(cezaevineGirisTarihi, ksGun);

  return {
    muebbetTuru,
    ksYil,
    ksGun,
    ksTarih: ksTarih ? formatTarih(ksTarih) : null,
    aciklama: muebbetTuru === 'agirlastirilmis'
      ? `Ağırlaştırılmış müebbet hapis cezasında koşullu salıverme süresi ${ksYil} yıldır${orgutVeyaTeror ? ' (örgüt veya terör suçu nedeniyle artırılmış)' : ''}.`
      : `Müebbet hapis cezasında koşullu salıverme süresi ${ksYil} yıldır${orgutVeyaTeror ? ' (örgüt veya terör suçu nedeniyle artırılmış)' : ''}.`,
    uyarilar: [
      muebbetTuru === 'agirlastirilmis'
        ? '5275 SK 107/16: TCK 2. kitap 4. kısım 4, 5 ve 6. bölümlerde yer alan suçlardan ağırlaştırılmış müebbet hapis cezasına mahkum olanlar hakkında koşullu salıverme uygulanmaz.'
        : null,
      'Müebbet hapis hükümlüleri için ek hastalık erteleme, koşullu salıvermeye 2 yıl kala denetim (0-6 yaş çocuklu kadın) gibi özel düzenlemeler uygulanabilir.',
    ].filter(Boolean),
  };
};

// ---------- DAVA-PLAN VALIDASYONU ----------

export const validateInput = (input) => {
  const errs = [];
  const toplam = yilAyGunToplam(input.cezaYil, input.cezaAy, input.cezaGun);
  if (toplam <= 0) errs.push('Ceza miktarı sıfırdan büyük olmalıdır.');
  if (!input.sucTarihi) errs.push('Suç tarihi seçilmelidir.');
  if (input.dogumTarihi && input.sucTarihi
      && tarihKarsilastir(input.dogumTarihi, input.sucTarihi) > 0) {
    errs.push('Doğum tarihi suç tarihinden sonra olamaz.');
  }
  if (input.cezaevineGirisTarihi && input.sucTarihi
      && tarihKarsilastir(input.cezaevineGirisTarihi, input.sucTarihi) < 0) {
    errs.push('Cezaevine giriş tarihi suç tarihinden önce olamaz.');
  }
  if (Number(input.tutukluGun) < 0) errs.push('Tutukluluk gün sayısı negatif olamaz.');
  return errs;
};

export default {
  SUC_KATEGORILERI,
  GECIS_TARIHLERI,
  MUEBBET_KS_YIL,
  AZAMI_KS_YIL,
  ESIK,
  yilAyGunToplam,
  gunuYilAyGuneCevir,
  formatYilAyGun,
  formatTarih,
  yasHesapla,
  sucKategorisiBul,
  kosulluSalivermeOraniBelirle,
  ksSureSureliHapis,
  cocukMahsubuHesapla,
  denetimliSerbestlikSureBelirle,
  acigaCikmaHesapla,
  hesapla,
  muebbetHesapla,
  validateInput,
};
