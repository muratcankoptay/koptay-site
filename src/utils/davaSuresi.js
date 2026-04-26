/**
 * Dava Süresi Hesaplama Yardımcı Fonksiyonları
 *
 * Bu modül üç ana hesaplama tipini destekler:
 *  1) Zamanaşımı / Hak Düşürücü Süre
 *  2) Ortalama Dava Süresi Tahmini (Adalet Bakanlığı istatistikleri esas alınarak)
 *  3) Usul / Yargılama Süreleri (HMK, CMK, İYUK, İİK, TMK)
 *
 * UYARI: Bilgi amaçlıdır. Her olayın özel koşulları hesaplamayı değiştirebilir.
 * Kesin sonuç için avukat görüşü zorunludur.
 */

// =====================================================================
// 1) ZAMANAŞIMI VERİTABANI
// =====================================================================
// Süre birimi: { yil, ay, gun }
// kanunMaddesi: yasal dayanak
// not: özel açıklama
// hak_dusurucu: true ise hak düşürücü süre, false/undefined ise zamanaşımı

export const ZAMANASIMI_KATEGORILERI = [
  {
    id: 'tazminat',
    ad: 'Tazminat ve Trafik / İş Kazası',
    aciklama: 'Haksız fiil, trafik kazası, iş kazası, malpraktis tazminatları',
    seçenekler: [
      {
        id: 'haksiz-fiil-bilinen',
        ad: 'Haksız fiil tazminatı (zarar/fail öğrenildikten itibaren)',
        sure: { yil: 2, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.72/1',
        not: 'Zarar görenin zararı ve faili öğrendiği tarihten itibaren 2 yıl. Aksi halde her halükarda 10 yıl.',
      },
      {
        id: 'haksiz-fiil-mutlak',
        ad: 'Haksız fiil tazminatı (olay tarihinden itibaren mutlak süre)',
        sure: { yil: 10, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.72/1',
        not: 'Olayın gerçekleştiği tarihten itibaren 10 yıl içinde dava açılmazsa zamanaşımı dolar.',
      },
      {
        id: 'trafik-kazasi-maddi',
        ad: 'Trafik kazası kaynaklı maddi tazminat',
        sure: { yil: 2, ay: 0, gun: 0 },
        kanunMaddesi: 'KTK m.109',
        not: 'Zarar görenin zararı ve sorumluyu öğrendiği tarihten itibaren 2 yıl, her halde 10 yıl.',
      },
      {
        id: 'trafik-kazasi-ceza',
        ad: 'Trafik kazası ceza zamanaşımı süresine tabi tazminat',
        sure: { yil: 8, ay: 0, gun: 0 },
        kanunMaddesi: 'KTK m.109/2 - TCK m.66',
        not: 'Eğer eylem suç teşkil ediyorsa ve ceza zamanaşımı daha uzunsa, o süre uygulanır (genelde 8 yıl).',
      },
      {
        id: 'is-kazasi-maddi-manevi',
        ad: 'İş kazası maddi/manevi tazminat',
        sure: { yil: 10, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.146',
        not: 'İş kazasından doğan tazminat davaları sözleşmeye aykırılık olarak değerlendirilir, 10 yıllık genel zamanaşımına tabidir.',
      },
      {
        id: 'destek-tazminati',
        ad: 'Destekten yoksun kalma tazminatı',
        sure: { yil: 2, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.72',
        not: 'Ölüm tarihinden itibaren 2 yıl, her halde 10 yıl. Ceza zamanaşımı daha uzunsa o süre uygulanır.',
      },
      {
        id: 'malpraktis',
        ad: 'Tıbbi malpraktis (hekim hatası) tazminatı',
        sure: { yil: 5, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.147',
        not: 'Vekalet ilişkisi kapsamında 5 yıl. Haksız fiil olarak da değerlendirilebilir (2 yıl/10 yıl).',
      },
      {
        id: 'manevi-tazminat',
        ad: 'Manevi tazminat (kişilik haklarına saldırı)',
        sure: { yil: 2, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.72',
        not: 'Öğrenmeden itibaren 2 yıl, her halde 10 yıl.',
      },
    ],
  },
  {
    id: 'is-hukuku',
    ad: 'İş Hukuku',
    aciklama: 'İşçilik alacakları, kıdem, ihbar, fazla mesai, işe iade',
    seçenekler: [
      {
        id: 'kidem-tazminati',
        ad: 'Kıdem tazminatı',
        sure: { yil: 5, ay: 0, gun: 0 },
        kanunMaddesi: 'İK m.32 / 7036 SK m.15',
        not: 'İş sözleşmesinin sona erdiği tarihten itibaren 5 yıl.',
      },
      {
        id: 'ihbar-tazminati',
        ad: 'İhbar tazminatı',
        sure: { yil: 5, ay: 0, gun: 0 },
        kanunMaddesi: 'İK m.32',
        not: 'Sözleşme sona erdiği tarihten itibaren 5 yıl.',
      },
      {
        id: 'kotuniyet-tazminati',
        ad: 'Kötüniyet tazminatı',
        sure: { yil: 5, ay: 0, gun: 0 },
        kanunMaddesi: 'İK m.32',
        not: 'Sözleşmenin sona erdiği tarihten itibaren 5 yıl.',
      },
      {
        id: 'fazla-mesai',
        ad: 'Fazla mesai ücreti',
        sure: { yil: 5, ay: 0, gun: 0 },
        kanunMaddesi: 'İK m.32 / TBK m.147',
        not: 'Her bir aylık ücret için ayrı ayrı, alacak doğduğu tarihten itibaren 5 yıl.',
      },
      {
        id: 'yillik-izin-ucreti',
        ad: 'Yıllık izin ücreti',
        sure: { yil: 5, ay: 0, gun: 0 },
        kanunMaddesi: 'İK m.59',
        not: 'Sözleşmenin sona erdiği tarihten itibaren 5 yıl.',
      },
      {
        id: 'ucret-alacagi',
        ad: 'Ücret, prim, ikramiye alacağı',
        sure: { yil: 5, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.147/1',
        not: 'Her bir alacağın muaccel olduğu tarihten itibaren 5 yıl.',
      },
      {
        id: 'ise-iade',
        ad: 'İşe iade davası (HAK DÜŞÜRÜCÜ)',
        sure: { yil: 0, ay: 1, gun: 0 },
        kanunMaddesi: '7036 SK m.3 - İK m.20',
        not: 'Önce arabuluculuğa başvuru zorunlu (1 ay). Anlaşmazlık tutanağı tarihinden itibaren 2 hafta içinde dava. HAK DÜŞÜRÜCÜ SÜRE.',
        hak_dusurucu: true,
      },
      {
        id: 'mobbing',
        ad: 'Mobbing tazminatı',
        sure: { yil: 5, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.147',
        not: 'Sözleşmesel ilişki kapsamında 5 yıl, haksız fiil değerlendirilirse 2 yıl/10 yıl.',
      },
    ],
  },
  {
    id: 'sozlesme',
    ad: 'Sözleşme ve Borçlar Hukuku',
    aciklama: 'Genel sözleşme alacakları, kira, satış, vekalet',
    seçenekler: [
      {
        id: 'genel-zamanasimi',
        ad: 'Genel zamanaşımı (özel hüküm yoksa)',
        sure: { yil: 10, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.146',
        not: 'Kanunda aksine hüküm bulunmadıkça her alacak 10 yıllık zamanaşımına tabidir.',
      },
      {
        id: 'bes-yillik',
        ad: 'Kira, faiz, taksit, ücret alacakları',
        sure: { yil: 5, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.147',
        not: 'Kira bedelleri, anapara faizleri, hayat boyu gelir, periyodik edalar.',
      },
      {
        id: 'satis-ayip',
        ad: 'Satılanın ayıbından dolayı sorumluluk',
        sure: { yil: 2, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.231',
        not: 'Satış tarihinden itibaren 2 yıl. Taşınmazda 5 yıl.',
      },
      {
        id: 'eser-sozlesmesi',
        ad: 'Eser sözleşmesinden doğan ayıp davası',
        sure: { yil: 5, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.478',
        not: 'Taşınır 2 yıl, taşınmaz 5 yıl, ağır kusur halinde 20 yıl.',
      },
      {
        id: 'vekalet',
        ad: 'Vekalet sözleşmesinden doğan alacaklar',
        sure: { yil: 5, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.147',
        not: 'Vekalet ücreti ve buna bağlı alacaklar.',
      },
      {
        id: 'cek',
        ad: 'Çek (hamilden keşideciye)',
        sure: { yil: 3, ay: 0, gun: 0 },
        kanunMaddesi: 'TTK m.814',
        not: 'İbraz süresinin bitiminden itibaren 3 yıl.',
      },
      {
        id: 'bono-police',
        ad: 'Bono / poliçe (hamilden kabul edene)',
        sure: { yil: 3, ay: 0, gun: 0 },
        kanunMaddesi: 'TTK m.749',
        not: 'Vade tarihinden itibaren 3 yıl.',
      },
    ],
  },
  {
    id: 'ceza',
    ad: 'Ceza Hukuku',
    aciklama: 'Dava ve ceza zamanaşımı, şikayet süresi',
    seçenekler: [
      {
        id: 'sikayet',
        ad: 'Şikayete bağlı suçlarda şikayet süresi',
        sure: { yil: 0, ay: 6, gun: 0 },
        kanunMaddesi: 'TCK m.73/1',
        not: 'Mağdur, fiili ve faili öğrendiği günden itibaren 6 ay içinde şikayet etmelidir. HAK DÜŞÜRÜCÜ.',
        hak_dusurucu: true,
      },
      {
        id: 'dava-zamanasimi-agirhapis',
        ad: 'Ağırlaştırılmış müebbet hapis cezası gerektiren suçlar',
        sure: { yil: 30, ay: 0, gun: 0 },
        kanunMaddesi: 'TCK m.66/1-a',
        not: 'Suçun işlendiği tarihten itibaren 30 yıl içinde dava açılmazsa zamanaşımı.',
      },
      {
        id: 'dava-zamanasimi-muebbet',
        ad: 'Müebbet hapis cezası gerektiren suçlar',
        sure: { yil: 25, ay: 0, gun: 0 },
        kanunMaddesi: 'TCK m.66/1-b',
        not: '25 yıl.',
      },
      {
        id: 'dava-zamanasimi-yirmi',
        ad: '20 yıldan fazla hapis cezası gerektiren suçlar',
        sure: { yil: 20, ay: 0, gun: 0 },
        kanunMaddesi: 'TCK m.66/1-c',
        not: '20 yıl.',
      },
      {
        id: 'dava-zamanasimi-onbes',
        ad: '5-20 yıl arası hapis cezası gerektiren suçlar',
        sure: { yil: 15, ay: 0, gun: 0 },
        kanunMaddesi: 'TCK m.66/1-d',
        not: '15 yıl.',
      },
      {
        id: 'dava-zamanasimi-sekiz',
        ad: '5 yıldan az hapis veya adli para cezası',
        sure: { yil: 8, ay: 0, gun: 0 },
        kanunMaddesi: 'TCK m.66/1-e',
        not: '8 yıl.',
      },
      {
        id: 'ceza-zamanasimi-agirhapis',
        ad: 'Ceza zamanaşımı – Ağırlaştırılmış müebbet',
        sure: { yil: 40, ay: 0, gun: 0 },
        kanunMaddesi: 'TCK m.68/1-a',
        not: 'Hükmün kesinleştiği tarihten itibaren cezanın infaz edilebileceği süre.',
      },
      {
        id: 'ceza-zamanasimi-muebbet',
        ad: 'Ceza zamanaşımı – Müebbet hapis',
        sure: { yil: 30, ay: 0, gun: 0 },
        kanunMaddesi: 'TCK m.68/1-b',
        not: '30 yıl.',
      },
      {
        id: 'ceza-zamanasimi-yirmi',
        ad: 'Ceza zamanaşımı – 20 yıl ve üzeri hapis',
        sure: { yil: 24, ay: 0, gun: 0 },
        kanunMaddesi: 'TCK m.68/1-c',
        not: '24 yıl.',
      },
    ],
  },
  {
    id: 'miras',
    ad: 'Miras Hukuku',
    aciklama: 'Mirasın reddi, tenkis, mirasçılık belgesi',
    seçenekler: [
      {
        id: 'mirasin-reddi',
        ad: 'Mirasın reddi (HAK DÜŞÜRÜCÜ)',
        sure: { yil: 0, ay: 3, gun: 0 },
        kanunMaddesi: 'TMK m.606',
        not: 'Yasal mirasçılar miras bırakanın ölümünü öğrendikleri, atanmış mirasçılar ise miras bırakanın atamayı öğrendikleri günden itibaren 3 ay. HAK DÜŞÜRÜCÜ SÜRE.',
        hak_dusurucu: true,
      },
      {
        id: 'tenkis',
        ad: 'Tenkis davası',
        sure: { yil: 1, ay: 0, gun: 0 },
        kanunMaddesi: 'TMK m.571',
        not: 'Mirasçıların saklı paylarının zedelendiğini öğrendikleri tarihten itibaren 1 yıl, vasiyetnamelerde her halde 10 yıl.',
      },
      {
        id: 'tasarrufun-iptali-miras',
        ad: 'Vasiyetnamenin iptali davası',
        sure: { yil: 1, ay: 0, gun: 0 },
        kanunMaddesi: 'TMK m.559',
        not: 'İptal sebebinin öğrenildiği tarihten itibaren 1 yıl, her halde 10 yıl (iyiniyetli üçüncü kişilere karşı 20 yıl).',
      },
      {
        id: 'miras-sebebiyle-istihkak',
        ad: 'Miras sebebiyle istihkak davası',
        sure: { yil: 1, ay: 0, gun: 0 },
        kanunMaddesi: 'TMK m.639',
        not: 'Davacının kendisinin mirasçı olduğunu ve davalının terekeye el koyduğunu öğrendiği tarihten itibaren 1 yıl, her halde 10 yıl.',
      },
    ],
  },
  {
    id: 'gayrimenkul',
    ad: 'Gayrimenkul ve Eşya Hukuku',
    aciklama: 'Tapu iptali, müdahalenin meni, kamulaştırma',
    seçenekler: [
      {
        id: 'tapu-iptali-yolsuz-tescil',
        ad: 'Yolsuz tescile dayalı tapu iptali',
        sure: { yil: 0, ay: 0, gun: 0 },
        kanunMaddesi: 'TMK m.1023',
        not: 'Mülkiyet hakkı zamanaşımına uğramaz. Ancak iyiniyetli üçüncü kişiler korunur.',
        ozel: 'Zamanaşımına tabi değil',
      },
      {
        id: 'olaganustu-zamanasimi',
        ad: 'Olağanüstü zamanaşımı ile iktisap',
        sure: { yil: 20, ay: 0, gun: 0 },
        kanunMaddesi: 'TMK m.713',
        not: 'Tapuda kayıtlı olmayan veya kim olduğu belirsiz taşınmazlar 20 yıl iyiniyetli ve davasız zilyetlikle iktisap edilir.',
      },
      {
        id: 'olagan-zamanasimi',
        ad: 'Olağan zamanaşımı ile iktisap',
        sure: { yil: 10, ay: 0, gun: 0 },
        kanunMaddesi: 'TMK m.712',
        not: 'Yolsuz tescile dayanan iyiniyetli zilyet 10 yıl davasız ve aralıksız ise mülk sahibi olur.',
      },
      {
        id: 'kamulastirma-bedel',
        ad: 'Kamulaştırma bedelinin tespiti davası',
        sure: { yil: 0, ay: 0, gun: 30 },
        kanunMaddesi: '2942 SK m.10',
        not: 'Kamulaştırma kararının tebliğinden itibaren 30 gün. HAK DÜŞÜRÜCÜ.',
        hak_dusurucu: true,
      },
      {
        id: 'kamulastirmasiz-elatma',
        ad: 'Kamulaştırmasız el atma tazminatı',
        sure: { yil: 0, ay: 0, gun: 0 },
        kanunMaddesi: '2942 SK m.38 - AYM kararları',
        not: 'Anayasa Mahkemesi 2942 SK m.38\'i iptal etti. Mülkiyet hakkı zamanaşımına uğramaz.',
        ozel: 'Zamanaşımına tabi değil',
      },
      {
        id: 'mudahalenin-meni',
        ad: 'Müdahalenin meni (el atmanın önlenmesi)',
        sure: { yil: 0, ay: 0, gun: 0 },
        kanunMaddesi: 'TMK m.683',
        not: 'Mülkiyet hakkına dayalı bu dava zamanaşımına uğramaz.',
        ozel: 'Zamanaşımına tabi değil',
      },
    ],
  },
  {
    id: 'idari',
    ad: 'İdare Hukuku',
    aciklama: 'İptal davası, tam yargı davası, vergi davası',
    seçenekler: [
      {
        id: 'iptal-davasi-idare',
        ad: 'İptal davası (idare mahkemesi)',
        sure: { yil: 0, ay: 0, gun: 60 },
        kanunMaddesi: 'İYUK m.7/1',
        not: 'İdari işlemin tebliğinden itibaren 60 gün. HAK DÜŞÜRÜCÜ.',
        hak_dusurucu: true,
      },
      {
        id: 'iptal-davasi-vergi',
        ad: 'İptal davası (vergi mahkemesi)',
        sure: { yil: 0, ay: 0, gun: 30 },
        kanunMaddesi: 'İYUK m.7/2',
        not: 'Vergi/resim/harç tahakkukuna karşı 30 gün. HAK DÜŞÜRÜCÜ.',
        hak_dusurucu: true,
      },
      {
        id: 'tam-yargi',
        ad: 'Tam yargı davası (idarenin sebep olduğu zarar)',
        sure: { yil: 1, ay: 0, gun: 0 },
        kanunMaddesi: 'İYUK m.13',
        not: 'Zararın öğrenildiği tarihten itibaren 1 yıl, her halde 5 yıl içinde idareye başvuru. Reddedilmesi halinde 60 gün içinde dava.',
      },
      {
        id: 'imar-iptal',
        ad: 'İmar planı iptali davası',
        sure: { yil: 0, ay: 0, gun: 60 },
        kanunMaddesi: 'İYUK m.7/4',
        not: 'İlan tarihinden itibaren 60 gün, ilgililerin idareye başvuru tarihinden itibaren 30 gün ek süre.',
        hak_dusurucu: true,
      },
    ],
  },
  {
    id: 'aile',
    ad: 'Aile Hukuku',
    aciklama: 'Boşanma, nafaka, soybağı',
    seçenekler: [
      {
        id: 'mal-paylasimi',
        ad: 'Mal rejiminin tasfiyesi (boşanma sonrası)',
        sure: { yil: 10, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.146',
        not: 'Boşanma kararının kesinleşmesinden itibaren 10 yıl.',
      },
      {
        id: 'soybagi-red-baba',
        ad: 'Soybağının reddi davası (baba)',
        sure: { yil: 1, ay: 0, gun: 0 },
        kanunMaddesi: 'TMK m.289',
        not: 'Babanın doğumu ve baba olmadığını öğrendiği tarihten itibaren 1 yıl, her halde 5 yıl. HAK DÜŞÜRÜCÜ.',
        hak_dusurucu: true,
      },
      {
        id: 'nafaka',
        ad: 'Geçmiş nafaka alacağı',
        sure: { yil: 10, ay: 0, gun: 0 },
        kanunMaddesi: 'TBK m.146',
        not: 'Aylık nafaka taksitleri için her bir taksit yönünden 10 yıl.',
      },
      {
        id: 'tedbir-nafaka',
        ad: 'Geçmişe yönelik nafaka istemi',
        sure: { yil: 1, ay: 0, gun: 0 },
        kanunMaddesi: 'TMK m.197',
        not: 'Tedbir nafakası dava tarihinden geriye yönelik istenebilir, ancak en fazla 1 yıllık birikmiş alacak için.',
      },
    ],
  },
];

// =====================================================================
// 2) USUL / YARGILAMA SÜRELERİ VERİTABANI
// =====================================================================

export const USUL_KATEGORILERI = [
  {
    id: 'cevap-itiraz',
    ad: 'Cevap ve İlk Dilekçeler',
    seçenekler: [
      {
        id: 'cevap-dilekcesi-hukuk',
        ad: 'Cevap dilekçesi (hukuk davası)',
        sure: { yil: 0, ay: 0, gun: 14 },
        kanunMaddesi: 'HMK m.127',
        not: 'Dava dilekçesinin tebliğinden itibaren 2 hafta. Mahkeme bu süreyi 1 ay uzatabilir.',
      },
      {
        id: 'cevaba-cevap',
        ad: 'Cevaba cevap dilekçesi (replik)',
        sure: { yil: 0, ay: 0, gun: 14 },
        kanunMaddesi: 'HMK m.136',
        not: 'Cevap dilekçesinin tebliğinden itibaren 2 hafta.',
      },
      {
        id: 'ikinci-cevap',
        ad: 'İkinci cevap (düplik)',
        sure: { yil: 0, ay: 0, gun: 14 },
        kanunMaddesi: 'HMK m.136',
        not: 'Replik dilekçesinin tebliğinden itibaren 2 hafta.',
      },
    ],
  },
  {
    id: 'kanunyolu-hukuk',
    ad: 'Kanun Yolları – Hukuk',
    seçenekler: [
      {
        id: 'istinaf-hukuk',
        ad: 'İstinaf süresi (hukuk – BAM)',
        sure: { yil: 0, ay: 0, gun: 14 },
        kanunMaddesi: 'HMK m.345',
        not: 'Kararın tebliğinden itibaren 2 hafta. Bölge Adliye Mahkemesi (BAM) incelemesi.',
      },
      {
        id: 'istinaf-cevap-hukuk',
        ad: 'İstinaf cevap dilekçesi',
        sure: { yil: 0, ay: 0, gun: 14 },
        kanunMaddesi: 'HMK m.347',
        not: 'İstinaf dilekçesinin tebliğinden itibaren 2 hafta.',
      },
      {
        id: 'temyiz-hukuk',
        ad: 'Temyiz süresi (hukuk – Yargıtay)',
        sure: { yil: 0, ay: 0, gun: 14 },
        kanunMaddesi: 'HMK m.361',
        not: 'BAM kararının tebliğinden itibaren 2 hafta. Tüm BAM kararları temyize tabi değildir.',
      },
      {
        id: 'karar-duzeltme',
        ad: 'Karar düzeltme (sınırlı haller)',
        sure: { yil: 0, ay: 0, gun: 15 },
        kanunMaddesi: 'HMK m.376',
        not: 'Yargıtay kararının tebliğinden itibaren 15 gün. Sadece istisnaen mümkün.',
      },
      {
        id: 'yargilanmanin-yenilenmesi',
        ad: 'Yargılamanın yenilenmesi',
        sure: { yil: 0, ay: 3, gun: 0 },
        kanunMaddesi: 'HMK m.378',
        not: 'Sebebin öğrenildiği tarihten itibaren 3 ay, her halde 10 yıl.',
      },
    ],
  },
  {
    id: 'kanunyolu-ceza',
    ad: 'Kanun Yolları – Ceza',
    seçenekler: [
      {
        id: 'istinaf-ceza',
        ad: 'İstinaf süresi (ceza – BAM)',
        sure: { yil: 0, ay: 0, gun: 7 },
        kanunMaddesi: 'CMK m.273',
        not: 'Hükmün öğrenilmesinden itibaren 7 gün.',
      },
      {
        id: 'temyiz-ceza',
        ad: 'Temyiz süresi (ceza – Yargıtay)',
        sure: { yil: 0, ay: 0, gun: 15 },
        kanunMaddesi: 'CMK m.291',
        not: 'BAM kararının tebliğinden itibaren 15 gün.',
      },
      {
        id: 'itiraz-ceza',
        ad: 'İtiraz (ceza kararlarına)',
        sure: { yil: 0, ay: 0, gun: 7 },
        kanunMaddesi: 'CMK m.268',
        not: 'Kararın tebliğinden itibaren 7 gün.',
      },
    ],
  },
  {
    id: 'kanunyolu-idari',
    ad: 'Kanun Yolları – İdari',
    seçenekler: [
      {
        id: 'istinaf-idari',
        ad: 'İstinaf süresi (idari)',
        sure: { yil: 0, ay: 0, gun: 30 },
        kanunMaddesi: 'İYUK m.45',
        not: 'İdare/vergi mahkemesi kararının tebliğinden itibaren 30 gün.',
      },
      {
        id: 'temyiz-idari',
        ad: 'Temyiz süresi (idari – Danıştay)',
        sure: { yil: 0, ay: 0, gun: 30 },
        kanunMaddesi: 'İYUK m.46',
        not: 'BİM kararının tebliğinden itibaren 30 gün.',
      },
    ],
  },
  {
    id: 'icra-iflas',
    ad: 'İcra ve İflas',
    seçenekler: [
      {
        id: 'odeme-emrine-itiraz',
        ad: 'Ödeme emrine itiraz (ilamsız icra)',
        sure: { yil: 0, ay: 0, gun: 7 },
        kanunMaddesi: 'İİK m.62',
        not: 'Ödeme emrinin tebliğinden itibaren 7 gün.',
      },
      {
        id: 'icra-takibine-itiraz-kambiyo',
        ad: 'Kambiyo senetlerine özgü icra takibine itiraz',
        sure: { yil: 0, ay: 0, gun: 5 },
        kanunMaddesi: 'İİK m.168',
        not: 'Ödeme emrinin tebliğinden itibaren 5 gün.',
      },
      {
        id: 'sikayet-icra',
        ad: 'İcra mahkemesine şikayet',
        sure: { yil: 0, ay: 0, gun: 7 },
        kanunMaddesi: 'İİK m.16',
        not: 'İşlemin öğrenildiği tarihten itibaren 7 gün.',
      },
      {
        id: 'itirazin-iptali',
        ad: 'İtirazın iptali davası',
        sure: { yil: 1, ay: 0, gun: 0 },
        kanunMaddesi: 'İİK m.67',
        not: 'İtirazın tebliğinden itibaren 1 yıl.',
      },
      {
        id: 'itirazin-kaldirilmasi',
        ad: 'İtirazın kaldırılması',
        sure: { yil: 0, ay: 6, gun: 0 },
        kanunMaddesi: 'İİK m.68',
        not: 'İtirazın tebliğinden itibaren 6 ay.',
      },
    ],
  },
  {
    id: 'arabuluculuk',
    ad: 'Arabuluculuk ve Dava Şartları',
    seçenekler: [
      {
        id: 'arabuluculuk-is',
        ad: 'İş davaları – arabuluculuk sonrası dava',
        sure: { yil: 0, ay: 0, gun: 14 },
        kanunMaddesi: '7036 SK m.3',
        not: 'Anlaşmazlık tutanağı tarihinden itibaren 2 hafta içinde iş mahkemesinde dava açılmalıdır.',
      },
      {
        id: 'arabuluculuk-ticari',
        ad: 'Ticari uyuşmazlık – arabuluculuk sonrası',
        sure: { yil: 0, ay: 0, gun: 0 },
        kanunMaddesi: '6325 SK / TTK m.5/A',
        not: 'Konusu para olan ticari uyuşmazlıklarda arabuluculuk dava şartıdır. Sonrası için zamanaşımı süresi içinde dava.',
      },
      {
        id: 'arabuluculuk-tuketici',
        ad: 'Tüketici uyuşmazlığı – arabuluculuk',
        sure: { yil: 0, ay: 0, gun: 0 },
        kanunMaddesi: '6502 SK',
        not: 'Belirli parasal sınırın üstünde tüketici uyuşmazlıklarında arabuluculuk dava şartı.',
      },
    ],
  },
];

// =====================================================================
// 3) ORTALAMA DAVA SÜRESİ VERİTABANI
// =====================================================================
// min/max: ay cinsinden ortalama
// not: Adalet Bakanlığı yıllık istatistikleri ve barolar verilerine göre tahmini

export const DAVA_TURLERI = [
  // HUKUK DAVALARI
  {
    id: 'asliye-hukuk',
    kategori: 'Hukuk',
    ad: 'Asliye Hukuk Davası (genel)',
    minAy: 12,
    maxAy: 18,
    istinafAy: { min: 8, max: 14 },
    temyizAy: { min: 12, max: 24 },
    not: 'Tanık sayısı, bilirkişi raporu ve dosyanın karmaşıklığına göre değişir.',
  },
  {
    id: 'sulh-hukuk',
    kategori: 'Hukuk',
    ad: 'Sulh Hukuk Davası',
    minAy: 6,
    maxAy: 12,
    istinafAy: { min: 6, max: 10 },
    temyizAy: { min: 0, max: 0 },
    not: 'Genelde temyize kapalı (kesin parasal sınır altı kararlar).',
  },
  {
    id: 'tuketici',
    kategori: 'Hukuk',
    ad: 'Tüketici Mahkemesi Davası',
    minAy: 6,
    maxAy: 12,
    istinafAy: { min: 6, max: 10 },
    temyizAy: { min: 0, max: 0 },
    not: 'Belirli sınır altı için kesindir.',
  },
  {
    id: 'asliye-ticaret',
    kategori: 'Hukuk',
    ad: 'Asliye Ticaret Davası',
    minAy: 18,
    maxAy: 30,
    istinafAy: { min: 10, max: 18 },
    temyizAy: { min: 12, max: 24 },
    not: 'Bilirkişi raporları ve uzman görüşleri nedeniyle uzun sürer.',
  },
  // AİLE
  {
    id: 'bosanma-anlasmali',
    kategori: 'Aile',
    ad: 'Anlaşmalı Boşanma',
    minAy: 1,
    maxAy: 3,
    istinafAy: { min: 0, max: 0 },
    temyizAy: { min: 0, max: 0 },
    not: 'Tek celsede karar verilir. Genellikle kanun yoluna gidilmez.',
  },
  {
    id: 'bosanma-cekismeli',
    kategori: 'Aile',
    ad: 'Çekişmeli Boşanma',
    minAy: 14,
    maxAy: 24,
    istinafAy: { min: 8, max: 16 },
    temyizAy: { min: 12, max: 24 },
    not: 'Kusur tespiti, tanık dinlenmesi, sosyal inceleme süreyi uzatır.',
  },
  {
    id: 'nafaka-velayet',
    kategori: 'Aile',
    ad: 'Nafaka / Velayet Davası',
    minAy: 6,
    maxAy: 14,
    istinafAy: { min: 6, max: 12 },
    temyizAy: { min: 0, max: 0 },
    not: 'Pedagog ve sosyal inceleme raporu beklenir.',
  },
  {
    id: 'mal-rejimi',
    kategori: 'Aile',
    ad: 'Mal Rejimi Tasfiyesi',
    minAy: 18,
    maxAy: 36,
    istinafAy: { min: 10, max: 18 },
    temyizAy: { min: 12, max: 24 },
    not: 'Bilirkişi değer tespiti, banka kayıtları, tapu kayıtları nedeniyle uzun.',
  },
  // İŞ
  {
    id: 'is-davasi',
    kategori: 'İş',
    ad: 'İşçilik Alacakları (kıdem, ihbar, fazla mesai)',
    minAy: 12,
    maxAy: 20,
    istinafAy: { min: 8, max: 14 },
    temyizAy: { min: 12, max: 20 },
    not: 'Önce zorunlu arabuluculuk (3-4 hafta) gerekir. Bilirkişi raporu süreyi uzatır.',
  },
  {
    id: 'ise-iade',
    kategori: 'İş',
    ad: 'İşe İade Davası',
    minAy: 6,
    maxAy: 12,
    istinafAy: { min: 4, max: 8 },
    temyizAy: { min: 0, max: 0 },
    not: 'İstinaf incelemesi sonrası kesindir, temyiz yolu kapalıdır.',
  },
  {
    id: 'is-kazasi-tazminat',
    kategori: 'İş',
    ad: 'İş Kazası Tazminat Davası',
    minAy: 18,
    maxAy: 36,
    istinafAy: { min: 10, max: 18 },
    temyizAy: { min: 12, max: 24 },
    not: 'Aktüer raporu, kusur incelemesi, SGK görüşü nedeniyle çok uzun sürer.',
  },
  // CEZA
  {
    id: 'asliye-ceza',
    kategori: 'Ceza',
    ad: 'Asliye Ceza Davası',
    minAy: 12,
    maxAy: 24,
    istinafAy: { min: 8, max: 14 },
    temyizAy: { min: 12, max: 24 },
    not: 'Tanık sayısı, dosya hacmi süreyi belirler.',
  },
  {
    id: 'agir-ceza',
    kategori: 'Ceza',
    ad: 'Ağır Ceza Davası',
    minAy: 18,
    maxAy: 36,
    istinafAy: { min: 12, max: 18 },
    temyizAy: { min: 18, max: 36 },
    not: 'Heyet halinde görüldüğü için duruşma günleri sınırlı, dosya kapsamı geniş.',
  },
  // İCRA
  {
    id: 'icra-takibi',
    kategori: 'İcra',
    ad: 'İlamsız İcra Takibi',
    minAy: 3,
    maxAy: 8,
    istinafAy: { min: 0, max: 0 },
    temyizAy: { min: 0, max: 0 },
    not: 'İtiraz olmazsa hızlı, itiraz olursa itirazın iptali davası açılır.',
  },
  {
    id: 'itirazin-iptali-dava',
    kategori: 'İcra',
    ad: 'İtirazın İptali Davası',
    minAy: 10,
    maxAy: 18,
    istinafAy: { min: 8, max: 14 },
    temyizAy: { min: 0, max: 0 },
    not: 'Belirli parasal sınırın altında temyize kapalı.',
  },
  // İDARİ
  {
    id: 'iptal-davasi',
    kategori: 'İdari',
    ad: 'İptal Davası (idare mahkemesi)',
    minAy: 12,
    maxAy: 24,
    istinafAy: { min: 6, max: 12 },
    temyizAy: { min: 12, max: 24 },
    not: 'BİM aşamasıyla genelde 1.5-3 yıl sürer.',
  },
  {
    id: 'tam-yargi-davasi',
    kategori: 'İdari',
    ad: 'Tam Yargı Davası',
    minAy: 12,
    maxAy: 24,
    istinafAy: { min: 8, max: 14 },
    temyizAy: { min: 12, max: 24 },
    not: 'Bilirkişi raporu süreyi uzatabilir.',
  },
  {
    id: 'vergi-davasi',
    kategori: 'İdari',
    ad: 'Vergi Davası',
    minAy: 12,
    maxAy: 24,
    istinafAy: { min: 8, max: 14 },
    temyizAy: { min: 12, max: 24 },
    not: 'Vergi mahkemesi → BİM → Danıştay süreciyle 3-5 yıl.',
  },
  // TRAFİK / TAZMİNAT
  {
    id: 'trafik-tazminat',
    kategori: 'Tazminat',
    ad: 'Trafik Kazası Tazminat Davası',
    minAy: 14,
    maxAy: 30,
    istinafAy: { min: 8, max: 14 },
    temyizAy: { min: 12, max: 24 },
    not: 'Aktüer raporu, kusur tespit raporu süreyi uzatır.',
  },
  {
    id: 'manevi-tazminat',
    kategori: 'Tazminat',
    ad: 'Manevi Tazminat Davası',
    minAy: 10,
    maxAy: 18,
    istinafAy: { min: 6, max: 12 },
    temyizAy: { min: 12, max: 18 },
    not: 'Olayın türüne göre değişir.',
  },
  // KAMULAŞTIRMA
  {
    id: 'kamulastirma-bedel',
    kategori: 'Gayrimenkul',
    ad: 'Kamulaştırma Bedel Tespiti',
    minAy: 8,
    maxAy: 18,
    istinafAy: { min: 6, max: 12 },
    temyizAy: { min: 12, max: 20 },
    not: 'Bilirkişi (3 kişilik heyet) raporu süreyi belirler.',
  },
  {
    id: 'tapu-iptali',
    kategori: 'Gayrimenkul',
    ad: 'Tapu İptali ve Tescil Davası',
    minAy: 18,
    maxAy: 36,
    istinafAy: { min: 10, max: 18 },
    temyizAy: { min: 18, max: 30 },
    not: 'Keşif, bilirkişi, tapu kayıtları nedeniyle uzun.',
  },
  // MİRAS
  {
    id: 'tenkis-davasi',
    kategori: 'Miras',
    ad: 'Tenkis Davası',
    minAy: 18,
    maxAy: 30,
    istinafAy: { min: 8, max: 14 },
    temyizAy: { min: 12, max: 24 },
    not: 'Murisin tasarruflarının tespiti, bilirkişi nedeniyle uzar.',
  },
  {
    id: 'mirasin-paylasimi',
    kategori: 'Miras',
    ad: 'Miras Paylaşımı (Ortaklığın Giderilmesi)',
    minAy: 12,
    maxAy: 24,
    istinafAy: { min: 8, max: 12 },
    temyizAy: { min: 0, max: 0 },
    not: 'Genelde sulh hukuk mahkemesi ve istinaf sonrası kesindir.',
  },
];

// =====================================================================
// HESAPLAMA FONKSİYONLARI
// =====================================================================

/**
 * Verilen başlangıç tarihine yıl/ay/gün ekler ve sonuç tarihini döndürür.
 */
export function tariheEkle(baslangicTarihi, sure) {
  const tarih = new Date(baslangicTarihi);
  if (isNaN(tarih.getTime())) return null;

  const sonuc = new Date(tarih);
  if (sure.yil) sonuc.setFullYear(sonuc.getFullYear() + sure.yil);
  if (sure.ay) sonuc.setMonth(sonuc.getMonth() + sure.ay);
  if (sure.gun) sonuc.setDate(sonuc.getDate() + sure.gun);
  return sonuc;
}

/**
 * İki tarih arasındaki gün farkını verir.
 */
export function gunFarki(baslangic, bitis) {
  const fark = bitis.getTime() - baslangic.getTime();
  return Math.ceil(fark / (1000 * 60 * 60 * 24));
}

/**
 * Bir tarihin Türkçe formatlanmış halini döndürür: "12 Mayıs 2026 (Salı)"
 */
export function formatTarih(tarih) {
  if (!tarih || isNaN(tarih.getTime())) return '-';
  const aylar = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  const gunler = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const gun = tarih.getDate();
  const ay = aylar[tarih.getMonth()];
  const yil = tarih.getFullYear();
  const haftaGunu = gunler[tarih.getDay()];
  return `${gun} ${ay} ${yil} (${haftaGunu})`;
}

/**
 * Süreyi insan-dostu metne çevirir: "2 yıl 6 ay" gibi.
 */
export function formatSure(sure) {
  const parcalar = [];
  if (sure.yil) parcalar.push(`${sure.yil} yıl`);
  if (sure.ay) parcalar.push(`${sure.ay} ay`);
  if (sure.gun) parcalar.push(`${sure.gun} gün`);
  return parcalar.length ? parcalar.join(' ') : '-';
}

/**
 * Zamanaşımı / hak düşürücü süre hesaplar.
 */
export function hesaplaZamanasimi({ baslangicTarihi, secenekId, kategoriId }) {
  const kategori = ZAMANASIMI_KATEGORILERI.find((k) => k.id === kategoriId);
  if (!kategori) return { hata: true, mesaj: 'Geçersiz kategori.' };

  const secenek = kategori.seçenekler.find((s) => s.id === secenekId);
  if (!secenek) return { hata: true, mesaj: 'Geçersiz seçenek.' };

  if (secenek.ozel === 'Zamanaşımına tabi değil') {
    return {
      ozelDurum: true,
      kategori: kategori.ad,
      secenekAd: secenek.ad,
      kanunMaddesi: secenek.kanunMaddesi,
      not: secenek.not,
      mesaj: 'Bu hak / dava türü zamanaşımına tabi değildir.',
    };
  }

  if (!baslangicTarihi) return { hata: true, mesaj: 'Başlangıç tarihi giriniz.' };

  const baslangic = new Date(baslangicTarihi);
  const bitis = tariheEkle(baslangic, secenek.sure);
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);

  const kalanGun = gunFarki(bugun, bitis);
  const gecti = kalanGun < 0;

  return {
    kategori: kategori.ad,
    secenekAd: secenek.ad,
    kanunMaddesi: secenek.kanunMaddesi,
    not: secenek.not,
    hak_dusurucu: !!secenek.hak_dusurucu,
    sure: secenek.sure,
    sureMetin: formatSure(secenek.sure),
    baslangicTarihi: baslangic,
    bitisTarihi: bitis,
    bugun,
    kalanGun: Math.abs(kalanGun),
    gecti,
  };
}

/**
 * Usul süresi hesaplar (tebligat / karar tarihinden itibaren).
 */
export function hesaplaUsulSuresi({ baslangicTarihi, secenekId, kategoriId }) {
  const kategori = USUL_KATEGORILERI.find((k) => k.id === kategoriId);
  if (!kategori) return { hata: true, mesaj: 'Geçersiz kategori.' };

  const secenek = kategori.seçenekler.find((s) => s.id === secenekId);
  if (!secenek) return { hata: true, mesaj: 'Geçersiz seçenek.' };
  if (!baslangicTarihi) return { hata: true, mesaj: 'Tebliğ / karar tarihini giriniz.' };

  const baslangic = new Date(baslangicTarihi);
  const bitis = tariheEkle(baslangic, secenek.sure);
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);

  const kalanGun = gunFarki(bugun, bitis);
  const gecti = kalanGun < 0;

  return {
    kategori: kategori.ad,
    secenekAd: secenek.ad,
    kanunMaddesi: secenek.kanunMaddesi,
    not: secenek.not,
    sure: secenek.sure,
    sureMetin: formatSure(secenek.sure),
    baslangicTarihi: baslangic,
    bitisTarihi: bitis,
    bugun,
    kalanGun: Math.abs(kalanGun),
    gecti,
  };
}

/**
 * Ortalama dava süresi tahmini.
 * Aşamalar dizisi seçilebilir: ilkDerece, istinaf, temyiz.
 */
export function hesaplaOrtalamaSure({ davaTuruId, asamalar = ['ilkDerece'], baslangicTarihi }) {
  const dava = DAVA_TURLERI.find((d) => d.id === davaTuruId);
  if (!dava) return { hata: true, mesaj: 'Geçersiz dava türü.' };

  let toplamMin = 0;
  let toplamMax = 0;
  const asamaDetaylari = [];

  if (asamalar.includes('ilkDerece')) {
    toplamMin += dava.minAy;
    toplamMax += dava.maxAy;
    asamaDetaylari.push({
      ad: 'İlk Derece',
      minAy: dava.minAy,
      maxAy: dava.maxAy,
    });
  }

  if (asamalar.includes('istinaf') && dava.istinafAy && (dava.istinafAy.min || dava.istinafAy.max)) {
    toplamMin += dava.istinafAy.min;
    toplamMax += dava.istinafAy.max;
    asamaDetaylari.push({
      ad: 'İstinaf (BAM)',
      minAy: dava.istinafAy.min,
      maxAy: dava.istinafAy.max,
    });
  }

  if (asamalar.includes('temyiz') && dava.temyizAy && (dava.temyizAy.min || dava.temyizAy.max)) {
    toplamMin += dava.temyizAy.min;
    toplamMax += dava.temyizAy.max;
    asamaDetaylari.push({
      ad: 'Temyiz (Yargıtay/Danıştay)',
      minAy: dava.temyizAy.min,
      maxAy: dava.temyizAy.max,
    });
  }

  let beklenenBitisMin = null;
  let beklenenBitisMax = null;
  if (baslangicTarihi) {
    const bas = new Date(baslangicTarihi);
    beklenenBitisMin = tariheEkle(bas, { ay: toplamMin });
    beklenenBitisMax = tariheEkle(bas, { ay: toplamMax });
  }

  return {
    dava,
    asamaDetaylari,
    toplamMinAy: toplamMin,
    toplamMaxAy: toplamMax,
    toplamMinYil: (toplamMin / 12).toFixed(1),
    toplamMaxYil: (toplamMax / 12).toFixed(1),
    beklenenBitisMin,
    beklenenBitisMax,
    not: dava.not,
  };
}

/**
 * Bugünün tarihini YYYY-MM-DD formatında döndürür (input[type=date] için).
 */
export function bugunISO() {
  const t = new Date();
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, '0');
  const d = String(t.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
