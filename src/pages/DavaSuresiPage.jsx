import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Info,
  Scale,
  Gavel,
  Hourglass,
  ArrowRight,
  BookOpen,
  Phone,
} from 'lucide-react';
import SEO from '../components/SEO';
import {
  ZAMANASIMI_KATEGORILERI,
  USUL_KATEGORILERI,
  DAVA_TURLERI,
  hesaplaZamanasimi,
  hesaplaUsulSuresi,
  hesaplaOrtalamaSure,
  formatTarih,
  formatSure,
  bugunISO,
} from '../utils/davaSuresi';

/**
 * Dava Süresi Hesaplama – 3 sekmeli kapsamlı araç
 * 1) Zamanaşımı / Hak Düşürücü Süre
 * 2) Ortalama Dava Süresi Tahmini
 * 3) Usul Süreleri (istinaf, temyiz, cevap, vb.)
 */
const DavaSuresiPage = () => {
  const [aktifSekme, setAktifSekme] = useState('zamanasimi');

  return (
    <>
      <SEO
        title="Dava Süresi Hesaplama | Zamanaşımı ve Yargılama Süreleri – Koptay Hukuk"
        description="Zamanaşımı, hak düşürücü süre, istinaf, temyiz, cevap dilekçesi ve ortalama dava süresi hesaplama aracı. TBK, TCK, HMK, CMK, İYUK ve İİK madde dayanaklarıyla."
        keywords="dava süresi hesaplama, zamanaşımı hesaplama, hak düşürücü süre, istinaf süresi, temyiz süresi, dava ne kadar sürer, tazminat zamanaşımı, iş davası süresi, ceza zamanaşımı, kıdem zamanaşımı"
        url="/hesaplama-araclari/dava-suresi"
      />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Dava Süresi ve Zamanaşımı Hesaplama Aracı',
          description:
            'Zamanaşımı, hak düşürücü süre, istinaf, temyiz ve ortalama dava süresi hesaplama aracı.',
          url: 'https://koptay.av.tr/hesaplama-araclari/dava-suresi',
          applicationCategory: 'LegalService',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
          provider: {
            '@type': 'LegalService',
            name: 'Koptay Hukuk Bürosu',
            url: 'https://koptay.av.tr',
          },
          featureList: [
            'Zamanaşımı süresi hesaplama',
            'Hak düşürücü süre hesaplama',
            'İstinaf, temyiz ve cevap süreleri',
            'Ortalama dava süresi tahmini',
            'TBK, TCK, HMK, CMK, İYUK ve İİK madde dayanakları',
          ],
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Zamanaşımı ile hak düşürücü süre arasındaki fark nedir?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'Zamanaşımı, talebin ileri sürülmesi halinde ileri sürülmedikçe hâkim tarafından kendiliğinden gözetilmez ve süresi uzatılabilir / kesilebilir. Hak düşürücü süre ise hâkim tarafından resen dikkate alınır, kesilemez ve uzatılamaz – süre dolduğunda hak da düşer.',
              },
            },
            {
              '@type': 'Question',
              name: 'Trafik kazası tazminatında zamanaşımı ne kadardır?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'KTK m.109 uyarınca, zarar görenin zararı ve sorumluyu öğrendiği tarihten itibaren 2 yıl, her halde olay tarihinden itibaren 10 yıldır. Eylem ceza kanunu kapsamında suç teşkil ediyorsa ve ceza zamanaşımı daha uzunsa (genelde 8 yıl) o süre uygulanır.',
              },
            },
            {
              '@type': 'Question',
              name: 'İstinaf ve temyiz süreleri kaç gündür?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'Hukuk davalarında istinaf ve temyiz süresi kararın tebliğinden itibaren 2 hafta (HMK m.345 ve m.361). Ceza davalarında istinaf 7 gün, temyiz 15 gündür. İdari davalarda her iki kanun yolu için süre 30 gündür.',
              },
            },
            {
              '@type': 'Question',
              name: 'Bir dava ne kadar sürer?',
              acceptedAnswer: {
                '@type': 'Answer',
                text:
                  'Dava süresi türüne göre değişir. Anlaşmalı boşanma 1-3 ay, çekişmeli boşanma 14-24 ay, işçilik alacakları 12-20 ay, ağır ceza 18-36 ay sürebilir. İstinaf 6-12 ay, temyiz 12-24 ay ek süre ekler.',
              },
            },
          ],
        })}
      </script>

      {/* HERO */}
      <section className="page-hero py-16 bg-lawPrimary text-white">
        <div className="container mx-auto px-4 text-center">
          <Hourglass className="w-12 h-12 mx-auto mb-4 text-lawSecondary" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-serif">
            Dava Süresi Hesaplama
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            Zamanaşımı, hak düşürücü süre, istinaf-temyiz ve ortalama yargılama
            süresini tek araçta hesaplayın. TBK, TCK, HMK, CMK, İYUK ve İİK
            madde dayanaklarıyla.
          </p>
        </div>
      </section>

      {/* SEKME SEÇİCİ */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-3">
              <SekmeButonu
                aktif={aktifSekme === 'zamanasimi'}
                onClick={() => setAktifSekme('zamanasimi')}
                icon={Clock}
                baslik="Zamanaşımı / Hak Düşürücü Süre"
                aciklama="Olay tarihinden itibaren dava açma süresinin ne zaman dolacağını hesaplayın"
              />
              <SekmeButonu
                aktif={aktifSekme === 'ortalama'}
                onClick={() => setAktifSekme('ortalama')}
                icon={Scale}
                baslik="Ortalama Dava Süresi"
                aciklama="Davanızın ortalama ne kadar süreceğini öğrenin"
              />
              <SekmeButonu
                aktif={aktifSekme === 'usul'}
                onClick={() => setAktifSekme('usul')}
                icon={Gavel}
                baslik="Usul / Yargılama Süreleri"
                aciklama="İstinaf, temyiz, cevap, itiraz vb. süreler"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AKTİF SEKME İÇERİĞİ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {aktifSekme === 'zamanasimi' && <ZamanasimiSekmesi />}
            {aktifSekme === 'ortalama' && <OrtalamaSureSekmesi />}
            {aktifSekme === 'usul' && <UsulSekmesi />}
          </div>
        </div>
      </section>

      {/* SEO İÇERİĞİ – uzun-form */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-lawDark mb-4">
              Dava Süresi Hakkında Bilmeniz Gerekenler
            </h2>

            <h3 className="text-xl font-semibold text-lawDark mt-6 mb-2">
              Zamanaşımı Nedir?
            </h3>
            <p className="text-gray-700 mb-4">
              Zamanaşımı, kanunla belirlenen süre içinde dava açılmaması veya
              hakkın kullanılmaması halinde dava hakkının düşmesidir. Türk
              hukukunda zamanaşımı sürelerinin büyük çoğunluğu Türk Borçlar
              Kanunu (TBK) m.146 (genel 10 yıl) ve m.147 (özel 5 yıl)
              maddelerinde düzenlenmiştir. Haksız fiil tazminatlarında ise
              TBK m.72 uygulanır: zarar görenin zararı ve faili öğrendiği
              günden itibaren 2 yıl, her halde olay tarihinden itibaren 10 yıl.
            </p>

            <h3 className="text-xl font-semibold text-lawDark mt-6 mb-2">
              Hak Düşürücü Süre Nedir?
            </h3>
            <p className="text-gray-700 mb-4">
              Hak düşürücü süre, hakkın kendisini sona erdiren süredir. Hâkim
              tarafından resen (kendiliğinden) dikkate alınır, kesilemez ve
              uzatılamaz. İşe iade davası (anlaşmazlık tutanağından itibaren 2
              hafta), mirasın reddi (3 ay), iptal davası (60 gün) hak düşürücü
              sürelere örnektir.
            </p>

            <h3 className="text-xl font-semibold text-lawDark mt-6 mb-2">
              Türkiye'de Davalar Ne Kadar Sürüyor?
            </h3>
            <p className="text-gray-700 mb-4">
              Adalet Bakanlığı yıllık istatistiklerine göre Türkiye'de bir
              hukuk davasının ortalama görülme süresi 12-18 aydır. İstinaf
              aşaması 6-12 ay, Yargıtay/Danıştay temyiz aşaması ise 12-24 ay
              ek süre alır. Yani bir dava karara bağlanıp kesinleşinceye kadar
              ortalama 2,5-4 yıl geçebilir. Bu süre dava türüne, mahkemenin iş
              yüküne, bilirkişi raporlarına ve tanık dinleme süreçlerine göre
              değişir.
            </p>

            <h3 className="text-xl font-semibold text-lawDark mt-6 mb-2">
              Süreler Nasıl Hesaplanır?
            </h3>
            <p className="text-gray-700 mb-4">
              Süreler genel kural olarak başlangıç tarihinin "ertesi günü"
              başlar (HMK m.91). Süre gün olarak verilmişse son gün mesai
              bitiminde, hafta veya ay olarak verilmişse karşılığı olan günde
              biter. Sürenin son gününün tatil gününe rastlaması halinde,
              süre çalışılan ilk iş günü mesai bitiminde sona erer (HMK m.93).
              Adli tatil (20 Temmuz – 31 Ağustos) sürelere işlemez,
              durduğu tarihten devam eder (HMK m.104).
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6 mb-6">
              <p className="text-sm text-yellow-900">
                <strong>Önemli Uyarı:</strong> Bu hesaplama aracı bilgi
                amaçlıdır. Sürelerin başlangıcı, kesilmesi, durması ve adli
                tatil etkisi olayın özelliklerine göre değişebilir. Kesin
                süre hesabı için mutlaka avukatınıza danışın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA – İletişim */}
      <section className="py-12 bg-lawPrimary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 font-serif">
            Süreniz Mi Doluyor?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Hak kaybı yaşamamak için ücretsiz ön değerlendirme alın.
            Avukatımız sizi arasın.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+905307111864"
              className="inline-flex items-center justify-center gap-2 bg-white text-lawPrimary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5" /> Hemen Ara
            </a>
            <Link
              to="/iletisim"
              className="inline-flex items-center justify-center gap-2 bg-lawSecondary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              İletişim Formu <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

// =====================================================================
// SEKME BUTONU
// =====================================================================
const SekmeButonu = ({ aktif, onClick, icon: Icon, baslik, aciklama }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-left p-4 rounded-xl border-2 transition-all ${
      aktif
        ? 'bg-lawPrimary text-white border-lawPrimary shadow-lg'
        : 'bg-white text-lawDark border-gray-200 hover:border-lawSecondary'
    }`}
  >
    <Icon className={`w-8 h-8 mb-2 ${aktif ? 'text-white' : 'text-lawSecondary'}`} />
    <h3 className="font-semibold mb-1">{baslik}</h3>
    <p className={`text-xs ${aktif ? 'text-white/80' : 'text-gray-600'}`}>
      {aciklama}
    </p>
  </button>
);

// =====================================================================
// SEKME 1 – ZAMANAŞIMI / HAK DÜŞÜRÜCÜ SÜRE
// =====================================================================
const ZamanasimiSekmesi = () => {
  const [kategoriId, setKategoriId] = useState(ZAMANASIMI_KATEGORILERI[0].id);
  const [secenekId, setSecenekId] = useState(ZAMANASIMI_KATEGORILERI[0].seçenekler[0].id);
  const [baslangicTarihi, setBaslangicTarihi] = useState('');
  const [sonuc, setSonuc] = useState(null);

  const aktifKategori = useMemo(
    () => ZAMANASIMI_KATEGORILERI.find((k) => k.id === kategoriId),
    [kategoriId]
  );

  const handleKategoriChange = (e) => {
    const yeniId = e.target.value;
    setKategoriId(yeniId);
    const yeniKategori = ZAMANASIMI_KATEGORILERI.find((k) => k.id === yeniId);
    setSecenekId(yeniKategori.seçenekler[0].id);
    setSonuc(null);
  };

  const handleHesapla = () => {
    const sonucObj = hesaplaZamanasimi({ baslangicTarihi, secenekId, kategoriId });
    setSonuc(sonucObj);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-lawDark">
            Zamanaşımı / Hak Düşürücü Süre Hesaplama
          </h2>
          <p className="text-sm text-gray-600">
            Olay tarihinden itibaren dava açma süresinin ne zaman dolacağını öğrenin
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hukuk Alanı
          </label>
          <select
            value={kategoriId}
            onChange={handleKategoriChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
          >
            {ZAMANASIMI_KATEGORILERI.map((k) => (
              <option key={k.id} value={k.id}>
                {k.ad}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">{aktifKategori?.aciklama}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dava / Talep Türü
          </label>
          <select
            value={secenekId}
            onChange={(e) => {
              setSecenekId(e.target.value);
              setSonuc(null);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
          >
            {aktifKategori?.seçenekler.map((s) => (
              <option key={s.id} value={s.id}>
                {s.ad}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Olay / Başlangıç Tarihi
          </label>
          <input
            type="date"
            value={baslangicTarihi}
            max={bugunISO()}
            onChange={(e) => setBaslangicTarihi(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Olay/zarar tarihi, sözleşmenin sona erdiği tarih, tebliğ tarihi vb.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleHesapla}
        className="w-full bg-lawPrimary text-white py-4 px-6 rounded-lg font-semibold hover:bg-lawSecondary transition-colors"
      >
        Süreyi Hesapla
      </button>

      {sonuc && <ZamanasimiSonucKarti sonuc={sonuc} />}
    </div>
  );
};

const ZamanasimiSonucKarti = ({ sonuc }) => {
  if (sonuc.hata) {
    return (
      <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-800 font-medium">{sonuc.mesaj}</p>
      </div>
    );
  }

  if (sonuc.ozelDurum) {
    return (
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              {sonuc.secenekAd}
            </h3>
            <p className="text-blue-800 mb-2">{sonuc.mesaj}</p>
            <p className="text-sm text-blue-700 mb-1">
              <strong>Yasal Dayanak:</strong> {sonuc.kanunMaddesi}
            </p>
            <p className="text-sm text-blue-700">{sonuc.not}</p>
          </div>
        </div>
      </div>
    );
  }

  const renkSinifi = sonuc.gecti
    ? 'bg-red-50 border-red-500 text-red-900'
    : sonuc.kalanGun < 30
      ? 'bg-orange-50 border-orange-500 text-orange-900'
      : 'bg-green-50 border-green-500 text-green-900';

  const Icon = sonuc.gecti ? AlertTriangle : sonuc.kalanGun < 30 ? AlertTriangle : CheckCircle2;

  return (
    <div className={`mt-6 border-l-4 p-6 rounded-lg ${renkSinifi}`}>
      <div className="flex items-start gap-3 mb-4">
        <Icon className="w-7 h-7 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold mb-1">
            {sonuc.gecti
              ? 'Süre Geçmiş'
              : sonuc.kalanGun < 30
                ? 'Süre Yakında Doluyor!'
                : 'Süreniz Devam Ediyor'}
          </h3>
          <p className="text-sm opacity-90">{sonuc.secenekAd}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 bg-white/60 rounded-lg p-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-wider opacity-70 mb-1">
            Yasal Süre
          </p>
          <p className="font-bold text-lg">{sonuc.sureMetin}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider opacity-70 mb-1">
            Süre Bitiş Tarihi
          </p>
          <p className="font-bold text-base">{formatTarih(sonuc.bitisTarihi)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider opacity-70 mb-1">
            {sonuc.gecti ? 'Geçen Süre' : 'Kalan Süre'}
          </p>
          <p className="font-bold text-lg">
            {sonuc.kalanGun} gün
            {sonuc.kalanGun >= 30 && (
              <span className="text-sm font-normal ml-1">
                (~{Math.floor(sonuc.kalanGun / 30)} ay)
              </span>
            )}
          </p>
        </div>
      </div>

      {sonuc.hak_dusurucu && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-900 font-semibold">
            Bu süre HAK DÜŞÜRÜCÜ niteliktedir – kesilemez, uzatılamaz ve hâkim
            tarafından resen dikkate alınır.
          </p>
        </div>
      )}

      <div className="text-sm space-y-1">
        <p>
          <strong>Yasal Dayanak:</strong> {sonuc.kanunMaddesi}
        </p>
        <p className="opacity-80">{sonuc.not}</p>
      </div>
    </div>
  );
};

// =====================================================================
// SEKME 2 – ORTALAMA DAVA SÜRESİ
// =====================================================================
const OrtalamaSureSekmesi = () => {
  const [davaTuruId, setDavaTuruId] = useState(DAVA_TURLERI[0].id);
  const [asamalar, setAsamalar] = useState(['ilkDerece']);
  const [baslangicTarihi, setBaslangicTarihi] = useState('');
  const [sonuc, setSonuc] = useState(null);

  // Kategorize edilmiş dava listesi
  const kategoriler = useMemo(() => {
    const grup = {};
    DAVA_TURLERI.forEach((d) => {
      if (!grup[d.kategori]) grup[d.kategori] = [];
      grup[d.kategori].push(d);
    });
    return grup;
  }, []);

  const toggleAsama = (asama) => {
    setAsamalar((prev) =>
      prev.includes(asama) ? prev.filter((a) => a !== asama) : [...prev, asama]
    );
    setSonuc(null);
  };

  const handleHesapla = () => {
    if (asamalar.length === 0) {
      setSonuc({ hata: true, mesaj: 'En az bir aşama seçiniz.' });
      return;
    }
    const sonucObj = hesaplaOrtalamaSure({ davaTuruId, asamalar, baslangicTarihi });
    setSonuc(sonucObj);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 text-indigo-700 w-10 h-10 rounded-lg flex items-center justify-center">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-lawDark">
            Ortalama Dava Süresi Tahmini
          </h2>
          <p className="text-sm text-gray-600">
            Adalet Bakanlığı istatistiklerine göre tahmini süre
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dava Türü
          </label>
          <select
            value={davaTuruId}
            onChange={(e) => {
              setDavaTuruId(e.target.value);
              setSonuc(null);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
          >
            {Object.entries(kategoriler).map(([kategori, davalar]) => (
              <optgroup key={kategori} label={kategori + ' Davaları'}>
                {davalar.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.ad}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Hesaplanacak Aşamalar
          </label>
          <div className="grid sm:grid-cols-3 gap-2">
            <AsamaCheckbox
              label="İlk Derece"
              checked={asamalar.includes('ilkDerece')}
              onChange={() => toggleAsama('ilkDerece')}
            />
            <AsamaCheckbox
              label="İstinaf (BAM)"
              checked={asamalar.includes('istinaf')}
              onChange={() => toggleAsama('istinaf')}
            />
            <AsamaCheckbox
              label="Temyiz (Yargıtay/Danıştay)"
              checked={asamalar.includes('temyiz')}
              onChange={() => toggleAsama('temyiz')}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dava Açılış Tarihi <span className="text-gray-400">(opsiyonel)</span>
          </label>
          <input
            type="date"
            value={baslangicTarihi}
            onChange={(e) => setBaslangicTarihi(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tarih girerseniz davanın tahmini bitiş tarihini de görürsünüz.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleHesapla}
        className="w-full bg-lawPrimary text-white py-4 px-6 rounded-lg font-semibold hover:bg-lawSecondary transition-colors"
      >
        Süreyi Hesapla
      </button>

      {sonuc && <OrtalamaSureSonucKarti sonuc={sonuc} />}
    </div>
  );
};

const AsamaCheckbox = ({ label, checked, onChange }) => (
  <label
    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
      checked
        ? 'bg-lawPrimary text-white border-lawPrimary'
        : 'bg-white text-gray-700 border-gray-300 hover:border-lawSecondary'
    }`}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="hidden"
    />
    <div
      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
        checked ? 'bg-white border-white' : 'border-gray-400'
      }`}
    >
      {checked && <CheckCircle2 className="w-4 h-4 text-lawPrimary" />}
    </div>
    <span className="font-medium text-sm">{label}</span>
  </label>
);

const OrtalamaSureSonucKarti = ({ sonuc }) => {
  if (sonuc.hata) {
    return (
      <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-800 font-medium">{sonuc.mesaj}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Scale className="w-7 h-7 text-indigo-600" />
        <h3 className="text-xl font-bold text-indigo-900">{sonuc.dava.ad}</h3>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4 text-center">
        <p className="text-sm text-gray-600 uppercase tracking-wider mb-2">
          Tahmini Toplam Süre
        </p>
        <p className="text-3xl md:text-4xl font-bold text-lawPrimary">
          {sonuc.toplamMinAy} - {sonuc.toplamMaxAy} ay
        </p>
        <p className="text-sm text-gray-500 mt-1">
          (~{sonuc.toplamMinYil} - {sonuc.toplamMaxYil} yıl)
        </p>
      </div>

      <div className="space-y-2 mb-4">
        {sonuc.asamaDetaylari.map((a, i) => (
          <div key={i} className="bg-white rounded-lg p-3 flex justify-between items-center">
            <span className="font-medium text-gray-700">{a.ad}</span>
            <span className="text-indigo-700 font-semibold">
              {a.minAy} - {a.maxAy} ay
            </span>
          </div>
        ))}
      </div>

      {sonuc.beklenenBitisMin && (
        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600 mb-1">
            <Calendar className="inline w-4 h-4 mr-1" />
            Tahmini Bitiş Tarihi (en erken / en geç):
          </p>
          <p className="font-semibold text-gray-900">
            {formatTarih(sonuc.beklenenBitisMin)} —{' '}
            {formatTarih(sonuc.beklenenBitisMax)}
          </p>
        </div>
      )}

      <div className="text-sm text-gray-700 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
        <strong>Not:</strong> {sonuc.not}
      </div>
    </div>
  );
};

// =====================================================================
// SEKME 3 – USUL SÜRELERİ
// =====================================================================
const UsulSekmesi = () => {
  const [kategoriId, setKategoriId] = useState(USUL_KATEGORILERI[0].id);
  const [secenekId, setSecenekId] = useState(USUL_KATEGORILERI[0].seçenekler[0].id);
  const [baslangicTarihi, setBaslangicTarihi] = useState('');
  const [sonuc, setSonuc] = useState(null);

  const aktifKategori = useMemo(
    () => USUL_KATEGORILERI.find((k) => k.id === kategoriId),
    [kategoriId]
  );

  const handleKategoriChange = (e) => {
    const yeniId = e.target.value;
    setKategoriId(yeniId);
    const yeniKategori = USUL_KATEGORILERI.find((k) => k.id === yeniId);
    setSecenekId(yeniKategori.seçenekler[0].id);
    setSonuc(null);
  };

  const handleHesapla = () => {
    const sonucObj = hesaplaUsulSuresi({ baslangicTarihi, secenekId, kategoriId });
    setSonuc(sonucObj);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 text-orange-700 w-10 h-10 rounded-lg flex items-center justify-center">
          <Gavel className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-lawDark">
            Usul / Yargılama Süreleri Hesaplama
          </h2>
          <p className="text-sm text-gray-600">
            İstinaf, temyiz, cevap, itiraz vb. sürelerinizi hesaplayın
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Süre Kategorisi
          </label>
          <select
            value={kategoriId}
            onChange={handleKategoriChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
          >
            {USUL_KATEGORILERI.map((k) => (
              <option key={k.id} value={k.id}>
                {k.ad}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İşlem Türü
          </label>
          <select
            value={secenekId}
            onChange={(e) => {
              setSecenekId(e.target.value);
              setSonuc(null);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
          >
            {aktifKategori?.seçenekler.map((s) => (
              <option key={s.id} value={s.id}>
                {s.ad}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tebliğ / Karar / Olay Tarihi
          </label>
          <input
            type="date"
            value={baslangicTarihi}
            onChange={(e) => setBaslangicTarihi(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lawPrimary focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Süre, genelde tebligatın yapıldığı günün ertesi günü işlemeye başlar (HMK m.91).
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleHesapla}
        className="w-full bg-lawPrimary text-white py-4 px-6 rounded-lg font-semibold hover:bg-lawSecondary transition-colors"
      >
        Süreyi Hesapla
      </button>

      {sonuc && <UsulSonucKarti sonuc={sonuc} />}
    </div>
  );
};

const UsulSonucKarti = ({ sonuc }) => {
  if (sonuc.hata) {
    return (
      <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-800 font-medium">{sonuc.mesaj}</p>
      </div>
    );
  }

  const renkSinifi = sonuc.gecti
    ? 'bg-red-50 border-red-500 text-red-900'
    : sonuc.kalanGun < 7
      ? 'bg-orange-50 border-orange-500 text-orange-900'
      : 'bg-green-50 border-green-500 text-green-900';

  const Icon = sonuc.gecti || sonuc.kalanGun < 7 ? AlertTriangle : CheckCircle2;

  return (
    <div className={`mt-6 border-l-4 p-6 rounded-lg ${renkSinifi}`}>
      <div className="flex items-start gap-3 mb-4">
        <Icon className="w-7 h-7 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold mb-1">
            {sonuc.gecti
              ? 'Süre Geçmiş!'
              : sonuc.kalanGun < 7
                ? `Süre Doluyor – ${sonuc.kalanGun} gün kaldı!`
                : 'Süreniz Devam Ediyor'}
          </h3>
          <p className="text-sm opacity-90">{sonuc.secenekAd}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 bg-white/60 rounded-lg p-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Yasal Süre</p>
          <p className="font-bold text-lg">{sonuc.sureMetin}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider opacity-70 mb-1">
            Son Tarih
          </p>
          <p className="font-bold text-base">{formatTarih(sonuc.bitisTarihi)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider opacity-70 mb-1">
            {sonuc.gecti ? 'Geçen Süre' : 'Kalan Süre'}
          </p>
          <p className="font-bold text-lg">{sonuc.kalanGun} gün</p>
        </div>
      </div>

      <div className="text-sm space-y-1">
        <p>
          <strong>Yasal Dayanak:</strong> {sonuc.kanunMaddesi}
        </p>
        <p className="opacity-80">{sonuc.not}</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mt-3 text-sm text-yellow-900">
        <strong>Hatırlatma:</strong> Adli tatil (20 Temmuz – 31 Ağustos) süreyi
        durdurabilir. Son gün resmi tatile rastlarsa süre ilk iş günü mesai
        bitiminde sona erer (HMK m.93).
      </div>
    </div>
  );
};

export default DavaSuresiPage;
