import { TRH2010 } from './trh2010';

export const ACTIVE_AGE_LIMIT = 60;
export const RETIREMENT_AGE = 60;

/**
 * Calculates the remaining life expectancy based on TRH-2010 table.
 * @param {string} birthDate - YYYY-MM-DD
 * @param {string} gender - 'male' or 'female'
 * @returns {number} Remaining life expectancy in years
 */
export const getRemainingLife = (birthDate, gender) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  // Clamp age to table limits
  if (age < 0) age = 0;
  if (age > 100) age = 100;

  return TRH2010[gender][age] || 0;
};

/**
 * Applies Balthazard formula for multiple disability rates.
 * @param {number[]} rates - Array of disability rates (0-100)
 * @returns {number} Combined disability rate
 */
export const calculateBalthazard = (rates) => {
  if (!rates || rates.length === 0) return 0;
  if (rates.length === 1) return rates[0];

  // Sort rates in descending order
  const sortedRates = [...rates].sort((a, b) => b - a);
  
  let remainingCapacity = 100;
  let totalLoss = 0;

  for (const rate of sortedRates) {
    const loss = (remainingCapacity * rate) / 100;
    totalLoss += loss;
    remainingCapacity -= loss;
  }

  return totalLoss;
};

/**
 * Calculates the compensation.
 * @param {Object} data - Input data
 * @returns {Object} Calculation results
 */
export const calculateCompensation = (data) => {
  const {
    birthDate,
    gender,
    incidentDate, // Olay/Tanı Tarihi
    jobLeaveDate, // İşten Ayrılış Tarihi (for warning only)
    pastSalary, // Geçmiş Dönem Aylık Net Maaş
    futureSalary, // Gelecek Aktif Dönem Aylık Net Maaş (Son Net Maaş)
    minimumWage, // Asgari Ücret (Net, AGİ hariç)
    disabilityRates, // Array of numbers
    workerFaultRate, // İşçi Kusur Oranı
    employerFaultRate, // İşveren Kusur Oranı
    thirdPartyFaultRate, // 3. Kişi Kusur Oranı
    sgkPsd, // SGK Peşin Sermaye Değeri
    isSgkConnected // SGK Gelir Bağladı mı?
  } = data;

  const today = new Date();
  const incident = new Date(incidentDate);
  const birth = new Date(birthDate);
  
  // 1. Bakiye Ömür Tespiti
  const remainingLife = getRemainingLife(birthDate, gender);
  const currentAge = today.getFullYear() - birth.getFullYear(); // Approximate for logic
  const deathDate = new Date(today);
  deathDate.setFullYear(today.getFullYear() + Math.floor(remainingLife));
  // Add remaining months roughly
  const remainingMonths = (remainingLife - Math.floor(remainingLife)) * 12;
  deathDate.setMonth(deathDate.getMonth() + remainingMonths);

  const age60Date = new Date(birth);
  age60Date.setFullYear(birth.getFullYear() + ACTIVE_AGE_LIMIT);

  // 2. Dönemlere Ayırma
  
  // Past Period: Incident Date to Today
  const pastDurationMs = today - incident;
  const pastDurationYears = Math.max(0, pastDurationMs / (1000 * 60 * 60 * 24 * 365.25));

  // Future Active Period: Today to Age 60
  let futureActiveDurationYears = 0;
  if (today < age60Date) {
    const durationMs = age60Date - today;
    futureActiveDurationYears = Math.max(0, durationMs / (1000 * 60 * 60 * 24 * 365.25));
  }

  // Future Passive Period: Age 60 to Death
  let futurePassiveDurationYears = 0;
  if (deathDate > age60Date) {
    const startPassive = today > age60Date ? today : age60Date;
    const durationMs = deathDate - startPassive;
    futurePassiveDurationYears = Math.max(0, durationMs / (1000 * 60 * 60 * 24 * 365.25));
  }

  // 3. Ham Tazminat Hesabı
  const disabilityRate = calculateBalthazard(disabilityRates) / 100;

  // Progressive Rent Note: 10% increase and 10% discount cancels out to factor 1.
  // So we just multiply Annual Earnings * Years.

  const pastEarnings = pastSalary * 12 * pastDurationYears;
  const pastCompensation = pastEarnings * disabilityRate;

  const futureActiveEarnings = futureSalary * 12 * futureActiveDurationYears;
  const futureActiveCompensation = futureActiveEarnings * disabilityRate;

  const futurePassiveEarnings = minimumWage * 12 * futurePassiveDurationYears;
  const futurePassiveCompensation = futurePassiveEarnings * disabilityRate;

  const totalGrossCompensation = pastCompensation + futureActiveCompensation + futurePassiveCompensation;

  // 4. İndirimler
  
  // Kusur İndirimi (Worker Fault)
  const faultDeduction = totalGrossCompensation * (workerFaultRate / 100);
  let netAfterFault = totalGrossCompensation - faultDeduction;

  // SGK PSD Mahsubu
  let psdDeduction = 0;
  if (isSgkConnected && sgkPsd > 0) {
    // Rücu edilebilir kısım: PSD * Employer Fault Rate
    // Note: Some interpretations include 3rd party fault too. The prompt says "sadece işverenin kusuruna isabet eden".
    // We will strictly follow the prompt: PSD * EmployerFaultRate
    psdDeduction = sgkPsd * (employerFaultRate / 100);
  }

  let finalCompensation = netAfterFault - psdDeduction;
  
  // Error Handling: Negative result
  if (finalCompensation < 0) {
    finalCompensation = 0;
  }

  return {
    remainingLife,
    pastDurationYears,
    futureActiveDurationYears,
    futurePassiveDurationYears,
    disabilityRate: disabilityRate * 100,
    totalGrossCompensation,
    faultDeduction,
    psdDeduction,
    finalCompensation,
    breakdown: {
      past: pastCompensation,
      futureActive: futureActiveCompensation,
      futurePassive: futurePassiveCompensation
    }
  };
};
