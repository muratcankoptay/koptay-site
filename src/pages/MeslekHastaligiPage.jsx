import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Chart } from 'chart.js/auto';

const MeslekHastaligiPage = () => {
    // State for inputs
    const [gender, setGender] = useState('M');
    const [dob, setDob] = useState('');
    const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
    const [wage, setWage] = useState(17002);
    const [disability, setDisability] = useState(10);
    const [workerFault, setWorkerFault] = useState(0);
    const [psd, setPsd] = useState(0);

    // State for results
    const [results, setResults] = useState(null);

    // Refs
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // TRH2010 Data (User's version)
    const TRH2010 = {
        18: [58.8, 63.6], 19: [57.9, 62.6], 20: [56.9, 61.6], 21: [56.0, 60.7], 22: [55.0, 59.7],
        23: [54.1, 58.7], 24: [53.1, 57.7], 25: [52.2, 56.8], 26: [51.2, 55.8], 27: [50.3, 54.8],
        28: [49.3, 53.9], 29: [48.4, 52.9], 30: [47.5, 51.9], 31: [46.5, 51.0], 32: [45.6, 50.0],
        33: [44.7, 49.1], 34: [43.7, 48.1], 35: [42.8, 47.2], 36: [41.9, 46.2], 37: [40.9, 45.3],
        38: [40.0, 44.3], 39: [39.1, 43.4], 40: [38.2, 42.4], 41: [37.3, 41.5], 42: [36.4, 40.5],
        43: [35.5, 39.6], 44: [34.6, 38.7], 45: [33.7, 37.7], 46: [32.8, 36.8], 47: [31.9, 35.9],
        48: [31.0, 35.0], 49: [30.1, 34.0], 50: [29.3, 33.1], 51: [28.4, 32.2], 52: [27.6, 31.3],
        53: [26.7, 30.4], 54: [25.9, 29.5], 55: [25.1, 28.6], 56: [24.3, 27.7], 57: [23.5, 26.9],
        58: [22.7, 26.0], 59: [21.9, 25.1], 60: [21.1, 24.3], 61: [20.4, 23.4], 62: [19.6, 22.6],
        63: [18.9, 21.8], 64: [18.2, 21.0], 65: [17.5, 20.2], 66: [16.8, 19.4], 67: [16.1, 18.6]
    };

    // Initialize DOB default
    useEffect(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 35);
        setDob(d.toISOString().split('T')[0]);
    }, []);

    const calculateCompensation = () => {
        const dobDate = new Date(dob);
        const eventDateObj = new Date(eventDate);
        const wageVal = parseFloat(wage) || 0;
        const disabilityRate = parseFloat(disability) / 100;
        const workerFaultVal = parseFloat(workerFault) / 100;
        const psdVal = parseFloat(psd) || 0;

        if (dobDate >= eventDateObj) {
            alert("Hata: Doğum tarihi olay tarihinden büyük olamaz.");
            return;
        }

        const ageAtEvent = eventDateObj.getFullYear() - dobDate.getFullYear();
        
        let remainingLife = 0;
        const genderIndex = gender === 'M' ? 0 : 1;
        
        if (TRH2010[ageAtEvent]) {
            remainingLife = TRH2010[ageAtEvent][genderIndex];
        } else {
            const maxAge = gender === 'M' ? 76 : 81;
            remainingLife = Math.max(0, maxAge - ageAtEvent);
        }

        const retirementAge = 60;
        let activeYears = 0;
        let passiveYears = 0;

        if (ageAtEvent < retirementAge) {
            const yearsToRetire = retirementAge - ageAtEvent;
            if (remainingLife > yearsToRetire) {
                activeYears = yearsToRetire;
                passiveYears = remainingLife - yearsToRetire;
            } else {
                activeYears = remainingLife;
                passiveYears = 0;
            }
        } else {
            activeYears = 0;
            passiveYears = remainingLife;
        }

        const yearlyWage = wageVal * 12;
        const grossActiveLoss = yearlyWage * activeYears * disabilityRate;
        const grossPassiveLoss = yearlyWage * passiveYears * disabilityRate;
        
        const totalLoss = grossActiveLoss + grossPassiveLoss;
        const faultDeduction = totalLoss * workerFaultVal;
        
        let finalNet = totalLoss - faultDeduction - psdVal;
        if (finalNet < 0) finalNet = 0;

        setResults({
            ageAtEvent,
            remainingLife,
            activeYears,
            passiveYears,
            grossActiveLoss,
            grossPassiveLoss,
            totalLoss,
            workerFaultRate: workerFaultVal,
            faultDeduction,
            psd: psdVal,
            finalNet
        });
    };

    // Chart Effect
    useEffect(() => {
        if (results && chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Net Tazminat', 'Kusur İndirimi', 'SGK Mahsup'],
                    datasets: [{
                        data: [results.finalNet, results.faultDeduction, results.psd],
                        backgroundColor: [
                            '#0f766e', // Teal (Net)
                            '#ef4444', // Red (Fault)
                            '#3b82f6'  // Blue (SGK)
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { font: { size: 10 } }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(context.raw);
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    }, [results]);

    const fmt = (num) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(num);

    // JSON-LD Schemas
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://koptay.av.tr/hesaplama-araclari/meslek-hastaligi"
        },
        "headline": "Meslek Hastalığı Tazminatı: Hukuki Şartları, Süreç ve Hesaplama Yöntemi (2025 Uzman Rehberi)",
        "description": "Meslek hastalığı tazminatı nedir? İşverenin kusur sorumluluğu, yükümlülük süresi, ispat yükü ve TRH-2010 yaşam tablosuna göre aktüeryal hesaplama yöntemlerini içeren kapsamlı hukuki bilirkişi rehberi.",
        "image": "https://koptay.av.tr/uploads/meslek-hastaligi-tazminati-hesaplama.jpg",
        "author": {
            "@type": "Organization",
            "name": "Koptay Hukuk ve Danışmanlık",
            "url": "https://koptay.av.tr"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Koptay Hukuk",
            "logo": {
                "@type": "ImageObject",
                "url": "https://koptay.av.tr/logo.png"
            }
        },
        "datePublished": "2024-12-02",
        "dateModified": "2024-12-02",
        "about": {
            "@type": "Thing",
            "name": "İş Hukuku ve Meslek Hastalıkları Tazminatı"
        }
    };

    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Koptay Hukuk Meslek Hastalığı Tazminat Hesaplama Aracı",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "description": "TRH-2010 yaşam tablosu ve güncel Yargıtay kriterlerine göre meslek hastalığı maddi tazminatını hesaplayan çevrimiçi hukuki araç.",
        "url": "https://koptay.av.tr/hesaplama-araclari/meslek-hastaligi",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "TRY"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "İşten ayrıldıktan yıllar sonra meslek hastalığı tazminatı alınır mı?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Evet. Her hastalığın bir 'yükümlülük süresi' vardır. Bu süre dolmuş olsa bile, hastalık ile iş arasındaki illiyet bağı tıbben ispatlanabilirse, Sosyal Sigorta Yüksek Sağlık Kurulu onayı ile dava açılabilir."
            }
        }, {
            "@type": "Question",
            "name": "Meslek hastalığı tazminatında hangi yaşam tablosu kullanılır?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yargıtay'ın güncel kararları uyarınca, eski PMF-1931 tablosu yerine, beklenen yaşam süresini daha güncel verilerle belirleyen TRH-2010 (Türkiye Hayat Tablosu) kullanılması zorunludur."
            }
        }, {
            "@type": "Question",
            "name": "Meslek hastalığı zamanaşımı süresi ne zaman başlar?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Zamanaşımı süresi (10 yıl), işten ayrılma tarihinde değil; hastalığın kesin tıbbi teşhisinin konulduğu ve maluliyet oranının kesinleştiği tarihten itibaren başlar."
            }
        }]
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 font-sans text-slate-800">
            <Helmet>
                <title>Meslek Hastalığı Tazminatı Hesaplama ve Şartları (2025) | Koptay Hukuk</title>
                <meta name="description" content="Meslek hastalığı tazminatı nedir? İşverenin kusur sorumluluğu, yükümlülük süresi ve TRH-2010 yaşam tablosuna göre aktüeryal hesaplama aracı." />
                <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
            </Helmet>
            
            <style>{`
                .chart-container {
                    position: relative;
                    width: 100%;
                    height: 300px;
                }
                @media print {
                    .no-print { display: none !important; }
                    .print-show { display: block !important; }
                    body { background: white; color: black; }
                    .shadow-xl { box-shadow: none; border: 1px solid #ccc; }
                    /* Hide site nav and footer if possible, but they are outside this component */
                    nav, footer { display: none !important; } 
                    /* Reset padding for print */
                    .pt-32 { padding-top: 0 !important; }
                }
            `}</style>

            {/* User's Header adapted as Toolbar */}
            <div className="container mx-auto px-4 py-4 flex justify-between items-center bg-white border-b border-slate-200 rounded-xl shadow-sm mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-teal-700 text-white p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 3.659c0 3.074-1.8 5.523-3.99 6.197-2.296-.705-4.002-3.125-4.002-6.197 0-3.074 1.8-5.523 4.002-6.197C12.99 5.125 14.8 7.574 14.8 10.659M9 17h6m-6 3h6m-6-6h6" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Meslek Hastalığı Tazminat Hesaplayıcı</h1>
                        <p className="text-xs text-slate-500">TRH-2010 Tablosu & Yargıtay İçtihatlarına Uygun Projeksiyon</p>
                    </div>
                </div>
                <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 text-sm text-teal-700 font-medium hover:bg-teal-50 px-3 py-2 rounded transition no-print">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Yazdır / PDF
                </button>
            </div>

            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* INPUT PANEL */}
                    <div className="lg:col-span-4 space-y-6 no-print">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">1. Kişisel Veriler & Olay</h2>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Cinsiyet</label>
                                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                                        <option value="M">Erkek</option>
                                        <option value="F">Kadın</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Doğum Tarihi</label>
                                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Meslek Hastalığı Tespit Tarihi</label>
                                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Aylık Net Kazanç (TL)</label>
                                <div className="relative">
                                    <input type="number" value={wage} onChange={(e) => setWage(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Örn: 25000" />
                                    <span className="absolute right-3 top-2 text-slate-400 text-sm">₺</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">*Çıplak net ücret giriniz.</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">2. Maluliyet ve Kusur</h2>
                            
                            <div className="mb-4">
                                <div className="flex justify-between">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Maluliyet Oranı (%)</label>
                                    <span className="text-xs font-bold text-teal-700">%{disability}</span>
                                </div>
                                <input type="range" min="0" max="100" value={disability} onChange={(e) => setDisability(e.target.value)} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                                <p className="text-[10px] text-slate-400 mt-1">SGK Sağlık Kurulu tarafından belirlenen oran.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">İşçi Kusuru (%)</label>
                                    <input type="number" value={workerFault} max="100" onChange={(e) => {
                                        let val = parseInt(e.target.value) || 0;
                                        if(val > 100) val = 100;
                                        setWorkerFault(val);
                                    }} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">İşveren Kusuru (%)</label>
                                    <input type="number" value={100 - workerFault} readOnly className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                                </div>
                            </div>
                            <p className="text-[10px] text-red-400 mb-4">*İşveren kusuru otomatik hesaplanır (100 - İşçi).</p>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">SGK Tarafından Bağlanan PSD (TL)</label>
                                <input type="number" value={psd} onChange={(e) => setPsd(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                                <p className="text-[10px] text-slate-400 mt-1">Rücu edilebilir Peşin Sermaye Değeri (İndirim kalemi).</p>
                            </div>
                        </div>

                        <button onClick={calculateCompensation} className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 3.659c0 3.074-1.8 5.523-3.99 6.197-2.296-.705-4.002-3.125-4.002-6.197 0-3.074 1.8-5.523 4.002-6.197C12.99 5.125 14.8 7.574 14.8 10.659M9 17h6m-6 3h6m-6-6h6" />
                            </svg>
                            HESAPLA
                        </button>
                    </div>

                    {/* REPORT PANEL */}
                    <div className="lg:col-span-8 space-y-6" id="reportArea">
                        
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
                                <p className="text-xs text-slate-500 font-semibold uppercase">Olay Tarihi Yaşı</p>
                                <p className="text-xl font-bold text-slate-800">{results ? results.ageAtEvent : '-'}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-indigo-500">
                                <p className="text-xs text-slate-500 font-semibold uppercase">TRH-2010 Bakiye</p>
                                <p className="text-xl font-bold text-slate-800">{results ? results.remainingLife.toFixed(2) + ' Yıl' : '-'}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-amber-500">
                                <p className="text-xs text-slate-500 font-semibold uppercase">Aktif Dönem</p>
                                <p className="text-xl font-bold text-slate-800">{results ? results.activeYears.toFixed(2) + ' Yıl' : '-'}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-teal-500">
                                <p className="text-xs text-slate-500 font-semibold uppercase">Pasif Dönem</p>
                                <p className="text-xl font-bold text-slate-800">{results ? results.passiveYears.toFixed(2) + ' Yıl' : '-'}</p>
                            </div>
                        </div>

                        {/* Main Result Card */}
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700">Tazminat Hesap Özeti</h3>
                                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">Bilirkişi Formatı</span>
                            </div>
                            
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                                            <tr>
                                                <th className="px-4 py-3">Hesap Kalemi</th>
                                                <th className="px-4 py-3 text-right">Detay / Oran</th>
                                                <th className="px-4 py-3 text-right">Tutar</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-slate-700">Brüt Zarar (Aktif Dönem)</td>
                                                <td className="px-4 py-3 text-right text-slate-500">60 Yaşına Kadar</td>
                                                <td className="px-4 py-3 text-right font-mono">{results ? fmt(results.grossActiveLoss) : '0,00 ₺'}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-slate-700">Brüt Zarar (Pasif Dönem)</td>
                                                <td className="px-4 py-3 text-right text-slate-500">Ölüm Tarihine Kadar</td>
                                                <td className="px-4 py-3 text-right font-mono">{results ? fmt(results.grossPassiveLoss) : '0,00 ₺'}</td>
                                            </tr>
                                            <tr className="bg-slate-50">
                                                <td className="px-4 py-3 font-bold text-slate-800">TOPLAM ZARAR</td>
                                                <td className="px-4 py-3 text-right"></td>
                                                <td className="px-4 py-3 text-right font-mono font-bold">{results ? fmt(results.totalLoss) : '0,00 ₺'}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-red-600">(-) İşçi Kusuru İndirimi</td>
                                                <td className="px-4 py-3 text-right text-red-500">%{results ? (results.workerFaultRate * 100).toFixed(0) : '0'}</td>
                                                <td className="px-4 py-3 text-right font-mono text-red-600">{results ? '-' + fmt(results.faultDeduction) : '0,00 ₺'}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-blue-600">(-) SGK Peşin Sermaye Değeri (PSD)</td>
                                                <td className="px-4 py-3 text-right text-blue-500">Rücu Edilebilir</td>
                                                <td className="px-4 py-3 text-right font-mono text-blue-600">{results ? '-' + fmt(results.psd) : '0,00 ₺'}</td>
                                            </tr>
                                            <tr className="bg-teal-50 border-t-2 border-teal-100">
                                                <td className="px-4 py-4 font-bold text-teal-900 text-lg">NET ÖDENECEK TAZMİNAT</td>
                                                <td className="px-4 py-4"></td>
                                                <td className="px-4 py-4 text-right font-bold text-teal-700 text-xl font-mono">{results ? fmt(results.finalNet) : '0,00 ₺'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Explanation / Chart Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
                            <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                                <h4 className="font-bold text-slate-700 mb-4 text-sm">Oransal Dağılım</h4>
                                <div className="chart-container">
                                    <canvas ref={chartRef}></canvas>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                                <h4 className="font-bold text-slate-700 mb-2 text-sm">Hukuki Notlar</h4>
                                <ul className="text-xs text-slate-600 space-y-3 list-disc pl-4">
                                    <li><strong>TRH-2010:</strong> Hesaplamada Yargıtay'ın zorunlu kıldığı güncel yaşam tablosu kullanılmıştır.</li>
                                    <li><strong>Aktif/Pasif Ayrımı:</strong> 60 yaş "Ekonomik Bütünleşme Yaşı" kabul edilmiştir. Pasif dönemde asgari geçim indirimi (AGİ) hariç tutar üzerinden hesaplama yapılması esastır, burada net ücret üzerinden projeksiyon yapılmıştır.</li>
                                    <li><strong>Kusur Oranı:</strong> Müterafik kusur (TBK m.52) uyarınca işçinin kusuru toplam zarardan düşülmüştür.</li>
                                    <li><strong>Mükerrer Ödeme:</strong> SGK tarafından bağlanan gelirin ilk peşin sermaye değeri, sebepsiz zenginleşmeyi önlemek (TBK m.55) için mahsup edilmiştir.</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Detailed Content & FAQ Section */}
                <div className="mt-16 max-w-5xl mx-auto space-y-12 no-print">
                    
                    {/* Expert Report Content */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
                        <h2 className="text-2xl font-bold text-slate-800 border-b pb-4 mb-6">Meslek Hastalığı Tazminatı: Hukuki Şartları, Süreç ve Hesaplama Yöntemi (2025 Uzman Rehberi)</h2>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-teal-700">1. Meslek Hastalığının Doğası</h3>
                                <p className="text-sm text-slate-600">
                                    Meslek hastalıkları, iş kazalarından farklı olarak anlık bir travma değil, zamana yayılmış bir maruziyetin sonucudur. 
                                    5510 sayılı Kanun’un 14. maddesine göre; sigortalının çalıştığı işin niteliğinden dolayı tekrarlanan bir sebeple 
                                    veya işin yürütüm şartları yüzünden uğradığı geçici veya sürekli hastalık halleridir.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-teal-700">2. Yükümlülük Süresi ve Latent Dönem</h3>
                                <p className="text-sm text-slate-600">
                                    Hastalığın işten ayrıldıktan sonra ortaya çıkması durumunda "Yükümlülük Süresi" devreye girer. 
                                    Genellikle 10 yıl olan bu süre aşılsa bile, tıbbi illiyet bağı kurulabiliyorsa Yüksek Sağlık Kurulu onayı ile 
                                    hastalık "Meslek Hastalığı" sayılabilir.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-teal-700">3. Hesaplama Metodolojisi (TRH-2010)</h3>
                            <p className="text-sm text-slate-600 mb-4">
                                Yargıtay 10. Hukuk Dairesi ve Hukuk Genel Kurulu kararları uyarınca, tazminat hesaplamalarında PMF-1931 tablosu yerine, 
                                Türkiye İstatistik Kurumu verilerine dayanan <strong>TRH-2010 (Türkiye Hayat Tablosu)</strong> kullanılması zorunludur.
                            </p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
                                <li><strong>Aktif Dönem:</strong> 60 yaşına kadar olan çalışma çağıdır. Tam ücret üzerinden hesaplanır.</li>
                                <li><strong>Pasif Dönem:</strong> 60 yaşından ölüme kadar olan dönemdir. Emekli de olsa efor kaybı devam ettiği için asgari ücret üzerinden hesaplanır.</li>
                                <li><strong>Progresif Rant:</strong> Bilinmeyen devreler için %10 artırım ve %10 iskonto yöntemi uygulanır.</li>
                            </ul>
                        </div>

                        <div className="mt-8 bg-slate-50 p-6 rounded-xl border-l-4 border-teal-500">
                            <h3 className="text-lg font-semibold text-slate-800">Kritik Uyarı: SGK PSD Mahsubu</h3>
                            <p className="text-sm text-slate-600 mt-2">
                                Hukukumuzda "Zenginleşme Yasağı" gereği, işçi aynı zarar için iki kere tazminat alamaz. 
                                Bu nedenle, SGK tarafından bağlanan Sürekli İş Göremezlik Gelirinin <strong>İlk Peşin Sermaye Değeri (PSD)</strong>, 
                                işverenin kusuru oranında hesaplanan tazminattan düşülür. Bu veri girilmezse hesaplama hatalı (yüksek) çıkar.
                            </p>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Sıkça Sorulan Sorular
                        </h2>
                        <div className="space-y-4">
                            <details className="group bg-slate-50 rounded-lg">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-700 hover:text-teal-700 transition">
                                    <span>İşten ayrıldıktan yıllar sonra meslek hastalığı tazminatı alınır mı?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-slate-600 text-sm px-4 pb-4">
                                    Evet. Her hastalığın bir 'yükümlülük süresi' vardır. Bu süre dolmuş olsa bile, hastalık ile iş arasındaki illiyet bağı tıbben ispatlanabilirse, Sosyal Sigorta Yüksek Sağlık Kurulu onayı ile dava açılabilir.
                                </div>
                            </details>
                            <details className="group bg-slate-50 rounded-lg">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-700 hover:text-teal-700 transition">
                                    <span>Hangi yaşam tablosu (TRH-2010 mu PMF-1931 mi) kullanılır?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-slate-600 text-sm px-4 pb-4">
                                    Yargıtay'ın yerleşik içtihatlarına göre, tazminat hesaplamalarında güncel ve ülkemiz verilerine dayanan TRH-2010 Yaşam Tablosu kullanılmalıdır.
                                </div>
                            </details>
                            <details className="group bg-slate-50 rounded-lg">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-700 hover:text-teal-700 transition">
                                    <span>Zamanaşımı süresi ne zaman başlar?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-slate-600 text-sm px-4 pb-4">
                                    Zamanaşımı, hastalığın öğrenildiği tarihten değil, maluliyet oranının kesin olarak tespit edildiği (rapor tarihinden) itibaren başlar ve süre 10 yıldır.
                                </div>
                            </details>
                            <details className="group bg-slate-50 rounded-lg">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-700 hover:text-teal-700 transition">
                                    <span>Manevi tazminat neye göre belirlenir?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-slate-600 text-sm px-4 pb-4">
                                    Manevi tazminat; işçinin çektiği acı, maluliyet oranı, kusur durumu ve tarafların ekonomik sosyal durumuna göre hakim tarafından takdir edilir.
                                </div>
                            </details>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default MeslekHastaligiPage;
