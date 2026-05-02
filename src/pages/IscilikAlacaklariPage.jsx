import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import { 
    calculateSeverance, 
    calculateNoticePay, 
    calculateAnnualLeave, 
    calculateOvertime,
    CONSTANTS 
} from '../utils/laborLawCalculations';
import { FaCalculator, FaMoneyBillWave, FaCalendarAlt, FaClock, FaInfoCircle } from 'react-icons/fa';

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
            active 
            ? 'border-blue-600 text-blue-600 bg-blue-50' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
    >
        <Icon className={`mr-2 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
        {label}
    </button>
);

const ResultCard = ({ title, amount, details }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>
        <div className="grid gap-4">
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Brüt Tutar:</span>
                <span className="font-medium text-gray-900">{amount.gross.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
            </div>
            {details && Object.entries(details).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-red-500">-{value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                </div>
            ))}
            <div className="flex justify-between items-center pt-4 border-t mt-2">
                <span className="text-lg font-bold text-gray-900">Net Ödenecek:</span>
                <span className="text-2xl font-bold text-blue-600">{amount.net.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
            </div>
        </div>
    </div>
);

const IscilikAlacaklariPage = () => {
    const [activeTab, setActiveTab] = useState('kidem');
    
    // State for inputs
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        grossSalary: '',
        unusedDays: '',
        overtimeHours: '',
        overtimeRate: '1.5'
    });

    const [results, setResults] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculate = () => {
        const salary = parseFloat(formData.grossSalary);
        if (!salary) return;

        let res = {};

        switch (activeTab) {
            case 'kidem':
                if (formData.startDate && formData.endDate) {
                    const calc = calculateSeverance({
                        startDate: formData.startDate,
                        endDate: formData.endDate,
                        grossSalary: salary
                    });
                    res = {
                        type: 'Kıdem Tazminatı',
                        gross: calc.grossAmount,
                        net: calc.netAmount,
                        details: {
                            'Damga Vergisi': calc.deductions.stampTax
                        },
                        extra: `Hizmet Süresi: ${calc.tenure.years} Yıl, ${calc.tenure.months} Ay, ${calc.tenure.days} Gün`
                    };
                }
                break;
            case 'ihbar':
                if (formData.startDate && formData.endDate) {
                    const calc = calculateNoticePay({
                        startDate: formData.startDate,
                        endDate: formData.endDate,
                        grossSalary: salary
                    });
                    res = {
                        type: 'İhbar Tazminatı',
                        gross: calc.grossAmount,
                        net: calc.netAmount,
                        details: {
                            'Gelir Vergisi': calc.deductions.incomeTax,
                            'Damga Vergisi': calc.deductions.stampTax
                        },
                        extra: `İhbar Süresi: ${calc.noticeWeeks} Hafta`
                    };
                }
                break;
            case 'izin':
                if (formData.unusedDays) {
                    const calc = calculateAnnualLeave({
                        unusedDays: parseFloat(formData.unusedDays),
                        grossSalary: salary
                    });
                    res = {
                        type: 'Yıllık İzin Ücreti',
                        gross: calc.grossAmount,
                        net: calc.netAmount,
                        details: {
                            'SGK İşçi Payı': calc.deductions.sgkWorker,
                            'İşsizlik Sigortası': calc.deductions.unemploymentWorker,
                            'Gelir Vergisi': calc.deductions.incomeTax,
                            'Damga Vergisi': calc.deductions.stampTax
                        }
                    };
                }
                break;
            case 'mesai':
                if (formData.overtimeHours) {
                    const calc = calculateOvertime({
                        grossSalary: salary,
                        hours: parseFloat(formData.overtimeHours),
                        rate: parseFloat(formData.overtimeRate)
                    });
                    res = {
                        type: 'Fazla Mesai Ücreti',
                        gross: calc.grossAmount,
                        net: calc.netAmount,
                        details: {
                            'SGK İşçi Payı': calc.deductions.sgkWorker,
                            'İşsizlik Sigortası': calc.deductions.unemploymentWorker,
                            'Gelir Vergisi': calc.deductions.incomeTax,
                            'Damga Vergisi': calc.deductions.stampTax
                        },
                        extra: `Saatlik Ücret: ${calc.hourlyWage.toFixed(2)} TL`
                    };
                }
                break;
        }
        setResults(res);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Kıdem Tazminatı Hesaplama 2026 | Kıdem, İhbar, İzin, Mesai | Koptay Hukuk"
                description="2026 kıdem tavanı 64.948,77 TL ile kıdem tazminatı, ihbar tazminatı, yıllık izin ücreti ve fazla mesai hesaplama aracı. İş Kanunu, 1475 sayılı Mülga Kanun m.14, Yargıtay 9. HD ve 22. HD içtihatlarına uygun. Ankara avukat — Koptay Hukuk Bürosu."
                keywords="kıdem tazminatı hesaplama, kıdem tazminatı 2026, kıdem tavanı 2026, ihbar tazminatı hesaplama, yıllık izin ücreti hesaplama, fazla mesai hesaplama, işçilik alacakları, brüt kıdem tazminatı, net kıdem tazminatı, kıdem ve ihbar hesaplama, ankara iş hukuku avukatı, işçi alacakları davası"
                url="https://koptay.av.tr/hesaplama-araclari/iscilik-alacaklari"
            />

            {/* JSON-LD: SoftwareApplication */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "İşçilik Alacakları Hesaplama Aracı (Kıdem, İhbar, Yıllık İzin, Fazla Mesai)",
                    "applicationCategory": "FinanceApplication",
                    "operatingSystem": "Web",
                    "url": "https://koptay.av.tr/hesaplama-araclari/iscilik-alacaklari",
                    "description": "2026 güncel kıdem tavanı, damga vergisi (%0,759) ve İş Kanunu hükümleri ile dört kalemde işçilik alacaklarını hesaplar.",
                    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
                    "creator": {
                        "@type": "Attorney",
                        "name": "Koptay Hukuk Bürosu",
                        "url": "https://koptay.av.tr",
                        "address": { "@type": "PostalAddress", "addressLocality": "Ankara", "addressCountry": "TR" }
                    },
                    "featureList": [
                        "Kıdem tazminatı (1475 sayılı Mülga K. m.14, 2026 tavanı)",
                        "İhbar tazminatı (İş K. m.17 — 2-8 hafta)",
                        "Yıllık izin ücreti (İş K. m.59)",
                        "Fazla mesai hesabı (İş K. m.41)",
                        "Brüt ve net tutar gösterimi",
                        "Damga vergisi kesintisi entegre"
                    ]
                })}
            </script>

            {/* JSON-LD: HowTo — Kıdem Tazminatı Adımları */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "HowTo",
                    "name": "Kıdem Tazminatı Nasıl Hesaplanır? (2026)",
                    "description": "İş Kanunu hükümlerine göre kıdem tazminatı hesaplama adımları, 2026 tavan rakamı ve damga vergisi uygulaması.",
                    "totalTime": "PT5M",
                    "step": [
                        {
                            "@type": "HowToStep",
                            "name": "Hizmet süresini belirleyin",
                            "text": "İşe başlangıç ve sona erme tarihleri arasındaki yıl ve gün sayısını tespit edin. En az bir tam yıl çalışma kıdem tazminatı hak etmenin asgari koşuludur."
                        },
                        {
                            "@type": "HowToStep",
                            "name": "Brüt günlük ücreti bulun",
                            "text": "Son ay brüt ücretini 30'a bölün. İş Kanunu m.32 ve Yargıtay 9. HD içtihatlarına göre süreklilik arz eden yol, yemek, prim, ikramiye gibi yardımları da ekleyin."
                        },
                        {
                            "@type": "HowToStep",
                            "name": "Yıl başına 30 günlük ücret hesabı",
                            "text": "Her tam hizmet yılı için 30 günlük brüt ücret tutarı kıdem tazminatı esasıdır. Yıldan artan süreler için orantılı hesap yapılır."
                        },
                        {
                            "@type": "HowToStep",
                            "name": "2026 kıdem tavanını uygulayın",
                            "text": "Hesaplanan günlük ücret, 2026 ilk 6 ay tavanı olan 64.948,77 TL'nin 30'a bölümünü aşamaz. Tavanı aşan kısımlar dikkate alınmaz."
                        },
                        {
                            "@type": "HowToStep",
                            "name": "Damga vergisini düşün",
                            "text": "Brüt tutar üzerinden yalnızca %0,759 damga vergisi kesilir. Gelir Vergisi Kanunu m.25/7 uyarınca kıdem tazminatından gelir vergisi kesilmez."
                        }
                    ]
                })}
            </script>

            {/* JSON-LD: FAQPage */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "2026 kıdem tazminatı tavanı kaç TL?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "2026 yılı ilk 6 ay (Ocak-Haziran) için kıdem tazminatı tavanı 64.948,77 TL'dir. Bu tutar her 6 ayda bir Maliye Bakanlığı bütçe genelgesi ile güncellenir; her tam hizmet yılı için ödenecek kıdem tazminatı bu tavanı aşamaz."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Kıdem tazminatından hangi vergiler kesilir?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Kıdem tazminatından yalnızca %0,759 oranında damga vergisi kesilir. 193 sayılı Gelir Vergisi Kanunu m.25/7 uyarınca kıdem tazminatından gelir vergisi kesilmez. SGK primi de kesilmez."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "İhbar tazminatı süreleri nelerdir?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "İş Kanunu m.17 uyarınca ihbar süreleri kıdeme göre belirlenir: 6 aydan az çalışmada 2 hafta, 6 ay-1,5 yıl arası 4 hafta, 1,5-3 yıl arası 6 hafta, 3 yıldan fazla çalışmada 8 haftadır. İhbar tazminatı, bu süreye karşılık gelen brüt ücrettir."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "İstifa eden işçi kıdem tazminatı alabilir mi?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Kural olarak istifa eden işçi kıdem tazminatı alamaz. Ancak istisnaları vardır: askerlik nedeniyle istifa, kadın işçinin evlenmeyi takip eden 1 yıl içinde feshi, emeklilik, sağlık nedenleri (İş K. m.24/I), işverenin haklı nedensiz ücret ödememesi (İş K. m.24/II) gibi haklı nedenle fesih hallerinde işçi kıdem tazminatına hak kazanır."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Fazla mesai WhatsApp mesajı ile ispat edilebilir mi?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Evet. Yargıtay 9. HD yerleşik içtihatlarına göre fazla mesai çalışması her türlü delille ispatlanabilir; tanık beyanı en yaygın delildir. WhatsApp mesajları, e-postalar, mesai çizelgeleri, kart okutma kayıtları, görev yazışmaları gibi elektronik deliller HMK m.199 uyarınca yazılı belge niteliğindedir. Ancak Yargıtay genellikle tanık beyanına dayalı hesaplamada yargıcın takdiri ile %20-30 arası takdiri indirim uygular."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Yıllık izin parası ne zaman zamanaşımına uğrar?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yıllık izin ücreti alacağı, iş sözleşmesinin feshinden itibaren 5 yıl içinde zamanaşımına uğrar (TBK m.146). Bu süre içinde dava açılmazsa hak düşer. Önemli not: kullanılmayan yıllık izinler iş sözleşmesi devam ederken zamanaşımına uğramaz; sadece sözleşme feshinden sonra 5 yıllık süre işlemeye başlar."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Kıdem tazminatı brüt mü net mi hesaplanır?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Kıdem tazminatı her zaman brüt ücret üzerinden hesaplanır. Brüt tutardan yalnızca damga vergisi (%0,759) kesilerek net ödenecek tutar bulunur. Bu nedenle 'kıdem tazminatım kaç TL?' sorusunda cevap brüt tutardır; net tutar damga vergisi düştükten sonraki rakamdır."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Geriye dönük 5 yıllık fazla mesai talep edilebilir mi?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Evet. Fazla mesai alacağı 5 yıllık zamanaşımına tabidir. Dava tarihinden geriye doğru 5 yıllık süre içindeki tüm fazla mesailer talep edilebilir. Daha eski döneme ait fazla mesailer zamanaşımı def'i ile reddedilir."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Asgari ücretle çalışan işçi kıdem tazminatı nasıl hesaplanır?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Asgari ücretle çalışan işçinin kıdem tazminatı, son brüt asgari ücret üzerinden hesaplanır. Brüt aylık asgari ücret 30'a bölünerek günlük ücret bulunur, her tam hizmet yılı için 30 gün ile çarpılır. Asgari ücretle çalışan işçi 2026 itibarıyla kıdem tavanını aşmadığı için tavan kısıtlaması uygulanmaz; brüt asgari ücretin tamamı kıdem matrahıdır."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Hafta tatili çalışmasının ücreti nasıl hesaplanır?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "İş Kanunu m.46 uyarınca hafta tatilinde çalıştırılan işçiye, çalıştığı her saat için %50 zamlı ücret ödenir; bu, fazla mesai ücretine eşittir. Hafta tatili kullandırılmıyorsa ayrıca tatil ücreti de ödenmesi gerekir."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "İşçilik alacakları davası nerede açılır?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "İşçilik alacakları davaları 7036 sayılı İş Mahkemeleri Kanunu uyarınca İş Mahkemeleri'nde açılır. Ancak dava açmadan önce zorunlu arabuluculuk başvurusu yapılması gerekir; arabuluculukta anlaşma sağlanamazsa son tutanak ile dava açılabilir."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Bordro tuzağı nedir? İhtirazi kayıt nasıl konulur?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Bordro tuzağı, işverenin ödediği fazla mesai ücretini bordroda gösterip işçiye 'aldım' yazdırarak alacağın tamamını ödediğini ispat etmesidir. Bunu önlemek için bordroya 'fazla mesai alacağımı saklı tutuyorum, ihtirazi kayıt' notu eklenmeli; ya da bordroda gösterilen ücretle gerçekte ödenen ücret tutmuyorsa banka hesap ekstresi delil olarak hazırlanmalıdır."
                            }
                        }
                    ]
                })}
            </script>

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Kıdem Tazminatı Hesaplama 2026 — Kıdem, İhbar, İzin, Fazla Mesai
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        2026 kıdem tavanı <strong>64.948,77 TL</strong> ile kıdem tazminatı, ihbar tazminatı, yıllık izin ücreti ve fazla mesai alacaklarını
                        İş Kanunu hükümleri ve Yargıtay 9. HD–22. HD içtihatlarına uygun olarak hesaplayın.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Tabs */}
                    <div className="flex overflow-x-auto border-b border-gray-200">
                        <TabButton 
                            active={activeTab === 'kidem'} 
                            onClick={() => { setActiveTab('kidem'); setResults(null); }} 
                            icon={FaMoneyBillWave} 
                            label="Kıdem Tazminatı" 
                        />
                        <TabButton 
                            active={activeTab === 'ihbar'} 
                            onClick={() => { setActiveTab('ihbar'); setResults(null); }} 
                            icon={FaInfoCircle} 
                            label="İhbar Tazminatı" 
                        />
                        <TabButton 
                            active={activeTab === 'izin'} 
                            onClick={() => { setActiveTab('izin'); setResults(null); }} 
                            icon={FaCalendarAlt} 
                            label="Yıllık İzin" 
                        />
                        <TabButton 
                            active={activeTab === 'mesai'} 
                            onClick={() => { setActiveTab('mesai'); setResults(null); }} 
                            icon={FaClock} 
                            label="Fazla Mesai" 
                        />
                    </div>

                    <div className="p-8">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Common Input: Salary */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Brüt Aylık Maaş (TL)
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₺</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="grossSalary"
                                        value={formData.grossSalary}
                                        onChange={handleInputChange}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Conditional Inputs */}
                            {(activeTab === 'kidem' || activeTab === 'ihbar') && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            İşe Giriş Tarihi
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            İşten Çıkış Tarihi
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2"
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === 'izin' && (
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kullanılmayan İzin Gün Sayısı
                                    </label>
                                    <input
                                        type="number"
                                        name="unusedDays"
                                        value={formData.unusedDays}
                                        onChange={handleInputChange}
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2"
                                        placeholder="Örn: 14"
                                    />
                                </div>
                            )}

                            {activeTab === 'mesai' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Toplam Fazla Mesai Saati
                                        </label>
                                        <input
                                            type="number"
                                            name="overtimeHours"
                                            value={formData.overtimeHours}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2"
                                            placeholder="Örn: 10"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mesai Oranı
                                        </label>
                                        <select
                                            name="overtimeRate"
                                            value={formData.overtimeRate}
                                            onChange={handleInputChange}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2"
                                        >
                                            <option value="1.5">%50 (Normal Fazla Mesai)</option>
                                            <option value="2.0">%100 (Bayram/Tatil Mesaisi)</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={calculate}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <FaCalculator className="mr-2" />
                                Hesapla
                            </button>
                        </div>

                        {results && (
                            <div className="mt-8 animate-fade-in-up">
                                {results.extra && (
                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <FaInfoCircle className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-blue-700">
                                                    {results.extra}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <ResultCard 
                                    title={`${results.type} Sonucu`}
                                    amount={results}
                                    details={results.details}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Detayli Rehber CTA — Fazla Mesai makalesine ic link */}
                <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">Fazla Mesai Alacağınız Var mı? Detaylı Rehberimizi İnceleyin</h3>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Fazla mesai ücretinin nasıl hesaplandığı, ispat yükü, %30 takdiri indirim doktrini, zamanaşımı ve dava süreci hakkında 2026 güncel kapsamlı rehberimiz. İhtirazi kayıt, tanık beyanı stratejisi ve bordro tuzakları gibi pratik konular dahil.
                            </p>
                        </div>
                        <Link
                            to="/makale/fazla-mesai-alacagi-hesaplama-ispat-dava-sureci-2026"
                            className="inline-flex items-center justify-center bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
                        >
                            Rehberi Oku →
                        </Link>
                    </div>
                </div>

                {/* === İÇERİK DERİNLİĞİ === */}

                {/* 1) Bu hesaplamalar nedir? */}
                <section className="mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">İşçilik Alacakları Hesaplaması Nedir?</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        İşçilik alacakları, iş sözleşmesinin sona ermesi veya çalışma süresince hak edilip ödenmemiş ücretler için işçinin işverenden talep edebileceği tazminat ve ücret kalemlerinin tümünü ifade eder.
                        Türk iş hukukunda dört ana başlık öne çıkar: <strong>kıdem tazminatı</strong>, <strong>ihbar tazminatı</strong>, <strong>yıllık izin ücreti</strong> ve <strong>fazla mesai alacağı</strong>.
                        Bu sayfadaki hesaplama aracı dördünü tek bir raporda birleştirerek, brüt ve net tutarları 2026 mevzuatına göre verir.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Hesaplama sonuçları, sürecin başında size somut bir aralık sunmak için tasarlanmıştır.
                        Mahkeme aşamasında nihai rakam atanan bilirkişinin raporuyla belirlenir; ancak Yargıtay yerleşik içtihatları ve İş Kanunu hükümleri gözetildiğinde bu hesaplama gerçekçi bir başlangıç noktası verir.
                    </p>
                </section>

                {/* 2) Kıdem Tazminatı Nasıl Hesaplanır? */}
                <section className="mt-8 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Kıdem Tazminatı Nasıl Hesaplanır? (2026)</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Kıdem tazminatı, bir işyerinde en az bir yıl süreyle çalışmış işçinin, iş sözleşmesinin kanunda sayılan hallerden biriyle (işveren tarafından haksız fesih, işçinin haklı nedenle feshi, askerlik, evlilik, emeklilik vb.) sona ermesi durumunda hak ettiği bir tutardır.
                        Hesaplama her tam hizmet yılı için 30 günlük brüt ücret esasına dayanır.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Adım adım hesaplama</h3>
                    <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                        <li><strong>Hizmet süresini belirleyin:</strong> İşe başlangıç ve sona erme tarihleri arasındaki yıl ve gün sayısı. En az bir tam yıl şarttır.</li>
                        <li><strong>Brüt günlük ücreti bulun:</strong> Son ay brüt ücretini 30'a bölün. İş Kanunu m.32 uyarınca süreklilik arz eden yol, yemek, prim, ikramiye gibi yardımları da ekleyin.</li>
                        <li><strong>Yıl başına 30 günlük ücret:</strong> Her tam hizmet yılı için 30 günlük brüt ücret tutarı kıdem tazminatı esasıdır. Yıldan artan süreler için orantılı hesap yapılır.</li>
                        <li><strong>2026 kıdem tavanını uygulayın:</strong> Her yıl için ödenecek kıdem tazminatı, 2026 ilk 6 ay tavanı olan <strong>64.948,77 TL</strong>'yi aşamaz.</li>
                        <li><strong>Damga vergisini düşün:</strong> Brüt tutar üzerinden %0,759 damga vergisi kesilir; gelir vergisi ve SGK kesintisi yapılmaz.</li>
                    </ol>
                </section>

                {/* 3) İhbar / Yıllık İzin / Fazla Mesai */}
                <section className="mt-8 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">İhbar, Yıllık İzin ve Fazla Mesai Hesabı</h2>

                    <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">İhbar Tazminatı (İş K. m.17)</h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                        İş sözleşmesinin haksız feshinde bildirim sürelerine uyulmaması karşılığında ödenen tazminattır. Süreler kıdeme göre değişir:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
                        <li>6 aydan az çalışmada: <strong>2 hafta</strong></li>
                        <li>6 ay – 1,5 yıl arası: <strong>4 hafta</strong></li>
                        <li>1,5 – 3 yıl arası: <strong>6 hafta</strong></li>
                        <li>3 yıldan fazla çalışmada: <strong>8 hafta</strong></li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        İhbar tazminatı brüt ücret üzerinden hesaplanır; damga vergisi ve gelir vergisi kesintilerine tabidir.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Yıllık İzin Ücreti (İş K. m.59)</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        İş sözleşmesinin sona ermesi durumunda kullanılmamış yıllık izinlerin ücret karşılığı işçiye ödenir.
                        Yıllık izin süreleri kıdeme göre 14, 20 ve 26 gündür. Hesaplama: <em>Brüt günlük ücret × Kullanılmayan izin günü sayısı</em>.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Fazla Mesai Alacağı (İş K. m.41)</h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                        Haftalık 45 saati aşan çalışma fazla mesaidir; her saat normal saatlik ücretin %50 zamlısı ile ödenir.
                        Hafta tatili (Pazar) ve genel tatil günlerindeki çalışmalar ayrı kalemlerdir (sırasıyla %50 ve %100 zam).
                    </p>
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-4">
                        <p className="text-sm text-amber-900">
                            <strong>Önemli:</strong> Fazla mesai çoğu zaman tanık beyanıyla ispat edilir; Yargıtay 9. HD yerleşik içtihatlarına göre bu durumda hâkim, takdiri olarak <strong>%20-30 arası indirim</strong> uygulayabilir.
                            Bordroya "fazla mesai alacağım saklıdır, ihtirazi kayıt" notu düşmek bu doktrini etkileyebilir.
                        </p>
                    </div>
                </section>

                {/* 4) Mevzuat dayanağı */}
                <section className="mt-8 bg-blue-50 rounded-xl p-8 border border-blue-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Mevzuat Dayanağı</h2>
                    <ul className="space-y-2 text-gray-700">
                        <li>• <strong>4857 sayılı İş Kanunu</strong> — yürürlükteki ana iş kanunu (m.17 ihbar, m.32 ücret, m.41 fazla mesai, m.46 hafta tatili, m.47 genel tatil, m.59 yıllık izin).</li>
                        <li>• <strong>1475 sayılı (Mülga) İş Kanunu m.14</strong> — kıdem tazminatına ilişkin tek yürürlükteki madde.</li>
                        <li>• <strong>İş Kanunu Geçici Madde 6</strong> — kıdem tazminatı tavanı düzenlemesi.</li>
                        <li>• <strong>193 sayılı Gelir Vergisi Kanunu m.25/7</strong> — kıdem tazminatından gelir vergisi kesilmez.</li>
                        <li>• <strong>488 sayılı Damga Vergisi Kanunu</strong> — %0,759 damga vergisi.</li>
                        <li>• <strong>6098 sayılı TBK m.146</strong> — işçi alacaklarında 5 yıllık zamanaşımı.</li>
                        <li>• <strong>7036 sayılı İş Mahkemeleri Kanunu</strong> — zorunlu arabuluculuk ve yetkili mahkeme.</li>
                    </ul>
                </section>

                {/* 5) Yargıtay kararları */}
                <section className="mt-8 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Yargıtay Yerleşik İçtihatları</h2>

                    <div className="space-y-5">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold text-gray-900">Yargıtay 9. HD — Süreklilik arz eden yardımlar</h3>
                            <p className="text-gray-700 text-sm mt-1">
                                Süreklilik arz eden yol, yemek, prim, ikramiye gibi yardımlar kıdem tazminatı hesabında esas brüt ücrete dahil edilir.
                                Bir defaya mahsus, gönüllülük esasına dayalı ödemeler dahil edilmez.
                            </p>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold text-gray-900">Yargıtay 22. HD — Gerçek ücretin tespiti</h3>
                            <p className="text-gray-700 text-sm mt-1">
                                İşveren tarafından gerçek ücreti gizleyen ödeme yöntemleri (elden ödeme, bordroda düşük gösterme) tespit edildiğinde
                                tazminat gerçek ücret üzerinden hesaplanır. Banka hesap ekstresi, tanık beyanı ve emsal ücretler delil olarak değerlendirilir.
                            </p>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold text-gray-900">Yargıtay 9. HD — Fazla mesai takdiri indirim doktrini</h3>
                            <p className="text-gray-700 text-sm mt-1">
                                Fazla mesainin tanık beyanı ile ispat edildiği durumlarda hâkim, çalışmanın tüm süre boyunca kesintisiz yapılmamış olabileceği varsayımıyla
                                hesaplanan tutardan %20-30 arası takdiri indirim uygulayabilir. Yazılı delil (mesai çizelgesi, kart okutma kaydı) varsa indirim oranı düşürülür.
                            </p>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold text-gray-900">Yargıtay HGK — İhtirazi kayıt</h3>
                            <p className="text-gray-700 text-sm mt-1">
                                İşçinin bordroyu ihtirazi kayıt koymadan imzalaması, gerçek alacağından feragat ettiği anlamına gelmez.
                                Ancak fazla mesai gibi hesaplama kalemlerinde ihtirazi kayıt konulması, sonraki dava sürecinde ispat yükünü hafifletir.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 6) SSS - Görünür blok (FAQPage schema ile uyumlu) */}
                <section className="mt-8 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
                    <div className="space-y-5">
                        {[
                            { q: '2026 kıdem tazminatı tavanı kaç TL?', a: '2026 yılı ilk 6 ay için kıdem tazminatı tavanı 64.948,77 TL\'dir. Bu tutar her 6 ayda bir Maliye Bakanlığı bütçe genelgesi ile güncellenir.' },
                            { q: 'Kıdem tazminatından hangi vergiler kesilir?', a: 'Yalnızca %0,759 damga vergisi. Gelir Vergisi Kanunu m.25/7 uyarınca kıdem tazminatından gelir vergisi ve SGK primi kesilmez.' },
                            { q: 'İstifa eden işçi kıdem tazminatı alabilir mi?', a: 'Kural olarak hayır; ancak askerlik, kadın işçi evliliği (1 yıl içinde), emeklilik, sağlık nedenleri (m.24/I) ve işverenin haklı nedensiz ücret ödememesi gibi haklı nedenle fesih hallerinde kıdem tazminatı hak edilir.' },
                            { q: 'Fazla mesai WhatsApp ile ispatlanabilir mi?', a: 'Evet. WhatsApp mesajları, e-postalar, mesai çizelgeleri HMK m.199 uyarınca yazılı belge niteliğindedir. Tanık beyanı en yaygın yoldur, ancak Yargıtay yargıcın takdiriyle %20-30 indirim uygulayabilir.' },
                            { q: 'Yıllık izin parası ne zaman zamanaşımına uğrar?', a: 'İş sözleşmesinin feshinden itibaren 5 yıl. Sözleşme devam ederken zamanaşımı işlemez; yalnızca fesih sonrası süre başlar.' },
                            { q: 'Kıdem brüt mü net mi hesaplanır?', a: 'Her zaman brüt. Brütten yalnızca damga vergisi (%0,759) kesilerek net ödenecek tutar bulunur.' },
                            { q: 'Geriye dönük 5 yıllık fazla mesai talep edilebilir mi?', a: 'Evet. Dava tarihinden geriye doğru 5 yıllık süre içindeki tüm fazla mesailer talep edilebilir; daha eski dönem zamanaşımıyla reddedilir.' },
                            { q: 'Asgari ücretle çalışan kıdem tazminatı nasıl hesaplanır?', a: 'Son brüt asgari ücret üzerinden hesaplanır. Asgari ücretle çalışan işçi kıdem tavanını aşmadığı için tavan kısıtlaması uygulanmaz.' },
                            { q: 'Hafta tatili çalışmasının ücreti nedir?', a: 'İş K. m.46 uyarınca hafta tatilinde çalıştırılan işçiye, çalıştığı her saat için %50 zamlı ücret ödenir.' },
                            { q: 'İşçilik alacakları davası nerede açılır?', a: '7036 sayılı Kanun uyarınca İş Mahkemeleri\'nde. Önce zorunlu arabuluculuk başvurusu yapılır; anlaşma olmazsa son tutanak ile dava açılır.' },
                            { q: 'Bordro tuzağı nedir?', a: 'İşverenin ödediği fazla mesaiyi bordroda gösterip "aldım" yazdırmasıdır. İhtirazi kayıt notu ya da banka ekstresi delili ile bu durumun aşılması gerekir.' },
                            { q: 'İhbar tazminatından gelir vergisi kesilir mi?', a: 'Evet. Kıdem tazminatından farklı olarak ihbar tazminatından hem damga vergisi hem de gelir vergisi kesilir.' }
                        ].map((f, i) => (
                            <div key={i} className="border-b border-gray-100 pb-4 last:border-b-0">
                                <h3 className="font-semibold text-gray-900 mb-2">{f.q}</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 7) İlgili Makaleler */}
                <section className="mt-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-blue-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">İlgili Makaleler</h2>
                    <p className="text-gray-700 mb-6">İş hukukundaki süreçleri daha derinlemesine incelemek isterseniz aşağıdaki rehberleri öneriyoruz.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link to="/makale/fazla-mesai-alacagi-hesaplama-ispat-dava-sureci-2026"
                              className="block bg-white rounded-lg p-5 border border-gray-200 hover:border-blue-400 transition-colors">
                            <h3 className="font-semibold text-gray-900 mb-1">Fazla Mesai Alacağı: Hesaplama, İspat ve Dava Süreci 2026</h3>
                            <p className="text-sm text-gray-600">İhtirazi kayıt, %30 takdiri indirim doktrini, tanık beyanı stratejisi, bordro tuzakları.</p>
                        </Link>
                        <Link to="/makale/2026-ilave-tediye-hesaplama-ve-hukuki-nitelik-rehberi"
                              className="block bg-white rounded-lg p-5 border border-gray-200 hover:border-blue-400 transition-colors">
                            <h3 className="font-semibold text-gray-900 mb-1">2026 İlave Tediye Hesaplama ve Hukuki Nitelik Rehberi</h3>
                            <p className="text-sm text-gray-600">6772 sayılı kanun kapsamı, ödeme tarihleri, dava süreci, faiz başlangıcı.</p>
                        </Link>
                        <Link to="/makale/ilave-tediye-alacak-tahsili-ve-dava-sureci-2026"
                              className="block bg-white rounded-lg p-5 border border-gray-200 hover:border-blue-400 transition-colors">
                            <h3 className="font-semibold text-gray-900 mb-1">İlave Tediye Alacak Tahsili ve Dava Süreci 2026</h3>
                            <p className="text-sm text-gray-600">Geriye dönük talep, arabuluculuk başvurusu, faiz türü ve oranları.</p>
                        </Link>
                        <Link to="/hesaplama-araclari/tazminat-hesaplama"
                              className="block bg-white rounded-lg p-5 border border-gray-200 hover:border-blue-400 transition-colors">
                            <h3 className="font-semibold text-gray-900 mb-1">İş Kazası Tazminat Hesaplayıcısı</h3>
                            <p className="text-sm text-gray-600">Maluliyet, kusur ve TRH-2010 esaslı aktüerya analizi ile maddi tazminat.</p>
                        </Link>
                    </div>
                </section>

                {/* 8) Avukatla görüş CTA */}
                <section className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
                    <h2 className="text-2xl font-bold mb-3">Davanız İçin Kişiye Özel Hesap ve Strateji</h2>
                    <p className="text-blue-100 mb-6 leading-relaxed">
                        Bu hesaplama size yön gösterir; ancak gerçek alacağınız belge denetimi, Yargıtay içtihatları ve dava stratejisiyle şekillenir.
                        <strong className="text-white"> Av. Murat Can Koptay </strong> Ankara'da iş hukuku alanında danışmanlık ve dava takibi yapmaktadır.
                        İlk değerlendirme ücretsizdir.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a href="tel:+905307111864" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                            Hemen Ara: 0530 711 18 64
                        </a>
                        <Link to="/iletisim" className="bg-blue-800 text-white border border-white/40 px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
                            İletişim Formu
                        </Link>
                    </div>
                </section>

                {/* 9) Yasal uyarı */}
                <div className="mt-8 bg-gray-100 rounded-xl p-6 border border-gray-200">
                    <h2 className="text-base font-semibold text-gray-700 mb-2">Yasal Uyarı</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Bu hesaplamalar bilgilendirme amaçlıdır. Mahkemeye sunulacak nihai rakam atanan bilirkişinin raporuyla belirlenir.
                        Vergi kesintilerinde kümülatif vergi matrahınıza göre net tutarlar değişiklik gösterebilir.
                        Kıdem tavanı, asgari ücret ve faiz oranları dönemsel olarak güncellenmektedir; en güncel mevzuat takip edilmelidir.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IscilikAlacaklariPage;
