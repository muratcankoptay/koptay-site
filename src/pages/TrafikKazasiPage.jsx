import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaCar, FaUserInjured, FaCalculator, FaPrint, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

// Lazy load Chart.js components
const ChartComponent = lazy(() => import('react-chartjs-2').then(mod => ({ default: mod.Doughnut })));

// Register Chart.js only when component mounts
let chartRegistered = false;
const registerChart = async () => {
    if (!chartRegistered) {
        const chartModule = await import('chart.js');
        chartModule.Chart.register(chartModule.ArcElement, chartModule.Tooltip, chartModule.Legend);
        chartRegistered = true;
    }
};

const TrafikKazasiPage = () => {
    const [activeTab, setActiveTab] = useState('vehicle');
    const [results, setResults] = useState(null);
    const [chartReady, setChartReady] = useState(false);
    
    // Register Chart.js on mount
    useEffect(() => {
        registerChart().then(() => setChartReady(true));
    }, []);
    
    // Constants
    const MIN_WAGE_NET_2025 = 17002;
    const MIN_WAGE_GROSS_2025 = 20002;

    // Form State
    const [formData, setFormData] = useState({
        victimFault: 0,
        // Vehicle
        marketValue: 1200000,
        vehicleKm: 45000,
        repairCost: 85000,
        repairDays: 15,
        rentCost: 1500,
        pastDamage: '0',
        // Body
        dob: new Date(new Date().setFullYear(new Date().getFullYear() - 30)).toISOString().split('T')[0],
        gender: 'M',
        wage: 17002,
        disability: 10,
        tempDisabilityDays: 45,
        caregiverDays: 30
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // TRH 2010 Data
    const TRH2010 = {
        18: [58.8, 63.6], 20: [56.9, 61.6], 25: [52.2, 56.8], 30: [47.5, 51.9], 
        35: [42.8, 47.2], 40: [38.2, 42.4], 45: [33.7, 37.7], 50: [29.3, 33.1], 
        55: [25.1, 28.6], 60: [21.1, 24.3], 65: [17.5, 20.2], 70: [14.0, 16.5]
    };

    const getLifeExpectancy = (age, gender) => {
        const keys = Object.keys(TRH2010).map(Number).sort((a,b)=>a-b);
        let closest = keys[0];
        for(let k of keys) {
            if(Math.abs(age - k) < Math.abs(age - closest)) closest = k;
        }
        const genderIdx = gender === 'M' ? 0 : 1;
        let val = TRH2010[closest][genderIdx];
        val -= (age - closest);
        return val > 0 ? val : 0;
    };

    const calculateAll = () => {
        const victimFaultRate = parseFloat(formData.victimFault) / 100;
        const faultMultiplier = 1 - victimFaultRate;

        // --- 1. VEHICLE CALCS ---
        const marketVal = parseFloat(formData.marketValue) || 0;
        const repairCost = parseFloat(formData.repairCost) || 0;
        const km = parseFloat(formData.vehicleKm) || 0;
        const repairDays = parseFloat(formData.repairDays) || 0;
        const rentCost = parseFloat(formData.rentCost) || 0;
        const pastDamage = parseInt(formData.pastDamage);

        let depreciationBase = 0;
        
        if (km > 165000) {
            depreciationBase = repairCost * 0.05; 
        } else {
            let damageRatio = repairCost / marketVal;
            let damageCoef = 0.15;
            if(damageRatio > 0.10) damageCoef = 0.20;
            if(damageRatio > 0.30) damageCoef = 0.25;

            let kmCoef = 1;
            if(km > 15000) kmCoef = 0.9;
            if(km > 30000) kmCoef = 0.8;
            if(km > 60000) kmCoef = 0.6;
            if(km > 100000) kmCoef = 0.4;

            let historyCoef = 1;
            if(pastDamage === 1) historyCoef = 0.5;
            if(pastDamage === 2) historyCoef = 0.1;

            depreciationBase = repairCost * damageCoef * kmCoef * historyCoef;
            if(depreciationBase > marketVal * 0.2) depreciationBase = marketVal * 0.2;
        }

        const valDepreciation = depreciationBase * faultMultiplier;
        const valRent = (repairDays * rentCost) * faultMultiplier;
        const totalVehicle = valDepreciation + valRent;

        // --- 2. BODY CALCS ---
        const dobDate = new Date(formData.dob);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        let valPermDis = 0;
        let valTempDis = 0;
        let valCaregiver = 0;

        if (formData.dob) {
            const remaining = getLifeExpectancy(age, formData.gender);
            const wage = parseFloat(formData.wage) || MIN_WAGE_NET_2025;
            const disability = parseFloat(formData.disability) / 100;
            
            let active = 0, passive = 0;
            if (age < 60) {
                if (age + remaining > 60) {
                    active = 60 - age;
                    passive = (age + remaining) - 60;
                } else active = remaining;
            } else passive = remaining;

            const yearlyWage = wage * 12;
            const grossActive = yearlyWage * active * disability;
            const grossPassive = yearlyWage * passive * disability; 
            valPermDis = (grossActive + grossPassive) * faultMultiplier;

            const tempDays = parseFloat(formData.tempDisabilityDays) || 0;
            const dailyWage = wage / 30;
            valTempDis = (tempDays * dailyWage) * faultMultiplier;

            const careDays = parseFloat(formData.caregiverDays) || 0;
            const dailyGrossMinWage = MIN_WAGE_GROSS_2025 / 30;
            valCaregiver = (careDays * dailyGrossMinWage) * faultMultiplier;
        }

        const totalBody = valPermDis + valTempDis + valCaregiver;
        const grandTotal = totalVehicle + totalBody;

        setResults({
            vehicle: {
                total: totalVehicle,
                depreciation: valDepreciation,
                rent: valRent
            },
            body: {
                total: totalBody,
                permDisability: valPermDis,
                tempDisability: valTempDis,
                caregiver: valCaregiver
            },
            grandTotal
        });
    };

    const chartData = results ? {
        labels: ['Araç (Maddi)', 'Bedeni (Şahıs)'],
        datasets: [{
            data: [results.vehicle.total, results.body.total],
            backgroundColor: ['#f59e0b', '#ef4444'],
            borderWidth: 0
        }]
    } : null;

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <Helmet>
                <title>Trafik Kazası Tazminat Hesaplama | Değer Kaybı & Aktüerya</title>
                <meta name="description" content="Araç değer kaybı, ikame araç bedeli, sürekli sakatlık ve geçici iş göremezlik tazminatlarını hesaplayın. KTK m.85 ve TBK m.49 uyumlu aktüerya sistemi." />
            </Helmet>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-8 text-white shadow-lg border-b-4 border-amber-500 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
                            <FaCalculator className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Trafik Kazası Aktüerya Sistemi</h1>
                            <p className="text-xs md:text-sm text-slate-300 opacity-90 mt-1">Araç Değer Kaybı & Bedeni Tazminat (KTK m.85 & TBK m.49)</p>
                        </div>
                    </div>
                    <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded transition shadow-lg">
                        <FaPrint /> PDF / RAPORLA
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8 no-print">
                    <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
                        <button 
                            onClick={() => setActiveTab('vehicle')}
                            className={`px-6 py-3 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
                                activeTab === 'vehicle' 
                                ? 'bg-slate-50 text-slate-800 font-bold border-b-2 border-amber-500' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <FaCar className={activeTab === 'vehicle' ? 'text-amber-500' : ''} />
                            Araç / Maddi Hasar
                        </button>
                        <button 
                            onClick={() => setActiveTab('body')}
                            className={`px-6 py-3 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 ${
                                activeTab === 'body' 
                                ? 'bg-slate-50 text-slate-800 font-bold border-b-2 border-red-500' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <FaUserInjured className={activeTab === 'body' ? 'text-red-500' : ''} />
                            Bedeni / Maluliyet
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT: INPUTS */}
                    <div className="lg:col-span-4 space-y-6 no-print">
                        
                        {/* Fault Analysis */}
                        <div className="bg-white rounded-xl shadow-md border-l-4 border-slate-600 p-5">
                            <h3 className="text-sm font-bold text-slate-700 mb-3 border-b pb-2 flex items-center gap-2">
                                <FaExclamationTriangle className="text-amber-500" /> Kusur Durumu (Kritik)
                            </h3>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Mağdur (Başvuran) Kusur Oranı %</label>
                            <input 
                                type="number" 
                                name="victimFault"
                                value={formData.victimFault}
                                onChange={handleInputChange}
                                max="100" 
                                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-slate-500 outline-none" 
                            />
                            <p className="text-[10px] text-slate-400 mt-1">Örn: Karşı taraf %100 kusurlu ise buraya 0 yazınız.</p>
                        </div>

                        {/* Vehicle Inputs */}
                        {activeTab === 'vehicle' && (
                            <div className="bg-white rounded-xl shadow-md p-5 border border-slate-100 animate-fade-in-up">
                                <h3 className="text-sm font-bold text-slate-700 mb-3 text-amber-600">Araç Bilgileri</h3>
                                
                                <div className="mb-3">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Araç Piyasa Rayiç Değeri</label>
                                    <input type="number" name="marketValue" value={formData.marketValue} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm font-bold text-slate-700 outline-none" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Araç Kilometresi</label>
                                        <input type="number" name="vehicleKm" value={formData.vehicleKm} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Onarım Tutarı</label>
                                        <input type="number" name="repairCost" value={formData.repairCost} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm outline-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Onarım Süresi (Gün)</label>
                                        <input type="number" name="repairDays" value={formData.repairDays} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Günlük İkame Bedeli</label>
                                        <input type="number" name="rentCost" value={formData.rentCost} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm outline-none" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Geçmiş Hasar Durumu</label>
                                    <select name="pastDamage" value={formData.pastDamage} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm outline-none">
                                        <option value="0">Hasarsız / Orijinal</option>
                                        <option value="1">Kısmi Boyalı / Ufak Hasarlı</option>
                                        <option value="2">Değişen Parçalı / Ağır Hasarlı</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Body Inputs */}
                        {activeTab === 'body' && (
                            <div className="bg-white rounded-xl shadow-md p-5 border border-slate-100 animate-fade-in-up">
                                <h3 className="text-sm font-bold text-slate-700 mb-3 text-red-600">Bedeni Hasar & Maluliyet</h3>
                                
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Doğum Tarihi</label>
                                        <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Cinsiyet</label>
                                        <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm outline-none">
                                            <option value="M">Erkek</option>
                                            <option value="F">Kadın</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Aylık Net Kazanç (TL)</label>
                                    <input type="number" name="wage" value={formData.wage} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm font-bold outline-none" />
                                    <p className="text-[10px] text-slate-400">İspatlanamıyorsa asgari ücret giriniz.</p>
                                </div>

                                <div className="mb-3">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-semibold text-slate-500">Sürekli Sakatlık Oranı</label>
                                        <span className="text-xs font-bold text-red-600">%{formData.disability}</span>
                                    </div>
                                    <input type="range" name="disability" min="0" max="100" value={formData.disability} onChange={handleInputChange} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3 bg-red-50 p-3 rounded border border-red-100">
                                    <div>
                                        <label className="block text-[10px] font-bold text-red-800 mb-1">Geçici İş Göremezlik (Gün)</label>
                                        <input type="number" name="tempDisabilityDays" value={formData.tempDisabilityDays} onChange={handleInputChange} className="w-full border border-red-200 rounded px-2 py-1 text-sm bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-red-800 mb-1">Bakıcı İhtiyacı (Gün)</label>
                                        <input type="number" name="caregiverDays" value={formData.caregiverDays} onChange={handleInputChange} className="w-full border border-red-200 rounded px-2 py-1 text-sm bg-white" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button onClick={calculateAll} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2">
                            <FaCalculator /> HESAPLA VE RAPORLA
                        </button>
                    </div>

                    {/* RIGHT: REPORT */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-amber-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-amber-600 uppercase">Araç (Maddi) Tazminat</p>
                                        <h3 className="text-2xl font-bold text-slate-800 mt-1">
                                            {results ? results.vehicle.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                        </h3>
                                    </div>
                                    <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                                        <FaCar />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2">Değer Kaybı + İkame + Onarım Farkı</p>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-red-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-red-600 uppercase">Bedeni (Şahıs) Tazminat</p>
                                        <h3 className="text-2xl font-bold text-slate-800 mt-1">
                                            {results ? results.body.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                        </h3>
                                    </div>
                                    <div className="bg-red-100 p-2 rounded-full text-red-600">
                                        <FaUserInjured />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2">Sürekli/Geçici İş Göremezlik + Bakıcı</p>
                            </div>

                            <div className="bg-slate-800 p-4 rounded-xl shadow text-white border border-slate-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Toplam Talep Edilebilir</p>
                                        <h3 className="text-2xl font-bold text-white mt-1">
                                            {results ? results.grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                        </h3>
                                    </div>
                                    <div className="bg-slate-600 p-2 rounded-full text-slate-300">
                                        <FaCalculator />
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2">Mağdur Kusuru İndirilmiş Net Tutar</p>
                            </div>
                        </div>

                        {/* Detailed Table */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 text-sm">Detaylı Hesap Dökümü</h3>
                                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded">Bilirkişi Formatı</span>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3">Tazminat Kalemi</th>
                                            <th className="px-6 py-3">Açıklama / Formül</th>
                                            <th className="px-6 py-3 text-right">Tutar (Net)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="bg-amber-50/50">
                                            <td className="px-6 py-3 font-medium text-slate-700">Araç Değer Kaybı</td>
                                            <td className="px-6 py-3 text-xs text-slate-500">Rayiç, Km ve Hasar Çarpanı ile (Yargıtay/SUT)</td>
                                            <td className="px-6 py-3 text-right font-mono">
                                                {results ? results.vehicle.depreciation.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-3 font-medium text-slate-700">İkame Araç (Mahrumiyet) Bedeli</td>
                                            <td className="px-6 py-3 text-xs text-slate-500">Onarım Süresi x Günlük Kira Bedeli</td>
                                            <td className="px-6 py-3 text-right font-mono">
                                                {results ? results.vehicle.rent.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                            </td>
                                        </tr>
                                        
                                        <tr className="bg-red-50/50 border-t border-slate-100">
                                            <td className="px-6 py-3 font-medium text-slate-700">Sürekli Sakatlık Tazminatı</td>
                                            <td className="px-6 py-3 text-xs text-slate-500">TRH-2010 Aktif+Pasif Dönem x Maluliyet</td>
                                            <td className="px-6 py-3 text-right font-mono">
                                                {results ? results.body.permDisability.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-3 font-medium text-slate-700">Geçici İş Göremezlik</td>
                                            <td className="px-6 py-3 text-xs text-slate-500">Raporlu Süre x Günlük Net Kazanç</td>
                                            <td className="px-6 py-3 text-right font-mono">
                                                {results ? results.body.tempDisability.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-3 font-medium text-slate-700">Bakıcı Gideri</td>
                                            <td className="px-6 py-3 text-xs text-slate-500">Süre x <strong>Brüt Asgari Ücret</strong></td>
                                            <td className="px-6 py-3 text-right font-mono">
                                                {results ? results.body.caregiver.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                            </td>
                                        </tr>
                                        
                                        <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                                            <td className="px-6 py-4 text-slate-800">GENEL TOPLAM</td>
                                            <td className="px-6 py-4 text-xs text-slate-500 italic">Mağdur kusuru düşülmüş nihai rakam</td>
                                            <td className="px-6 py-4 text-right text-lg text-slate-900">
                                                {results ? results.grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Charts & Notes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
                            <div className="bg-white p-5 rounded-xl shadow border border-slate-100">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Maddi vs Bedeni Dağılım</h4>
                                <div className="h-64 flex justify-center">
                                    {results && (
                                        <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400">Grafik yükleniyor...</div>}>
                                            <ChartComponent data={chartData} options={{ maintainAspectRatio: false }} />
                                        </Suspense>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-xl shadow border border-slate-100 text-xs text-slate-600 leading-relaxed">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                                    <FaInfoCircle className="text-blue-500" /> Bilirkişi Notları
                                </h4>
                                <ul className="list-disc pl-4 space-y-2">
                                    <li><strong>Değer Kaybı:</strong> SUT formülü Anayasa Mahkemesi tarafından iptal edildiği için, hesaplamada "Piyasa Rayiç Farkı" metoduna yakınsayan bir algoritma kullanılmıştır.</li>
                                    <li><strong>Bakıcı Gideri:</strong> Yargıtay yerleşik içtihatları gereği, bakıcı gideri hesaplamasında <strong>Brüt Asgari Ücret</strong> esas alınır.</li>
                                    <li><strong>TRH-2010:</strong> Bedeni zararlarda bakiye ömür hesabı güncel TRH-2010 tablosuna göre yapılmıştır.</li>
                                    <li><strong>Manevi Tazminat:</strong> Bu hesaplamaya manevi tazminat dahil değildir, hakimin takdirindedir.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrafikKazasiPage;
