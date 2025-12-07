import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
            <Helmet>
                <title>İşçilik Alacakları Hesaplama - Kıdem, İhbar, İzin, Mesai | Koptay Hukuk</title>
                <meta name="description" content="Kıdem tazminatı, ihbar tazminatı, yıllık izin ücreti ve fazla mesai alacaklarınızı güncel oranlarla hesaplayın. Ücretsiz işçilik alacakları hesaplama aracı." />
            </Helmet>

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                        İşçilik Alacakları Hesaplama
                    </h1>
                    <p className="text-lg text-gray-600">
                        Kıdem, İhbar, Yıllık İzin ve Fazla Mesai alacaklarınızı kolayca hesaplayın.
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

                <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Bilgilendirme</h2>
                    <div className="prose prose-blue text-gray-600 text-sm">
                        <p>
                            * <strong>Kıdem Tazminatı:</strong> En az 1 yıl çalışmış olmanız gerekmektedir. 2024 yılı için kıdem tazminatı tavanı {CONSTANTS.KIDEM_TAVANI.toLocaleString('tr-TR')} TL'dir.
                        </p>
                        <p>
                            * <strong>İhbar Tazminatı:</strong> İş sözleşmesinin feshinden önce bildirim sürelerine uyulmaması durumunda ödenir.
                        </p>
                        <p>
                            * <strong>Vergiler:</strong> Hesaplamalarda standart yasal kesintiler (Damga Vergisi, Gelir Vergisi, SGK) uygulanmıştır. Kümülatif vergi matrahınıza göre net tutarlar değişiklik gösterebilir.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IscilikAlacaklariPage;
