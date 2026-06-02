import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HesaplamaDisclaimer from '../components/HesaplamaDisclaimer';
import { FaUserInjured, FaCalculator, FaPrint, FaInfoCircle, FaExclamationTriangle, FaCar, FaArrowRight } from 'react-icons/fa';

// Lazy load Chart.js components
const ChartComponent = lazy(() => import('react-chartjs-2').then(mod => ({ default: mod.Doughnut })));

let chartRegistered = false;
const registerChart = async () => {
    if (!chartRegistered) {
        const chartModule = await import('chart.js');
        chartModule.Chart.register(chartModule.ArcElement, chartModule.Tooltip, chartModule.Legend);
        chartRegistered = true;
    }
};

const TrafikKazasiTazminatiPage = () => {
    const [results, setResults] = useState(null);
    const [chartReady, setChartReady] = useState(false);

    useEffect(() => {
        registerChart().then(() => setChartReady(true));
    }, []);

    // Constants
    const MIN_WAGE_NET_2025 = 17002;
    const MIN_WAGE_GROSS_2025 = 20002;

    const [formData, setFormData] = useState({
        victimFault: 0,
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
        const keys = Object.keys(TRH2010).map(Number).sort((a, b) => a - b);
        let closest = keys[0];
        for (let k of keys) {
            if (Math.abs(age - k) < Math.abs(age - closest)) closest = k;
        }
        const genderIdx = gender === 'M' ? 0 : 1;
        let val = TRH2010[closest][genderIdx];
        val -= (age - closest);
        return val > 0 ? val : 0;
    };

    const calculateAll = () => {
        const victimFaultRate = parseFloat(formData.victimFault) / 100;
        const faultMultiplier = 1 - victimFaultRate;

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

        const total = valPermDis + valTempDis + valCaregiver;

        setResults({
            total,
            permDisability: valPermDis,
            tempDisability: valTempDis,
            caregiver: valCaregiver
        });
    };

    const chartData = results ? {
        labels: ['Sürekli Sakatlık', 'Geçici İş Göremezlik', 'Bakıcı Gideri'],
        datasets: [{
            data: [results.permDisability, results.tempDisability, results.caregiver],
            backgroundColor: ['#ef4444', '#f97316', '#64748b'],
            borderWidth: 0
        }]
    } : null;

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <SEO
                title="Trafik Kazası Maluliyet Tazminatı Hesaplama 2026 | İş Göremezlik | Koptay Hukuk"
                description="Trafik kazası sonrası sürekli sakatlık (maluliyet), geçici iş göremezlik ve bakıcı gideri tazminatını hesaplayın. TRH-2010 yaşam tablosu, KTK m.90 ve TBK m.55 esaslı aktüerya. Ankara avukat — Koptay Hukuk Bürosu."
                keywords="trafik kazası maluliyet tazminatı hesaplama, sürekli sakatlık tazminatı hesaplama, geçici iş göremezlik tazminatı, trafik kazası iş göremezlik hesaplama, maluliyet oranı tazminat, TRH-2010 hesaplama, bakıcı gideri tazminatı, trafik kazası bedeni hasar tazminatı, trafik kazası avukatı ankara"
                url="https://koptay.av.tr/hesaplama-araclari/trafik-kazasi-tazminati"
                image="/images/articles/trafik-kazasi-sonrasi-maluliyet-raporu-nasil-alinir.jpg"
            />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-8 text-white shadow-lg border-b-4 border-red-500 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
                            <FaUserInjured className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Trafik Kazası Maluliyet Tazminatı Hesaplama</h1>
                            <p className="text-xs md:text-sm text-slate-300 opacity-90 mt-1">Sürekli Sakatlık, Geçici İş Göremezlik & Bakıcı Gideri (TRH-2010 esaslı)</p>
                        </div>
                    </div>
                    <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 text-xs font-bold bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition shadow-lg">
                        <FaPrint /> PDF / RAPORLA
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT: INPUTS */}
                    <div className="lg:col-span-4 space-y-6 no-print">

                        {/* Fault Analysis */}
                        <div className="bg-white rounded-xl shadow-md border-l-4 border-slate-600 p-5">
                            <h3 className="text-sm font-bold text-slate-700 mb-3 border-b pb-2 flex items-center gap-2">
                                <FaExclamationTriangle className="text-red-500" /> Kusur Durumu (Kritik)
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

                        {/* Body Inputs */}
                        <div className="bg-white rounded-xl shadow-md p-5 border border-slate-100">
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

                            <div className="grid grid-cols-2 gap-3 mb-1 bg-red-50 p-3 rounded border border-red-100">
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

                        <button onClick={calculateAll} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2">
                            <FaCalculator /> HESAPLA VE RAPORLA
                        </button>

                        {/* Cross-link to vehicle tool */}
                        <Link to="/hesaplama-araclari/arac-hasar-ikame-arac" className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition no-print">
                            <div className="flex items-center gap-3">
                                <FaCar className="text-amber-500" />
                                <span className="text-xs font-semibold text-amber-800">Aracınız da hasar gördü mü? İkame araç & değer kaybı hesaplayın</span>
                            </div>
                            <FaArrowRight className="text-amber-500" />
                        </Link>
                    </div>

                    {/* RIGHT: REPORT */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-red-500">
                                <p className="text-xs font-bold text-red-600 uppercase">Sürekli Sakatlık</p>
                                <h3 className="text-xl font-bold text-slate-800 mt-1">
                                    {results ? results.permDisability.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-2">TRH-2010 Aktif + Pasif Dönem</p>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-orange-500">
                                <p className="text-xs font-bold text-orange-600 uppercase">Geçici İş Göremezlik</p>
                                <h3 className="text-xl font-bold text-slate-800 mt-1">
                                    {results ? results.tempDisability.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-2">Raporlu Süre x Günlük Kazanç</p>
                            </div>

                            <div className="bg-slate-800 p-4 rounded-xl shadow text-white border border-slate-700">
                                <p className="text-xs font-bold text-slate-400 uppercase">Toplam Talep Edilebilir</p>
                                <h3 className="text-xl font-bold text-white mt-1">
                                    {results ? results.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                </h3>
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
                                        <tr className="bg-red-50/50">
                                            <td className="px-6 py-3 font-medium text-slate-700">Sürekli Sakatlık Tazminatı</td>
                                            <td className="px-6 py-3 text-xs text-slate-500">TRH-2010 Aktif+Pasif Dönem x Maluliyet</td>
                                            <td className="px-6 py-3 text-right font-mono">
                                                {results ? results.permDisability.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-3 font-medium text-slate-700">Geçici İş Göremezlik</td>
                                            <td className="px-6 py-3 text-xs text-slate-500">Raporlu Süre x Günlük Net Kazanç</td>
                                            <td className="px-6 py-3 text-right font-mono">
                                                {results ? results.tempDisability.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-3 font-medium text-slate-700">Bakıcı Gideri</td>
                                            <td className="px-6 py-3 text-xs text-slate-500">Süre x <strong>Brüt Asgari Ücret</strong></td>
                                            <td className="px-6 py-3 text-right font-mono">
                                                {results ? results.caregiver.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                            </td>
                                        </tr>
                                        <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                                            <td className="px-6 py-4 text-slate-800">GENEL TOPLAM</td>
                                            <td className="px-6 py-4 text-xs text-slate-500 italic">Mağdur kusuru düşülmüş nihai rakam</td>
                                            <td className="px-6 py-4 text-right text-lg text-slate-900">
                                                {results ? results.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Charts & Notes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
                            <div className="bg-white p-5 rounded-xl shadow border border-slate-100">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Tazminat Kalemleri Dağılımı</h4>
                                <div className="h-64 flex justify-center">
                                    {results && chartReady && (
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
                                    <li><strong>TRH-2010:</strong> Bakiye ömür hesabı güncel TRH-2010 yaşam tablosuna göre yapılır; aktif dönem 60 yaşa kadar, sonrası pasif dönemdir.</li>
                                    <li><strong>Bakıcı Gideri:</strong> Yargıtay yerleşik içtihatları gereği <strong>Brüt Asgari Ücret</strong> esas alınır.</li>
                                    <li><strong>Maluliyet Oranı:</strong> Kesin oran ATK veya tam teşekküllü hastane sağlık kurulu raporuyla belirlenir; buradaki değer yaklaşıktır.</li>
                                    <li><strong>Manevi Tazminat:</strong> Bu hesaba dahil değildir, hâkimin takdirindedir (TBK m.56).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===================== SEO İÇERİK ===================== */}
                <article className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 prose prose-slate max-w-none">
                    <h2 className="text-2xl font-bold text-slate-900">Trafik Kazası Maluliyet Tazminatı Nedir?</h2>
                    <p>
                        Trafik kazası sonrası bedensel zarar gören kişi; <strong>sürekli sakatlık (maluliyet) tazminatı</strong>,
                        <strong> geçici iş göremezlik tazminatı</strong>, <strong>bakıcı gideri</strong> ve <strong>tedavi giderlerini</strong> talep edebilir.
                        Bu kalemler, kazada oluşan kalıcı veya geçici kazanç kaybını ve ek masrafları karşılamayı amaçlar.
                        Talepler hem kusurlu sürücüye hem de aracın <strong>Zorunlu Mali Sorumluluk (Trafik) Sigortası</strong>'na yöneltilebilir (KTK m.85).
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8">Sürekli Sakatlık (Maluliyet) Tazminatı Nasıl Hesaplanır?</h2>
                    <p>
                        Sürekli iş göremezlik tazminatı, kişinin yaşına ve cinsiyetine göre <strong>TRH-2010 yaşam tablosundan</strong> bulunan bakiye ömür,
                        yıllık net kazanç ve <strong>maluliyet oranı</strong> çarpılarak hesaplanır. Dönem ikiye ayrılır:
                    </p>
                    <ul>
                        <li><strong>Aktif dönem:</strong> Kişinin 60 yaşına kadar olan çalışma çağı. Bu dönemde gerçek/ispatlanan kazanç esas alınır.</li>
                        <li><strong>Pasif dönem:</strong> 60 yaşından bakiye ömrün sonuna kadar olan süre. Bu dönemde genellikle asgari ücret esas alınır.</li>
                    </ul>
                    <p>
                        Formül özet olarak: <em>(Yıllık Kazanç × Aktif Yıl × Maluliyet Oranı) + (Yıllık Kazanç × Pasif Yıl × Maluliyet Oranı)</em>.
                        Elde edilen tutardan mağdurun kendi kusuru oranında indirim yapılır.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8">Geçici İş Göremezlik ve Bakıcı Gideri</h2>
                    <p>
                        <strong>Geçici iş göremezlik tazminatı</strong>, kazadan sonra iyileşme sürecinde çalışılamayan (raporlu) günler için ödenir:
                        raporlu gün sayısı × günlük net kazanç. <strong>Bakıcı gideri</strong> ise başkasının bakımına muhtaç kalınan günler için
                        Yargıtay içtihatları uyarınca <strong>brüt asgari ücret</strong> üzerinden hesaplanır.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8">Hangi Kanunlara Dayanır?</h2>
                    <p>
                        Maddi tazminat sorumluluğu <strong>TBK m.49 ve m.54</strong> (haksız fiil ve bedensel zarar), trafik sigortasının sorumluluğu
                        <strong> 2918 sayılı KTK m.85 ve m.90</strong>, manevi tazminat ise <strong>TBK m.56</strong> kapsamında değerlendirilir.
                        Sigortacıya karşı taleplerde <strong>KTK m.109</strong> uyarınca 2 yıllık özel zamanaşımı uygulanır.
                    </p>

                    <div className="not-prose bg-red-50 border-l-4 border-red-500 p-4 rounded mt-6">
                        <p className="text-sm text-red-800">
                            <strong>Önemli:</strong> Bu araç bilgilendirme amaçlıdır. Kesin tazminat tutarı, maluliyet oranını belirleyen sağlık kurulu raporu
                            ve mahkemece atanan aktüer bilirkişi raporu ile ortaya çıkar.
                        </p>
                    </div>

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
                            <Link to="/hesaplama-araclari/arac-hasar-ikame-arac" className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-amber-400 transition text-sm font-medium text-slate-700">
                                İkame Araç & Araç Hasar Tazminatı Hesaplama →
                            </Link>
                        </li>
                        <li>
                            <Link to="/hesaplama-araclari/arac-deger-kaybi" className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-amber-400 transition text-sm font-medium text-slate-700">
                                Araç Değer Kaybı Hesaplama →
                            </Link>
                        </li>
                        <li>
                            <Link to="/makale/trafik-kazasi-sonrasi-maluliyet-heyet-raporu-nasil-ve-nereden-alinir-2025-rehberi" className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-amber-400 transition text-sm font-medium text-slate-700">
                                Maluliyet (Heyet) Raporu Nasıl Alınır? →
                            </Link>
                        </li>
                        <li>
                            <Link to="/makale/trafik-kazalarinda-kusur-tespiti-bilirkisi-raporu-rehberi-2026" className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-amber-400 transition text-sm font-medium text-slate-700">
                                Trafik Kazasında Kusur Tespiti Rehberi →
                            </Link>
                        </li>
                    </ul>
                </article>
            </div>

            <HesaplamaDisclaimer
                aracAdi="trafik kazası maluliyet tazminatı hesaplama aracı"
                mevzuat="2918 sayılı Karayolları Trafik Kanunu m.85 ve m.90, 6098 sayılı Türk Borçlar Kanunu m.49, m.54 ve m.56, KMAZMSS Genel Şartları"
                ekNotlar={[
                    'Sürekli iş göremezlik tazminatı için maluliyet oranı, ATK veya tam teşekküllü hastane raporuna göre belirlenir; bu araçtaki seçim yaklaşık değerdir.',
                    'TRH-2010 yaşam tablosu, asgari ücret ve faiz oranları dönemsel olarak güncellenir.',
                    'Manevi tazminat tamamen hâkimin takdirinde olup bu hesaplamaya dahil değildir.',
                    'KTK m.109 uyarınca sigortacıya karşı taleplerde 2 yıllık özel zamanaşımı, TBK m.72 uyarınca haksız fiilden doğan taleplerde 2 yıllık öğrenme/10 yıllık her hâlde zamanaşımı uygulanır.',
                ]}
            />
        </div>
    );
};

// FAQ — prerender.js'teki FAQPage şeması ile birebir eşleşmelidir
export const FAQ_ITEMS = [
    {
        q: 'Trafik kazasında maluliyet tazminatı nasıl hesaplanır?',
        a: 'Sürekli sakatlık tazminatı; kişinin yaş ve cinsiyetine göre TRH-2010 yaşam tablosundan bulunan bakiye ömür, yıllık net kazanç ve maluliyet oranının çarpımıyla hesaplanır. Hesap aktif (60 yaşa kadar) ve pasif (sonrası) dönem olarak ikiye ayrılır; bulunan tutardan mağdurun kusuru oranında indirim yapılır.'
    },
    {
        q: 'Maluliyet oranı nereden ve nasıl belirlenir?',
        a: 'Maluliyet oranı; Adli Tıp Kurumu veya sağlık kurulu raporu vermeye yetkili üniversite, eğitim-araştırma ve devlet hastanelerinden alınan sağlık kurulu (heyet) raporuyla belirlenir. Erişkinler İçin Engellilik Değerlendirmesi Hakkında Yönetmelik esas alınır; rapora itiraz hakkınız saklıdır.'
    },
    {
        q: 'Geçici iş göremezlik tazminatı nedir?',
        a: 'Kaza sonrası iyileşme sürecinde çalışamadığınız (raporlu) günler için ödenen tazminattır. Raporlu gün sayısı ile günlük net kazancınız çarpılarak bulunur; gerçek kazanç ispat edilemiyorsa asgari ücret esas alınır.'
    },
    {
        q: 'Bakıcı gideri hangi ücret üzerinden hesaplanır?',
        a: 'Yargıtay yerleşik içtihatlarına göre bakıcı gideri, başkasının bakımına muhtaç kalınan gün sayısı ile brüt asgari ücretin çarpımı üzerinden hesaplanır. Profesyonel bakıcı tutulmasa dahi bu gider talep edilebilir.'
    },
    {
        q: 'Trafik kazası tazminat davasının zamanaşımı kaç yıldır?',
        a: 'TBK m.72 uyarınca haksız fiilden doğan tazminat davası, zararın ve failin öğrenilmesinden itibaren 2 yıl, her hâlde 10 yıl içinde açılmalıdır. Kaza suç teşkil ediyorsa daha uzun ceza zamanaşımı süresi uygulanır. Sigortacıya karşı taleplerde KTK m.109 gereği 2 yıllık özel zamanaşımı geçerlidir.'
    },
    {
        q: 'Maluliyet tazminatını sigorta mı yoksa kusurlu sürücü mü öder?',
        a: 'Bedensel zararlar, teminat limitleri dahilinde aracın zorunlu trafik sigortasından ödenir (KTK m.85). Sigorta limitini aşan kısım ve manevi tazminat için kusurlu sürücüye karşı dava açılır. Manevi tazminat zorunlu trafik sigortası teminatı dışındadır.'
    }
];

export default TrafikKazasiTazminatiPage;
