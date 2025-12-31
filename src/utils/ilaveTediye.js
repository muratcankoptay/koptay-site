/**
 * İlave Tediye Hesaplama Modülü
 * 6772 Sayılı Kanun Kapsamında Kamu İşçileri İçin İlave Tediye Hesaplama
 * 
 * Güncelleme: 2026 Yılı Bordro Parametreleri
 */

// 2026 Yılı Bordro Sabitleri
export const ILAVE_TEDIYE_CONSTANTS = {
    // 2026 Asgari Ücret (01.01.2026 itibariyle)
    BRUT_ASGARI_UCRET: 33030.00,
    GUNLUK_ASGARI_UCRET: 1101.00, // 33030 / 30
    
    // SGK Parametreleri
    SGK_ISCI_PAYI_ORANI: 0.14,           // %14
    ISSIZLIK_SIGORTASI_ORANI: 0.01,      // %1
    SGK_TAVAN: 247725.00,                 // 2026 SGK Tavan (33.030 x 7,5)
    
    // Vergi Oranları
    DAMGA_VERGISI_ORANI: 0.00759,        // Binde 7,59
    
    // Gelir Vergisi Dilimleri (2026) - Tahmini, resmi açıklama ile güncellenecek
    VERGI_DILIMLERI: [
        { min: 0, max: 158000, oran: 0.15 },
        { min: 158000, max: 330000, oran: 0.20 },
        { min: 330000, max: 1200000, oran: 0.27 },
        { min: 1200000, max: 4300000, oran: 0.35 },
        { min: 4300000, max: Infinity, oran: 0.40 }
    ],
    
    // Asgari Ücret Vergi İstisnaları (2026 - hesaplanacak)
    ASGARI_UCRET_GELIR_VERGISI_ISTISNASI: 4207.05, // Tahmini
    ASGARI_UCRET_DAMGA_VERGISI_ISTISNASI: 250.60,  // Tahmini
    
    // İlave Tediye Gün Sayıları
    YILLIK_TEDIYE_GUN: 52,               // Yıllık toplam
    TAKSIT_GUN: 13,                       // Her taksit 13 gün
    TAKSIT_SAYISI: 4,                     // Yılda 4 taksit
    
    // Maden İşçileri İçin Ek Tediye
    MADEN_EK_TEDIYE_GUN: 26              // Yıllık ek 26 gün
};

/**
 * Vergi dilimini belirle
 * @param {number} kumulatifMatrah - Kümülatif gelir vergisi matrahı
 * @returns {number} Vergi oranı
 */
export const getVergiOrani = (kumulatifMatrah) => {
    for (const dilim of ILAVE_TEDIYE_CONSTANTS.VERGI_DILIMLERI) {
        if (kumulatifMatrah <= dilim.max) {
            return dilim.oran;
        }
    }
    return 0.40; // En yüksek oran
};

/**
 * Vergi dilimi adını getir
 * @param {number} oran - Vergi oranı
 * @returns {string} Dilim adı
 */
export const getVergiDilimiAdi = (oran) => {
    const oranYuzde = oran * 100;
    return `%${oranYuzde}`;
};

/**
 * Günlük brüt ücret hesapla
 * @param {number} aylikBrutUcret - Aylık brüt çıplak ücret
 * @returns {number} Günlük brüt ücret
 */
export const hesaplaGunlukBrutUcret = (aylikBrutUcret) => {
    return aylikBrutUcret / 30;
};

/**
 * Brüt tediye tutarını hesapla
 * @param {number} gunlukBrutUcret - Günlük brüt ücret
 * @param {number} gunSayisi - Tediye gün sayısı
 * @returns {number} Brüt tediye tutarı
 */
export const hesaplaBrutTediye = (gunlukBrutUcret, gunSayisi) => {
    return gunlukBrutUcret * gunSayisi;
};

/**
 * SGK ve İşsizlik kesintilerini hesapla
 * @param {number} brutTediye - Brüt tediye tutarı
 * @returns {Object} Kesinti detayları
 */
export const hesaplaSGKKesintileri = (brutTediye) => {
    const sgkIsciPayi = brutTediye * ILAVE_TEDIYE_CONSTANTS.SGK_ISCI_PAYI_ORANI;
    const issizlikSigortasi = brutTediye * ILAVE_TEDIYE_CONSTANTS.ISSIZLIK_SIGORTASI_ORANI;
    const toplamPrimKesintisi = sgkIsciPayi + issizlikSigortasi;
    
    return {
        sgkIsciPayi,
        issizlikSigortasi,
        toplamPrimKesintisi
    };
};

/**
 * Gelir vergisi hesapla
 * @param {number} matrah - Gelir vergisi matrahı
 * @param {number} vergiOrani - Uygulanacak vergi oranı
 * @returns {number} Gelir vergisi tutarı
 */
export const hesaplaGelirVergisi = (matrah, vergiOrani) => {
    return matrah * vergiOrani;
};

/**
 * Damga vergisi hesapla
 * @param {number} brutTediye - Brüt tediye tutarı
 * @returns {number} Damga vergisi tutarı
 */
export const hesaplaDamgaVergisi = (brutTediye) => {
    return brutTediye * ILAVE_TEDIYE_CONSTANTS.DAMGA_VERGISI_ORANI;
};

/**
 * Kıstelyevm (orantılı) hesaplama
 * @param {number} fiiliCalismaGun - Fiili çalışılan gün sayısı
 * @param {number} yillikTediyeGun - Yıllık tediye gün hakkı (default: 52)
 * @returns {number} Orantılı tediye gün sayısı
 */
export const hesaplaKistelyevm = (fiiliCalismaGun, yillikTediyeGun = 52) => {
    return (fiiliCalismaGun * yillikTediyeGun) / 365;
};

/**
 * Tam İlave Tediye Hesaplama
 * @param {Object} params - Hesaplama parametreleri
 * @param {number} params.aylikBrutUcret - Aylık brüt çıplak ücret
 * @param {number} params.gunSayisi - Tediye gün sayısı (13, 26, 39 veya 52)
 * @param {number} params.vergiOrani - Gelir vergisi oranı (0.15, 0.20, 0.27, 0.35, 0.40)
 * @param {boolean} params.madenIscisi - Maden işçisi mi? (ek 26 gün hakkı)
 * @param {number} params.fiiliCalismaGun - Kıstelyevm için fiili çalışma günü (opsiyonel)
 * @returns {Object} Detaylı hesaplama sonuçları
 */
export const hesaplaIlaveTediye = ({
    aylikBrutUcret,
    gunSayisi = 13,
    vergiOrani = 0.15,
    madenIscisi = false,
    fiiliCalismaGun = null
}) => {
    // Validasyonlar
    if (aylikBrutUcret < ILAVE_TEDIYE_CONSTANTS.BRUT_ASGARI_UCRET) {
        return {
            hata: true,
            mesaj: `Brüt ücret asgari ücretten (${ILAVE_TEDIYE_CONSTANTS.BRUT_ASGARI_UCRET.toLocaleString('tr-TR')} TL) düşük olamaz.`
        };
    }

    // Kıstelyevm hesabı varsa gün sayısını ayarla
    let hesaplananGunSayisi = gunSayisi;
    let kistelyevmUygulandı = false;
    
    if (fiiliCalismaGun && fiiliCalismaGun < 365) {
        const orantiliGun = hesaplaKistelyevm(fiiliCalismaGun, gunSayisi <= 13 ? 52 : gunSayisi);
        // Eğer tek taksit seçildiyse, orantılı hesap yap
        if (gunSayisi <= 13) {
            hesaplananGunSayisi = (fiiliCalismaGun * 13) / 365;
        } else {
            hesaplananGunSayisi = orantiliGun;
        }
        kistelyevmUygulandı = true;
    }

    // 1. Günlük Brüt Ücret
    const gunlukBrutUcret = hesaplaGunlukBrutUcret(aylikBrutUcret);
    
    // 2. Brüt Tediye Tutarı
    const brutTediye = hesaplaBrutTediye(gunlukBrutUcret, hesaplananGunSayisi);
    
    // 3. SGK Kesintileri
    const { sgkIsciPayi, issizlikSigortasi, toplamPrimKesintisi } = hesaplaSGKKesintileri(brutTediye);
    
    // 4. Gelir Vergisi Matrahı
    const gelirVergisiMatrahi = brutTediye - toplamPrimKesintisi;
    
    // 5. Gelir Vergisi
    const gelirVergisi = hesaplaGelirVergisi(gelirVergisiMatrahi, vergiOrani);
    
    // 6. Damga Vergisi
    const damgaVergisi = hesaplaDamgaVergisi(brutTediye);
    
    // 7. Toplam Kesinti
    const toplamKesinti = toplamPrimKesintisi + gelirVergisi + damgaVergisi;
    
    // 8. Net Tediye
    const netTediye = brutTediye - toplamKesinti;

    return {
        hata: false,
        girisVerileri: {
            aylikBrutUcret,
            gunSayisi: hesaplananGunSayisi,
            vergiOrani,
            vergiDilimi: getVergiDilimiAdi(vergiOrani),
            madenIscisi,
            kistelyevmUygulandı,
            fiiliCalismaGun
        },
        hesaplamalar: {
            gunlukBrutUcret,
            brutTediye,
            sgkIsciPayi,
            issizlikSigortasi,
            toplamPrimKesintisi,
            gelirVergisiMatrahi,
            gelirVergisi,
            damgaVergisi,
            toplamKesinti,
            netTediye
        },
        ozet: {
            brutTutar: brutTediye,
            kesintilerToplami: toplamKesinti,
            netTutar: netTediye
        }
    };
};

/**
 * Tüm Taksitleri Hesapla
 * @param {number} aylikBrutUcret - Aylık brüt çıplak ücret
 * @param {number} vergiOrani - Gelir vergisi oranı
 * @param {boolean} madenIscisi - Maden işçisi mi?
 * @returns {Object} Tüm taksitler ve yıllık toplam
 */
export const hesaplaTumTaksitler = (aylikBrutUcret, vergiOrani = 0.15, madenIscisi = false) => {
    const taksitler = [];
    let yillikToplamBrut = 0;
    let yillikToplamNet = 0;
    let yillikToplamKesinti = 0;

    // 4 taksit hesapla
    for (let i = 1; i <= 4; i++) {
        const taksit = hesaplaIlaveTediye({
            aylikBrutUcret,
            gunSayisi: 13,
            vergiOrani,
            madenIscisi: false
        });

        if (!taksit.hata) {
            taksitler.push({
                taksitNo: i,
                taksitAdi: `${i}. Taksit`,
                ...taksit.hesaplamalar
            });
            yillikToplamBrut += taksit.hesaplamalar.brutTediye;
            yillikToplamNet += taksit.hesaplamalar.netTediye;
            yillikToplamKesinti += taksit.hesaplamalar.toplamKesinti;
        }
    }

    // Maden işçisi ek tediyesi
    let madenEkTediye = null;
    if (madenIscisi) {
        const ekTediye = hesaplaIlaveTediye({
            aylikBrutUcret,
            gunSayisi: 26,
            vergiOrani,
            madenIscisi: true
        });
        
        if (!ekTediye.hata) {
            madenEkTediye = {
                taksitAdi: 'Maden İşçisi Ek Tediye (26 Gün)',
                ...ekTediye.hesaplamalar
            };
            yillikToplamBrut += ekTediye.hesaplamalar.brutTediye;
            yillikToplamNet += ekTediye.hesaplamalar.netTediye;
            yillikToplamKesinti += ekTediye.hesaplamalar.toplamKesinti;
        }
    }

    return {
        taksitler,
        madenEkTediye,
        yillikToplam: {
            brutTutar: yillikToplamBrut,
            kesintilerToplami: yillikToplamKesinti,
            netTutar: yillikToplamNet
        }
    };
};

/**
 * Format para birimi
 * @param {number} tutar - Tutar
 * @returns {string} Formatlanmış tutar
 */
export const formatTutar = (tutar) => {
    return tutar.toLocaleString('tr-TR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
};

export default {
    ILAVE_TEDIYE_CONSTANTS,
    hesaplaIlaveTediye,
    hesaplaTumTaksitler,
    hesaplaKistelyevm,
    getVergiOrani,
    formatTutar
};
