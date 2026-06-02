import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HesaplamaDisclaimer from '../components/HesaplamaDisclaimer';
import { FaCar, FaCalculator, FaPrint, FaInfoCircle, FaExclamationTriangle, FaUserInjured, FaArrowRight } from 'react-icons/fa';

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

const AracHasarIkamePage = () => {
    const [results, setResults] = useState(null);
    const [chartReady, setChartReady] = useState(false);

    useEffect(() => {
        registerChart().then(() => setChartReady(true));
    }, []);

    const [formData, setFormData] = useState({
        victimFault: 0,
        marketValue: 1200000,
        vehicleKm: 45000,
        repairCost: 85000,
        repairDays: 15,
        rentCost: 1500,
        pastDamage: '0'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateAll = () => {
        const victimFaultRate = parseFloat(formData.victimFault) / 100;
        const faultMultiplier = 1 - victimFaultRate;

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
            if (damageRatio > 0.10) damageCoef = 0.20;
            if (damageRatio > 0.30) damageCoef = 0.25;

            let kmCoef = 1;
            if (km > 15000) kmCoef = 0.9;
            if (km > 30000) kmCoef = 0.8;
            if (km > 60000) kmCoef = 0.6;
            if (km > 100000) kmCoef = 0.4;

            let historyCoef = 1;
            if (pastDamage === 1) historyCoef = 0.5;
            if (pastDamage === 2) historyCoef = 0.1;

            depreciationBase = repairCost * damageCoef * kmCoef * historyCoef;
            if (depreciationBase > marketVal * 0.2) depreciationBase = marketVal * 0.2;
        }

        const valDepreciation = depreciationBase * faultMultiplier;
        const valRent = (repairDays * rentCost) * faultMultiplier;
        const total = valDepreciation + valRent;

        setResults({
            total,
            depreciation: valDepreciation,
            rent: valRent
        });
    };

    const chartData = results ? {
        labels: ['İkame Araç (Mahrumiyet)', 'Değer Kaybı'],
        datasets: [{
            data: [results.rent, results.depreciation],
            backgroundColor: ['#f59e0b', '#0ea5e9'],
            borderWidth: 0
        }]
    } : null;

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <SEO
                title="İkame Araç ve Araç Hasar Tazminatı Hesaplama 2026 | Mahrumiyet Bedeli | Koptay Hukuk"
                description="Trafik kazası sonrası ikame araç (mahrumiyet) bedeli ve maddi araç hasar tazminatını hesaplayın. Onarım süresi, günlük kira ve kusur oranına göre Yargıtay 17. HD içtihatlarına uygun aktüerya. Ankara avukat — Koptay Hukuk Bürosu."
                keywords="ikame araç bedeli hesaplama, araç mahrumiyet bedeli hesaplama, araç hasar tazminatı hesaplama, kaza sonrası ikame araç hakkı, mahrumiyet tazminatı, onarım süresi tazminatı, trafik kazası maddi hasar, ikame araç ücreti, araç kullanım kaybı tazminatı"
                url="https://koptay.av.tr/hesaplama-araclari/arac-hasar-ikame-arac"
                image="/images/articles/arac-mahrumiyet-bedeli-ikame-arac.jpg"
            />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 mb-8 text-white shadow-lg border-b-4 border-amber-500 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
                            <FaCar className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight">İkame Araç ve Araç Hasar Tazminatı Hesaplama</h1>
                            <p className="text-xs md:text-sm text-slate-300 opacity-90 mt-1">Mahrumiyet (İkame Araç) Bedeli & Maddi Hasar (KTK m.85, TBK m.49)</p>
                        </div>
                    </div>
                    <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded transition shadow-lg">
                        <FaPrint /> PDF / RAPORLA
                    </button>
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
                        <div className="bg-white rounded-xl shadow-md p-5 border border-slate-100">
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

                            <div className="grid grid-cols-2 gap-3 mb-3 bg-amber-50 p-3 rounded border border-amber-100">
                                <div>
                                    <label className="block text-[10px] font-bold text-amber-800 mb-1">Onarım Süresi (Gün)</label>
                                    <input type="number" name="repairDays" value={formData.repairDays} onChange={handleInputChange} className="w-full border border-amber-200 rounded px-2 py-1 text-sm bg-white" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-amber-800 mb-1">Günlük İkame Bedeli</label>
                                    <input type="number" name="rentCost" value={formData.rentCost} onChange={handleInputChange} className="w-full border border-amber-200 rounded px-2 py-1 text-sm bg-white" />
                                </div>
                            </div>

                            <div className="mb-1">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Geçmiş Hasar Durumu</label>
                                <select name="pastDamage" value={formData.pastDamage} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm outline-none">
                                    <option value="0">Hasarsız / Orijinal</option>
                                    <option value="1">Kısmi Boyalı / Ufak Hasarlı</option>
                                    <option value="2">Değişen Parçalı / Ağır Hasarlı</option>
                                </select>
                            </div>
                        </div>

                        <button onClick={calculateAll} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2">
                            <FaCalculator /> HESAPLA VE RAPORLA
                        </button>

                        {/* Cross-link to bodily injury tool */}
                        <Link to="/hesaplama-araclari/trafik-kazasi-tazminati" className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl p-4 hover:bg-red-100 transition no-print">
                            <div className="flex items-center gap-3">
                                <FaUserInjured className="text-red-500" />
                                <span className="text-xs font-semibold text-red-800">Yaralanma da var mı? Maluliyet & iş göremezlik tazminatı hesaplayın</span>
                            </div>
                            <FaArrowRight className="text-red-500" />
                        </Link>
                    </div>

                    {/* RIGHT: REPORT */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-amber-500">
                                <p className="text-xs font-bold text-amber-600 uppercase">İkame Araç (Mahrumiyet)</p>
                                <h3 className="text-xl font-bold text-slate-800 mt-1">
                                    {results ? results.rent.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-2">Onarım Süresi x Günlük Kira</p>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow border-l-4 border-sky-500">
                                <p className="text-xs font-bold text-sky-600 uppercase">Değer Kaybı (Tahmini)</p>
                                <h3 className="text-xl font-bold text-slate-800 mt-1">
                                    {results ? results.depreciation.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-2">Rayiç, Km ve Hasar Çarpanı</p>
                            </div>

                            <div className="bg-slate-800 p-4 rounded-xl shadow text-white border border-slate-700">
                                <p className="text-xs font-bold text-slate-400 uppercase">Toplam Maddi Tazminat</p>
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
                                        <tr className="bg-amber-50/50">
                                            <td className="px-6 py-3 font-medium text-slate-700">İkame Araç (Mahrumiyet) Bedeli</td>
                                            <td className="px-6 py-3 text-xs text-slate-500">Onarım Süresi x Günlük Kira Bedeli</td>
                                            <td className="px-6 py-3 text-right font-mono">
                                                {results ? results.rent.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-3 font-medium text-slate-700">Araç Değer Kaybı (Tahmini)</td>
                                            <td className="px-6 py-3 text-xs text-slate-500">Rayiç, Km ve Hasar Çarpanı ile (Yargıtay 17. HD)</td>
                                            <td className="px-6 py-3 text-right font-mono">
                                                {results ? results.depreciation.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
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
                                    <li><strong>İkame Araç:</strong> Mahrumiyet bedeli için aracın fiilen kullanılamadığı makul onarım süresi ve emsal kira bedeli esas alınır; fatura şart değildir (Yargıtay 17. HD).</li>
                                    <li><strong>Değer Kaybı:</strong> Buradaki rakam yaklaşıktır; kesin tutar için <Link to="/hesaplama-araclari/arac-deger-kaybi" className="text-sky-600 underline">Araç Değer Kaybı aracını</Link> kullanın.</li>
                                    <li><strong>Kusur:</strong> Tazminat, mağdurun kusuru oranında indirilir; %100 karşı kusurda tam tahsil edilir.</li>
                                    <li><strong>Kasko:</strong> Kasko kural olarak mahrumiyet ve değer kaybını ödemez; bunlar karşı tarafın trafik sigortasından/kusurludan istenir.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===================== SEO İÇERİK ===================== */}
                <article className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 prose prose-slate max-w-none">
                    <h2 className="text-2xl font-bold text-slate-900">İkame Araç (Mahrumiyet) Bedeli Nedir?</h2>
                    <p>
                        Trafik kazasında aracı hasar gören kişi, aracının serviste/onarımda kaldığı süre boyunca ondan yararlanamaz.
                        Bu kullanım kaybı, hukukta <strong>araç mahrumiyet bedeli</strong> veya <strong>ikame araç bedeli</strong> olarak tazmin edilir.
                        Yargıtay 17. Hukuk Dairesi yerleşik içtihatlarına göre, mağdur fiilen kiralık araç tutmasa dahi, aracından mahrum kaldığı
                        makul süre için emsal kira bedeli üzerinden tazminat talep edebilir.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8">İkame Araç Bedeli Nasıl Hesaplanır?</h2>
                    <p>
                        Hesaplama iki temel veriye dayanır: <strong>makul onarım süresi</strong> (aracın serviste geçirmesi gereken iş günü) ve
                        <strong> günlük emsal kira bedeli</strong> (aynı segment aracın günlük kiralama ücreti). Formül basitçe:
                        <em> Onarım Süresi (gün) × Günlük İkame Bedeli</em>. Elde edilen tutardan mağdurun kusuru oranında indirim yapılır.
                        Onarımın makul süreyi aşan kısmı (servis ihmali vb.) genellikle tazminata dahil edilmez.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8">İkame Araç Hakkının Şartları</h2>
                    <ul>
                        <li>Kazada <strong>karşı tarafın kusurlu</strong> olması (kendi kusurunuz oranında indirim yapılır).</li>
                        <li>Aracın fiilen kullanılamaz/onarımda olması.</li>
                        <li>Onarım süresinin makul ve belgelenebilir olması (servis kaydı, ekspertiz).</li>
                        <li>Talebin <strong>2 yıllık</strong> zamanaşımı süresi içinde yapılması (KTK m.109).</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8">Değer Kaybı ile İkame Araç Bedeli Farkı</h2>
                    <p>
                        Bunlar ayrı tazminat kalemleridir ve birlikte talep edilebilir. <strong>Değer kaybı</strong>, hasar onarılsa bile aracın
                        ikinci el piyasa değerindeki kalıcı düşüştür. <strong>İkame araç bedeli</strong> ise aracın kullanılamadığı dönemdeki geçici kullanım kaybıdır.
                        Değer kaybının ayrıntılı ve güncel (2026 Baz Katsayı %19) hesabı için ayrı aracımızı kullanabilirsiniz:
                        {' '}<Link to="/hesaplama-araclari/arac-deger-kaybi" className="text-sky-600 underline">Araç Değer Kaybı Hesaplama</Link>.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8">Hangi Kanunlara Dayanır?</h2>
                    <p>
                        Maddi zararın tazmini <strong>TBK m.49 ve m.50</strong> (haksız fiil), zorunlu trafik sigortasının sorumluluğu
                        <strong> 2918 sayılı KTK m.85</strong> kapsamındadır. Sigortacıya karşı taleplerde <strong>KTK m.109</strong> uyarınca
                        2 yıllık özel zamanaşımı uygulanır. Uyuşmazlıkta <strong>Sigorta Tahkim Komisyonu</strong>'na başvuru hızlı bir çözüm yoludur.
                    </p>

                    <div className="not-prose bg-amber-50 border-l-4 border-amber-500 p-4 rounded mt-6">
                        <p className="text-sm text-amber-800">
                            <strong>Önemli:</strong> Bu araç bilgilendirme amaçlıdır. Kesin tutar, makul onarım süresi ve emsal kira bedelini belirleyen
                            ekspertiz/bilirkişi raporu ile ortaya çıkar.
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
                            <Link to="/hesaplama-araclari/arac-deger-kaybi" className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-amber-400 transition text-sm font-medium text-slate-700">
                                Araç Değer Kaybı Hesaplama →
                            </Link>
                        </li>
                        <li>
                            <Link to="/hesaplama-araclari/trafik-kazasi-tazminati" className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-amber-400 transition text-sm font-medium text-slate-700">
                                Trafik Kazası Maluliyet Tazminatı Hesaplama →
                            </Link>
                        </li>
                        <li>
                            <Link to="/makale/arac-mahrumiyet-bedeli-ikame-arac-hakki" className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-amber-400 transition text-sm font-medium text-slate-700">
                                Araç Mahrumiyet Bedeli ve İkame Araç Hakkı Rehberi →
                            </Link>
                        </li>
                        <li>
                            <Link to="/makale/arac-mahrumiyet-tazminati-hesaplama-sartlari-2026" className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-amber-400 transition text-sm font-medium text-slate-700">
                                Araç Mahrumiyet Tazminatı: Hesaplama ve Şartlar →
                            </Link>
                        </li>
                    </ul>
                </article>
            </div>

            <HesaplamaDisclaimer
                aracAdi="ikame araç ve araç hasar tazminatı hesaplama aracı"
                mevzuat="2918 sayılı Karayolları Trafik Kanunu m.85 ve m.109, 6098 sayılı Türk Borçlar Kanunu m.49 ve m.50, KMAZMSS Genel Şartları"
                ekNotlar={[
                    'İkame araç (mahrumiyet) bedeli, makul onarım süresi ve emsal kira bedeline göre belirlenir; nihai süre ekspertiz raporuyla saptanır.',
                    'Değer kaybı tutarı bu araçta yaklaşıktır; ayrıntılı 2026 hesap için Araç Değer Kaybı aracını kullanınız.',
                    'KTK m.109 uyarınca sigortacıya karşı taleplerde 2 yıllık özel zamanaşımı uygulanır.',
                ]}
            />
        </div>
    );
};

// FAQ — prerender.js'teki FAQPage şeması ile birebir eşleşmelidir
export const FAQ_ITEMS = [
    {
        q: 'İkame araç (mahrumiyet) bedeli nasıl hesaplanır?',
        a: 'İkame araç bedeli; aracın fiilen kullanılamadığı makul onarım süresi (gün) ile aynı segment aracın günlük emsal kira bedelinin çarpımıyla hesaplanır. Elde edilen tutardan mağdurun kusuru oranında indirim yapılır. Onarımın makul süreyi aşan kısmı tazminata dahil edilmez.'
    },
    {
        q: 'İkame araç için fiilen kiralık araç tutmam şart mı?',
        a: 'Hayır. Yargıtay 17. Hukuk Dairesi yerleşik içtihatlarına göre, mağdur fiilen kiralık araç tutmasa dahi aracından mahrum kaldığı makul süre için emsal kira bedeli üzerinden mahrumiyet tazminatı talep edebilir. Fatura ibrazı zorunlu değildir.'
    },
    {
        q: 'Mahrumiyet bedelini sigorta mı öder?',
        a: 'Karşı tarafın zorunlu trafik sigortası (ZMSS), kusuru oranında maddi zararları teminat limiti dahilinde öder (KTK m.85). Standart kasko kural olarak mahrumiyet bedelini ve değer kaybını ödemez; bu kalemler kusurlu sürücüden veya onun trafik sigortasından talep edilir.'
    },
    {
        q: 'İkame araç bedeli ile araç değer kaybı aynı şey mi?',
        a: 'Hayır, ayrı kalemlerdir ve birlikte talep edilebilir. İkame araç bedeli, aracın onarımda olduğu dönemdeki geçici kullanım kaybıdır. Değer kaybı ise hasar onarılsa bile aracın ikinci el piyasa değerindeki kalıcı düşüştür. Değer kaybının ayrıntılı hesabı için ayrı aracımızı kullanabilirsiniz.'
    },
    {
        q: 'Onarım süresi tartışmalıysa ne olur?',
        a: 'Makul onarım süresi; servis kayıtları, parça temin süreleri ve ekspertiz/bilirkişi değerlendirmesiyle belirlenir. Servisin ihmalinden kaynaklanan gecikmeler genellikle kusurlu tarafa yüklenmez. Uyuşmazlıkta Sigorta Tahkim Komisyonu veya mahkeme bilirkişisi süreyi takdir eder.'
    },
    {
        q: 'Mahrumiyet bedeli talebinin zamanaşımı ne kadar?',
        a: 'Sigortacıya karşı taleplerde KTK m.109 uyarınca 2 yıllık özel zamanaşımı uygulanır. Kusurlu sürücüye karşı açılacak haksız fiil davasında TBK m.72 gereği zararın ve failin öğrenilmesinden itibaren 2 yıl, her hâlde 10 yıllık süre geçerlidir.'
    }
];

export default AracHasarIkamePage;
