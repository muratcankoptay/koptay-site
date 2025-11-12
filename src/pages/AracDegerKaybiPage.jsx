import React, { useState } from 'react';
import { Car, Calculator, FileText, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Calendar, Gauge, DollarSign, Info } from 'lucide-react';
import SEO from '../components/SEO';
import {
  hesaplaDegerKaybi,
  parcaListesi,
  formatCurrency,
  formatPercentage
} from '../utils/aracDegerKaybi';

export default function AracDegerKaybiPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    aracDegeri: '',
    modelYili: '',
    kazaTarihi: '',
    kilometre: ''
  });

  const [hasar1, setHasar1] = useState({
    hasarTutari: '',
    hasarTuru: '', // A1, A2, A3, A4 - Kullanıcı seçecek
    parcalar: []
  });

  const [sonuc, setSonuc] = useState(null);

  // Form alanı değişikliklerini handle et
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHasar1Change = (field, value) => {
    setHasar1(prev => ({ ...prev, [field]: value }));
  };

  // Parça seçimi toggle
  const toggleParca = (hasarNo, parcaId, islemTuru) => {
    setHasar1(prev => {
      const mevcutParcalar = prev.parcalar || [];
      const parcaIndex = mevcutParcalar.findIndex(p => p.id === parcaId);
      
      if (parcaIndex >= 0) {
        // Parça zaten seçili - aynı işlem türüyse kaldır, değilse güncelle
        if (mevcutParcalar[parcaIndex].islemTuru === islemTuru) {
          return {
            ...prev,
            parcalar: mevcutParcalar.filter(p => p.id !== parcaId)
          };
        } else {
          const yeniParcalar = [...mevcutParcalar];
          yeniParcalar[parcaIndex] = { id: parcaId, islemTuru };
          return { ...prev, parcalar: yeniParcalar };
        }
      } else {
        // Yeni parça ekle
        return {
          ...prev,
          parcalar: [...mevcutParcalar, { id: parcaId, islemTuru }]
        };
      }
    });
  };

  // Validation
  const validateStep1 = () => {
    return formData.aracDegeri && formData.modelYili && formData.kazaTarihi && formData.kilometre;
  };

  const validateStep2 = () => {
    return hasar1.hasarTutari && hasar1.hasarTuru && hasar1.parcalar.length > 0;
  };

  // Navigation
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step === 1) {
      setCurrentStep(1);
    } else if (step === 2 && validateStep1()) {
      setCurrentStep(2);
    } else if (step === 3 && validateStep1() && validateStep2()) {
      setCurrentStep(3);
    }
  };

  // Hesaplama
  const handleHesapla = () => {
    const aktifHasarlar = [];
    if (hasar1.hasarTutari) {
      aktifHasarlar.push(hasar1);
    }

    const hesaplama = hesaplaDegerKaybi({
      aracDegeri: parseFloat(formData.aracDegeri),
      modelYili: parseInt(formData.modelYili),
      kazaTarihi: formData.kazaTarihi,
      kilometre: parseInt(formData.kilometre),
      hasarlar: aktifHasarlar.map(h => ({
        ...h,
        hasarTutari: parseFloat(h.hasarTutari),
        hasarKodu: h.hasarTuru // Kullanıcının seçtiği A1-A4 değerini hasarKodu olarak gönder
      }))
    });

    setSonuc(hesaplama);
    setCurrentStep(4);
  };

  const steps = [
    { number: 1, title: 'Genel Bilgiler', icon: Car },
    { number: 2, title: 'Hasar Bilgileri', icon: AlertCircle },
    { number: 3, title: 'Özet', icon: FileText },
    { number: 4, title: 'Rapor', icon: CheckCircle }
  ];

  return (
    <>
      <SEO
        title="Araç Değer Kaybı Hesaplama 2025 | Bilirkişi Raporu Uyumlu | Koptay Hukuk"
        description="Trafik kazası sonrası araç değer kaybı hesaplama aracı. 2025 Sigorta Genel Şartları formülü (Baz Katsayı %19), A1-A4 hasar sınıflandırması, Yargıtay içtihatlarına uygun detaylı hesaplama. Ücretsiz araç değer kaybı hesaplayıcı."
        keywords="araç değer kaybı hesaplama, araç değer kaybı 2025, trafik kazası değer kaybı, araç hasar değer kaybı, bilirkişi raporu araç değer kaybı, sigorta değer kaybı hesaplama, araç ekspertiz değer kaybı, A1 A2 A3 A4 hasar, yargıtay araç değer kaybı, araç değer kaybı formülü, trafik sigortası değer kaybı, kasko değer kaybı, araç değer kaybı tazminat"
        url="/hesaplama-araclari/arac-deger-kaybi"
      />

      {/* Structured Data - JSON-LD for Calculator */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Araç Değer Kaybı Hesaplama Aracı",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "TRY"
          },
          "description": "Trafik kazası sonrası araç değer kaybı hesaplama aracı. 2025 Sigorta Genel Şartları formülü ile Yargıtay içtihatlarına uygun hesaplama.",
          "author": {
            "@type": "LegalService",
            "name": "Koptay Hukuk Bürosu",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "İstanbul",
              "addressCountry": "TR"
            }
          },
          "featureList": [
            "2025 Sigorta Genel Şartları formülü (Baz Katsayı %19)",
            "A1-A4 hasar boyutu sınıflandırması",
            "Kilometre bazlı katsayı hesaplama",
            "Yargıtay %35 üst sınır kontrolü",
            "Bilirkişi raporu uyumlu sonuçlar",
            "13 parçalı araç hasar gösterimi"
          ]
        })}
      </script>

      {/* FAQ Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Araç değer kaybı nasıl hesaplanır?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "2025 Sigorta Genel Şartlarına göre: Baz Değer Kaybı = Araç Rayiç Değeri × %19. Toplam Değer Kaybı = Baz Değer Kaybı × Hasar Boyutu Katsayısı (A1-A4) × KM Katsayısı. Yargıtay kararlarına göre maksimum %35 sınırı uygulanır."
              }
            },
            {
              "@type": "Question",
              "name": "A1, A2, A3, A4 hasar kodları ne anlama gelir?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A1 (Büyük Hasar): Katsayı 0.90 - Aracın %20+ hasar, A2 (Orta Hasar): Katsayı 0.75 - %8-20 arası hasar, A3 (Küçük Hasar): Katsayı 0.50 - %2-8 arası hasar, A4 (Basit Hasar): Katsayı 0.25 - %2 den az hasar."
              }
            },
            {
              "@type": "Question",
              "name": "Araç değer kaybı tazminatı nasıl alınır?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Trafik kazası sonrası kusurlu taraftan veya sigorta şirketinden talep edilir. Bilirkişi raporu ile hasar tespit edilir, mahkeme veya sulh yoluyla tazminat alınabilir. Hesaplama aracımız ile tahmini tutar öğrenilebilir."
              }
            },
            {
              "@type": "Question",
              "name": "2025 araç değer kaybı formülü nedir?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "2025 Sigorta Genel Şartlarına göre Baz Katsayı %19'dur. Formül: B (Baz Değer Kaybı) = R (Rayiç Değer) × 0.19, D (Toplam Değer Kaybı) = B × H (Hasar Boyutu) × K (KM Katsayısı)."
              }
            }
          ]
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Car className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Araç Değer Kaybı Hesaplama
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trafik kazası sonrası aracınızın değer kaybını bilirkişi raporlarına uygun şekilde hesaplayın
            </p>
          </div>

          {/* Progress Steps */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between relative">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div
                    className="flex flex-col items-center cursor-pointer relative z-10"
                    onClick={() => goToStep(step.number)}
                  >
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full transition-all
                      ${currentStep === step.number
                        ? 'bg-red-600 text-white scale-110'
                        : currentStep > step.number
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }
                    `}>
                      {currentStep > step.number ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`
                      mt-2 text-xs font-medium hidden md:block text-center
                      ${currentStep === step.number ? 'text-red-600' : 'text-gray-500'}
                    `}>
                      {step.title}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div className={`
                      flex-1 h-1 mx-2 transition-all
                      ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'}
                    `} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* ADIM 1: Genel Bilgiler */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Genel Bilgiler</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Araç Değeri (TL)
                    </label>
                    <input
                      type="number"
                      value={formData.aracDegeri}
                      onChange={(e) => handleInputChange('aracDegeri', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="örn: 1500000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Model Yılı
                    </label>
                    <input
                      type="number"
                      value={formData.modelYili}
                      onChange={(e) => handleInputChange('modelYili', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="örn: 2022"
                      min="1990"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Kaza Tarihi
                    </label>
                    <input
                      type="date"
                      value={formData.kazaTarihi}
                      onChange={(e) => handleInputChange('kazaTarihi', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Gauge className="w-4 h-4 inline mr-1" />
                      Kilometre
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        (KM katsayısı hesaplamada kullanılır)
                      </span>
                    </label>
                    <input
                      type="number"
                      value={formData.kilometre}
                      onChange={(e) => handleInputChange('kilometre', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="örn: 45000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      0-14.999 km: %90 • 15-29.999 km: %80 • 30-44.999 km: %60 • 45-59.999 km: %40
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <div className="flex">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">Bilgilendirme</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Lütfen tüm bilgileri eksiksiz ve doğru şekilde doldurunuz. Hesaplama sonuçları bu bilgilere göre oluşturulacaktır.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADIM 2: Hasar Bilgileri */}
            {currentStep === 2 && (
              <HasarForm
                hasarNo={1}
                hasar={hasar1}
                onHasarChange={handleHasar1Change}
                onParcaToggle={toggleParca}
              />
            )}

            {/* ADIM 3: Özet */}
            {currentStep === 3 && (
              <OzetEkrani formData={formData} hasar1={hasar1} />
            )}

            {/* ADIM 4: Rapor */}
            {currentStep === 4 && sonuc && (
              <RaporEkrani sonuc={sonuc} formData={formData} />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`
                  flex items-center px-6 py-3 rounded-lg font-medium transition-all
                  ${currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Geri
              </button>

              {currentStep < 3 && (
                <button
                  onClick={handleNextStep}
                  disabled={(currentStep === 1 && !validateStep1()) || (currentStep === 2 && !validateStep2())}
                  className={`
                    flex items-center px-6 py-3 rounded-lg font-medium transition-all
                    ${((currentStep === 1 && !validateStep1()) || (currentStep === 2 && !validateStep2()))
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                    }
                  `}
                >
                  İleri
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              )}

              {currentStep === 3 && (
                <button
                  onClick={handleHesapla}
                  className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Hesapla
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Araç Kroki Komponenti
const AracKroki = ({ seciliParcalar }) => {
  const getParcaClass = (parcaId) => {
    const parca = seciliParcalar?.find(p => p.id === parcaId);
    if (!parca) return '';
    
    switch (parca.islemTuru) {
      case 'lokalBoya':
        return 'lokal';
      case 'boyali':
        return 'boyali';
      case 'degisen':
        return 'degisen';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-200 sticky top-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">Araç Hasar Haritası</h3>
      
      <style>{`
        .arac-parcasi {
          fill: #e5e5e5;
          stroke: #D3D2D2;
          stroke-width: 1.5;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        .arac-parcasi:hover {
          fill: #d0d0d0;
          stroke: #999;
        }
        .arac-govdesi {
          fill: #fff;
          stroke: #D3D2D2;
          stroke-width: 1.5;
        }
        .arac-parcasi.lokal {
          fill: #FFEB3B !important;
          stroke: #FBC02D !important;
        }
        .arac-parcasi.boyali {
          fill: #F44336 !important;
          stroke: #D32F2F !important;
        }
        .arac-parcasi.degisen {
          fill: #8B0000 !important;
          stroke: #600 !important;
        }
      `}</style>

      <svg 
        version="1.1" 
        viewBox="0 0 300 430"
        className="w-full h-auto"
        style={{ maxHeight: '490px', margin: 'auto', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
          <g>
            <g transform="translate(156.5 219.5) rotate(-90) translate(-188.5 -144.5)">
              <g transform="translate(0)">
                {/* Ana Gövde */}
                <path className="arac-govdesi" d="m311.85 23.096c0-1.3004-0.20081-2.5488-0.50203-3.8493l-2.8616-11.08 0.40162-2.4448c0.40162-2.2367-1.2049-4.3174-3.4138-4.4215l-19.931-1.1444c-1.4057-0.10403-2.5102 1.1444-2.4097 2.5488 0.20081 2.1847 0.45183 4.4215 0.50203 6.8142 0.40162 13.472-9.8398 24.916-22.842 24.76-12.4-0.10403-22.441-10.559-22.441-23.46 0-2.965 0.050203-5.6179 0.25102-8.3227 0.10041-1.3524-0.95386-2.4968-2.2591-2.4968h-110.6c-1.4057 0-2.46 1.2484-2.2591 2.7049 0.35142 2.3408 0.50203 4.7336 0.50203 7.3344 0.15061 13.004-9.9402 24.188-22.491 24.292-12.601 0.10403-22.842-10.455-22.842-23.46 0-0.67622 0.050203-1.4045 0.10041-2.0807 0.15061-1.5605-1.2551-2.7569-2.711-2.4448l-2.962 0.62421c-1.3053 0.10403-5.3215 0.57219-8.8859 3.9013-1.5563 1.4565-2.5604 3.017-3.2632 4.4215-1.2049 2.4448-2.7612 4.7336-4.6187 6.7622-0.80325 0.88429-1.6567 1.8206-2.46 2.7049-1.8575 3.2251-0.10041 6.7102-0.25102 10.455-0.20081 6.4501 3.8154 12.692 2.2089 19.142-0.25102 0.93631 0.10041 1.9767 0.85345 2.4968 2.6608 1.9246 5.8236 2.913 9.0868 2.913h11.547c0.65264 0 1.2551 0.15605 1.8073 0.46815 2.6106 1.6645 5.1709 3.3811 7.7815 5.0457 9.639 6.2941 20.182 10.924 31.327 13.576 0.60244 0.15605 1.2049 0.26009 1.8073 0.41614 7.5807 1.6645 14.509 2.3408 20.282 2.4968h20.734c20.935 0 41.518-5.6699 59.691-16.437l21.738-12.848 43.928-7.6465c6.8778-1.1964 13.404-4.0573 19.027-8.3748 0.050204-0.052017 6.426-3.4851 6.426-13.368z" />

                {/* Sol Arka Kapı */}
                <path id="pathSolArkaKapi" className={`arac-parcasi ${getParcaClass('arkaKapiSol')}`} d="m106.51 55.944c-0.52167 0.93363-0.66394 2.0147-0.33197 2.9974 0.85364 2.506 2.5609 4.5207 4.7899 5.7492l4.6476 2.506c9.5798 5.2087 20.345 7.9113 31.158 7.9113h13.421l3.13-17.248c1.3279-7.2233 1.9918-14.643 1.9918-21.965v-25.847c-2.4187 0-8.0622-0.049138-13.706-0.049138-4.3156 0-7.7776 0-10.196 0.049138-1.8496 0-3.794 1.081-5.3115 2.9483-1.1856 1.425-2.2764 2.9483-3.2723 4.5207-1.0433 1.6707-1.6599 2.9483-2.229 4.1767-0.71137 1.4741-1.3753 2.8992-2.6084 4.619-1.2805 1.769-2.798 3.4397-4.5053 4.9138-3.4146 2.9483-6.3075 6.388-8.5838 10.319l-0.047424 0.049138v0.049138l-8.3467 14.299zm5.027-0.88449c2.0393-1.769 4.6476-2.7517 7.3508-2.7517h40.548c0.80622 0 1.4227 0.73707 1.3279 1.5724l-2.4187 16.412c-0.23712 1.5724-1.5176 2.7026-3.0352 2.6535l-10.149-0.19655c-9.4849-0.19655-18.733-2.85-26.937-7.7638l-3.13-1.8673c-1.8021-1.081-3.2723-2.6535-4.2208-4.5699-0.61652-1.1793-0.33197-2.6535 0.66394-3.4888z" fillRule="nonzero" />

                {/* Sol Ön Kapı */}
                <path id="pathSolOnKapi" className={`arac-parcasi ${getParcaClass('onKapiSol')}`} d="m166.04 58.376l-3.0398 16.732 2.9448-0.14764c18.476-0.98425 36.62-6.7421 52.483-16.634 3.4197-2.1653 5.9845-5.561 7.0769-9.5472 3.2297-11.467 3.9897-23.72 2.1848-35.531l-0.28498-1.7224c-0.14249-0.88582-0.85493-1.5256-1.7574-1.5256h-57.613v25.886c0 7.5295-0.66495 15.108-1.9948 22.49zm-0.28498 12.352l3.8472-15.994c0.42747-1.7224 1.8524-2.9527 3.5622-3.0512l34.055-1.9193v-0.049212c0-2.559 1.9948-4.6752 4.5121-4.6752h7.3144c0.61745 0 1.1874 0.14764 1.7574 0.34449 0.23748 0.098425 0.33247 0.3937 0.23748 0.63976-0.094992 0.24606-0.37997 0.34449-0.61745 0.24606-0.42747-0.19685-0.90243-0.29527-1.3774-0.29527h-7.3144c-1.9948 0-3.6097 1.6732-3.6097 3.7401v0.049212c0 2.313 1.8049 4.1831 4.0372 4.1831h7.3144 0.23748l-0.37997 0.24606c-13.489 9.3012-28.783 15.305-44.836 17.52l-7.0769 0.98425c-0.99742 0.19685-1.8998-0.83661-1.6624-1.9685z" fillRule="nonzero" />

                {/* Ön Tampon */}
                <path id="pathOnTampon" className={`arac-parcasi ${getParcaClass('onBumper')}`} d="m340 201.35c3.7652 1.6125 7.7313 2.4968 11.798 2.4968h15.864c3.2632 0 5.9742-2.8609 6.1248-6.5021 0.70284-16.958 1.1547-34.643 1.1547-53.005v-0.41614c0-18.518-0.40162-36.36-1.1547-53.422-0.15061-3.6412-2.8616-6.5021-6.1248-6.5021h-15.864c-4.0664 0-8.0325 0.83227-11.798 2.4968v114.85z" fillRule="nonzero" />

                {/* Sol Arka Çamurluk */}
                <path id="pathSolArkaCamurluk" className={`arac-parcasi ${getParcaClass('arkaCamurlukSol')}`} d="m59.277 54.594s6.1176 1.9503 15.529 0.97517l5.3646 0.29255s9.2234 7.5088 12.047 7.2163c2.8235-0.34131 7.7175-8.4352 7.7175-8.4352l10.635-19.503c-0.14118 0.24379-15.2 3.4131-22.164-1.414-6.0234-4.1932-10.682-10.824-11.482-17.846l-0.79999-4.8759s-9.3175-0.39007-12.329 6.5824c-3.0117 6.9725-6.5411 9.4592-6.5411 9.4592s-0.94116 10.629 0.79999 13.262c1.6941 2.5842 1.2235 14.286 1.2235 14.286z" fillRule="nonzero" />

                {/* Sol Ön Çamurluk */}
                <path id="pathSolOnCamurluk" className={`arac-parcasi ${getParcaClass('onCamurlukSol')}`} transform="translate(267.88 27.237) scale(-1) rotate(180) translate(-267.88 -27.237)" d="m234.26 49.983l53.188-9.0296s15.014-4.4657 16.577-8.6861c1.563-4.2204 2.3681-7.0176 1.563-10.109-0.80516-3.0917-2.8418-10.502-2.8418-10.502s3.3154-6.1833-0.61572-6.1833c-3.9311 0-15.958-0.98148-15.958-0.98148s2.3211 32.474-25.531 32.907c-25.568 0.39668-24.904-28.637-24.904-28.637h-5.8815s5.7309 23.212 0 41.222h4.4042z" fillRule="nonzero" />

                {/* Sağ Ön Çamurluk */}
                <path id="pathSagOnCamurluk" className={`arac-parcasi ${getParcaClass('onCamurlukSag')}`} transform="translate(267.88 261.26) scale(-1 1) rotate(180) translate(-267.88 -261.26)" d="m234.26 284.01l53.188-9.0296s15.014-4.4657 16.577-8.6861c1.563-4.2204 2.3681-7.0176 1.563-10.109-0.80516-3.0917-2.8418-10.502-2.8418-10.502s3.3154-6.1833-0.61572-6.1833c-3.9311 0-15.958-0.98148-15.958-0.98148s2.3211 32.474-25.531 32.907c-25.568 0.39668-24.904-28.637-24.904-28.637h-5.8815s5.7309 23.212 0 41.222h4.4042z" fillRule="nonzero" />

                {/* Sağ Arka Kapı */}
                <path id="pathSagArkaKapi" className={`arac-parcasi ${getParcaClass('arkaKapiSag')}`} d="m114.9 247.46l0.047425 0.098276c2.2764 3.9311 5.1693 7.4199 8.5838 10.319 1.7547 1.4741 3.2723 3.1448 4.5053 4.9138 1.233 1.7198 1.897 3.1448 2.6084 4.619 0.61652 1.2285 1.233 2.5552 2.229 4.1767 0.99592 1.5724 2.0867 3.0957 3.2723 4.5207 1.5176 1.8181 3.462 2.8992 5.3115 2.9483 2.4661 0.049138 5.8806 0.049138 10.196 0.049138 5.5961 0 11.287-0.049138 13.706-0.049138v-25.847c0-7.3707-0.66394-14.741-1.9918-21.965l-3.13-17.248h-13.469c-10.813 0-21.578 2.7517-31.158 7.9113l-4.6476 2.506c-2.2764 1.2285-3.9362 3.2431-4.7899 5.7492-0.33197 0.98276-0.1897 2.0638 0.33197 2.9974l8.3941 14.299zm-3.9837-16.904c0.94849-1.9164 2.4187-3.4888 4.2208-4.5699l3.13-1.8673c8.2044-4.9138 17.452-7.5673 26.937-7.7638l10.149-0.19655c1.5176-0.049138 2.8455 1.1302 3.0352 2.6535l2.4187 16.412c0.14227 0.83535-0.47425 1.5724-1.3279 1.5724h-40.548c-2.7032 0-5.2641-0.98276-7.3508-2.7517-0.94849-0.83535-1.233-2.3095-0.66394-3.4888z" fillRule="nonzero" />

                {/* Sağ Ön Kapı */}
                <path id="pathSagOnKapi" className={`arac-parcasi ${getParcaClass('onKapiSag')}`} d="m169.03 253.22v25.886h57.66c0.85493 0 1.6149-0.63976 1.7574-1.5256l0.28498-1.7224c1.8049-11.811 1.0449-24.065-2.1848-35.531-1.1399-3.9862-3.6572-7.3819-7.0769-9.5472-15.911-9.9409-34.055-15.65-52.531-16.634l-2.9448-0.14764 3.0398 16.732c1.3299 7.3819 1.9948 14.961 1.9948 22.49zm-0.52246-36.86l7.0769 0.98425c16.054 2.2146 31.395 8.2185 44.836 17.52l0.37997 0.24606h-0.23748-7.3144c-2.2323 0-4.0372 1.8701-4.0372 4.1831v0.049213c0 2.0669 1.6149 3.7401 3.6097 3.7401h7.3144c0.47496 0 0.94992-0.098425 1.3774-0.29528 0.23748-0.098425 0.52246 0 0.61745 0.24606 0.094992 0.24606 0 0.54134-0.23748 0.63976-0.56996 0.24606-1.1399 0.34449-1.7574 0.34449h-7.3144c-2.4698 0-4.5121-2.0669-4.5121-4.6752v-0.049213l-34.055-1.9193c-1.7099-0.098425-3.1348-1.3287-3.5622-3.0512l-3.8472-15.994c-0.33247-1.0827 0.56996-2.1161 1.6624-1.9685z" fillRule="nonzero" />

                {/* Sağ Arka Çamurluk */}
                <path id="pathSagArkaCamurluk" className={`arac-parcasi ${getParcaClass('arkaCamurlukSag')}`} d="m58.43 234.06s6.5264-2.0807 16.567-1.0403l5.7232-0.3121s9.8398-8.0106 12.852-7.6985c3.0122 0.36412 8.2333 8.999 8.2333 8.999l11.346 20.807c-0.15061-0.26008-16.216-3.6412-23.646 1.5085-6.426 4.4735-11.396 11.548-12.25 19.038l-0.85345 5.2017s-9.9402 0.41614-13.153-7.0223c-3.213-7.4385-6.9782-10.091-6.9782-10.091s-1.0041-11.34 0.85345-14.149c1.8073-2.7569 1.3053-15.241 1.3053-15.241z" fillRule="nonzero" />

                {/* Motor Kaputu */}
                <path id="pathMotorKaputu" className={`arac-parcasi ${getParcaClass('kaput')}`} d="m230 100s14.961 40.833 0 87.129h53.968s20.633-8.1667 18.876-43.07c-1.7571-34.904-18.876-44.059-18.876-44.059h-53.968z" fillRule="nonzero" />

                {/* Bagaj Kapağı */}
                <path id="pathBagajKapagi" className={`arac-parcasi ${getParcaClass('bagajKapagi')}`} d="m95.64 100.03h-23.897s-10.743-1.3004-10.743 13.004v65.594s1.7069 8.7909 8.4843 8.7909h26.156s-8.5345-37.712 0-87.389z" fillRule="nonzero" />

                {/* Tavan */}
                <path id="pathTavan" className={`arac-parcasi ${getParcaClass('tavan')}`} d="m126.16 111s-10.794 28.349-1.1547 64.501h63.658s8.7855-32.771 0-64.501h-62.503z" fillRule="nonzero" />

                {/* Arka Tampon */}
                <path id="pathArkaTampon" className={`arac-parcasi ${getParcaClass('arkaBumper')}`} d="m36.941 86.497c-3.7652-1.6125-7.7313-2.4968-11.798-2.4968h-15.864c-3.2632 0-5.9742 2.8609-6.1248 6.5021-0.70284 16.958-1.1547 34.643-1.1547 53.005v0.41614c0 18.518 0.40162 36.36 1.1547 53.422 0.15061 3.6412 2.8616 6.5021 6.1248 6.5021h15.864c4.0664 0 8.0325-0.83228 11.798-2.4968v-114.85z" fillRule="nonzero" />
              </g>
            </g>
          </g>
        </g>
      </svg>

      {/* Renk Açıklaması */}
      <div className="mt-4 flex flex-wrap gap-3 text-sm justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4" style={{ backgroundColor: '#FFEB3B', border: '1px solid #333' }}></div>
          <span>Lokal Boyalı</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4" style={{ backgroundColor: '#F44336', border: '1px solid #333' }}></div>
          <span>Boyalı</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4" style={{ backgroundColor: '#8B0000', border: '1px solid #333' }}></div>
          <span>Değişen</span>
        </div>
      </div>
    </div>
  );
};

// Hasar Form Komponenti
const HasarForm = ({ hasarNo, hasar, onHasarChange, onParcaToggle, opsiyonel = false }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {hasarNo}. Hasar Bilgileri
        </h2>
        {opsiyonel && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Opsiyonel
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Taraf - Form Alanları */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hasar Tutarı (TL)
            </label>
            <input
              type="number"
              value={hasar.hasarTutari}
              onChange={(e) => onHasarChange('hasarTutari', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="örn: 120000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hasar Boyutu <span className="text-red-500">*</span>
            </label>
            <select
              value={hasar.hasarTuru}
              onChange={(e) => onHasarChange('hasarTuru', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Hasar boyutunu seçiniz</option>
              <option value="A1">A1 (Büyük Hasar) - Katsayı 0.90 - Aracın %20+ hasar</option>
              <option value="A2">A2 (Orta Hasar) - Katsayı 0.75 - Aracın %8-20 arası hasar</option>
              <option value="A3">A3 (Küçük Hasar) - Katsayı 0.50 - Aracın %2-8 arası hasar</option>
              <option value="A4">A4 (Basit Hasar) - Katsayı 0.25 - Aracın %2 den az hasar</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              💡 Hasar boyutu, hasarın araç değerine oranına göre belirlenir
            </p>
          </div>
        </div>

        {/* Sağ Taraf - Araç Kroki */}
        <AracKroki seciliParcalar={hasar.parcalar} />
      </div>

      {/* Parça Seçimi Tablosu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Hasarlı Parçalar
        </label>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Parça Adı</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Lokal Boyalı</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Boyalı</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Değişen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {parcaListesi.map((parca, index) => {
                const seciliParca = hasar.parcalar?.find(p => p.id === parca.id);
                const islemTuru = seciliParca?.islemTuru;

                return (
                  <tr key={parca.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{parca.ad}</td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        name={`${hasarNo}-${parca.id}`}
                        checked={islemTuru === 'lokalBoya'}
                        onChange={() => onParcaToggle(hasarNo, parca.id, 'lokalBoya')}
                        className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        name={`${hasarNo}-${parca.id}`}
                        checked={islemTuru === 'boyali'}
                        onChange={() => onParcaToggle(hasarNo, parca.id, 'boyali')}
                        className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        name={`${hasarNo}-${parca.id}`}
                        checked={islemTuru === 'degisen'}
                        onChange={() => onParcaToggle(hasarNo, parca.id, 'degisen')}
                        className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Özet Ekranı
const OzetEkrani = ({ formData, hasar1 }) => {
  const aktifHasarlar = [];
  if (hasar1.hasarTutari) aktifHasarlar.push(hasar1);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Özet</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Araç Bilgileri</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Araç Değeri:</span>
              <span className="font-medium">{formatCurrency(parseFloat(formData.aracDegeri))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Model Yılı:</span>
              <span className="font-medium">{formData.modelYili}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kilometre:</span>
              <span className="font-medium">{parseInt(formData.kilometre).toLocaleString('tr-TR')} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kaza Tarihi:</span>
              <span className="font-medium">{new Date(formData.kazaTarihi).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Hasar Bilgileri</h3>
          <div className="space-y-3">
            {aktifHasarlar.map((hasar, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium text-gray-900">{index + 1}. Hasar</div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600">Tutar:</span>
                  <span className="font-medium">{formatCurrency(parseFloat(hasar.hasarTutari))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parça Sayısı:</span>
                  <span className="font-medium">{hasar.parcalar?.length || 0} parça</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Bilgilendirme</h3>
            <p className="text-sm text-yellow-700 mt-1">
              "Hesapla" butonuna tıkladığınızda araç değer kaybı hesaplanacaktır.
              Hesaplama bilirkişi raporları ve Yargıtay içtihatlarına dayalı olarak yapılmaktadır.
            </p>
          </div>
        </div>
      </div>

      {/* Hasar Boyutu Rehberi */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          📋 Hasar Boyutu Sınıflandırması (2025 Resmî Uygulama)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-white p-3 rounded border border-red-200">
            <div className="font-semibold text-red-700">A1 - Büyük Hasar</div>
            <div className="text-gray-600 text-xs mt-1">Katsayı: 0.90 - Aracın %20+ hasar</div>
          </div>
          <div className="bg-white p-3 rounded border border-orange-200">
            <div className="font-semibold text-orange-700">A2 - Orta Hasar</div>
            <div className="text-gray-600 text-xs mt-1">Katsayı: 0.75 - Aracın %8-20 arası hasar</div>
          </div>
          <div className="bg-white p-3 rounded border border-yellow-200">
            <div className="font-semibold text-yellow-700">A3 - Küçük Hasar</div>
            <div className="text-gray-600 text-xs mt-1">Katsayı: 0.50 - Aracın %2-8 arası hasar</div>
          </div>
          <div className="bg-white p-3 rounded border border-green-200">
            <div className="font-semibold text-green-700">A4 - Basit Hasar</div>
            <div className="text-gray-600 text-xs mt-1">Katsayı: 0.25 - Aracın %2 den az hasar</div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3">
          💡 Hasar boyutu, hasarın araç rayiç değerine oranına göre otomatik belirlenir.
        </p>
      </div>
    </div>
  );
};

// Rapor Ekranı
const RaporEkrani = ({ sonuc, formData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Hesaplama Tamamlandı</h2>
      </div>

      {/* Ana Sonuç */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="text-sm font-medium opacity-90 mb-2">TOPLAM DEĞER KAYBI</div>
          <div className="text-5xl font-bold mb-2">
            {formatCurrency(sonuc.toplamDegerKaybi)}
          </div>
          <div className="text-xl opacity-90">
            ({formatPercentage(sonuc.toplamDegerKaybiOrani)} değer kaybı)
          </div>
        </div>
      </div>

      {/* Detaylı Bilgiler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Araç Değeri</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(sonuc.aracDegeri)}
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">Kilometre</div>
          <div className="text-2xl font-bold text-gray-900">
            {sonuc.kilometre.toLocaleString('tr-TR')} km
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg text-center">
          <div className="text-sm text-gray-600 mb-1">KM Katsayısı</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPercentage(sonuc.kmKatsayisi * 100)}
          </div>
        </div>
      </div>

      {/* Hesaplama Detayları */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Hesaplama Detayları</h3>
        
        {/* Formül Açıklaması */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">📐 Hesaplama Formülü (2025 Sigorta Genel Şartları):</div>
          <div className="space-y-1 text-sm text-gray-700">
            <div className="font-mono bg-white px-3 py-2 rounded border border-blue-200">
              <strong>B</strong> (Baz Değer Kaybı) = R (Rayiç Değer) × 0.19
            </div>
            <div className="font-mono bg-white px-3 py-2 rounded border border-blue-200">
              <strong>D</strong> (Toplam Değer Kaybı) = B × H (Hasar Boyutu) × K (KM Katsayısı)
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Baz Değer Kaybı (R × 0.19):</span>
            <span className="font-medium">{formatCurrency(sonuc.aracDegeri)} × 0.19 = {formatCurrency(sonuc.bazDegerKaybi)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">KM Katsayısı (K):</span>
            <span className="font-medium">{formatPercentage(sonuc.kmKatsayisi * 100)}</span>
          </div>
          {sonuc.hasarDetaylari.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Hasar Boyutu Katsayısı (H):</span>
              <span className="font-medium">{sonuc.hasarDetaylari[0].hasarKodu} = {sonuc.hasarDetaylari[0].hasarBoyutuKatsayisi}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-900 font-semibold">Toplam Değer Kaybı (D):</span>
            <span className="font-bold text-red-600">{formatCurrency(sonuc.toplamDegerKaybi)}</span>
          </div>
          {sonuc.sinirAsildiMi && (
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
              * Yargıtay %35 sınırı uygulandı
          </div>
        )}
      </div>

      {/* SEO İçerik Bölümü */}
      {currentStep === 4 && (
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Araç Değer Kaybı Nedir ve Nasıl Hesaplanır?</h2>
            
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">2025 Araç Değer Kaybı Hesaplama Formülü</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Trafik kazası sonrası araç değer kaybı, 2025 Sigorta Genel Şartları'na göre <strong>Baz Katsayı %19</strong> ile hesaplanır. 
                Formül: <strong>Baz Değer Kaybı = Araç Rayiç Değeri × 0.19</strong>. Toplam değer kaybı için hasar boyutu (A1-A4) 
                ve kilometre katsayısı ile çarpılır.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">A1, A2, A3, A4 Hasar Kodları</h3>
              <ul className="space-y-2 mb-4">
                <li className="text-gray-700">
                  <strong>A1 (Büyük Hasar):</strong> Katsayı 0.90 - Aracın %20 ve üzeri hasar
                </li>
                <li className="text-gray-700">
                  <strong>A2 (Orta Hasar):</strong> Katsayı 0.75 - Aracın %8-20 arası hasar
                </li>
                <li className="text-gray-700">
                  <strong>A3 (Küçük Hasar):</strong> Katsayı 0.50 - Aracın %2-8 arası hasar
                </li>
                <li className="text-gray-700">
                  <strong>A4 (Basit Hasar):</strong> Katsayı 0.25 - Aracın %2'den az hasar
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Kilometre Katsayısı Tablosu</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Aracın kilometresine göre değer kaybı katsayısı değişir: 0-14.999 km (%90), 
                15-29.999 km (%80), 30-44.999 km (%60), 45-59.999 km (%40), 60-74.999 km (%30), 
                75-149.999 km (%20), 150.000 km ve üzeri (%10).
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Araç Değer Kaybı Tazminatı Nasıl Alınır?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Trafik kazası sonrası kusurlu taraftan veya sigorta şirketinden araç değer kaybı tazminatı talep edilebilir. 
                Bilirkişi raporu ile hasar tespit edilir, mahkeme veya sulh yoluyla tazminat alınır. 
                Yargıtay kararlarına göre maksimum değer kaybı aracın rayiç değerinin %35'i kadardır.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Bilirkişi Raporu ve Yasal Süreç</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Araç değer kaybı hesaplaması için mahkeme tarafından atanan bilirkişi, 
                aracın kaza öncesi ve sonrası değerini tespit eder. 2025 formülüne göre yapılan hesaplama, 
                Yargıtay içtihatları ve sigorta mevzuatı çerçevesinde değerlendirilir.
              </p>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6 rounded">
                <p className="text-sm text-red-800">
                  <strong>Önemli:</strong> Bu araç değer kaybı hesaplama aracı bilgilendirme amaçlıdır. 
                  Kesin hesaplama için bilirkişi raporu ve hukuki danışmanlık alınız. 
                  Koptay Hukuk Bürosu olarak araç değer kaybı tazminat davalarında uzman avukat desteği sunuyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>      {/* Hasar Detayları */}
      {sonuc.hasarDetaylari.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Hasar Detayları</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {sonuc.hasarDetaylari.map((hasar, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-gray-900">{hasar.hasarNo}. Hasar</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Hasar Tutarı: {formatCurrency(hasar.hasarTutari)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(hasar.degerKaybiTutari)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatPercentage(hasar.hasarOrani)} (Hasar Oranı)
                    </div>
                  </div>
                </div>
                
                {/* Hasar Boyutu Açıklaması */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <div className="flex items-start gap-2">
                    <div className="font-semibold text-blue-900">
                      {hasar.hasarKodu}
                    </div>
                    <div className="text-sm text-blue-800">
                      {hasar.hasarKodu === 'A1' && '(Büyük Hasar - Katsayı: 0.90) - Aracın değerinin %20+ oranında hasar'}
                      {hasar.hasarKodu === 'A2' && '(Orta Hasar - Katsayı: 0.75) - Aracın değerinin %8-20 arası hasar'}
                      {hasar.hasarKodu === 'A3' && '(Küçük Hasar - Katsayı: 0.50) - Aracın değerinin %2-8 arası hasar'}
                      {hasar.hasarKodu === 'A4' && '(Basit Hasar - Katsayı: 0.25) - Aracın değerinin %2 den az hasar'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Yasal Uyarı */}
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Yasal Uyarı</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Bu hesaplama, bilirkişi raporları ve Yargıtay içtihatlarına dayalı olarak yapılmış olup,
          tahmini bir sonuç niteliğindedir. Kesin değer kaybı, mahkeme tarafından atanan bilirkişi
          tarafından belirlenecektir. Maksimum %35 değer kaybı sınırı Yargıtay kararlarına göre
          uygulanmaktadır.
        </p>
      </div>

      {/* Yazdır Butonu */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all"
        >
          Raporu Yazdır
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
        >
          Yeni Hesaplama
        </button>
      </div>
    </div>
  );
};
