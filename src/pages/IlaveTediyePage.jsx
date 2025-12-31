import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
    FaCalculator, 
    FaMoneyBillWave, 
    FaInfoCircle, 
    FaChevronLeft, 
    FaFileInvoiceDollar,
    FaBuilding,
    FaHardHat,
    FaCalendarAlt,
    FaPercent
} from 'react-icons/fa';
import { 
    hesaplaIlaveTediye, 
    hesaplaTumTaksitler, 
    formatTutar,
    ILAVE_TEDIYE_CONSTANTS 
} from '../utils/ilaveTediye';

const InfoCard = ({ title, children }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
            <FaInfoCircle className="text-blue-600 mt-1 flex-shrink-0" />
            <div>
                <h4 className="font-semibold text-blue-900 mb-2">{title}</h4>
                <div className="text-sm text-blue-800">{children}</div>
            </div>
        </div>
    </div>
);

const ResultCard = ({ title, amount, icon: Icon, color = "blue" }) => (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-xl p-6`}>
        <div className="flex items-center gap-3 mb-2">
            <Icon className={`text-${color}-600 text-xl`} />
            <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <p className={`text-3xl font-bold text-${color}-700`}>
            {formatTutar(amount)} TL
        </p>
    </div>
);

const DeductionRow = ({ label, amount, isTotal = false }) => (
    <div className={`flex justify-between items-center py-2 ${isTotal ? 'border-t-2 border-gray-300 pt-3 mt-2' : 'border-b border-gray-100'}`}>
        <span className={`${isTotal ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{label}</span>
        <span className={`${isTotal ? 'font-bold text-lg text-red-600' : 'text-gray-800'}`}>
            {isTotal ? '' : '-'}{formatTutar(amount)} TL
        </span>
    </div>
);

const IlaveTediyePage = () => {
    // Form State
    const [formData, setFormData] = useState({
        aylikBrutUcret: ILAVE_TEDIYE_CONSTANTS.BRUT_ASGARI_UCRET.toString(),
        hesaplamaTuru: 'tek', // tek, yillik
        gunSayisi: '13',
        vergiOrani: '0.15',
        madenIscisi: false,
        kistelyevm: false,
        fiiliCalismaGun: ''
    });

    const [sonuc, setSonuc] = useState(null);
    const [hata, setHata] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleHesapla = () => {
        setHata('');
        setSonuc(null);

        // Türkçe format desteği: noktaları kaldır, virgülü noktaya çevir
        const temizDeger = formData.aylikBrutUcret.toString().replace(/\./g, '').replace(',', '.');
        const aylikBrutUcret = parseFloat(temizDeger);
        
        if (!aylikBrutUcret || aylikBrutUcret <= 0 || isNaN(aylikBrutUcret)) {
            setHata('Lütfen geçerli bir brüt ücret giriniz.');
            return;
        }

        if (aylikBrutUcret < ILAVE_TEDIYE_CONSTANTS.BRUT_ASGARI_UCRET) {
            setHata(`Brüt ücret asgari ücretten (${formatTutar(ILAVE_TEDIYE_CONSTANTS.BRUT_ASGARI_UCRET)} TL) düşük olamaz.`);
            return;
        }

        const vergiOrani = parseFloat(formData.vergiOrani);
        const fiiliCalismaGun = formData.kistelyevm ? parseInt(formData.fiiliCalismaGun) : null;

        if (formData.hesaplamaTuru === 'yillik') {
            // Yıllık tüm taksitler
            const sonuclar = hesaplaTumTaksitler(aylikBrutUcret, vergiOrani, formData.madenIscisi);
            setSonuc({
                tur: 'yillik',
                ...sonuclar
            });
        } else {
            // Tek taksit hesaplama
            const gunSayisi = parseInt(formData.gunSayisi);
            const hesaplama = hesaplaIlaveTediye({
                aylikBrutUcret,
                gunSayisi,
                vergiOrani,
                madenIscisi: formData.madenIscisi,
                fiiliCalismaGun
            });

            if (hesaplama.hata) {
                setHata(hesaplama.mesaj);
                return;
            }

            setSonuc({
                tur: 'tek',
                ...hesaplama
            });
        }
    };

    const handleTemizle = () => {
        setFormData({
            aylikBrutUcret: ILAVE_TEDIYE_CONSTANTS.BRUT_ASGARI_UCRET.toString(),
            hesaplamaTuru: 'tek',
            gunSayisi: '13',
            vergiOrani: '0.15',
            madenIscisi: false,
            kistelyevm: false,
            fiiliCalismaGun: ''
        });
        setSonuc(null);
        setHata('');
    };

    return (
        <>
            <Helmet>
                <title>İlave Tediye Hesaplama 2026 | 6772 Sayılı Kanun | Koptay Hukuk</title>
                <meta name="description" content="6772 sayılı kanun kapsamında kamu işçileri için ilave tediye hesaplama aracı. 2026 güncel parametreleriyle brüt-net tediye hesaplayın." />
                <meta name="keywords" content="ilave tediye, tediye hesaplama, kamu işçisi, 6772 sayılı kanun, ikramiye hesaplama, belediye işçisi" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link 
                            to="/hesaplama-araclari" 
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                        >
                            <FaChevronLeft className="mr-2" />
                            Hesaplama Araçlarına Dön
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            İlave Tediye Hesaplama
                        </h1>
                        <p className="text-gray-600">
                            6772 Sayılı Kanun Kapsamında Kamu İşçileri İçin İlave Tediye Hesaplama
                        </p>
                    </div>

                    {/* Info Card */}
                    <InfoCard title="İlave Tediye Nedir?">
                        <p className="mb-2">
                            İlave tediye, 6772 sayılı Kanun kapsamında kamu kurum ve kuruluşlarında çalışan işçilere 
                            yılda <strong>52 gün</strong> (4 taksit x 13 gün) olarak ödenen yasal bir haktır.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Hesaplama <strong>çıplak brüt ücret</strong> üzerinden yapılır</li>
                            <li>Sosyal yardımlar (yemek, yol, yakacak vb.) hesaplamaya dahil edilmez</li>
                            <li>Maden işçileri için yıllık ek 26 gün tediye hakkı vardır</li>
                        </ul>
                    </InfoCard>

                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <FaFileInvoiceDollar className="text-white text-2xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">2026 Yılı Hesaplama</h2>
                                    <p className="text-blue-100 text-sm">
                                        Asgari Ücret: {formatTutar(ILAVE_TEDIYE_CONSTANTS.BRUT_ASGARI_UCRET)} TL (Brüt)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="p-6">
                            {/* Hata Mesajı */}
                            {hata && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                                    <FaInfoCircle />
                                    <span>{hata}</span>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Brüt Ücret */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaMoneyBillWave className="inline mr-2 text-green-600" />
                                        Aylık Brüt Çıplak Ücret (TL)
                                    </label>
                                    <input
                                        type="number"
                                        name="aylikBrutUcret"
                                        value={formData.aylikBrutUcret}
                                        onChange={handleInputChange}
                                        placeholder={`Min: ${formatTutar(ILAVE_TEDIYE_CONSTANTS.BRUT_ASGARI_UCRET)}`}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Sosyal yardımlar hariç temel brüt ücret
                                    </p>
                                </div>

                                {/* Hesaplama Türü */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaCalculator className="inline mr-2 text-blue-600" />
                                        Hesaplama Türü
                                    </label>
                                    <select
                                        name="hesaplamaTuru"
                                        value={formData.hesaplamaTuru}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="tek">Tek Dönem Hesaplama</option>
                                        <option value="yillik">Yıllık Tüm Taksitler</option>
                                    </select>
                                </div>

                                {/* Gün Sayısı - Sadece Tek Dönem için */}
                                {formData.hesaplamaTuru === 'tek' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FaCalendarAlt className="inline mr-2 text-orange-600" />
                                            Tediye Gün Sayısı
                                        </label>
                                        <select
                                            name="gunSayisi"
                                            value={formData.gunSayisi}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="13">13 Gün (1 Taksit)</option>
                                            <option value="26">26 Gün (2 Taksit)</option>
                                            <option value="39">39 Gün (3 Taksit)</option>
                                            <option value="52">52 Gün (Yıllık Toplam)</option>
                                        </select>
                                    </div>
                                )}

                                {/* Vergi Dilimi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPercent className="inline mr-2 text-red-600" />
                                        Gelir Vergisi Dilimi
                                    </label>
                                    <select
                                        name="vergiOrani"
                                        value={formData.vergiOrani}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="0.15">%15 (0 - 158.000 TL)</option>
                                        <option value="0.20">%20 (158.001 - 330.000 TL)</option>
                                        <option value="0.27">%27 (330.001 - 1.200.000 TL)</option>
                                        <option value="0.35">%35 (1.200.001 - 4.300.000 TL)</option>
                                        <option value="0.40">%40 (4.300.001 TL ve üzeri)</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Kümülatif matrahınıza göre seçin
                                    </p>
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="mt-6 space-y-4">
                                {/* Maden İşçisi */}
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="madenIscisi"
                                        checked={formData.madenIscisi}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <FaHardHat className="text-yellow-600" />
                                    <span className="text-gray-700">Maden/Yer Altı İşçisiyim (Ek 26 Gün Hakkı)</span>
                                </label>

                                {/* Kıstelyevm */}
                                {formData.hesaplamaTuru === 'tek' && (
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="kistelyevm"
                                            checked={formData.kistelyevm}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <FaCalendarAlt className="text-purple-600" />
                                        <span className="text-gray-700">Kıstelyevm (Orantılı) Hesaplama Yap</span>
                                    </label>
                                )}

                                {/* Kıstelyevm Gün Girişi */}
                                {formData.kistelyevm && formData.hesaplamaTuru === 'tek' && (
                                    <div className="ml-8">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Yıl İçinde Fiili Çalışılan Gün Sayısı
                                        </label>
                                        <input
                                            type="number"
                                            name="fiiliCalismaGun"
                                            value={formData.fiiliCalismaGun}
                                            onChange={handleInputChange}
                                            placeholder="Örn: 180"
                                            min="1"
                                            max="365"
                                            className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleHesapla}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <FaCalculator />
                                    Hesapla
                                </button>
                                <button
                                    onClick={handleTemizle}
                                    className="sm:w-auto px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Temizle
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sonuçlar */}
                    {sonuc && (
                        <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
                                <h3 className="text-xl font-bold text-white">Hesaplama Sonuçları</h3>
                            </div>
                            
                            <div className="p-6">
                                {sonuc.tur === 'tek' ? (
                                    // Tek Dönem Sonuçları
                                    <>
                                        {/* Özet Kartlar */}
                                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <FaMoneyBillWave className="text-blue-600 text-xl" />
                                                    <h3 className="font-semibold text-gray-800">Brüt Tediye</h3>
                                                </div>
                                                <p className="text-3xl font-bold text-blue-700">
                                                    {formatTutar(sonuc.hesaplamalar.brutTediye)} TL
                                                </p>
                                            </div>
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <FaPercent className="text-red-600 text-xl" />
                                                    <h3 className="font-semibold text-gray-800">Toplam Kesinti</h3>
                                                </div>
                                                <p className="text-3xl font-bold text-red-700">
                                                    {formatTutar(sonuc.hesaplamalar.toplamKesinti)} TL
                                                </p>
                                            </div>
                                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <FaFileInvoiceDollar className="text-green-600 text-xl" />
                                                    <h3 className="font-semibold text-gray-800">Net Tediye</h3>
                                                </div>
                                                <p className="text-3xl font-bold text-green-700">
                                                    {formatTutar(sonuc.hesaplamalar.netTediye)} TL
                                                </p>
                                            </div>
                                        </div>

                                        {/* Detaylı Döküm */}
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="font-semibold text-gray-800 mb-4">Detaylı Hesap Dökümü</h4>
                                            
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                                    <span className="text-gray-600">Günlük Brüt Ücret</span>
                                                    <span className="text-gray-800 font-medium">
                                                        {formatTutar(sonuc.hesaplamalar.gunlukBrutUcret)} TL
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                                    <span className="text-gray-600">Tediye Gün Sayısı</span>
                                                    <span className="text-gray-800 font-medium">
                                                        {sonuc.girisVerileri.gunSayisi.toFixed(2)} Gün
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-gray-200 bg-blue-50 -mx-6 px-6">
                                                    <span className="text-blue-800 font-medium">Brüt Tediye Tutarı</span>
                                                    <span className="text-blue-800 font-bold">
                                                        {formatTutar(sonuc.hesaplamalar.brutTediye)} TL
                                                    </span>
                                                </div>
                                                
                                                <div className="pt-4">
                                                    <h5 className="font-medium text-gray-700 mb-2">Kesintiler:</h5>
                                                    <DeductionRow label="SGK İşçi Payı (%14)" amount={sonuc.hesaplamalar.sgkIsciPayi} />
                                                    <DeductionRow label="İşsizlik Sigortası (%1)" amount={sonuc.hesaplamalar.issizlikSigortasi} />
                                                    <DeductionRow label={`Gelir Vergisi (${sonuc.girisVerileri.vergiDilimi})`} amount={sonuc.hesaplamalar.gelirVergisi} />
                                                    <DeductionRow label="Damga Vergisi (‰7,59)" amount={sonuc.hesaplamalar.damgaVergisi} />
                                                    <DeductionRow label="Toplam Kesinti" amount={sonuc.hesaplamalar.toplamKesinti} isTotal />
                                                </div>

                                                <div className="flex justify-between items-center py-4 mt-4 bg-green-100 -mx-6 px-6 rounded-b-xl">
                                                    <span className="text-green-800 font-bold text-lg">Net Ele Geçecek Tutar</span>
                                                    <span className="text-green-800 font-bold text-2xl">
                                                        {formatTutar(sonuc.hesaplamalar.netTediye)} TL
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {sonuc.girisVerileri.kistelyevmUygulandı && (
                                            <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                                                <p className="text-purple-800 text-sm">
                                                    <strong>Kıstelyevm Uygulandı:</strong> {sonuc.girisVerileri.fiiliCalismaGun} günlük çalışma süresine göre orantılı hesaplama yapıldı.
                                                </p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    // Yıllık Taksit Sonuçları
                                    <>
                                        {/* Yıllık Toplam */}
                                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                                <h3 className="font-semibold text-gray-800 mb-2">Yıllık Brüt Toplam</h3>
                                                <p className="text-3xl font-bold text-blue-700">
                                                    {formatTutar(sonuc.yillikToplam.brutTutar)} TL
                                                </p>
                                            </div>
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                                <h3 className="font-semibold text-gray-800 mb-2">Yıllık Toplam Kesinti</h3>
                                                <p className="text-3xl font-bold text-red-700">
                                                    {formatTutar(sonuc.yillikToplam.kesintilerToplami)} TL
                                                </p>
                                            </div>
                                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                                <h3 className="font-semibold text-gray-800 mb-2">Yıllık Net Toplam</h3>
                                                <p className="text-3xl font-bold text-green-700">
                                                    {formatTutar(sonuc.yillikToplam.netTutar)} TL
                                                </p>
                                            </div>
                                        </div>

                                        {/* Taksit Tablosu */}
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Taksit</th>
                                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Brüt</th>
                                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">SGK</th>
                                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">İşsizlik</th>
                                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">G.Vergisi</th>
                                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">D.Vergisi</th>
                                                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Net</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sonuc.taksitler.map((taksit, index) => (
                                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                            <td className="px-4 py-3 font-medium text-gray-800">{taksit.taksitAdi}</td>
                                                            <td className="px-4 py-3 text-right">{formatTutar(taksit.brutTediye)}</td>
                                                            <td className="px-4 py-3 text-right text-red-600">-{formatTutar(taksit.sgkIsciPayi)}</td>
                                                            <td className="px-4 py-3 text-right text-red-600">-{formatTutar(taksit.issizlikSigortasi)}</td>
                                                            <td className="px-4 py-3 text-right text-red-600">-{formatTutar(taksit.gelirVergisi)}</td>
                                                            <td className="px-4 py-3 text-right text-red-600">-{formatTutar(taksit.damgaVergisi)}</td>
                                                            <td className="px-4 py-3 text-right font-bold text-green-600">{formatTutar(taksit.netTediye)}</td>
                                                        </tr>
                                                    ))}
                                                    {sonuc.madenEkTediye && (
                                                        <tr className="border-b border-gray-100 bg-yellow-50">
                                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                                <FaHardHat className="inline mr-2 text-yellow-600" />
                                                                {sonuc.madenEkTediye.taksitAdi}
                                                            </td>
                                                            <td className="px-4 py-3 text-right">{formatTutar(sonuc.madenEkTediye.brutTediye)}</td>
                                                            <td className="px-4 py-3 text-right text-red-600">-{formatTutar(sonuc.madenEkTediye.sgkIsciPayi)}</td>
                                                            <td className="px-4 py-3 text-right text-red-600">-{formatTutar(sonuc.madenEkTediye.issizlikSigortasi)}</td>
                                                            <td className="px-4 py-3 text-right text-red-600">-{formatTutar(sonuc.madenEkTediye.gelirVergisi)}</td>
                                                            <td className="px-4 py-3 text-right text-red-600">-{formatTutar(sonuc.madenEkTediye.damgaVergisi)}</td>
                                                            <td className="px-4 py-3 text-right font-bold text-green-600">{formatTutar(sonuc.madenEkTediye.netTediye)}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                                <tfoot className="bg-gray-100">
                                                    <tr className="font-bold">
                                                        <td className="px-4 py-3">YILLIK TOPLAM</td>
                                                        <td className="px-4 py-3 text-right text-blue-700">{formatTutar(sonuc.yillikToplam.brutTutar)}</td>
                                                        <td colSpan="4" className="px-4 py-3 text-right text-red-700">-{formatTutar(sonuc.yillikToplam.kesintilerToplami)}</td>
                                                        <td className="px-4 py-3 text-right text-green-700">{formatTutar(sonuc.yillikToplam.netTutar)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Yasal Uyarı */}
                    <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                            <FaInfoCircle />
                            Önemli Bilgiler
                        </h4>
                        <ul className="text-sm text-amber-800 space-y-2">
                            <li>• Bu hesaplama aracı bilgilendirme amaçlıdır ve kesin sonuç garantisi vermez.</li>
                            <li>• Hesaplamalar 2026 yılı bordro parametreleri ile yapılmaktadır.</li>
                            <li>• Gerçek tediye tutarı, işvereninizin bordro hesaplamalarına göre farklılık gösterebilir.</li>
                            <li>• Vergi dilimi seçimi, kümülatif matrahınıza göre yapılmalıdır.</li>
                            <li>• İlave tediye alacağı 5 yıllık zamanaşımına tabidir.</li>
                            <li>• Detaylı bilgi için bir iş hukuku uzmanına danışmanızı öneririz.</li>
                        </ul>
                    </div>

                    {/* 2026 Parametre Bilgileri */}
                    <div className="mt-6 bg-gray-100 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-800 mb-4">2026 Yılı Hesaplama Parametreleri</h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div className="bg-white rounded-lg p-4">
                                <span className="text-gray-500">Brüt Asgari Ücret</span>
                                <p className="font-semibold text-gray-800">{formatTutar(ILAVE_TEDIYE_CONSTANTS.BRUT_ASGARI_UCRET)} TL</p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <span className="text-gray-500">SGK İşçi Payı</span>
                                <p className="font-semibold text-gray-800">%14</p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <span className="text-gray-500">İşsizlik Sigortası</span>
                                <p className="font-semibold text-gray-800">%1</p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <span className="text-gray-500">Damga Vergisi</span>
                                <p className="font-semibold text-gray-800">‰7,59</p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <span className="text-gray-500">Yıllık Tediye</span>
                                <p className="font-semibold text-gray-800">52 Gün (4 x 13)</p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <span className="text-gray-500">SGK Tavan</span>
                                <p className="font-semibold text-gray-800">{formatTutar(ILAVE_TEDIYE_CONSTANTS.SGK_TAVAN)} TL</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default IlaveTediyePage;
