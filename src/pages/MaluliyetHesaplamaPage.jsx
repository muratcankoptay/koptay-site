import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HesaplamaDisclaimer from '../components/HesaplamaDisclaimer';
import { FaUserInjured, FaCalculator, FaInfoCircle, FaArrowRight, FaArrowLeft, FaCheck, FaTrash, FaRedo, FaCopy, FaExclamationTriangle } from 'react-icons/fa';

/* =========================================================================
   Ek-2 cetveli çapa (anchor) değerleri ve rehberli sihirbaz veri ağacı.
   Kaynak: Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik
   (R.G. 20.02.2019/30692), Ek-2 Engel Oranları Cetveli.
   exact:true  -> cetvelde sabit (kesin) oran
   min/max/val -> ölçüme dayalı (tahmini aralık + orta değer)
   ========================================================================= */
const R = (o) => Object.assign({ exact: false, note: '' }, o);
const P_UEAMP = 248, P_LEAMP = 268, P_SPINE = 215, P_ROM_UE = '226-247', P_ROM_LE = '255-267',
  P_VISION = '148-177', P_EAR = '116-130', P_NERVE = '200-214', P_BURN = '197-199', P_ORG = '189-196';

const NODES = {
  kol: {
    q: 'Kol, omuz, dirsek, el bileği veya elinizde ne oldu?', help: 'Size en uygun seçeneği işaretleyin.', opts: [
      { label: 'Uzuv koptu / ameliyatla alındı (ampütasyon)', emo: '✂️', go: 'kol_amp' },
      { label: 'Kemik kırığı oldu', emo: '🦴', go: 'kol_part' },
      { label: 'Eklemde çıkık / kalıcı hareket kısıtlılığı', emo: '🦾', go: 'kol_part' },
      { label: 'Sinir hasarı (his veya kuvvet kaybı)', emo: '⚡', go: 'kol_nerve' },
      { label: 'Bilmiyorum / listede yok', emo: '❓', go: 'manual' }]
  },
  kol_amp: {
    q: 'Kopma / ampütasyon hangi düzeyde?', help: 'En yakın seçenek yeterli.', opts: [
      { label: 'Omuzdan (tüm kol)', sub: 'Omuz dezartikülasyonu / üst kol', go: R({ desc: 'Kol ampütasyonu – omuz düzeyi', exact: true, val: 60, page: P_UEAMP, sec: 'Üst ekstremite ampütasyonu (Tablo 2.7)' }) },
      { label: 'Kol ortasından', sub: 'Dirsek üstü', go: R({ desc: 'Kol ampütasyonu – kol ortası', exact: true, val: 57, page: P_UEAMP, sec: 'Tablo 2.7' }) },
      { label: 'Ön kol / el bileği düzeyinden', go: R({ desc: 'Ön kol/el ampütasyonu', exact: true, val: 56, page: P_UEAMP, sec: 'Tablo 2.7' }) },
      { label: 'Tüm el (bütün parmaklar dahil)', go: R({ desc: 'El ampütasyonu (tüm parmaklar)', exact: true, val: 54, page: P_UEAMP, sec: 'Tablo 2.7' }) },
      { label: 'Başparmak', go: R({ desc: 'Başparmak ampütasyonu', exact: true, val: 22, page: P_UEAMP, sec: 'Tablo 2.7' }) },
      { label: 'İşaret veya orta parmak', go: R({ desc: 'İşaret/orta parmak ampütasyonu', exact: true, val: 11, page: P_UEAMP, sec: 'Tablo 2.7' }) },
      { label: 'Yüzük veya küçük parmak', go: R({ desc: 'Yüzük/küçük parmak ampütasyonu', exact: true, val: 5, page: P_UEAMP, sec: 'Tablo 2.7' }) }]
  },
  kol_part: {
    q: 'Etkilenen bölge neresi?', opts: [
      { label: 'Omuz / üst kol', go: 'sev_omuz' },
      { label: 'Dirsek', go: 'sev_dirsek' },
      { label: 'El bileği / ön kol', go: 'sev_elbilek' },
      { label: 'El / parmaklar', go: 'sev_el' }]
  },
  kol_nerve: {
    q: 'Sinir hasarı kolu ne kadar etkiliyor?', help: 'Günlük yaşamdaki etkisine göre seçin.', opts: [
      { label: 'Hafif – ara sıra uyuşma/karıncalanma', go: R({ desc: 'Kol sinir hasarı (hafif)', min: 2, max: 10, val: 5, page: P_NERVE, sec: 'Periferik sinir bozuklukları' }) },
      { label: 'Orta – belirgin kuvvet/his kaybı', go: R({ desc: 'Kol sinir hasarı (orta)', min: 10, max: 30, val: 18, page: P_NERVE, sec: 'Periferik sinir bozuklukları' }) },
      { label: 'Ağır – elini/kolunu kullanamıyor', go: R({ desc: 'Kol sinir hasarı (ağır)', min: 30, max: 55, val: 40, page: P_NERVE, sec: 'Periferik sinir bozuklukları' }) }]
  },

  bacak: {
    q: 'Bacak, kalça, diz, ayak bileği veya ayağınızda ne oldu?', opts: [
      { label: 'Uzuv koptu / ameliyatla alındı (ampütasyon)', emo: '✂️', go: 'bacak_amp' },
      { label: 'Kemik kırığı oldu', emo: '🦴', go: 'bacak_part' },
      { label: 'Eklemde çıkık / kalıcı hareket kısıtlılığı', emo: '🦵', go: 'bacak_part' },
      { label: 'Sinir hasarı (his veya kuvvet kaybı)', emo: '⚡', go: 'bacak_nerve' },
      { label: 'Bilmiyorum / listede yok', emo: '❓', go: 'manual' }]
  },
  bacak_amp: {
    q: 'Kopma / ampütasyon hangi düzeyde?', opts: [
      { label: 'Leğen kemiğiyle birlikte (hemipelvektomi)', sub: 'En üst düzey', go: R({ desc: 'Bacak ampütasyonu – hemipelvektomi', exact: true, val: 65, page: P_LEAMP, sec: 'Alt ekstremite ampütasyonu (Tablo 3.30)' }) },
      { label: 'Kalçadan (tüm bacak)', sub: 'Kalça dezartikülasyonu', go: R({ desc: 'Bacak ampütasyonu – kalça düzeyi', exact: true, val: 50, page: P_LEAMP, sec: 'Tablo 3.30' }) },
      { label: 'Uyluktan (diz üstü)', go: R({ desc: 'Bacak ampütasyonu – diz üstü', exact: true, val: 50, page: P_LEAMP, sec: 'Tablo 3.30' }) },
      { label: 'Diz düzeyinden', sub: 'Diz dezartikülasyonu', go: R({ desc: 'Bacak ampütasyonu – diz', exact: true, val: 45, page: P_LEAMP, sec: 'Tablo 3.30' }) },
      { label: 'Baldırdan (diz altı)', go: R({ desc: 'Bacak ampütasyonu – diz altı', exact: true, val: 43, page: P_LEAMP, sec: 'Tablo 3.30' }) },
      { label: 'Ayak bileğinden (Syme)', go: R({ desc: 'Ayak ampütasyonu – ayak bileği (Syme)', exact: true, val: 38, page: P_LEAMP, sec: 'Tablo 3.30' }) },
      { label: 'Ayak ortasından (Chopart)', go: R({ desc: 'Ayak ortası ampütasyonu', exact: true, val: 31, page: P_LEAMP, sec: 'Tablo 3.30' }) },
      { label: 'Tüm ayak parmakları', go: R({ desc: 'Tüm ayak parmakları ampütasyonu', exact: true, val: 11, page: P_LEAMP, sec: 'Tablo 3.30' }) },
      { label: 'Ayak başparmağı', go: R({ desc: 'Ayak başparmağı ampütasyonu', exact: true, val: 6, page: P_LEAMP, sec: 'Tablo 3.30' }) }]
  },
  bacak_part: {
    q: 'Etkilenen bölge neresi?', opts: [
      { label: 'Kalça / uyluk', go: 'sev_kalca' },
      { label: 'Diz', go: 'sev_diz' },
      { label: 'Ayak bileği / baldır', go: 'sev_aybilek' },
      { label: 'Ayak / parmaklar', go: 'sev_ayak' }]
  },
  bacak_nerve: {
    q: 'Sinir hasarı bacağı ne kadar etkiliyor?', opts: [
      { label: 'Hafif – ara sıra uyuşma/karıncalanma', go: R({ desc: 'Bacak sinir hasarı (hafif)', min: 2, max: 10, val: 5, page: P_NERVE, sec: 'Periferik sinir bozuklukları' }) },
      { label: 'Orta – belirgin kuvvet/his kaybı, aksama', go: R({ desc: 'Bacak sinir hasarı (orta)', min: 10, max: 30, val: 18, page: P_NERVE, sec: 'Periferik sinir bozuklukları' }) },
      { label: 'Ağır – ayağını/bacağını kullanamıyor', go: R({ desc: 'Bacak sinir hasarı (ağır)', min: 30, max: 50, val: 40, page: P_NERVE, sec: 'Periferik sinir bozuklukları' }) }]
  }
};

const sevNode = (bolge, page, h, o, a) => ({
  q: bolge + ' – iyileşme sonrası bugünkü durum nasıl?',
  help: 'Kırık/çıkık iyileştikten sonra kalıcı kısıtlılığa göre seçin. Kesin oran eklem hareket açıklığı ölçümüyle belirlenir.', opts: [
    { label: 'Sorunsuz iyileşti, kısıtlılık yok', sub: 'Tam hareket ediyor, ağrı yok', go: R({ desc: bolge + ' kırığı/çıkığı – sorunsuz iyileşmiş', min: 0, max: 3, val: 0, page, sec: 'Eklem hareket açıklığı modeli' }) },
    { label: 'Hafif kısıtlılık veya ara sıra ağrı', go: R({ desc: bolge + ' – hafif kalıcı kısıtlılık', min: h[0], max: h[1], val: h[2], page, sec: 'Eklem hareket açıklığı modeli' }) },
    { label: 'Belirgin / orta dereceli kısıtlılık', go: R({ desc: bolge + ' – orta dereceli kısıtlılık', min: o[0], max: o[1], val: o[2], page, sec: 'Eklem hareket açıklığı modeli' }) },
    { label: 'İleri kısıtlılık / eklem neredeyse tutmuyor (ankiloz)', go: R({ desc: bolge + ' – ileri kısıtlılık / ankiloz', min: a[0], max: a[1], val: a[2], page, sec: 'Eklem hareket açıklığı / ankiloz' }) }]
});
NODES.sev_omuz = sevNode('Omuz / üst kol', P_ROM_UE, [2, 8, 5], [8, 20, 14], [20, 45, 32]);
NODES.sev_dirsek = sevNode('Dirsek', P_ROM_UE, [2, 7, 4], [7, 18, 12], [18, 35, 26]);
NODES.sev_elbilek = sevNode('El bileği / ön kol', P_ROM_UE, [2, 6, 4], [6, 15, 10], [15, 30, 22]);
NODES.sev_el = sevNode('El / parmaklar', P_ROM_UE, [1, 5, 3], [5, 12, 8], [12, 25, 18]);
NODES.sev_kalca = sevNode('Kalça / uyluk', P_ROM_LE, [2, 8, 5], [8, 20, 14], [20, 45, 32]);
NODES.sev_diz = sevNode('Diz', P_ROM_LE, [2, 8, 5], [8, 20, 14], [20, 40, 30]);
NODES.sev_aybilek = sevNode('Ayak bileği / baldır', P_ROM_LE, [2, 6, 4], [6, 15, 10], [15, 30, 22]);
NODES.sev_ayak = sevNode('Ayak / parmaklar', P_ROM_LE, [1, 4, 2], [4, 10, 7], [10, 22, 16]);

Object.assign(NODES, {
  omurga: {
    q: 'Omurganızın hangi bölümü yaralandı?', help: 'Birden fazla omur kırıldıysa her birini ayrı ayrı ekleyin; araç bunları birleştirir.', opts: [
      { label: 'Boyun (servikal)', go: 'omurga_t_Boyun' },
      { label: 'Sırt (torakal)', go: 'omurga_t_Sırt' },
      { label: 'Bel (lomber)', go: 'omurga_t_Bel' },
      { label: 'Omurilik / sinir hasarı (felç, his kaybı)', emo: '⚡', go: 'omurga_kord' }]
  },
  omurga_kord: {
    q: 'Omurilik hasarının etkisi nedir?', help: 'Bu çok ciddi bir durumdur; kesin oran nörolojik muayene ile belirlenir.', opts: [
      { label: 'Bir kol veya bacakta kısmi kuvvet kaybı', go: R({ desc: 'Omurilik/sinir hasarı (kısmi)', min: 20, max: 50, val: 35, page: P_NERVE, sec: 'Spinal kord ve ilgili bozukluklar' }) },
      { label: 'İki bacakta felç (parapleji)', go: R({ desc: 'Parapleji (iki bacak felci)', min: 70, max: 100, val: 85, page: P_NERVE, sec: 'Spinal kord ve ilgili bozukluklar' }) },
      { label: 'Kol ve bacaklarda felç (tetrapleji)', go: R({ desc: 'Tetrapleji', min: 90, max: 100, val: 95, page: P_NERVE, sec: 'Spinal kord ve ilgili bozukluklar' }) }]
  }
});
const omurgaType = (reg, post, disl) => ({
  q: reg + ' – ne tür bir hasar var?', help: 'Raporunuzda yazıyorsa ona göre seçin.', opts: [
    { label: 'Omur (vertebra) cisminde kırık / çökme', go: 'omurga_comp_' + reg },
    { label: 'Omurun arka elemanında kırık', sub: 'Pedikül, lamina, transvers proçes', go: R({ desc: reg + ' – posterior eleman kırığı', exact: true, val: post, page: P_SPINE, sec: 'Spesifik omurga hastalığı (Tablo 1.7)' }) },
    { label: 'Omurda çıkık (dislokasyon)', go: R({ desc: reg + ' – redükte dislokasyon', exact: true, val: disl, page: P_SPINE, sec: 'Tablo 1.7' }) },
    { label: 'Disk fıtığı / yumuşak doku', go: 'omurga_disk_' + reg }]
});
const compNode = (reg, vals) => ({
  q: reg + ' – omurdaki çökme miktarı ne kadar?', help: 'Raporda "kompresyon %" olarak yazar. Bilmiyorsanız orta seçeneği uygundur.', opts: [
    { label: 'Hafif (%25\u2019e kadar çökme)', go: R({ desc: reg + ' vertebra kompresyon kırığı (%0-25)', exact: true, val: vals[0], page: P_SPINE, sec: 'Tablo 1.7' }) },
    { label: 'Orta (%26-50 çökme)', go: R({ desc: reg + ' vertebra kompresyon kırığı (%26-50)', exact: true, val: vals[1], page: P_SPINE, sec: 'Tablo 1.7' }) },
    { label: 'Ağır (%50\u2019den fazla çökme)', go: R({ desc: reg + ' vertebra kompresyon kırığı (>%50)', exact: true, val: vals[2], page: P_SPINE, sec: 'Tablo 1.7' }) }]
});
const diskNode = (reg, a, b) => ({
  q: reg + ' – disk/yumuşak doku lezyonunun durumu?', opts: [
    { label: 'Belirti yok, kalıcı sorun yok', go: R({ desc: reg + ' disk lezyonu – semptomsuz', exact: true, val: 0, page: P_SPINE, sec: 'Tablo 1.7' }) },
    { label: 'Ameliyatsız, kalıcı ağrı/bulgu var', go: R({ desc: reg + ' disk lezyonu – ameliyatsız, bulgulu', exact: true, val: a, page: P_SPINE, sec: 'Tablo 1.7' }) },
    { label: 'Ameliyat edildi (disk cerrahisi)', go: R({ desc: reg + ' disk lezyonu – opere', min: b, max: b + 3, val: b, page: P_SPINE, sec: 'Tablo 1.7' }) }]
});
NODES.omurga_t_Boyun = omurgaType('Boyun', 4, 5); NODES.omurga_comp_Boyun = compNode('Boyun', [4, 6, 10]); NODES.omurga_disk_Boyun = diskNode('Boyun', 4, 7);
NODES.omurga_t_Sırt = omurgaType('Sırt', 2, 3); NODES.omurga_comp_Sırt = compNode('Sırt', [2, 3, 5]); NODES.omurga_disk_Sırt = diskNode('Sırt', 2, 5);
NODES.omurga_t_Bel = omurgaType('Bel', 5, 6); NODES.omurga_comp_Bel = compNode('Bel', [5, 7, 12]); NODES.omurga_disk_Bel = diskNode('Bel', 5, 7);

Object.assign(NODES, {
  kafa: {
    q: 'Kafa travmasının kalıcı etkisi nedir?', help: 'Kazadan sonra DEVAM EDEN şikâyetlere göre seçin.', opts: [
      { label: 'Yüzeysel yara, kalıcı etki yok', go: R({ desc: 'Kafa travması – kalıcı etki yok', min: 0, max: 2, val: 0, page: '200', sec: 'Sinir sistemi' }) },
      { label: 'Süregelen baş ağrısı / baş dönmesi', go: R({ desc: 'Travma sonrası baş ağrısı/baş dönmesi', min: 0, max: 10, val: 5, page: '200', sec: 'Sinir sistemi' }) },
      { label: 'Hafıza, dikkat, konuşma gibi zihinsel etkilenme', go: 'kafa_kognitif' },
      { label: 'Sara nöbetleri (epilepsi) başladı', go: 'kafa_epilepsi' },
      { label: 'Kol/bacakta felç gelişti', go: 'omurga_kord' }]
  },
  kafa_kognitif: {
    q: 'Zihinsel etkilenme günlük hayatı ne kadar bozuyor?', help: 'Kesin oran nöropsikolojik testlerle belirlenir.', opts: [
      { label: 'Hafif – işini biraz zorlaştırıyor', go: R({ desc: 'Travma sonrası bilişsel bozukluk (hafif)', min: 10, max: 25, val: 17, page: '205', sec: 'Yüksek kortikal fonksiyon bozuklukları' }) },
      { label: 'Orta – çoğu işte yardım gerekiyor', go: R({ desc: 'Bilişsel bozukluk (orta)', min: 25, max: 50, val: 37, page: '205', sec: 'Yüksek kortikal fonksiyon bozuklukları' }) },
      { label: 'Ağır – kendi başına yaşayamıyor', go: R({ desc: 'Bilişsel bozukluk (ağır)', min: 50, max: 90, val: 70, page: '205', sec: 'Yüksek kortikal fonksiyon / demans' }) }]
  },
  kafa_epilepsi: {
    q: 'Nöbetler ne sıklıkta?', opts: [
      { label: 'İlaçla kontrol altında, seyrek', go: R({ desc: 'Post-travmatik epilepsi (kontrollü)', min: 10, max: 20, val: 15, page: '201', sec: 'Sinir sistemi – epilepsi' }) },
      { label: 'İlaca rağmen sık nöbet', go: R({ desc: 'Post-travmatik epilepsi (sık)', min: 20, max: 50, val: 35, page: '201', sec: 'Sinir sistemi – epilepsi' }) },
      { label: 'Sık ve günlük hayatı engelleyen nöbetler', go: R({ desc: 'Post-travmatik epilepsi (ağır)', min: 50, max: 90, val: 70, page: '201', sec: 'Sinir sistemi – epilepsi' }) }]
  },

  goz: {
    q: 'Gözünüzde / görmenizde ne oldu?', opts: [
      { label: 'Bir gözü tamamen kaybettim (görmüyor / küre alındı)', go: R({ desc: 'Tek göz görme kaybı', min: 20, max: 30, val: 25, page: P_VISION, sec: 'Görme sistemi' }) },
      { label: 'İki gözde de ileri görme kaybı / körlük', go: R({ desc: 'İki taraflı ileri görme kaybı', min: 85, max: 100, val: 95, page: P_VISION, sec: 'Görme sistemi' }) },
      { label: 'Görmem azaldı (kısmi)', go: 'goz_kismi' },
      { label: 'Göz çevresinde yaralanma / iz, görme normal', go: R({ desc: 'Göz çevresi yaralanması (görme korunmuş)', min: 0, max: 8, val: 3, page: P_VISION, sec: 'Görme sistemi' }) }]
  },
  goz_kismi: {
    q: 'Görme kaybı ne kadar?', help: 'Kesin oran görme keskinliği ve görme alanı ölçümüyle (GSYO) belirlenir.', opts: [
      { label: 'Hafif – gözlükle düzeliyor', go: R({ desc: 'Görme azalması (hafif)', min: 0, max: 10, val: 5, page: P_VISION, sec: 'Görme sistemi' }) },
      { label: 'Orta – tek gözde belirgin azalma', go: R({ desc: 'Görme azalması (orta, tek göz)', min: 10, max: 25, val: 17, page: P_VISION, sec: 'Görme sistemi' }) },
      { label: 'İleri – iki gözde belirgin azalma', go: R({ desc: 'Görme azalması (ileri, iki göz)', min: 25, max: 60, val: 40, page: P_VISION, sec: 'Görme sistemi' }) }]
  },

  kulak: {
    q: 'Kulağınızda / işitmenizde ne oldu?', opts: [
      { label: 'İşitme kaybı oldu', go: 'kulak_isitme' },
      { label: 'Baş dönmesi / denge bozukluğu (vestibüler)', go: 'kulak_denge' },
      { label: 'Dış kulak (kepçe) kaybı / şekil bozukluğu', go: 'kulak_dis' },
      { label: 'Kulak çınlaması (tinnitus)', go: R({ desc: 'Tinnitus (kulak çınlaması)', min: 0, max: 5, val: 2, page: P_EAR, sec: 'Kulak Burun Boğaz' }) }]
  },
  kulak_isitme: {
    q: 'İşitme kaybı hangi düzeyde?', help: 'Kesin oran odyometri (işitme testi) ile belirlenir.', opts: [
      { label: 'Tek kulakta kısmi', go: R({ desc: 'Tek kulak işitme kaybı (kısmi)', min: 0, max: 6, val: 3, page: P_EAR, sec: 'İşitme' }) },
      { label: 'Tek kulakta tam sağırlık', go: R({ desc: 'Tek kulak tam işitme kaybı', min: 6, max: 15, val: 10, page: P_EAR, sec: 'İşitme' }) },
      { label: 'İki kulakta ileri/tam işitme kaybı', go: R({ desc: 'İki taraflı ileri işitme kaybı', min: 25, max: 50, val: 35, page: P_EAR, sec: 'İşitme' }) }]
  },
  kulak_denge: {
    q: 'Denge bozukluğunun derecesi?', opts: [
      { label: 'Hafif (destekleyici bulgular)', go: R({ desc: 'Vestibüler bozukluk (hafif)', min: 5, max: 15, val: 10, page: P_EAR, sec: 'Denge' }) },
      { label: 'Orta', go: R({ desc: 'Vestibüler bozukluk (orta)', min: 15, max: 25, val: 20, page: P_EAR, sec: 'Denge' }) },
      { label: 'Ağır (günlük hayatı kısıtlıyor)', go: R({ desc: 'Vestibüler bozukluk (ağır)', min: 25, max: 35, val: 30, page: P_EAR, sec: 'Denge' }) }]
  },
  kulak_dis: {
    q: 'Dış kulak kaybı?', opts: [
      { label: 'Tek kulak', go: R({ desc: 'Dış kulağın tek taraflı kaybı/şekil bozukluğu', exact: true, val: 3, page: '125', sec: 'Kulak Burun Boğaz' }) },
      { label: 'İki kulak', go: R({ desc: 'Dış kulağın çift taraflı kaybı/şekil bozukluğu', exact: true, val: 7, page: '125', sec: 'Kulak Burun Boğaz' }) }]
  },

  yuz: {
    q: 'Yüz, çene, burun veya ağız bölgesinde ne oldu?', opts: [
      { label: 'Burnun tamamen kaybı', go: R({ desc: 'Burnun tam kaybı', exact: true, val: 47, page: '126', sec: 'Kulak Burun Boğaz' }) },
      { label: 'Burun şekil bozukluğu / kısmi kayıp', go: R({ desc: 'Burun şekil bozukluğu / kısmi kayıp', min: 2, max: 12, val: 6, page: '125', sec: 'Kulak Burun Boğaz' }) },
      { label: 'Çene (mandibula) kısmen alındı', go: R({ desc: 'Mandibula segmenter rezeksiyon', exact: true, val: 13, page: '125', sec: 'Kulak Burun Boğaz' }) },
      { label: 'Çene yarısı alındı (hemimandibulektomi)', go: R({ desc: 'Hemimandibulektomi', exact: true, val: 33, page: '125', sec: 'Kulak Burun Boğaz' }) },
      { label: 'Diş / çene kemiği kaybı', go: R({ desc: 'Diş/alveoler kemik kaybı', min: 2, max: 17, val: 8, page: '125', sec: 'Kulak Burun Boğaz' }) },
      { label: 'Yüzde kalıcı iz / yara izi', go: R({ desc: 'Yüzde kalıcı skar/iz', min: 0, max: 15, val: 5, page: P_BURN, sec: 'Deri / yanık arızaları' }) },
      { label: 'Yüz felci (mimik kaybı)', go: R({ desc: 'Periferik fasial paralizi', min: 5, max: 25, val: 12, page: P_NERVE, sec: 'Periferik fasial paralizi' }) }]
  },

  gogus: {
    q: 'Göğüs bölgesinde ne oldu?', opts: [
      { label: 'Kaburga kırığı (iyileşmiş)', go: R({ desc: 'Kaburga kırığı (iyileşmiş)', min: 0, max: 5, val: 2, page: '180', sec: 'Göğüs / solunum' }) },
      { label: 'Bir akciğer alındı (pnömonektomi)', go: R({ desc: 'Tek taraflı pnömonektomi', exact: true, val: 10, page: '196', sec: 'Akciğer' }) },
      { label: 'Nefes darlığı / solunum kapasitesi düştü', go: 'gogus_solunum' }]
  },
  gogus_solunum: {
    q: 'Nefes darlığı ne kadar?', help: 'Kesin oran solunum fonksiyon testi ile belirlenir.', opts: [
      { label: 'Sadece ağır eforda', go: R({ desc: 'Solunum kısıtlılığı (hafif)', min: 5, max: 15, val: 10, page: '180', sec: 'Göğüs / solunum' }) },
      { label: 'Günlük aktivitede', go: R({ desc: 'Solunum kısıtlılığı (orta)', min: 20, max: 40, val: 30, page: '180', sec: 'Göğüs / solunum' }) },
      { label: 'İstirahatte bile / oksijene bağımlı', go: R({ desc: 'Solunum kısıtlılığı (ağır)', min: 50, max: 90, val: 70, page: '180', sec: 'Göğüs / solunum' }) }]
  },

  karin: {
    q: 'Karın bölgesi / iç organlarda ne oldu?', opts: [
      { label: 'Dalak alındı (splenektomi)', go: R({ desc: 'Dalak kaybı (splenektomi)', min: 3, max: 10, val: 6, page: P_ORG, sec: 'Hematoloji / iç organlar' }) },
      { label: 'Bir böbrek alındı (diğeri normal)', go: R({ desc: 'Tek böbrek kaybı (diğeri normal)', min: 15, max: 25, val: 20, page: '189', sec: 'Üriner sistem' }) },
      { label: 'Her iki böbrek işlevsiz (diyaliz)', go: R({ desc: 'Bilateral nefrektomi / böbrek yetmezliği', exact: true, val: 90, page: '189', sec: 'Üriner sistem' }) },
      { label: 'Bağırsak / karaciğer rezeksiyonu', go: R({ desc: 'Bağırsak/karaciğer rezeksiyonu', min: 5, max: 30, val: 15, page: P_ORG, sec: 'Sindirim sistemi' }) },
      { label: 'Karın duvarı fıtığı / kalıcı sorun', go: R({ desc: 'Karın duvarı defekti/fıtık', min: 0, max: 10, val: 5, page: P_ORG, sec: 'Sindirim sistemi' }) }]
  },

  urogenital: {
    q: 'Üriner veya genital sistemde ne oldu?', opts: [
      { label: 'İdrar kaçırma (inkontinans)', go: R({ desc: 'Üriner inkontinans', min: 5, max: 25, val: 12, page: '190', sec: 'Üriner sistem' }) },
      { label: 'Bir böbrek kaybı', go: R({ desc: 'Tek böbrek kaybı', min: 15, max: 25, val: 20, page: '189', sec: 'Üriner sistem' }) },
      { label: 'Genital organ yaralanması / kaybı', go: R({ desc: 'Genital organ yaralanması/kaybı', min: 5, max: 30, val: 15, page: '191', sec: 'Genital sistem' }) }]
  },

  cilt: {
    q: 'Cilt yaralanması / yanık durumu?', help: 'Yanıkta kesin oran, vücut yüzey alanı ve fonksiyon kaybıyla belirlenir.', opts: [
      { label: 'Küçük yanık / iz (vücudun <%10)', go: R({ desc: 'Yanık / skar (sınırlı, <%10)', min: 0, max: 8, val: 4, page: P_BURN, sec: 'Yanıklar' }) },
      { label: 'Orta yanık (%10-30)', go: R({ desc: 'Yanık (%10-30)', min: 8, max: 25, val: 16, page: P_BURN, sec: 'Yanıklar' }) },
      { label: 'Geniş yanık (>%30) / eklemi kısıtlayan skar', go: R({ desc: 'Yaygın yanık / kontraktür (>%30)', min: 25, max: 60, val: 40, page: P_BURN, sec: 'Yanıklar' }) }]
  },

  sinir: {
    q: 'Felç / sinir tutulumu nasıl?', help: 'Kesin oran nörolojik muayene ile belirlenir.', opts: [
      { label: 'Tek kol veya bacakta kısmi güç kaybı', go: R({ desc: 'Tek ekstremite parsiyel parezi', min: 15, max: 45, val: 30, page: P_NERVE, sec: 'Sinir sistemi' }) },
      { label: 'Vücudun bir yarısı felçli (hemipleji)', go: R({ desc: 'Hemipleji (yarım vücut felci)', min: 50, max: 90, val: 70, page: P_NERVE, sec: 'Sinir sistemi' }) },
      { label: 'İki bacak felçli (parapleji)', go: R({ desc: 'Parapleji', min: 70, max: 100, val: 85, page: P_NERVE, sec: 'Spinal kord' }) },
      { label: 'Dört uzuv felçli (tetrapleji)', go: R({ desc: 'Tetrapleji', min: 90, max: 100, val: 95, page: P_NERVE, sec: 'Spinal kord' }) }]
  },

  manual: { q: 'Oranı elle girin', help: 'Bu yaralanma listede yoksa veya elinizde sağlık kurulu raporu varsa, oranı doğrudan yazın.', manual: true }
});

const ROOT = {
  q: 'Vücudunuzun neresi yaralandı?', help: 'Birden fazla bölge yaralandıysa önce birini seçin; sonra diğerlerini ekleyebilirsiniz.', opts: [
    { label: 'Kol / omuz / dirsek / el', emo: '💪', go: 'kol' },
    { label: 'Bacak / kalça / diz / ayak', emo: '🦵', go: 'bacak' },
    { label: 'Omurga (boyun / sırt / bel)', emo: '🦴', go: 'omurga' },
    { label: 'Kafa / beyin', emo: '🧠', go: 'kafa' },
    { label: 'Göz / görme', emo: '👁️', go: 'goz' },
    { label: 'Kulak / işitme / denge', emo: '👂', go: 'kulak' },
    { label: 'Yüz / çene / burun / ağız', emo: '👃', go: 'yuz' },
    { label: 'Göğüs / akciğer / kaburga', emo: '🫁', go: 'gogus' },
    { label: 'Karın / iç organlar', emo: '🩺', go: 'karin' },
    { label: 'Üriner / genital sistem', emo: '🩻', go: 'urogenital' },
    { label: 'Cilt / yanık', emo: '🔥', go: 'cilt' },
    { label: 'Sinir sistemi / felç', emo: '⚡', go: 'sinir' }]
};

/* Balthazard formülü: birleşik = 100·(1 − ∏(1 − rᵢ/100)) */
const balthazard = (rates) => {
  const sorted = rates.slice().sort((a, b) => b - a);
  const steps = [];
  let c = sorted.length ? sorted[0] : 0;
  steps.push({ type: 'base', value: c });
  for (let k = 1; k < sorted.length; k++) {
    const r = sorted[k];
    const rem = 100 - c;
    const add = rem * r / 100;
    const nc = c + add;
    steps.push({ type: 'comb', prev: c, r, rem, add, value: nc });
    c = nc;
  }
  return { value: c, steps };
};

const fmt = (n) => (Math.round(n * 100) / 100).toString().replace('.', ',');

/* Kaza tarihine göre uygulanacak yönetmelik */
const getRegNote = (dateStr) => {
  if (!dateStr) return null;
  const t = new Date(dateStr);
  if (t < new Date('2008-10-11')) return { ok: false, name: 'Sosyal Sigorta Sağlık İşlemleri Tüzüğü', period: '11.10.2008 öncesi' };
  if (t < new Date('2013-09-01')) return { ok: false, name: 'Çalışma Gücü ve Meslekte Kazanma Gücü Kaybı Oranı Tespit İşlemleri Yönetmeliği', period: '2008–2013' };
  if (t < new Date('2015-06-01')) return { ok: false, name: 'Maluliyet Tespiti İşlemleri Yönetmeliği (2013)', period: '2013–2015' };
  if (t < new Date('2019-02-20')) return { ok: false, name: 'Özürlülük Ölçütü… Hakkında Yönetmelik', period: '2015–2019' };
  return { ok: true, name: 'Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik', period: '20.02.2019 ve sonrası' };
};

const MaluliyetHesaplamaPage = () => {
  const [stack, setStack] = useState(['ROOT']);
  const [path, setPath] = useState([]);
  const [pending, setPending] = useState(null);   // incelenmekte olan sonuç
  const [adjVal, setAdjVal] = useState(0);
  const [manualDesc, setManualDesc] = useState('');
  const [manualVal, setManualVal] = useState('');
  const [added, setAdded] = useState([]);
  const [yas, setYas] = useState('');
  const [kazaTarihi, setKazaTarihi] = useState('');
  const [final, setFinal] = useState(null);
  const [showBd, setShowBd] = useState(false);
  const [copied, setCopied] = useState(false);

  const curKey = stack[stack.length - 1];
  const node = curKey === 'ROOT' ? ROOT : NODES[curKey];
  const regNote = useMemo(() => getRegNote(kazaTarihi), [kazaTarihi]);

  // Yaralanma listesi değişince eski (bayat) sonucu temizle
  useEffect(() => { setFinal(null); setShowBd(false); }, [added]);

  const choose = (opt) => {
    const lbl = opt.label.length > 26 ? opt.label.slice(0, 24) + '…' : opt.label;
    setPath((p) => [...p, lbl]);
    if (typeof opt.go === 'string') {
      setStack((s) => [...s, opt.go]);
      setPending(null);
    } else {
      setPending(opt.go);
      setAdjVal(opt.go.val);
    }
  };

  const goBack = () => {
    if (pending) { setPending(null); setPath((p) => p.slice(0, -1)); return; }
    if (stack.length > 1) { setStack((s) => s.slice(0, -1)); setPath((p) => p.slice(0, -1)); }
  };

  const confirmResult = () => {
    const res = pending;
    let v = res.val;
    if (!res.exact) {
      const x = parseFloat(adjVal);
      if (!isNaN(x)) v = Math.max(res.min, Math.min(res.max, x));
    }
    setAdded((a) => [...a, { desc: res.desc, val: v, min: res.min, max: res.max, exact: !!res.exact, page: res.page, sec: res.sec }]);
    restartWizard();
  };

  const addManual = () => {
    const v = parseFloat((manualVal || '').replace(',', '.'));
    if (isNaN(v) || v < 0 || v > 100) { alert('Lütfen 0-100 arası geçerli bir oran girin.'); return; }
    setAdded((a) => [...a, { desc: (manualDesc.trim() || 'Elle girilen oran'), val: v, exact: true, sec: 'Elle girildi', page: '-' }]);
    setManualDesc(''); setManualVal('');
    restartWizard();
  };

  const restartWizard = () => { setStack(['ROOT']); setPath([]); setPending(null); };
  const removeItem = (i) => setAdded((a) => a.filter((_, idx) => idx !== i));

  const resetAll = () => {
    setAdded([]); setFinal(null); setShowBd(false); setYas(''); setKazaTarihi('');
    restartWizard();
  };

  const hesapla = () => {
    if (!added.length) { alert('Lütfen en az bir yaralanma ekleyin.'); return; }
    const res = balthazard(added.map((a) => a.val));
    let combined = res.value;
    const yasN = parseInt(yas, 10);
    let ageStep = null;
    if (!isNaN(yasN) && yasN >= 65) {
      const rem = 100 - combined;
      const add = rem * 10 / 100;
      ageStep = { prev: combined, add, value: combined + add };
      combined += add;
    }
    const anyEst = added.some((a) => !a.exact);
    setFinal({ combined, steps: res.steps, ageStep, anyEst, items: added.slice().sort((a, b) => b.val - a.val) });
    setShowBd(false);
  };

  const buildText = () => {
    if (!final) return '';
    let t = 'MALULİYET (ENGELLİLİK ORANI) ÖN HESABI\n';
    if (kazaTarihi) t += 'Kaza tarihi: ' + kazaTarihi + '\n';
    t += 'Yöntem: Balthazard formülü (Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik)\n\nYaralanmalar:\n';
    final.items.forEach((a, i) => {
      t += (i + 1) + ') ' + a.desc + ' — %' + fmt(a.val) + (a.exact ? ' (kesin)' : ' (tahmini)') + (a.page && a.page !== '-' ? (' [Ek-2 sf.' + a.page + ']') : '') + '\n';
    });
    t += '\nAdım adım:\n';
    final.steps.forEach((s, i) => {
      if (s.type === 'base') t += '1. En yüksek: %' + fmt(s.value) + '\n';
      else t += (i + 1) + '. %' + fmt(s.prev) + ' + (100-' + fmt(s.prev) + ')*' + fmt(s.r) + '/100 = %' + fmt(s.value) + '\n';
    });
    if (final.ageStep) t += '65+ yaş (+%10): %' + fmt(final.ageStep.value) + '\n';
    t += '\nSONUÇ: %' + fmt(final.combined) + ' (yuvarlanmış %' + Math.round(final.combined) + ')' + (final.anyEst ? ' — TAHMİNİDİR, kesin oran sağlık kurulunca belirlenir.' : '') + '\n';
    return t;
  };

  const kopyala = () => {
    const t = buildText();
    if (!t) return;
    navigator.clipboard.writeText(t).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => {
        const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove(); setCopied(true); setTimeout(() => setCopied(false), 2000);
      });
  };

  const hasAdded = added.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <SEO
        title="Maluliyet (Engellilik) Oranı Hesaplama 2026 | Trafik Kazası Rehberli Araç | Koptay Hukuk"
        description="Trafik kazası sonrası maluliyet (engellilik) oranınızı soru-cevap ile adım adım hesaplayın. Hiçbir tıbbi bilgi gerektirmez; Erişkinler İçin Engellilik Değerlendirmesi Yönetmeliği (Ek-2 cetveli), Balthazard formülü ve 65+ yaş %10 kuralı esaslı. Ankara avukat — Koptay Hukuk Bürosu."
        keywords="maluliyet oranı hesaplama, engellilik oranı hesaplama, trafik kazası maluliyet hesaplama, balthazard formülü hesaplama, ek-2 cetveli engel oranı, engellilik değerlendirme yönetmeliği, maluliyet oranı nasıl hesaplanır, birden fazla yaralanma maluliyet, kaza sonrası engel oranı, trafik kazası avukatı ankara"
        url="https://koptay.av.tr/hesaplama-araclari/trafik-kazasi-maluliyet-hesaplama"
        image="/images/articles/trafik-kazasi-sonrasi-maluliyet-raporu-nasil-alinir.jpg"
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-6 text-white shadow-lg border-b-4 border-red-500">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
              <FaUserInjured className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Maluliyet (Engellilik Oranı) Hesaplama Aracı</h1>
              <p className="text-xs md:text-sm text-slate-300 opacity-90 mt-1">Trafik kazası ve yaralanmalara bağlı engellilik oranını soru-cevap ile, adım adım hesaplayın. Tıbbi bilgi gerektirmez.</p>
            </div>
          </div>
        </div>

        {/* Bilgi şeridi */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-xs text-blue-800 flex items-start gap-2">
          <FaInfoCircle className="mt-0.5 flex-shrink-0" />
          <span>Dayanak: <strong>Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik</strong> (R.G. 20.02.2019/30692) Ek-2 cetveli ve <strong>Balthazard</strong> birleştirme formülü. Bu araç sonucu yönlendirme amaçlıdır; <strong>kesin oran sağlık kurulunca</strong> belirlenir.</span>
        </div>

        {/* WIZARD */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-6">
          {/* Breadcrumb + Back */}
          {(path.length > 0) && (
            <div className="text-xs text-slate-500 mb-3">Seçimler: <span className="font-semibold text-slate-700">{path.join(' › ')}</span></div>
          )}
          {(stack.length > 1 || pending) && (
            <button onClick={goBack} className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-3 font-medium">
              <FaArrowLeft className="w-3 h-3" /> Geri
            </button>
          )}

          {/* Sonuç incelemesi */}
          {pending ? (
            <div>
              <div className={`rounded-xl p-5 border ${pending.exact ? 'border-emerald-200 bg-emerald-50' : 'border-orange-200 bg-orange-50'}`}>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 flex-wrap">
                  {pending.desc}
                  {pending.exact
                    ? <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Kesin değer</span>
                    : <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Tahmini</span>}
                </h3>
                <div className="text-3xl font-extrabold text-slate-800 mt-2">{pending.exact ? '%' + pending.val : '~%' + pending.val}</div>
                <div className="text-xs text-slate-500">{pending.exact ? 'Cetvelde sabit (kesin) değer' : `Aralık: %${pending.min} – %${pending.max} (ölçümle netleşir)`}</div>

                {!pending.exact && (
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <label className="text-xs font-semibold text-slate-600">Tahmini oranı ayarlayın:</label>
                    <input type="number" value={adjVal} min={pending.min} max={pending.max} step="0.5"
                      onChange={(e) => setAdjVal(e.target.value)}
                      className="w-24 px-2 py-1.5 border border-slate-300 rounded-lg text-center text-sm" />
                    <span className="text-xs text-slate-500">(%{pending.min}–%{pending.max})</span>
                  </div>
                )}
                <div className="text-[11px] text-slate-400 mt-3">Dayanak: {pending.sec} · Ek-2 cetveli, Resmî PDF sayfa {pending.page}</div>
              </div>
              <div className="flex gap-3 mt-4 flex-wrap">
                <button onClick={confirmResult} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-lg transition">
                  <FaCheck className="w-3 h-3" /> Bu yaralanmayı ekle
                </button>
                <button onClick={goBack} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-lg transition">
                  <FaArrowLeft className="w-3 h-3" /> Geri / değiştir
                </button>
              </div>
            </div>
          ) : node.manual ? (
            <div>
              <p className="text-lg font-bold text-slate-800">{node.q}</p>
              <p className="text-sm text-slate-500 mb-4">{node.help}</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Açıklama</label>
                  <input value={manualDesc} onChange={(e) => setManualDesc(e.target.value)} placeholder="Örn: Sol diz hareket kısıtlılığı"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Oran %</label>
                  <input type="number" value={manualVal} onChange={(e) => setManualVal(e.target.value)} min="0" max="100" step="0.5"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={addManual} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-lg transition">
                  <FaCheck className="w-3 h-3" /> Ekle
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-slate-800">{node.q}</p>
              {node.help && <p className="text-sm text-slate-500 mb-4">{node.help}</p>}
              <div className="space-y-2.5 mt-3">
                {node.opts.map((o, i) => (
                  <button key={i} onClick={() => choose(o)}
                    className="w-full flex items-center gap-3 text-left bg-white border border-slate-200 rounded-xl px-4 py-3.5 hover:border-slate-500 hover:bg-slate-50 transition group">
                    <span className="text-xl flex-shrink-0">{o.emo || '•'}</span>
                    <span className="flex-1 text-sm text-slate-800">
                      {o.label}
                      {o.sub && <small className="block text-xs text-slate-400 font-normal mt-0.5">{o.sub}</small>}
                    </span>
                    <FaArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* EKLENEN YARALANMALAR */}
        {hasAdded && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-6">
            <h2 className="text-base font-bold text-slate-800 mb-1">Eklenen yaralanmalar</h2>
            <p className="text-xs text-slate-500 mb-4">Birden fazla yaralanma varsa hepsini ekleyin; oranlar Balthazard formülü ile birleştirilir.</p>
            <div className="space-y-2.5">
              {added.map((a, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-3">
                  <span className="w-7 h-7 flex-shrink-0 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs">{i + 1}</span>
                  <div className="flex-1 text-sm text-slate-700">
                    {a.desc}
                    {a.exact
                      ? <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">kesin</span>
                      : <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">tahmini</span>}
                    <small className="block text-[11px] text-slate-400">{a.sec || ''}{a.page && a.page !== '-' ? (' · sf. ' + a.page) : ''}</small>
                  </div>
                  <span className="font-bold text-slate-800 whitespace-nowrap">%{fmt(a.val)}</span>
                  <button onClick={() => removeItem(i)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={restartWizard} className="mt-4 inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-lg transition text-sm">
              + Başka bir yaralanma ekle
            </button>
          </div>
        )}

        {/* SON ADIM: YAŞ + KAZA TARİHİ + HESAP */}
        {hasAdded && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-6">
            <h2 className="text-base font-bold text-slate-800 mb-4">Son adım: yaş, kaza tarihi ve sonuç</h2>
            <div className="flex gap-4 flex-wrap mb-3">
              <div className="w-36">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Yaş (isteğe bağlı)</label>
                <input type="number" value={yas} onChange={(e) => setYas(e.target.value)} min="0" max="120" placeholder="Örn: 45"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
              <div className="w-48">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Kaza tarihi (isteğe bağlı)</label>
                <input type="date" value={kazaTarihi} onChange={(e) => setKazaTarihi(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-3">65 yaş ve üzeri bireylerde bulunan orana yönetmelik gereği ayrıca %10 eklenir.</p>

            {regNote && (
              <div className={`text-xs rounded-lg p-3 mb-4 border ${regNote.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
                {regNote.ok ? '✓' : '⚠'} <strong>Uygulanacak yönetmelik:</strong> {regNote.name}{' '}
                <span className="inline-block bg-white/60 text-[10px] px-2 py-0.5 rounded-full ml-1">{regNote.period}</span>
                <br />
                {regNote.ok
                  ? 'Bu araç tam olarak bu yönetmeliğe dayanır.'
                  : 'Bu kaza tarihinde farklı bir yönetmelik yürürlükteydi. Balthazard birleştirmesi benzerdir; ancak oranlar o tarihteki cetvelden alınmalıdır.'}
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <button onClick={hesapla} className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-3 rounded-xl transition">
                <FaCalculator /> Maluliyet Oranını Hesapla
              </button>
              <button onClick={resetAll} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-3 rounded-xl transition">
                <FaRedo className="w-3 h-3" /> Hepsini temizle
              </button>
            </div>

            {/* SONUÇ */}
            {final && (
              <>
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-2xl p-6 mt-6">
                  <div className="text-sm opacity-90">{final.anyEst ? 'Birleştirilmiş Maluliyet Oranı – TAHMİNİ' : 'Birleştirilmiş Maluliyet Oranı'}</div>
                  <div className="text-5xl font-extrabold my-1">%{fmt(final.combined)}</div>
                  <div className="text-sm opacity-90">
                    {final.items.length} yaralanma Balthazard ile birleştirildi.{final.ageStep ? ' 65+ yaş için +%10 uygulandı.' : ''}
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button onClick={() => setShowBd((s) => !s)} className="text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition">
                      Adım adım dökümü
                    </button>
                    <button onClick={kopyala} className="inline-flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-lg transition">
                      <FaCopy className="w-3 h-3" /> {copied ? 'Kopyalandı!' : 'Dökümü kopyala'}
                    </button>
                  </div>
                </div>

                {showBd && (
                  <div className="bg-white border border-slate-200 rounded-xl p-4 mt-4 text-sm">
                    <h3 className="text-sm font-bold text-slate-700 mb-3">Balthazard formülü – adım adım</h3>
                    <div className="py-1.5 border-b border-dashed border-slate-200 tabular-nums">
                      <strong>Sıralı oranlar:</strong> {final.items.map((a) => '%' + fmt(a.val)).join(', ')}
                    </div>
                    {final.steps.map((s, i) => (
                      <div key={i} className="py-1.5 border-b border-dashed border-slate-200 tabular-nums">
                        {s.type === 'base'
                          ? <span>1. En yüksek oran → <strong>%{fmt(s.value)}</strong></span>
                          : <span>{i + 1}. %{fmt(s.prev)} + ((100−{fmt(s.prev)})×{fmt(s.r)}÷100) = %{fmt(s.prev)} + %{fmt(s.add)} = <strong>%{fmt(s.value)}</strong>
                            <span className="block text-xs text-slate-400">kalan beden fonksiyonu %{fmt(s.rem)} üzerinden eklendi</span></span>}
                      </div>
                    ))}
                    {final.ageStep && (
                      <div className="py-1.5 border-b border-dashed border-slate-200 tabular-nums">
                        <strong>65+ yaş (+%10):</strong> %{fmt(final.ageStep.prev)} + ((100−{fmt(final.ageStep.prev)})×10÷100) = <strong>%{fmt(final.ageStep.value)}</strong>
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t-2 border-slate-700 font-bold">
                      Sonuç: %{fmt(final.combined)} → yuvarlanmış: %{Math.round(final.combined)}{final.anyEst ? ' (tahmini)' : ''}
                    </div>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4 text-xs text-amber-800 flex items-start gap-2">
                  <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                  <span><strong>Bu bir ön tahmindir.</strong> Kesin maluliyet oranı yalnızca yetkili sağlık kurullarınca, muayene ve ölçümlerle (eklem hareket açıklığı, odyometri, görme alanı, nöropsikolojik test vb.) belirlenir. Bu araç mağduru yönlendirmek ve fikir vermek içindir.</span>
                </div>

                {/* Tazminat zinciri */}
                <Link to="/hesaplama-araclari/trafik-kazasi-tazminati" className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl p-4 mt-4 hover:bg-red-100 transition">
                  <div className="flex items-center gap-3">
                    <FaCalculator className="text-red-500" />
                    <span className="text-xs font-semibold text-red-800">Maluliyet oranını buldunuz mu? Bu orana karşılık gelen <strong>tazminat tutarını</strong> hesaplayın</span>
                  </div>
                  <FaArrowRight className="text-red-500" />
                </Link>
              </>
            )}
          </div>
        )}

        {/* ===================== SEO İÇERİK ===================== */}
        <article className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-slate-900">Maluliyet (Engellilik) Oranı Nedir, Nasıl Hesaplanır?</h2>
          <p>
            <strong>Maluliyet oranı</strong> (engellilik oranı), bir kişinin geçirdiği yaralanma veya hastalık sonucu beden
            fonksiyonlarında oluşan kalıcı kaybı yüzde olarak ifade eden değerdir. Trafik kazası sonrası talep edilecek
            <strong> sürekli sakatlık tazminatının</strong> en kritik girdisi bu orandır. Oran ne kadar yüksekse tazminat da
            o kadar yüksek olur. Oran; <strong>Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik</strong>
            (R.G. 20.02.2019/30692) ekindeki <strong>Ek-2 Engel Oranları Cetveli</strong> esas alınarak belirlenir.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8">Bu Araç Nasıl Çalışır?</h2>
          <p>
            Bu hesaplayıcı, hiçbir tıbbi terim bilmenize gerek kalmadan <strong>soru-cevap (rehberli) akışıyla</strong> ilerler.
            Önce vücudunuzun neresinin yaralandığını seçersiniz (kol, bacak, omurga, kafa, göz, kulak vb.); ardından yaralanma türünü
            (kırık, çıkık, ampütasyon, sinir hasarı…) ve iyileşme sonrası kalıcı durumu işaretlersiniz. Araç, Ek-2 cetvelindeki ilgili
            değeri bulur:
          </p>
          <ul>
            <li><strong>Kesin değer:</strong> Ampütasyon (uzuv kaybı), organ kaybı gibi cetvelde sabit yüzdesi olan kalemler doğrudan verilir.</li>
            <li><strong>Tahmini aralık:</strong> Kırık, eklem hareket kısıtlılığı, işitme/görme kaybı gibi <em>ölçüme dayalı</em> kalemlerde
              bir aralık ve tahmini değer sunulur; kesin oran ancak sağlık kurulu ölçümüyle netleşir.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8">Balthazard Formülü: Birden Fazla Yaralanma Nasıl Birleştirilir?</h2>
          <p>
            Vücutta birden fazla arıza varsa oranlar <strong>toplanmaz</strong>; <strong>Balthazard formülü</strong> ile birleştirilir.
            Mantık şudur: her yeni arıza, <em>geriye kalan sağlam beden fonksiyonu</em> üzerinden etki eder. Önce en yüksek oran alınır;
            sonraki oran, kalan kapasiteye uygulanarak eklenir:
          </p>
          <p className="not-prose bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-sm text-slate-700">
            Birleşik Oran = 100 × (1 − ∏ (1 − rᵢ ⁄ 100))
          </p>
          <p>
            Örneğin %40, %30 ve %20'lik üç arıza toplandığında %90 değil, Balthazard ile yaklaşık <strong>%66,4</strong> bulunur.
            Bu araç bu hesabı sizin için kusursuz ve adım adım dökümlü yapar.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8">65 Yaş ve Üzeri için %10 İlavesi</h2>
          <p>
            Yönetmelik gereği, 65 yaş ve üzerindeki bireylerde bulunan engellilik oranına ayrıca <strong>%10 oranında ilave</strong> yapılır
            (kalan beden fonksiyonu üzerinden). Araç, yaş bilgisini girdiğinizde bu ilaveyi otomatik uygular ve dökümde gösterir.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8">Kaza Tarihi Neden Önemli?</h2>
          <p>
            Maluliyet oranı, <strong>kaza tarihinde yürürlükte olan yönetmeliğe</strong> göre belirlenir. 20.02.2019 ve sonrasındaki kazalarda
            bu araçtaki Ek-2 cetveli birebir geçerlidir. Daha eski tarihli kazalarda farklı yönetmelikler (2013, 2015 vb.) uygulanır; araç,
            kaza tarihini girdiğinizde hangi mevzuatın geçerli olduğunu sizi uyararak gösterir.
          </p>

          <div className="not-prose bg-red-50 border-l-4 border-red-500 p-4 rounded mt-6">
            <p className="text-sm text-red-800">
              <strong>Önemli:</strong> Bu araç bilgilendirme ve ön hesaplama amaçlıdır. Kesin maluliyet oranı; Adli Tıp Kurumu veya
              yetkili sağlık kurulu (heyet) raporu ile belirlenir. Hesaplanan oran, dava ve sigorta sürecinde size yön vermek içindir.
            </p>
          </div>

          {/* Yaygın yaralanma → oran referans tablosu */}
          <h2 className="text-2xl font-bold text-slate-900 mt-8">Yaygın Trafik Kazası Yaralanmaları ve Yaklaşık Maluliyet Oranları</h2>
          <p>
            Aşağıdaki tablo, sık görülen yaralanmalar için Ek-2 cetveline dayalı <strong>yaklaşık</strong> maluliyet oranlarını
            özetler. <strong>Kesin</strong> etiketli kalemler (uzuv/organ kaybı) cetvelde sabittir; <strong>tahmini</strong> kalemler
            kalıcı kısıtlılığın derecesine göre değişir ve kesin oran ancak sağlık kurulu ölçümüyle netleşir. Kendi durumunuza özel
            sonuç için yukarıdaki <strong>rehberli hesaplama aracını</strong> kullanın.
          </p>
          <div className="not-prose overflow-x-auto mt-4">
            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-800 text-white text-left">
                  <th className="px-3 py-2 font-semibold">Yaralanma</th>
                  <th className="px-3 py-2 font-semibold whitespace-nowrap">Yaklaşık oran</th>
                  <th className="px-3 py-2 font-semibold">Tür</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Kol kaybı (omuzdan ampütasyon)', '%60', 'Kesin'],
                  ['Ön kol / el düzeyinde kol kaybı', '%56', 'Kesin'],
                  ['Başparmak kaybı', '%22', 'Kesin'],
                  ['Bir parmağın kaybı (işaret/orta)', '%11', 'Kesin'],
                  ['Bacak kaybı (kalçadan ampütasyon)', '%50', 'Kesin'],
                  ['Diz altı bacak kaybı', '%43', 'Kesin'],
                  ['Ayak bileğinden kayıp (Syme)', '%38', 'Kesin'],
                  ['Burnun tam kaybı', '%47', 'Kesin'],
                  ['Her iki böbreğin işlevsizliği (diyaliz)', '%90', 'Kesin'],
                  ['Bel vertebrası kompresyon kırığı', '%5 – %12', 'Tahmini'],
                  ['Diz / kalça ileri hareket kısıtlılığı (ankiloz)', '%20 – %45', 'Tahmini'],
                  ['Tek gözde görme kaybı', '%20 – %30', 'Tahmini'],
                  ['İki taraflı ileri işitme kaybı', '%25 – %50', 'Tahmini'],
                  ['Tek böbreğin kaybı (diğeri sağlam)', '%15 – %25', 'Tahmini'],
                  ['Yarım vücut felci (hemipleji)', '%50 – %90', 'Tahmini'],
                  ['İki bacak felci (parapleji)', '%70 – %100', 'Tahmini'],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-3 py-2 text-slate-700">{row[0]}</td>
                    <td className="px-3 py-2 font-bold text-slate-800 whitespace-nowrap">{row[1]}</td>
                    <td className="px-3 py-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${row[2] === 'Kesin' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{row[2]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Birden fazla yaralanma varsa bu oranlar <strong>toplanmaz</strong>, Balthazard formülüyle birleştirilir. Tablo bilgilendirme amaçlıdır; kesin oran sağlık kurulu raporuyla belirlenir.
          </p>

          {/* Visible FAQ */}
          <h2 className="text-2xl font-bold text-slate-900 mt-10">Sıkça Sorulan Sorular</h2>
          <div className="not-prose space-y-4 mt-4">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <h3 className="text-base font-semibold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          {/* İlgili içerik */}
          <h2 className="text-2xl font-bold text-slate-900 mt-10">İlgili Hesaplama ve Rehberler</h2>
          <ul className="not-prose grid sm:grid-cols-2 gap-3 mt-4">
            <li>
              <Link to="/hesaplama-araclari/trafik-kazasi-tazminati" className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-red-400 transition text-sm font-medium text-slate-700">
                Trafik Kazası Maluliyet Tazminatı Hesaplama →
              </Link>
            </li>
            <li>
              <Link to="/hesaplama-araclari/arac-hasar-ikame-arac" className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-red-400 transition text-sm font-medium text-slate-700">
                İkame Araç & Araç Hasar Tazminatı Hesaplama →
              </Link>
            </li>
            <li>
              <Link to="/makale/trafik-kazasi-sonrasi-maluliyet-heyet-raporu-nasil-ve-nereden-alinir-2025-rehberi" className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-red-400 transition text-sm font-medium text-slate-700">
                Maluliyet (Heyet) Raporu Nasıl Alınır? →
              </Link>
            </li>
            <li>
              <Link to="/makale/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026" className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-red-400 transition text-sm font-medium text-slate-700">
                Trafik Kazasında Kusur Tespiti Rehberi →
              </Link>
            </li>
          </ul>
        </article>
      </div>

      <HesaplamaDisclaimer
        aracAdi="maluliyet (engellilik) oranı hesaplama aracı"
        mevzuat="Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik (R.G. 20.02.2019/30692) ve Ek-2 Engel Oranları Cetveli"
        ekNotlar={[
          'Maluliyet oranı yalnızca Adli Tıp Kurumu veya yetkili sağlık kurulu (heyet) raporuyla kesinleşir; bu araçtaki değerler ön tahmindir.',
          'Ölçüme dayalı kalemlerde (kırık, eklem hareket kısıtlılığı, işitme, görme) kesin oran odyometri, görme alanı ve eklem hareket açıklığı ölçümleriyle belirlenir.',
          'Birden fazla arıza Balthazard formülüyle birleştirilir; 65 yaş ve üzeri bireylerde orana %10 ilave edilir.',
          'Maluliyet oranı, kaza tarihinde yürürlükte olan yönetmeliğe göre belirlenir; 20.02.2019 öncesi kazalarda farklı cetveller uygulanabilir.',
        ]}
      />
    </div>
  );
};

// FAQ — prerender.js'teki FAQPage şeması ile birebir eşleşmelidir
export const FAQ_ITEMS = [
  {
    q: 'Maluliyet (engellilik) oranı nasıl hesaplanır?',
    a: 'Maluliyet oranı, Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik ekindeki Ek-2 Engel Oranları Cetveli esas alınarak belirlenir. Her yaralanma veya fonksiyon kaybı için cetvelde karşılık gelen yüzde bulunur; birden fazla arıza varsa Balthazard formülüyle birleştirilir ve 65 yaş üzeri bireylerde orana %10 ilave edilir.'
  },
  {
    q: 'Balthazard formülü nedir ve oranlar neden toplanmaz?',
    a: 'Balthazard formülü, birden fazla engellilik oranını birleştirmek için kullanılır. Oranlar doğrudan toplanmaz; çünkü her yeni arıza, geriye kalan sağlam beden fonksiyonu üzerinden etki eder. Formül: Birleşik = 100 × (1 − çarpım(1 − rᵢ/100)). Örneğin %40, %30 ve %20 birleştiğinde sonuç %90 değil, yaklaşık %66,4 olur.'
  },
  {
    q: 'Bu araç kesin maluliyet oranımı verir mi?',
    a: 'Hayır. Bu araç ön tahmin verir ve sizi yönlendirir. Kesin maluliyet oranı yalnızca Adli Tıp Kurumu veya yetkili sağlık kurulu (heyet) raporuyla; muayene ve ölçümlerle (eklem hareket açıklığı, odyometri, görme alanı, nöropsikolojik test vb.) belirlenir. Özellikle kırık ve eklem kısıtlılığı gibi ölçüme dayalı kalemlerde aracın verdiği değer bir aralık tahminidir.'
  },
  {
    q: '65 yaş ve üzeri için neden orana %10 ekleniyor?',
    a: 'Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik gereği, 65 yaş ve üzerindeki bireylerde bulunan engellilik oranına kalan beden fonksiyonu üzerinden ayrıca %10 ilave yapılır. Araç, yaş bilgisini girdiğinizde bu ilaveyi otomatik uygular.'
  },
  {
    q: 'Maluliyet oranı tazminat tutarını nasıl etkiler?',
    a: 'Maluliyet oranı, sürekli sakatlık (iş göremezlik) tazminatının doğrudan çarpanıdır. Tazminat; bakiye ömür, yıllık kazanç ve maluliyet oranının çarpımıyla hesaplanır. Oran arttıkça tazminat da artar. Oranı bulduktan sonra Trafik Kazası Maluliyet Tazminatı Hesaplama aracımızla tutarı hesaplayabilirsiniz.'
  },
  {
    q: 'Kaza tarihi maluliyet oranını neden etkiler?',
    a: 'Maluliyet oranı, kaza tarihinde yürürlükte olan yönetmeliğe göre belirlenir. 20.02.2019 ve sonrasındaki kazalarda Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik (Ek-2 cetveli) uygulanır. Daha eski kazalarda 2013 veya 2015 tarihli yönetmelikler gibi farklı mevzuat geçerli olabilir; bu nedenle araç kaza tarihini girdiğinizde uygulanacak yönetmeliği belirtir.'
  },
  {
    q: 'En düşük kaç maluliyet oranından tazminat alınır?',
    a: 'Trafik kazası kaynaklı bedensel zararlarda sürekli sakatlık tazminatı için yasal bir alt sınır yoktur; %1 düzeyinde sürekli bir maluliyet dahi tazminat hakkı doğurur ve oran arttıkça tazminat tutarı da artar. (Not: SGK tarafından sürekli iş göremezlik geliri bağlanması için %10 gibi eşikler aranır; bu, kusurlu tarafa/sigortaya karşı açılan trafik kazası tazminat davasından farklı bir konudur.)'
  },
  {
    q: 'Kol veya bacak kırığı kaç maluliyet oranı verir?',
    a: 'Basit ve sorunsuz kaynayan bir kırık çoğunlukla kalıcı maluliyet bırakmaz (yaklaşık %0). Maluliyet, kırığın iyileşme sonrası bıraktığı kalıcı sonuçtan doğar: eklemde hareket kısıtlılığı, kaynamama (psödoartroz), kısalık veya sinir hasarı. Hafif kısıtlılıkta tek haneli, ileri kısıtlılık veya ankilozda daha yüksek oranlar çıkabilir. Kesin oran eklem hareket açıklığı ölçümüyle belirlenir; aracın rehberli akışı size bir tahmin aralığı verir.'
  },
  {
    q: 'Bel fıtığı veya omurga (vertebra) kırığı maluliyet oranı kaç?',
    a: 'Omurga yaralanmalarında oran; etkilenen bölgeye (boyun/sırt/bel) ve hasarın türüne göre değişir. Örneğin bir bel vertebrasının kompresyon kırığında çökme miktarına göre yaklaşık %5–12; ameliyatlı disk lezyonunda birkaç puan düzeyinde değerler söz konusudur. Omurilik veya sinir kökü tutulumu varsa oran çok daha yüksek olur. Birden fazla omur etkilendiyse her birinin oranı Balthazard formülüyle birleştirilir.'
  },
  {
    q: 'Bir uzvun (kol, bacak, parmak) tamamen kaybı yüzde kaç maluliyettir?',
    a: 'Ampütasyonların cetvelde sabit (kesin) oranı vardır: omuzdan kol kaybı yaklaşık %60, ön kol/el düzeyinde %56, başparmak %22; kalçadan bacak kaybı %50, diz altı %43, ayak bileğinden (Syme) %38. Tam liste için aracın "ampütasyon" adımını kullanabilirsiniz.'
  },
  {
    q: 'Maluliyet oranına nasıl itiraz edilir?',
    a: 'Sağlık kurulu raporundaki orana katılmıyorsanız itiraz edebilirsiniz. Uygulamada rapora karşı bir üst sağlık kuruluna ya da Adli Tıp Kurumu’na yeniden değerlendirme için başvurulabilir; dava aşamasında mahkemeden yeni bir heyet veya bilirkişi raporu talep edilebilir. Süreç teknik ve süreye tabi olduğundan bir avukatla yürütmeniz önerilir.'
  },
  {
    q: 'Maluliyet (heyet) raporu nereden alınır?',
    a: 'Rapor; Sağlık Bakanlığınca yetkilendirilmiş üniversite, eğitim-araştırma ve tam teşekküllü devlet hastanelerinin sağlık kurullarından ya da Adli Tıp Kurumu’ndan alınır. Dava sürecinde mahkeme genellikle ATK veya üniversite hastanesinden rapor ister. Ayrıntı için "Maluliyet (Heyet) Raporu Nasıl Alınır?" rehberimize bakabilirsiniz.'
  },
  {
    q: 'Geçici iş göremezlik ile sürekli maluliyet arasındaki fark nedir?',
    a: 'Geçici iş göremezlik, tedavi ve iyileşme süresince işe/günlük yaşama ara verilen dönemdeki geçici kayıptır ve ayrı hesaplanır. Sürekli maluliyet ise iyileşme tamamlandıktan sonra geriye kalan kalıcı engellilik oranıdır. Bu araç sürekli (kalıcı) maluliyet oranını tahmin eder.'
  },
  {
    q: 'Bu araç çocuklar için de kullanılabilir mi?',
    a: 'Hayır. Bu araç 18 yaş ve üzeri erişkinler için, Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmeliğe dayanır. 18 yaş altı bireyler için "Çocuklar İçin Özel Gereksinim Raporu (ÇÖZGER)" mevzuatı uygulanır ve oranlandırma esasları farklıdır.'
  },
  {
    q: 'Maluliyet tazminatı ne zaman zamanaşımına uğrar?',
    a: 'Trafik kazası tazminat taleplerinde kural olarak zararı ve sorumluyu öğrenmeden itibaren 2 yıllık ve her hâlde olay tarihinden itibaren 10 yıllık zamanaşımı uygulanır; ancak fiil aynı zamanda suç teşkil ediyorsa daha uzun ceza zamanaşımı süreleri devreye girebilir. Hak kaybı yaşamamak için en kısa sürede bir avukata danışmanız önerilir.'
  },
  {
    q: 'Diz bağ kopması veya menisküs yaralanması maluliyet oranı kaç?',
    a: 'Diz içi yaralanmalarda (ön/arka çapraz bağ, menisküs) maluliyet, ameliyat sonrası kalan instabilite ve hareket kısıtlılığına göre belirlenir. Hafif kısıtlılıkta tek haneli, ileri kısıtlılık veya diz ankilozunda yaklaşık %20–40’a varan oranlar söz konusu olabilir. Kesin oran diz hareket açıklığı ve stabilite muayenesiyle belirlenir.'
  },
  {
    q: 'Kaburga kırığı maluliyet oranı kaç?',
    a: 'Sorunsuz iyileşen kaburga kırıkları çoğunlukla kalıcı maluliyet bırakmaz (yaklaşık %0–5). Ancak çok sayıda kaburga kırığı, akciğer hasarı veya kalıcı solunum kısıtlılığı eşlik ediyorsa oran yükselir; bu durumda solunum fonksiyon testi esas alınır.'
  },
  {
    q: 'Kalça kırığı veya kalça protezi maluliyet oranı kaç?',
    a: 'Kalça kırıklarında oran kalan hareket kısıtlılığına göre yaklaşık %2–20; ileri kısıtlılık veya ankilozda daha yüksektir. Başarılı bir kalça protezinde fonksiyon büyük ölçüde düzelse de cetvel, protez sonrası belirli bir kalıcı kısıtlılık öngörür; kesin oran muayeneyle belirlenir.'
  },
  {
    q: 'Omuz çıkığı veya kırığı maluliyet oranı kaç?',
    a: 'Omuz yaralanmalarında oran, kolun yukarı kaldırılması ve döndürülmesindeki kalıcı kısıtlılığa göre değişir: hafifte %2–8, ortada %8–20, ileri kısıtlılık veya ankilozda yaklaşık %20–45. Tekrarlayan çıkık (instabilite) ayrıca değerlendirilir.'
  },
  {
    q: 'El veya parmak kırığı ya da kaybı maluliyet oranı kaç?',
    a: 'El ve parmak yaralanmalarında oran, hareket kısıtlılığına ve varsa parmak kaybına göre belirlenir. Hareket kısıtlılığında yaklaşık %1–25; tam kayıpta cetveldeki sabit değerler geçerlidir: başparmak kaybı %22, işaret veya orta parmak %11, yüzük veya küçük parmak %5.'
  },
  {
    q: 'Ayak bileği kırığı maluliyet oranı kaç?',
    a: 'Ayak bileği kırıklarında oran, kalan hareket kısıtlılığı ve instabiliteye göre yaklaşık %2–6 (hafif), %6–15 (orta), %15–30 (ileri veya ankiloz) aralığındadır. Eklem içi kırıklar ve kaynama bozuklukları oranı yükseltir.'
  },
  {
    q: 'Kafa travması veya beyin hasarı maluliyet oranı kaç?',
    a: 'Kafa travmasında oran, kalıcı nörolojik ve bilişsel etkilenmeye göre çok geniş bir aralıkta değişir: süregelen baş ağrısı veya baş dönmesinde tek haneli; hafıza-dikkat gibi bilişsel kayıplarda yaklaşık %10–90; post-travmatik epilepside nöbet sıklığına göre %10–90. Kesin oran nöroloji ve nöropsikolojik testlerle belirlenir.'
  },
  {
    q: 'Tek gözün görme kaybı maluliyet oranı kaç?',
    a: 'Bir gözün tamamen görme kaybında oran yaklaşık %20–30 düzeyindedir; kısmi görme azalmasında değer, görme keskinliği ve görme alanı skoruna (GSYO) göre düşer. İki gözde ileri kayıp veya körlükte oran %85–100’e ulaşır. Kesin oran göz muayenesiyle belirlenir.'
  },
  {
    q: 'İşitme kaybı maluliyet oranı kaç?',
    a: 'İşitme kaybında oran odyometri (işitme testi) sonucuna göre belirlenir: tek kulakta kısmi kayıpta tek haneli, tek kulak tam sağırlıkta yaklaşık %6–15, iki taraflı ileri veya tam kayıpta yaklaşık %25–50.'
  },
  {
    q: 'Dalak veya böbrek kaybı gibi iç organ yaralanmalarında maluliyet oranı kaç?',
    a: 'İç organ kayıplarında oran organa göre değişir: dalağın alınması (splenektomi) yaklaşık %3–10; tek böbreğin kaybı (diğeri sağlam) yaklaşık %15–25; her iki böbreğin işlevsizliği (diyaliz bağımlılığı) %90; tek akciğerin alınması (pnömonektomi) yaklaşık %10.'
  },
  {
    q: 'Menisküs ameliyatı (artroskopi) sonrası maluliyet oranı kaç?',
    a: 'Menisküs yırtığında, özellikle menisektomi (menisküsün alınması) sonrası dizde kalıcı kısıtlılık veya erken kireçlenme gelişebilir. Maluliyet, ameliyat sonrası kalan diz hareket kısıtlılığı ve instabiliteye göre belirlenir; çoğu olguda tek haneli, ileri durumlarda daha yüksek oranlar söz konusudur. Kesin oran diz muayenesiyle saptanır.'
  },
  {
    q: 'Platin, vida veya çivi takılması tek başına maluliyet verir mi?',
    a: 'Hayır; kırık için takılan platin, vida veya çivi (osteosentez) tek başına maluliyet oranı doğurmaz. Maluliyet, implanttan değil kırığın bıraktığı kalıcı sonuçtan (hareket kısıtlılığı, kaynamama, kısalık) doğar. Donanım nedeniyle ileride hareket kısıtlılığı veya kalıcı ağrı kalırsa, bu ilgili eklem üzerinden değerlendirilir.'
  },
  {
    q: 'Boyun fıtığı (servikal disk) maluliyet oranı kaç?',
    a: 'Boyun (servikal) bölgesinde travmaya bağlı disk lezyonunda oran düşük seviyededir; ameliyatsız ancak kalıcı bulgulu olgularda yaklaşık %4, ameliyatlı disk lezyonunda birkaç puan civarındadır. Kola yayılan kuvvet veya his kaybı (radikülopati) varsa oran, sinir tutulumu üzerinden ayrıca değerlendirilir.'
  },
  {
    q: 'El bileği veya kol kemiğinde kaynamama (psödoartroz) maluliyet oranı kaç?',
    a: 'Kırığın kaynamaması (psödoartroz), kaynamış bir kırığa göre daha yüksek maluliyet verir; çünkü ilgili bölgede kalıcı işlev kaybı sürer. Oran, etkilenen ekleme ve kalan hareket veya kuvvet kaybına göre belirlenir ve genellikle orta-ileri kısıtlılık bandında değerlendirilir.'
  },
  {
    q: 'Çene (mandibula) kırığı maluliyet oranı kaç?',
    a: 'Sorunsuz iyileşen çene kırığı genelde kalıcı maluliyet bırakmaz. Çiğneme fonksiyonunda kalıcı bozukluk, ağız açıklığında kısıtlılık ya da cerrahi rezeksiyon varsa oran yükselir; örneğin mandibulanın bir segmentinin alınmasında yaklaşık %13, çenenin yarısının alınmasında (hemimandibulektomi) %33 gibi değerler söz konusudur.'
  },
  {
    q: 'Burun kırığı maluliyet oranı kaç?',
    a: 'Şekil bozukluğu bırakmadan iyileşen burun kırığı genelde maluliyet vermez. Kalıcı şekil bozukluğu veya nefes almayı bozan eğrilik varsa düşük oranlar (yaklaşık %2–12); burnun tamamen kaybı gibi ağır durumlarda %47 gibi sabit bir değer söz konusudur.'
  },
  {
    q: 'Köprücük kemiği (klavikula) kırığı maluliyet oranı kaç?',
    a: 'Köprücük kemiği kırıkları çoğunlukla sorunsuz iyileşir ve kalıcı maluliyet bırakmaz. Kaynamama veya omuz hareketlerinde kalıcı kısıtlılık kalırsa oran, omuz fonksiyonu üzerinden (hafifte tek haneli) değerlendirilir.'
  },
  {
    q: 'Diz protezi (total diz replasmanı) sonrası maluliyet oranı kaç?',
    a: 'Başarılı bir diz protezinde fonksiyon büyük ölçüde düzelse de cetvel, protez sonrası belirli bir kalıcı kısıtlılık öngörür. Oran, ameliyat sonrası kalan hareket açıklığı ve stabiliteye göre belirlenir; kesin değer muayeneyle saptanır.'
  },
  {
    q: 'Bacakta kısalık kalması maluliyet oranını etkiler mi?',
    a: 'Evet. Kırık sonrası bacakta kalıcı kısalık; aksamaya ve yük dağılımının bozulmasına yol açtığından ayrı bir engel unsuru olarak değerlendirilir ve diğer kısıtlılıklarla birlikte orana yansır. Kısalık miktarı ölçülerek dikkate alınır.'
  },
  {
    q: 'Yüzde kalıcı iz veya yara izi maluliyet sayılır mı?',
    a: 'Yüzdeki kalıcı izler, büyüklüğüne ve belirginliğine göre değerlendirilebilir; geniş veya fonksiyonu (göz kapağı, dudak hareketi gibi) bozan izlerde oran artar. Ayrıca yüzde sabit eser veya iz, trafik kazası davalarında manevi tazminatın da önemli bir gerekçesidir.'
  },
  {
    q: 'Travma sonrası düşük ayak (ayağı yukarı kaldıramama) maluliyet oranı kaç?',
    a: 'Düşük ayak genellikle peroneal sinir hasarına bağlıdır ve yürümeyi belirgin biçimde etkiler. Maluliyet, sinir hasarının derecesine göre belirlenir; kısmi olgularda orta, kalıcı tam kayıpta daha yüksek oranlar söz konusudur. Kesin oran nörolojik muayene ve EMG ile değerlendirilir.'
  },
  {
    q: 'Elde tendon veya sinir kesisi maluliyet oranı kaç?',
    a: 'El ve bilekteki tendon veya sinir kesilerinde oran, parmak ve elin kalıcı hareket ve his kaybına göre belirlenir. Hafif olgularda düşük, birden fazla parmağı tutan kalıcı kayıplarda daha yüksek oranlar çıkar; kesin oran el fonksiyon muayenesiyle saptanır.'
  },
  {
    q: 'Birden çok bölgede kırığım var (kol, bacak, kaburga), toplam maluliyet nasıl bulunur?',
    a: 'Her kırığın bıraktığı kalıcı oran ayrı ayrı belirlenir, sonra Balthazard formülüyle birleştirilir (toplanmaz). Örneğin %15, %10 ve %5’lik üç ayrı oran birleştiğinde sonuç %30 değil, yaklaşık %27,6 olur. Aracımız bu birleştirmeyi otomatik ve adım adım yapar.'
  },
  {
    q: 'Maluliyet oranı kaza sonrası ne zaman, kaç ay sonra belirlenir?',
    a: 'Maluliyet, iyileşme tamamlanıp kalıcı durum oturduktan sonra belirlenir. Uygulamada genellikle kaza veya tedavi sonrası belirli bir süre (çoğu olguda yaklaşık 12-18 ay) beklenir; erken alınan raporlarda oran eksik tespit edilebilir ve itiraza konu olabilir.'
  },
  {
    q: 'Maluliyet oranı sonradan artırılabilir veya yeniden değerlendirilebilir mi?',
    a: 'Evet. Durumda kötüleşme ya da yeni bir engelin ortaya çıkması hâlinde, süreli raporlarda kontrol muayenesiyle oran yeniden değerlendirilebilir. Dava sürecinde de mevcut rapora itiraz edilerek yeni bir heyet veya bilirkişi raporu talep edilebilir.'
  },
];

export default MaluliyetHesaplamaPage;
