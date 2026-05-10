import { useState } from 'react';
import { Calculator, Scale, TrendingUp, Info, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';
import HesaplamaDisclaimer from '../components/HesaplamaDisclaimer';
import {
  calculateNispiUcret,
  calculateMaktuUcret,
  getMahkemeKategorileri,
  formatCurrency
} from '../utils/vekaletUcreti';

export default function VekaletUcretiPage() {
  const [ucretTuru, setUcretTuru] = useState('nispi'); // 'nispi' veya 'maktu'
  const [davaKonusuDeger, setDavaKonusuDeger] = useState('');
  const [mahkemeTuru, setMahkemeTuru] = useState('');
  const [sonuc, setSonuc] = useState(null);
  const [hesaplaniyor, setHesaplaniyor] = useState(false);

  const mahkemeKategorileri = getMahkemeKategorileri();

  const handleHesapla = () => {
    setHesaplaniyor(true);
    
    // Use requestIdleCallback for better INP - don't block main thread
    const doCalculation = () => {
      if (ucretTuru === 'nispi') {
        const deger = parseFloat(davaKonusuDeger);
        const hesaplama = calculateNispiUcret(deger);
        setSonuc(hesaplama);
      } else {
        const hesaplama = calculateMaktuUcret(mahkemeTuru);
        setSonuc(hesaplama);
      }
      setHesaplaniyor(false);
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(doCalculation, { timeout: 300 });
    } else {
      setTimeout(doCalculation, 50);
    }
  };

  const handleReset = () => {
    setDavaKonusuDeger('');
    setMahkemeTuru('');
    setSonuc(null);
  };

  return (
    <>
      <SEO
        title="Vekalet Ücreti Hesaplama Aracı - 2026 Güncel Tarife"
        description="2026 Avukatlık Asgari Ücret Tarifesi'ne göre vekalet ücreti hesaplama aracı. Hem maktu hem nispi ücretler için güncel hesaplama yapın."
        keywords="vekalet ücreti hesaplama, avukatlık ücreti, AAÜT 2026, nispi ücret, maktu ücret, avukat ücreti hesaplama"
      />
      
      {/* Schema.org JSON-LD for WebApplication */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Vekalet Ücreti Hesaplama Aracı",
          "description": "2026 Avukatlık Asgari Ücret Tarifesi'ne göre vekalet ücreti hesaplama aracı",
          "url": "https://koptay.av.tr/hesaplama-araclari/vekalet-ucreti",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "TRY"
          },
          "provider": {
            "@type": "LegalService",
            "name": "Koptay Hukuk Bürosu",
            "url": "https://koptay.av.tr"
          },
          "featureList": [
            "Nispi ücret hesaplama",
            "Maktu ücret hesaplama", 
            "2026 AAÜT tarifesi",
            "65+ mahkeme türü"
          ],
          "datePublished": "2025-11-10",
          "dateModified": "2025-11-10"
        })}
      </script>
      
      {/* FAQ Schema for better SERP features */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "2026 vekalet ücreti tarifesi nedir?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "4 Kasım 2025 tarihinde yayımlanan 2026 Avukatlık Asgari Ücret Tarifesi, hem maktu hem nispi ücretlerde güncellemeler içerir. Nispi ücretler %16'dan başlayıp %1'e kadar azalır, maktu ücretler ise mahkeme türüne göre 9.000 TL ile 120.000 TL arasında değişir."
              }
            },
            {
              "@type": "Question",
              "name": "Nispi ücret nasıl hesaplanır?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nispi ücret, dava konusunun parasal değerine göre kademeli olarak hesaplanır. İlk 600.000 TL için %16, sonraki 600.000 TL için %15 şeklinde 10 farklı kademe uygulanır."
              }
            },
            {
              "@type": "Question",
              "name": "Maktu ücret ne demektir?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Maktu ücret, para ile değerlendirilemeyen davalarda uygulanan sabit ücrettir. Mahkeme türüne göre belirlenir ve boşanma, ceza davaları gibi işlerde kullanılır."
              }
            }
          ]
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li><a href="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</a></li>
              <li><ChevronDown className="w-4 h-4 rotate-[-90deg]" /></li>
              <li><a href="/hesaplama-araclari" className="hover:text-primary-600 transition-colors">Hesaplama Araçları</a></li>
              <li><ChevronDown className="w-4 h-4 rotate-[-90deg]" /></li>
              <li className="text-primary-600 font-medium">Vekalet Ücreti Hesaplama</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-lawSecondary/10 rounded-md mb-4">
              <Scale className="w-8 h-8 text-lawSecondary" />
            </div>
            <h1 className="text-4xl font-serif font-light text-gray-900 mb-3">
              Vekalet Ücreti Hesaplama
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              2026 Avukatlık Asgari Ücret Tarifesi'ne göre güncel vekalet ücreti hesaplaması yapın
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm">
              <Info className="w-4 h-4" />
              <span className="font-medium">4 Kasım 2025 tarihli güncel tarife</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form Bölümü */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-md shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-primary-600" />
                  Hesaplama Bilgileri
                </h2>

                {/* Ücret Türü Seçimi */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ücret Türü
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setUcretTuru('nispi');
                        handleReset();
                      }}
                      className={`p-4 rounded-md border-2 transition-all ${
                        ucretTuru === 'nispi'
                          ? 'border-lawSecondary bg-lawSecondary/10 text-lawSecondary'
                          : 'border-gray-200 hover:border-lawSecondary/40'
                      }`}
                    >
                      <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${
                        ucretTuru === 'nispi' ? 'text-primary-600' : 'text-gray-400'
                      }`} />
                      <div className="font-semibold">Nispi Ücret</div>
                      <div className="text-xs text-gray-500 mt-1">Para konulu davalar</div>
                    </button>
                    <button
                      onClick={() => {
                        setUcretTuru('maktu');
                        handleReset();
                      }}
                      className={`p-4 rounded-md border-2 transition-all ${
                        ucretTuru === 'maktu'
                          ? 'border-lawSecondary bg-lawSecondary/10 text-lawSecondary'
                          : 'border-gray-200 hover:border-lawSecondary/40'
                      }`}
                    >
                      <Scale className={`w-6 h-6 mx-auto mb-2 ${
                        ucretTuru === 'maktu' ? 'text-primary-600' : 'text-gray-400'
                      }`} />
                      <div className="font-semibold">Maktu Ücret</div>
                      <div className="text-xs text-gray-500 mt-1">Sabit ücret</div>
                    </button>
                  </div>
                </div>

                {/* Nispi Ücret Formu */}
                {ucretTuru === 'nispi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Dava Konusu Değer (TL)
                      </label>
                      <input
                        type="number"
                        value={davaKonusuDeger}
                        onChange={(e) => setDavaKonusuDeger(e.target.value)}
                        placeholder="Örn: 1500000"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-lawSecondary focus:outline-none transition-colors text-lg"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        💡 Davanızın parasal değerini giriniz
                      </p>
                    </div>
                  </div>
                )}

                {/* Maktu Ücret Formu */}
                {ucretTuru === 'maktu' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mahkeme/İşlem Türü
                    </label>
                    <select
                      value={mahkemeTuru}
                      onChange={(e) => setMahkemeTuru(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:border-lawSecondary focus:outline-none transition-colors text-base"
                    >
                      <option value="">-- Mahkeme türünü seçiniz --</option>
                      {mahkemeKategorileri.map((kategori, index) => (
                        <optgroup key={index} label={kategori.kategori}>
                          {kategori.mahkemeler.map((mahkeme) => (
                            <option key={mahkeme.value} value={mahkeme.value}>
                              {mahkeme.label} - {formatCurrency(mahkeme.ucret)}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      💡 Davanızın görüleceği mahkemeyi seçiniz
                    </p>
                  </div>
                )}

                {/* Hesapla Butonu */}
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={handleHesapla}
                    disabled={
                      hesaplaniyor ||
                      (ucretTuru === 'nispi' && !davaKonusuDeger) ||
                      (ucretTuru === 'maktu' && !mahkemeTuru)
                    }
                    className="flex-1 bg-lawPrimary text-white py-4 rounded-md font-semibold hover:bg-lawSecondary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {hesaplaniyor ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Hesaplanıyor...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Ücreti Hesapla
                      </span>
                    )}
                  </button>
                  {sonuc && (
                    <button
                      onClick={handleReset}
                      className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-all"
                    >
                      Temizle
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bilgi Kutusu */}
            <div className="lg:col-span-1">
              <div className="bg-lawPrimary rounded-md shadow-md p-6 text-white sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Önemli Bilgiler</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="font-semibold mb-1">📋 Nispi Ücret</p>
                    <p className="text-blue-100">
                      Para konulu davalar için dava değerine göre kademeli hesaplama yapılır.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="font-semibold mb-1">⚖️ Maktu Ücret</p>
                    <p className="text-blue-100">
                      Para ile değerlendirilemeyen davalar için sabit ücret uygulanır.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="font-semibold mb-1">📅 Güncel Tarife</p>
                    <p className="text-blue-100">
                      Bu hesaplama, 4 Kasım 2025 tarihli Resmi Gazete'de yayımlanan tarifeye göredir.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="font-semibold mb-1">⚠️ Asgari Ücret</p>
                    <p className="text-blue-100">
                      Hesaplanan ücretler <strong>asgari</strong> ücretlerdir. Taraflar arasında daha yüksek ücret kararlaştırılabilir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sonuç Bölümü */}
          {sonuc && !sonuc.hata && (
            <div className="mt-6 bg-white rounded-md shadow-md p-6 md:p-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Hesaplama Sonucu
              </h2>

              {/* Toplam Ücret */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 mb-6 text-white">
                <div className="text-center">
                  <p className="text-green-100 mb-2 font-medium">Toplam Asgari Vekalet Ücreti</p>
                  <p className="text-4xl md:text-5xl font-bold">
                    {formatCurrency(sonuc.toplamUcret)}
                  </p>
                  {ucretTuru === 'maktu' && sonuc.aciklama && (
                    <p className="text-green-100 mt-3 text-sm">
                      {sonuc.aciklama}
                    </p>
                  )}
                </div>
              </div>

              {/* Nispi Ücret Detayları */}
              {ucretTuru === 'nispi' && sonuc.detaylar && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Kademe Detayları</h3>
                  <div className="space-y-3">
                    {sonuc.detaylar.map((detay, index) => (
                      <div
                        key={index}
                        className="border-2 border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                                {detay.kademe}
                              </span>
                              <p className="font-semibold text-gray-900">{detay.aciklama}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Tutar:</span>
                                <span className="ml-2 font-semibold text-gray-900">
                                  {formatCurrency(detay.miktar)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Oran:</span>
                                <span className="ml-2 font-semibold text-primary-600">
                                  %{detay.oran}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Ücret</p>
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(detay.ucret)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uyarı */}
              <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Önemli Not:</p>
                    <p>
                      Bu hesaplama, Türkiye Barolar Birliği tarafından belirlenen <strong>asgari ücretleri</strong> göstermektedir. 
                      Avukat ile müvekkil arasında daha yüksek ücret kararlaştırılabilir. 
                      Kesin bilgi için avukatınıza danışmanız önerilir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hata Mesajı */}
          {sonuc && sonuc.hata && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 font-medium">{sonuc.hata}</p>
              </div>
            </div>
          )}

          {/* Tarife Tablosu Bilgisi */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2026 Avukatlık Asgari Ücret Tarifesi Hakkında
            </h2>
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-600 mb-4">
                4 Kasım 2025 tarihinde Resmi Gazete'de yayımlanarak yürürlüğe giren yeni tarife, 
                avukatlık mesleğinin ekonomik temellerini yeniden şekillendiriyor. 
                Özellikle maktu ücretlerde kayda değer artışlar gözlenirken, nispi ücretlerde de yeni kademeler getirildi.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-primary-50 rounded-xl p-5">
                  <h3 className="font-bold text-primary-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Nispi Ücret Özellikleri
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Para konulu davalarda uygulanır</li>
                    <li>• 10 farklı kademe ile hesaplama</li>
                    <li>• %16'dan başlayıp %1'e kadar azalır</li>
                    <li>• 2026'da yeni %13 kademesi eklendi</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-xl p-5">
                  <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Maktu Ücret Özellikleri
                  </h3>
                  <ul className="text-sm text-purple-800 space-y-2">
                    <li>• Para ile değerlendirilemeyen davalar</li>
                    <li>• Mahkeme türüne göre sabit ücret</li>
                    <li>• 2025'e göre %30-40 artış</li>
                    <li>• Boşanma, ceza davaları vb.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SSS Bölümü - SEO için */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Sık Sorulan Sorular
            </h2>
            <div className="space-y-6">
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">
                  Vekalet ücreti hesaplaması nasıl yapılır?
                </h3>
                <p className="text-gray-600 text-sm">
                  Vekalet ücreti, davanın türüne göre iki şekilde hesaplanır: Para konulu davalarda 
                  <strong> nispi ücret</strong> (dava değerine göre kademeli), para ile değerlendirilemeyen 
                  davalarda <strong> maktu ücret</strong> (mahkeme türüne göre sabit) uygulanır.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">
                  2026 AAÜT ile 2025 arasındaki fark nedir?
                </h3>
                <p className="text-gray-600 text-sm">
                  2026 tarifesinde maktu ücretlerde ortalama %30-40 artış olmuştur. Nispi ücretlerde 
                  ise yeni bir kademe (%13) eklenmiş ve eşik tutarlar yaklaşık %50 oranında yükseltilmiştir.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">
                  Hesaplanan ücret kesin midir?
                </h3>
                <p className="text-gray-600 text-sm">
                  Hayır, bu hesaplama <strong>asgari ücretleri</strong> gösterir. Avukat ile müvekkil 
                  arasında daha yüksek ücret kararlaştırılabilir. Asgari ücretin altında sözleşme yapılamaz.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">
                  Hangi davalarda nispi ücret uygulanır?
                </h3>
                <p className="text-gray-600 text-sm">
                  Alacak davaları, tazminat davaları, icra takipleri gibi <strong>para konulu</strong> 
                  tüm davalarda nispi ücret hesaplanır. Dava değeri TL cinsinden belirlenir ve 
                  kademeli oranlara göre hesaplama yapılır.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">
                  Hangi davalarda maktu ücret uygulanır?
                </h3>
                <p className="text-gray-600 text-sm">
                  Boşanma, ceza davaları, idarî davalar gibi <strong>para ile değerlendirilemeyen</strong> 
                  davalarda maktu ücret uygulanır. Ücret, davanın görüleceği mahkeme türüne göre belirlenir.
                </p>
              </div>
            </div>
          </div>

          {/* Anahtar Kelime Zengin İçerik */}
          <div className="mt-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Vekalet Ücreti Hesaplama Rehberi
            </h2>
            <div className="prose prose-blue max-w-none text-gray-700 space-y-4 text-sm">
              <p>
                <strong>Vekalet ücreti hesaplama</strong> işlemi, Türkiye Barolar Birliği tarafından 
                belirlenen Avukatlık Asgari Ücret Tarifesi (AAÜT) çerçevesinde yapılır. 2026 yılı için 
                4 Kasım 2025 tarihinde güncellenen tarife, hem <strong>nispi ücret hesaplama</strong> 
                hem de <strong>maktu ücret</strong> sistemlerini içermektedir.
              </p>
              
              <p>
                <strong>Avukatlık ücreti hesaplama</strong> yaparken dikkat edilmesi gereken en önemli 
                nokta, davanın türünü doğru belirlemektir. Para konulu davalarda (alacak, tazminat, 
                icra takibi) nispi ücret; para ile değerlendirilemeyen davalarda (boşanma, ceza, idare) 
                maktu ücret sistemi uygulanır.
              </p>

              <div className="bg-white rounded-xl p-5 border-2 border-blue-100">
                <h3 className="font-bold text-primary-900 mb-3">2026 Nispi Ücret Kademeleri</h3>
                <ul className="space-y-2 text-sm">
                  <li>• İlk 600.000 TL için <strong>%16 oran</strong></li>
                  <li>• Sonraki 600.000 TL için <strong>%15 oran</strong></li>
                  <li>• Sonraki 1.200.000 TL için <strong>%14 oran</strong></li>
                  <li>• Sonraki 1.200.000 TL için <strong>%13 oran</strong> (yeni!)</li>
                  <li>• Ve devamında azalan oranlarda hesaplama</li>
                </ul>
              </div>

              <p>
                <strong>Avukat ücreti</strong> hesaplarken unutulmamalıdır ki, burada bahsedilen ücretler 
                <strong> asgari tutarlardır</strong>. Avukat ve müvekkil arasında yapılacak sözleşmede 
                bu tutarlardan daha yüksek ücret kararlaştırılabilir, ancak daha düşük ücret 
                belirlenmesi mümkün değildir.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>

      <HesaplamaDisclaimer
        aracAdi="vekâlet ücreti hesaplama aracı"
        mevzuat="2026 yılı Avukatlık Asgari Ücret Tarifesi (AAÜT)"
        ekNotlar={[
          'Tarife, her yıl Türkiye Barolar Birliği tarafından güncellenir; sayfa içeriği yayınlanan en son tarifeye göre düzenlenmiştir.',
          'Nispi ücret hesabında müddeabihin değeri, kademeli oranlar ve maktu sınırlar bu araçta dikkate alınır; somut davada mahkemece takdir edilecek miktar farklılık gösterebilir.',
        ]}
      />
    </>
  );
}
