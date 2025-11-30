import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { calculateCompensation, ACTIVE_AGE_LIMIT } from '../utils/meslekHastaligi';
import { Helmet } from 'react-helmet-async';

const MeslekHastaligiPage = () => {
  const [formData, setFormData] = useState({
    birthDate: '',
    gender: 'male',
    incidentDate: '',
    jobLeaveDate: '',
    pastSalary: '',
    futureSalary: '',
    minimumWage: 17002, // Default 2024 net minimum wage approx
    disabilityRates: [''],
    workerFaultRate: 0,
    employerFaultRate: 100,
    thirdPartyFaultRate: 0,
    isSgkConnected: false,
    sgkPsd: 0
  });

  const [result, setResult] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (formData.incidentDate && formData.jobLeaveDate) {
      const incident = new Date(formData.incidentDate);
      const leave = new Date(formData.jobLeaveDate);
      const diffTime = Math.abs(incident - leave);
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
      
      // Warning if Diagnosis Date (Incident) is more than 10 years after Job Leave Date
      // Usually liability period starts from leave date. If diagnosis is much later, it might be time-barred.
      // Prompt: "Eğer fark > 10 yıl ise ... ekrana Kırmızı Uyarı Kutusu çıkar"
      // Assuming "fark" means Incident Date - Job Leave Date > 10 Years.
      if (incident > leave && diffYears > 10) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }
  }, [formData.incidentDate, formData.jobLeaveDate]);

  useEffect(() => {
    if (result && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            'Elinize Geçecek Net Tutar',
            'Kusur Nedeniyle Kesilen',
            'SGK Tarafından Karşılanan (PSD)'
          ],
          datasets: [{
            data: [
              result.finalCompensation,
              result.faultDeduction,
              result.psdDeduction
            ],
            backgroundColor: [
              '#0d9488', // Teal-600
              '#ef4444', // Red-500
              '#f59e0b'  // Amber-500
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed !== null) {
                    label += new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(context.parsed);
                  }
                  return label;
                }
              }
            }
          }
        }
      });
    }
  }, [result]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRateChange = (index, value) => {
    const newRates = [...formData.disabilityRates];
    newRates[index] = value;
    setFormData(prev => ({ ...prev, disabilityRates: newRates }));
  };

  const addRate = () => {
    setFormData(prev => ({ ...prev, disabilityRates: [...prev.disabilityRates, ''] }));
  };

  const removeRate = (index) => {
    const newRates = formData.disabilityRates.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, disabilityRates: newRates }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    
    // Validation
    const totalFault = parseFloat(formData.workerFaultRate) + parseFloat(formData.employerFaultRate) + parseFloat(formData.thirdPartyFaultRate);
    if (Math.abs(totalFault - 100) > 0.1) {
      alert("Kusur oranları toplamı 100 olmalıdır!");
      return;
    }

    const rates = formData.disabilityRates.map(r => parseFloat(r)).filter(r => !isNaN(r));
    if (rates.some(r => r < 0 || r > 100)) {
      alert("Maluliyet oranları 0-100 arasında olmalıdır.");
      return;
    }

    const calculationData = {
      ...formData,
      pastSalary: parseFloat(formData.pastSalary),
      futureSalary: parseFloat(formData.futureSalary),
      minimumWage: parseFloat(formData.minimumWage),
      disabilityRates: rates,
      workerFaultRate: parseFloat(formData.workerFaultRate),
      employerFaultRate: parseFloat(formData.employerFaultRate),
      thirdPartyFaultRate: parseFloat(formData.thirdPartyFaultRate),
      sgkPsd: parseFloat(formData.sgkPsd)
    };

    const res = calculateCompensation(calculationData);
    setResult(res);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <Helmet>
        <title>Meslek Hastalığı Tazminat Hesaplama | Koptay Hukuk</title>
        <meta name="description" content="Meslek hastalığı tazminat hesaplama aracı. TRH-2010 yaşam tablosu ve Yargıtay içtihatlarına uygun hesaplama." />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Meslek Hastalığı Tazminat Hesaplama Aracı
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Yargıtay içtihatlarına ve TRH-2010 yaşam tablosuna uygun, aktüeryal hesaplama yapan dijital bilirkişi.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          <div className="p-8">
            <form onSubmit={handleCalculate} className="space-y-8">
              
              {/* Kişisel Bilgiler */}
              <section>
                <h2 className="text-xl font-semibold text-teal-700 mb-4 border-b border-teal-100 pb-2">
                  1. Kişisel Bilgiler ve Tarihler
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Doğum Tarihi</label>
                    <input type="date" name="birthDate" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cinsiyet</label>
                    <select name="gender" className="w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" onChange={handleInputChange}>
                      <option value="male">Erkek</option>
                      <option value="female">Kadın</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tanı / Olay Tarihi</label>
                    <input type="date" name="incidentDate" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">İşten Ayrılış Tarihi</label>
                    <input type="date" name="jobLeaveDate" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" onChange={handleInputChange} />
                  </div>
                </div>
                
                {showWarning && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md">
                    <p className="font-bold">Dikkat: Yükümlülük süresi aşılmıştır.</p>
                    <p className="text-sm">Tazminat hakkınız için Yüksek Sağlık Kurulu onayı gerekebilir. (İşten ayrılış ile tanı tarihi arasında 10 yıldan fazla süre var.)</p>
                  </div>
                )}
              </section>

              {/* Maaş Bilgileri */}
              <section>
                <h2 className="text-xl font-semibold text-teal-700 mb-4 border-b border-teal-100 pb-2">
                  2. Kazanç Bilgileri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Geçmiş Dönem Aylık Net Maaş</label>
                    <div className="relative rounded-md shadow-sm">
                      <input type="number" name="pastSalary" required min="0" className="w-full rounded-md border-slate-300 pl-3 pr-12 focus:border-teal-500 focus:ring-teal-500" placeholder="0.00" onChange={handleInputChange} />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">TL</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Olay tarihinden bugüne kadar olan dönem için.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Son Net Maaş (Aktif Dönem)</label>
                    <div className="relative rounded-md shadow-sm">
                      <input type="number" name="futureSalary" required min="0" className="w-full rounded-md border-slate-300 pl-3 pr-12 focus:border-teal-500 focus:ring-teal-500" placeholder="0.00" onChange={handleInputChange} />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">TL</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Bugünden 60 yaşına kadar olan dönem için.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Asgari Ücret (Pasif Dönem)</label>
                    <div className="relative rounded-md shadow-sm">
                      <input type="number" name="minimumWage" required min="0" value={formData.minimumWage} className="w-full rounded-md border-slate-300 pl-3 pr-12 focus:border-teal-500 focus:ring-teal-500" onChange={handleInputChange} />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">TL</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">60 yaşından ölüme kadar olan dönem için.</p>
                  </div>
                </div>
              </section>

              {/* Maluliyet ve Kusur */}
              <section>
                <h2 className="text-xl font-semibold text-teal-700 mb-4 border-b border-teal-100 pb-2">
                  3. Maluliyet ve Kusur Oranları
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Maluliyet Oranları (%)</label>
                  {formData.disabilityRates.map((rate, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={rate} 
                        onChange={(e) => handleRateChange(index, e.target.value)}
                        className="w-32 rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" 
                        placeholder="%" 
                        required
                      />
                      {formData.disabilityRates.length > 1 && (
                        <button type="button" onClick={() => removeRate(index)} className="text-red-600 hover:text-red-800 text-sm">Sil</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addRate} className="text-sm text-teal-600 hover:text-teal-800 font-medium">+ Başka Oran Ekle (Balthazard)</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">İşçi Kusur Oranı (%)</label>
                    <input type="number" name="workerFaultRate" min="0" max="100" value={formData.workerFaultRate} onChange={handleInputChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">İşveren Kusur Oranı (%)</label>
                    <input type="number" name="employerFaultRate" min="0" max="100" value={formData.employerFaultRate} onChange={handleInputChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">3. Kişi Kusur Oranı (%)</label>
                    <input type="number" name="thirdPartyFaultRate" min="0" max="100" value={formData.thirdPartyFaultRate} onChange={handleInputChange} className="w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Not: Kusur oranları toplamı 100 olmalıdır.</p>
              </section>

              {/* SGK Bilgileri */}
              <section>
                <h2 className="text-xl font-semibold text-teal-700 mb-4 border-b border-teal-100 pb-2">
                  4. SGK Ödemeleri
                </h2>
                <div className="flex items-center mb-4">
                  <input type="checkbox" id="isSgkConnected" name="isSgkConnected" checked={formData.isSgkConnected} onChange={handleInputChange} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded" />
                  <label htmlFor="isSgkConnected" className="ml-2 block text-sm text-slate-900">
                    SGK Sürekli İş Göremezlik Geliri Bağladı mı?
                  </label>
                </div>
                
                {formData.isSgkConnected && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">İlk Peşin Sermaye Değeri (PSD)</label>
                    <div className="relative rounded-md shadow-sm max-w-xs">
                      <input type="number" name="sgkPsd" min="0" value={formData.sgkPsd} onChange={handleInputChange} className="w-full rounded-md border-slate-300 pl-3 pr-12 focus:border-teal-500 focus:ring-teal-500" />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-slate-500 sm:text-sm">TL</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Sadece işverenin kusuruna isabet eden kısım (Rücu edilebilir) düşülecektir.</p>
                  </div>
                )}
              </section>

              <div className="pt-6">
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200">
                  HESAPLA
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sonuç Ekranı */}
        {result && (
          <div className="mt-10 bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200 animate-fade-in-up">
            <div className="bg-teal-700 px-8 py-4">
              <h2 className="text-2xl font-bold text-white">Hesaplama Sonucu</h2>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Sol Kolon: Detaylar */}
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h3 className="font-semibold text-slate-800 mb-3">Aktüeryal Veriler</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex justify-between"><span>TRH-2010 Bakiye Ömür:</span> <span className="font-medium text-slate-900">{result.remainingLife.toFixed(2)} Yıl</span></li>
                      <li className="flex justify-between"><span>Geçmiş Dönem Süresi:</span> <span className="font-medium text-slate-900">{result.pastDurationYears.toFixed(2)} Yıl</span></li>
                      <li className="flex justify-between"><span>Gelecek Aktif Dönem:</span> <span className="font-medium text-slate-900">{result.futureActiveDurationYears.toFixed(2)} Yıl</span></li>
                      <li className="flex justify-between"><span>Gelecek Pasif Dönem:</span> <span className="font-medium text-slate-900">{result.futurePassiveDurationYears.toFixed(2)} Yıl</span></li>
                      <li className="flex justify-between"><span>Toplam Maluliyet Oranı:</span> <span className="font-medium text-slate-900">%{result.disabilityRate.toFixed(2)}</span></li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h3 className="font-semibold text-slate-800 mb-3">Tazminat Dökümü</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex justify-between"><span>Ham Tazminat Toplamı:</span> <span className="font-medium text-slate-900">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(result.totalGrossCompensation)}</span></li>
                      <li className="flex justify-between text-red-600"><span>(-) Kusur İndirimi (%{formData.workerFaultRate}):</span> <span>-{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(result.faultDeduction)}</span></li>
                      <li className="flex justify-between text-amber-600"><span>(-) SGK PSD Mahsubu:</span> <span>-{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(result.psdDeduction)}</span></li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-800">NET ÖDENECEK:</span>
                      <span className="text-2xl font-bold text-teal-700">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(result.finalCompensation)}</span>
                    </div>
                  </div>
                  
                  <div className="group relative inline-block">
                    <span className="text-xs text-slate-400 cursor-help border-b border-dotted border-slate-400">Manevi Tazminat Hakkında Bilgi</span>
                    <div className="invisible group-hover:visible absolute z-10 w-64 bg-slate-800 text-white text-xs rounded p-2 bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Bu hesaplama aracı sadece Maddi Tazminat içindir. Manevi tazminat, hakimin takdir yetkisinde olup, olayın özelliği, tarafların sıfatı ve ekonomik durumlarına göre belirlenir, matematiksel olarak hesaplanamaz.
                    </div>
                  </div>
                </div>

                {/* Sağ Kolon: Grafik */}
                <div className="flex flex-col items-center justify-center">
                  <h3 className="font-semibold text-slate-800 mb-4">Tazminat Dağılımı</h3>
                  <div className="w-full max-w-xs">
                    <canvas ref={chartRef}></canvas>
                  </div>
                  <div className="mt-6 text-center text-xs text-slate-500">
                    <p>Grafik, toplam hesaplanan zararın dağılımını göstermektedir.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeslekHastaligiPage;
