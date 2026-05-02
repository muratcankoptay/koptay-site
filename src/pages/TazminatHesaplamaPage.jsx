import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';

// Lazy load Chart.js only when needed
let Chart = null;
const loadChart = async () => {
  if (!Chart) {
    const module = await import('chart.js/auto');
    Chart = module.Chart;
  }
  return Chart;
};

const TazminatHesaplamaPage = () => {
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

    // Optimized calculation - doesn't block main thread for better INP
    const calculateCompensation = useCallback(() => {
        const doCalculation = () => {
            const dobDate = new Date(dob);
            const eventDateObj = new Date(eventDate);
            const wageVal = parseFloat(wage) || 0;
            const disabilityRate = parseFloat(disability) / 100;
            const workerFaultVal = parseFloat(workerFault) / 100;
            const psdVal = parseFloat(psd) || 0;

            if (dobDate >= eventDateObj) {
                alert("Hata: DoÄŸum tarihi olay tarihinden bÃ¼yÃ¼k olamaz.");
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
        
        // Use requestIdleCallback for better INP score
        if ('requestIdleCallback' in window) {
            requestIdleCallback(doCalculation, { timeout: 500 });
        } else {
            setTimeout(doCalculation, 0);
        }
    }, [dob, eventDate, wage, disability, workerFault, psd, gender, TRH2010]);

    // Chart Effect - Load Chart.js dynamically
    useEffect(() => {
        if (results && chartRef.current) {
            const initChart = async () => {
                const ChartJS = await loadChart();
                
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const ctx = chartRef.current.getContext('2d');
                chartInstance.current = new ChartJS(ctx, {
                    type: 'doughnut',
                    data: {
                    labels: ['Net Tazminat', 'Kusur Ä°ndirimi', 'SGK Mahsup'],
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
            };
            
            initChart();
        }
    }, [results]);

    const fmt = (num) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(num);

    // JSON-LD Schemas
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Ä°ÅŸ KazasÄ± Tazminat Hesaplama AracÄ± (2026)",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "TRY"
        },
        "description": "TRH-2010 yaÅŸam tablosu ve YargÄ±tay iÃ§tihatlarÄ±na uygun, iÅŸ kazasÄ± ve meslek hastalÄ±ÄŸÄ± maddi tazminat hesaplama aracÄ±.",
        "featureList": "TRH-2010 YaÅŸam Tablosu, Aktif/Pasif DÃ¶nem HesabÄ±, Kusur Ä°ndirimi, SGK PSD Mahsubu"
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Meslek hastalÄ±ÄŸÄ± ile iÅŸ kazasÄ± arasÄ±ndaki fark nedir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ä°ÅŸ kazasÄ± anlÄ±k bir olay iken, meslek hastalÄ±ÄŸÄ± tekrarlanan sebeplerle veya iÅŸin yÃ¼rÃ¼tÃ¼m ÅŸartlarÄ± yÃ¼zÃ¼nden zamanla ortaya Ã§Ä±kan, sÃ¼reklilik arz eden bir sÃ¼reÃ§tir."
                }
            },
            {
                "@type": "Question",
                "name": "Ä°ÅŸten ayrÄ±ldÄ±ktan yÄ±llar sonra meslek hastalÄ±ÄŸÄ± davasÄ± aÃ§abilir miyim?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Evet. YÃ¼kÃ¼mlÃ¼lÃ¼k sÃ¼resi (genellikle 10 yÄ±l) dolsa bile, tÄ±bbi illiyet baÄŸÄ± kurulabiliyorsa YÃ¼ksek SaÄŸlÄ±k Kurulu onayÄ± ile meslek hastalÄ±ÄŸÄ± sayÄ±labilir ve dava aÃ§Ä±labilir."
                }
            },
            {
                "@type": "Question",
                "name": "Tazminat hesabÄ±nda hangi yaÅŸam tablosu kullanÄ±lÄ±r?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "YargÄ±tay kararlarÄ± uyarÄ±nca PMF-1931 yerine, daha gÃ¼ncel olan TRH-2010 (TÃ¼rkiye Hayat Tablosu) kullanÄ±lmaktadÄ±r."
                }
            },
            {
                "@type": "Question",
                "name": "Emekli olduktan sonraki dÃ¶nem iÃ§in tazminat alabilir miyim?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Evet. YargÄ±tay'a gÃ¶re emeklilik dÃ¶neminde de (Pasif DÃ¶nem) efor kaybÄ± devam ettiÄŸi iÃ§in, genellikle asgari Ã¼cret Ã¼zerinden tazminat hesaplanÄ±r."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 font-sans text-slate-800">
            <SEO
                title="Ä°ÅŸ KazasÄ± Tazminat Hesaplama 2026 | Maluliyet, Kusur, TRH-2010 | Koptay Hukuk"
                description="Ä°ÅŸ kazasÄ± nedeniyle maddi tazminatÄ±nÄ±zÄ± maluliyet oranÄ±, kusur durumu ve TRH-2010 yaÅŸam tablosu kapsamÄ±nda hesaplayÄ±n. SÃ¼rekli iÅŸ gÃ¶remezlik, geÃ§ici iÅŸ gÃ¶remezlik, destekten yoksun kalma. YargÄ±tay 21. ve 10. HD iÃ§tihatlarÄ±na uygun. Ankara iÅŸ kazasÄ± avukatÄ±."
                keywords="iÅŸ kazasÄ± tazminat hesaplama, iÅŸ kazasÄ± maddi tazminat, maluliyet oranÄ± hesaplama, kusur oranÄ±, TRH-2010, sÃ¼rekli iÅŸ gÃ¶remezlik tazminatÄ±, geÃ§ici iÅŸ gÃ¶remezlik, destekten yoksun kalma, iÅŸ kazasÄ± avukatÄ± ankara, ankara iÅŸ hukuku avukatÄ±"
                url="https://koptay.av.tr/hesaplama-araclari/tazminat-hesaplama"
            />
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
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
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Ä°ÅŸ KazasÄ± Tazminat Hesaplama 2026</h1>
                        <p className="text-xs md:text-sm text-slate-500">Maluliyet, Kusur ve TRH-2010 EsaslÄ± AktÃ¼erya â€” YargÄ±tay 21. HD Ä°Ã§tihatlarÄ±na Uygun</p>
                    </div>
                </div>
                <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 text-sm text-teal-700 font-medium hover:bg-teal-50 px-3 py-2 rounded transition no-print">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    YazdÄ±r / PDF
                </button>
            </div>

            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* INPUT PANEL */}
                    <div className="lg:col-span-4 space-y-6 no-print">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">1. KiÅŸisel Veriler & Olay</h2>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Cinsiyet</label>
                                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none">
                                        <option value="M">Erkek</option>
                                        <option value="F">KadÄ±n</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">DoÄŸum Tarihi</label>
                                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Kaza / Tespit Tarihi</label>
                                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">AylÄ±k Net KazanÃ§ (TL)</label>
                                <div className="relative">
                                    <input type="number" value={wage} onChange={(e) => setWage(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Ã–rn: 25000" />
                                    <span className="absolute right-3 top-2 text-slate-400 text-sm">â‚º</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">*Ã‡Ä±plak net Ã¼cret giriniz.</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">2. Maluliyet ve Kusur</h2>
                            
                            <div className="mb-4">
                                <div className="flex justify-between">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Maluliyet OranÄ± (%)</label>
                                    <span className="text-xs font-bold text-teal-700">%{disability}</span>
                                </div>
                                <input type="range" min="0" max="100" value={disability} onChange={(e) => setDisability(e.target.value)} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                                <p className="text-[10px] text-slate-400 mt-1">SGK SaÄŸlÄ±k Kurulu tarafÄ±ndan belirlenen oran.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Ä°ÅŸÃ§i Kusuru (%)</label>
                                    <input type="number" value={workerFault} max="100" onChange={(e) => {
                                        let val = parseInt(e.target.value) || 0;
                                        if(val > 100) val = 100;
                                        setWorkerFault(val);
                                    }} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Ä°ÅŸveren Kusuru (%)</label>
                                    <input type="number" value={100 - workerFault} readOnly className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                                </div>
                            </div>
                            <p className="text-[10px] text-red-400 mb-4">*Ä°ÅŸveren kusuru otomatik hesaplanÄ±r (100 - Ä°ÅŸÃ§i).</p>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">SGK TarafÄ±ndan BaÄŸlanan PSD (TL)</label>
                                <input type="number" value={psd} onChange={(e) => setPsd(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                                <p className="text-[10px] text-slate-400 mt-1">RÃ¼cu edilebilir PeÅŸin Sermaye DeÄŸeri (Ä°ndirim kalemi).</p>
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
                                <p className="text-xs text-slate-500 font-semibold uppercase">Olay Tarihi YaÅŸÄ±</p>
                                <p className="text-xl font-bold text-slate-800">{results ? results.ageAtEvent : '-'}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-indigo-500">
                                <p className="text-xs text-slate-500 font-semibold uppercase">TRH-2010 Bakiye</p>
                                <p className="text-xl font-bold text-slate-800">{results ? results.remainingLife.toFixed(2) + ' YÄ±l' : '-'}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-amber-500">
                                <p className="text-xs text-slate-500 font-semibold uppercase">Aktif DÃ¶nem</p>
                                <p className="text-xl font-bold text-slate-800">{results ? results.activeYears.toFixed(2) + ' YÄ±l' : '-'}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-teal-500">
                                <p className="text-xs text-slate-500 font-semibold uppercase">Pasif DÃ¶nem</p>
                                <p className="text-xl font-bold text-slate-800">{results ? results.passiveYears.toFixed(2) + ' YÄ±l' : '-'}</p>
                            </div>
                        </div>

                        {/* Main Result Card */}
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700">Tazminat Hesap Ã–zeti</h3>
                                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">BilirkiÅŸi FormatÄ±</span>
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
                                                <td className="px-4 py-3 font-medium text-slate-700">BrÃ¼t Zarar (Aktif DÃ¶nem)</td>
                                                <td className="px-4 py-3 text-right text-slate-500">60 YaÅŸÄ±na Kadar</td>
                                                <td className="px-4 py-3 text-right font-mono">{results ? fmt(results.grossActiveLoss) : '0,00 â‚º'}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium text-slate-700">BrÃ¼t Zarar (Pasif DÃ¶nem)</td>
                                                <td className="px-4 py-3 text-right text-slate-500">Ã–lÃ¼m Tarihine Kadar</td>
                                                <td className="px-4 py-3 text-right font-mono">{results ? fmt(results.grossPassiveLoss) : '0,00 â‚º'}</td>
                                            </tr>
                                            <tr className="bg-slate-50">
                                                <td className="px-4 py-3 font-bold text-slate-800">TOPLAM ZARAR</td>
                                                <td className="px-4 py-3 text-right"></td>
                                                <td className="px-4 py-3 text-right font-mono font-bold">{results ? fmt(results.totalLoss) : '0,00 â‚º'}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-red-600">(-) Ä°ÅŸÃ§i Kusuru Ä°ndirimi</td>
                                                <td className="px-4 py-3 text-right text-red-500">%{results ? (results.workerFaultRate * 100).toFixed(0) : '0'}</td>
                                                <td className="px-4 py-3 text-right font-mono text-red-600">{results ? '-' + fmt(results.faultDeduction) : '0,00 â‚º'}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-blue-600">(-) SGK PeÅŸin Sermaye DeÄŸeri (PSD)</td>
                                                <td className="px-4 py-3 text-right text-blue-500">RÃ¼cu Edilebilir</td>
                                                <td className="px-4 py-3 text-right font-mono text-blue-600">{results ? '-' + fmt(results.psd) : '0,00 â‚º'}</td>
                                            </tr>
                                            <tr className="bg-teal-50 border-t-2 border-teal-100">
                                                <td className="px-4 py-4 font-bold text-teal-900 text-lg">NET Ã–DENECEK TAZMÄ°NAT</td>
                                                <td className="px-4 py-4"></td>
                                                <td className="px-4 py-4 text-right font-bold text-teal-700 text-xl font-mono">{results ? fmt(results.finalNet) : '0,00 â‚º'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Explanation / Chart Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
                            <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                                <h4 className="font-bold text-slate-700 mb-4 text-sm">Oransal DaÄŸÄ±lÄ±m</h4>
                                <div className="chart-container">
                                    <canvas ref={chartRef}></canvas>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
                                <h4 className="font-bold text-slate-700 mb-2 text-sm">Hukuki Notlar</h4>
                                <ul className="text-xs text-slate-600 space-y-3 list-disc pl-4">
                                    <li><strong>TRH-2010:</strong> Hesaplamada YargÄ±tay'Ä±n zorunlu kÄ±ldÄ±ÄŸÄ± gÃ¼ncel yaÅŸam tablosu kullanÄ±lmÄ±ÅŸtÄ±r.</li>
                                    <li><strong>Aktif/Pasif AyrÄ±mÄ±:</strong> 60 yaÅŸ "Ekonomik BÃ¼tÃ¼nleÅŸme YaÅŸÄ±" kabul edilmiÅŸtir. Pasif dÃ¶nemde asgari geÃ§im indirimi (AGÄ°) hariÃ§ tutar Ã¼zerinden hesaplama yapÄ±lmasÄ± esastÄ±r, burada net Ã¼cret Ã¼zerinden projeksiyon yapÄ±lmÄ±ÅŸtÄ±r.</li>
                                    <li><strong>Kusur OranÄ±:</strong> MÃ¼terafik kusur (TBK m.52) uyarÄ±nca iÅŸÃ§inin kusuru toplam zarardan dÃ¼ÅŸÃ¼lmÃ¼ÅŸtÃ¼r.</li>
                                    <li><strong>MÃ¼kerrer Ã–deme:</strong> SGK tarafÄ±ndan baÄŸlanan gelirin ilk peÅŸin sermaye deÄŸeri, sebepsiz zenginleÅŸmeyi Ã¶nlemek (TBK m.55) iÃ§in mahsup edilmiÅŸtir.</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Detailed Content & FAQ Section */}
                <div className="mt-16 max-w-5xl mx-auto space-y-12 no-print">

                    {/* Ã‡apraz referans: Meslek hastalÄ±ÄŸÄ± iÃ§in ayrÄ± sayfa */}
                    <section className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-lg">
                        <p className="text-sm text-amber-900">
                            <strong>Ä°ÅŸ kazasÄ± mÄ±, meslek hastalÄ±ÄŸÄ± mÄ±?</strong> Bu sayfa anlÄ±k travma niteliÄŸindeki <strong>iÅŸ kazasÄ±</strong> tazminatÄ± iÃ§indir.
                            HastalÄ±ÄŸÄ±nÄ±z iÅŸ yerindeki uzun sÃ¼reli maruziyetin sonucu (silikosis, asbestos kaynaklÄ±, mobbing kaynaklÄ± vb.) ise
                            yÃ¼kÃ¼mlÃ¼lÃ¼k sÃ¼resi aÃ§Ä±sÄ±ndan farklÄ± kurallar geÃ§erlidir;{' '}
                            <Link to="/hesaplama-araclari/meslek-hastaligi" className="font-semibold text-amber-900 underline hover:text-amber-700">
                                Meslek HastalÄ±ÄŸÄ± Tazminat HesaplayÄ±cÄ±sÄ±
                            </Link>{' '}
                            sayfasÄ±nÄ± kullanÄ±n.
                        </p>
                    </section>

                    {/* Expert Report Content */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 prose prose-slate max-w-none">
                        <h2 className="text-2xl font-bold text-slate-800 border-b pb-4 mb-6">Ä°ÅŸ KazasÄ± TazminatÄ±nÄ±n Hukuki ve AktÃ¼eryal Temelleri</h2>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-teal-700">1. Meslek HastalÄ±ÄŸÄ±nÄ±n DoÄŸasÄ±</h3>
                                <p className="text-sm text-slate-600">
                                    Meslek hastalÄ±klarÄ±, iÅŸ kazalarÄ±ndan farklÄ± olarak anlÄ±k bir travma deÄŸil, zamana yayÄ±lmÄ±ÅŸ bir maruziyetin sonucudur. 
                                    5510 sayÄ±lÄ± Kanunâ€™un 14. maddesine gÃ¶re; sigortalÄ±nÄ±n Ã§alÄ±ÅŸtÄ±ÄŸÄ± iÅŸin niteliÄŸinden dolayÄ± tekrarlanan bir sebeple 
                                    veya iÅŸin yÃ¼rÃ¼tÃ¼m ÅŸartlarÄ± yÃ¼zÃ¼nden uÄŸradÄ±ÄŸÄ± geÃ§ici veya sÃ¼rekli hastalÄ±k halleridir.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-teal-700">2. YÃ¼kÃ¼mlÃ¼lÃ¼k SÃ¼resi ve Latent DÃ¶nem</h3>
                                <p className="text-sm text-slate-600">
                                    HastalÄ±ÄŸÄ±n iÅŸten ayrÄ±ldÄ±ktan sonra ortaya Ã§Ä±kmasÄ± durumunda "YÃ¼kÃ¼mlÃ¼lÃ¼k SÃ¼resi" devreye girer. 
                                    Genellikle 10 yÄ±l olan bu sÃ¼re aÅŸÄ±lsa bile, tÄ±bbi illiyet baÄŸÄ± kurulabiliyorsa YÃ¼ksek SaÄŸlÄ±k Kurulu onayÄ± ile 
                                    hastalÄ±k "Meslek HastalÄ±ÄŸÄ±" sayÄ±labilir.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-teal-700">3. Hesaplama Metodolojisi (TRH-2010)</h3>
                            <p className="text-sm text-slate-600 mb-4">
                                YargÄ±tay 10. Hukuk Dairesi ve Hukuk Genel Kurulu kararlarÄ± uyarÄ±nca, tazminat hesaplamalarÄ±nda PMF-1931 tablosu yerine, 
                                TÃ¼rkiye Ä°statistik Kurumu verilerine dayanan <strong>TRH-2010 (TÃ¼rkiye Hayat Tablosu)</strong> kullanÄ±lmasÄ± zorunludur.
                            </p>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
                                <li><strong>Aktif DÃ¶nem:</strong> 60 yaÅŸÄ±na kadar olan Ã§alÄ±ÅŸma Ã§aÄŸÄ±dÄ±r. Tam Ã¼cret Ã¼zerinden hesaplanÄ±r.</li>
                                <li><strong>Pasif DÃ¶nem:</strong> 60 yaÅŸÄ±ndan Ã¶lÃ¼me kadar olan dÃ¶nemdir. Emekli de olsa efor kaybÄ± devam ettiÄŸi iÃ§in asgari Ã¼cret Ã¼zerinden hesaplanÄ±r.</li>
                                <li><strong>Progresif Rant:</strong> Bilinmeyen devreler iÃ§in %10 artÄ±rÄ±m ve %10 iskonto yÃ¶ntemi uygulanÄ±r.</li>
                            </ul>
                        </div>

                        <div className="mt-8 bg-slate-50 p-6 rounded-xl border-l-4 border-teal-500">
                            <h3 className="text-lg font-semibold text-slate-800">Kritik UyarÄ±: SGK PSD Mahsubu</h3>
                            <p className="text-sm text-slate-600 mt-2">
                                Hukukumuzda "ZenginleÅŸme YasaÄŸÄ±" gereÄŸi, iÅŸÃ§i aynÄ± zarar iÃ§in iki kere tazminat alamaz. 
                                Bu nedenle, SGK tarafÄ±ndan baÄŸlanan SÃ¼rekli Ä°ÅŸ GÃ¶remezlik Gelirinin <strong>Ä°lk PeÅŸin Sermaye DeÄŸeri (PSD)</strong>, 
                                iÅŸverenin kusuru oranÄ±nda hesaplanan tazminattan dÃ¼ÅŸÃ¼lÃ¼r. Bu veri girilmezse hesaplama hatalÄ± (yÃ¼ksek) Ã§Ä±kar.
                            </p>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            SÄ±kÃ§a Sorulan Sorular
                        </h2>
                        <div className="space-y-4">
                            <details className="group bg-slate-50 rounded-lg">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-700 hover:text-teal-700 transition">
                                    <span>Meslek hastalÄ±ÄŸÄ± ile iÅŸ kazasÄ± arasÄ±ndaki fark nedir?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-slate-600 text-sm px-4 pb-4">
                                    Ä°ÅŸ kazasÄ± anlÄ±k bir olay iken, meslek hastalÄ±ÄŸÄ± tekrarlanan sebeplerle veya iÅŸin yÃ¼rÃ¼tÃ¼m ÅŸartlarÄ± yÃ¼zÃ¼nden zamanla ortaya Ã§Ä±kan, sÃ¼reklilik arz eden bir sÃ¼reÃ§tir.
                                </div>
                            </details>
                            <details className="group bg-slate-50 rounded-lg">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-700 hover:text-teal-700 transition">
                                    <span>Ä°ÅŸten ayrÄ±ldÄ±ktan yÄ±llar sonra dava aÃ§abilir miyim?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-slate-600 text-sm px-4 pb-4">
                                    Evet. YÃ¼kÃ¼mlÃ¼lÃ¼k sÃ¼resi (genellikle 10 yÄ±l) dolsa bile, tÄ±bbi illiyet baÄŸÄ± kurulabiliyorsa YÃ¼ksek SaÄŸlÄ±k Kurulu onayÄ± ile meslek hastalÄ±ÄŸÄ± sayÄ±labilir. ZamanaÅŸÄ±mÄ± sÃ¼resi (10 yÄ±l) ise hastalÄ±ÄŸÄ±n kesin teÅŸhis konulduÄŸu tarihten itibaren baÅŸlar.
                                </div>
                            </details>
                            <details className="group bg-slate-50 rounded-lg">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-700 hover:text-teal-700 transition">
                                    <span>Tazminat hesabÄ±nda hangi yaÅŸam tablosu kullanÄ±lÄ±r?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-slate-600 text-sm px-4 pb-4">
                                    YargÄ±tay kararlarÄ± uyarÄ±nca PMF-1931 yerine, daha gÃ¼ncel olan ve TÃ¼rkiye Ä°statistik Kurumu verilerine dayanan TRH-2010 (TÃ¼rkiye Hayat Tablosu) kullanÄ±lmaktadÄ±r.
                                </div>
                            </details>
                            <details className="group bg-slate-50 rounded-lg">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-slate-700 hover:text-teal-700 transition">
                                    <span>Emekli olduktan sonraki dÃ¶nem iÃ§in tazminat alabilir miyim?</span>
                                    <span className="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="text-slate-600 text-sm px-4 pb-4">
                                    Evet. YargÄ±tay'a gÃ¶re emeklilik dÃ¶neminde de (Pasif DÃ¶nem) efor kaybÄ± devam ettiÄŸi iÃ§in, genellikle asgari Ã¼cret Ã¼zerinden tazminat hesaplanÄ±r.
                                </div>
                            </details>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TazminatHesaplamaPage;
