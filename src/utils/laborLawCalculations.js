
// Constants (Updated for 2024-2025 period - should be kept up to date)
export const CONSTANTS = {
    KIDEM_TAVANI: 35058.58, // 2024 First Half - needs update for current period
    DAMGA_VERGISI_ORANI: 0.00759,
    GELIR_VERGISI_ORANI: 0.15, // Base rate
    SGK_ISCI_PAYI: 0.14,
    ISSIZLIK_SIGORTASI_ISCI_PAYI: 0.01,
};

/**
 * Calculate Tenure (Service Period)
 * @param {string|Date} startDate 
 * @param {string|Date} endDate 
 * @returns {Object} { years, months, days, totalDays }
 */
export const calculateTenure = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
        months--;
        // Get days in previous month
        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays };
};

/**
 * Calculate Severance Pay (Kıdem Tazminatı)
 * @param {Object} params
 * @param {string|Date} params.startDate
 * @param {string|Date} params.endDate
 * @param {number} params.grossSalary
 * @param {boolean} params.applyCeiling
 * @returns {Object}
 */
export const calculateSeverance = ({ startDate, endDate, grossSalary, applyCeiling = true }) => {
    const tenure = calculateTenure(startDate, endDate);
    
    // Determine base salary (capped if needed)
    let baseSalary = grossSalary;
    if (applyCeiling && grossSalary > CONSTANTS.KIDEM_TAVANI) {
        baseSalary = CONSTANTS.KIDEM_TAVANI;
    }

    // Calculate Gross Severance
    // Formula: (Years + Months/12 + Days/365) * BaseSalary
    const yearFactor = tenure.years + (tenure.months / 12) + (tenure.days / 365);
    const grossAmount = baseSalary * yearFactor;

    // Deductions
    const stampTax = grossAmount * CONSTANTS.DAMGA_VERGISI_ORANI;
    const netAmount = grossAmount - stampTax;

    return {
        tenure,
        baseSalary,
        grossAmount,
        deductions: {
            stampTax
        },
        netAmount
    };
};

/**
 * Calculate Notice Pay (İhbar Tazminatı)
 * @param {Object} params
 * @param {string|Date} params.startDate
 * @param {string|Date} params.endDate
 * @param {number} params.grossSalary
 * @returns {Object}
 */
export const calculateNoticePay = ({ startDate, endDate, grossSalary }) => {
    const tenure = calculateTenure(startDate, endDate);
    const totalMonths = (tenure.years * 12) + tenure.months;

    let noticeWeeks = 0;
    if (totalMonths < 6) noticeWeeks = 2;
    else if (totalMonths < 18) noticeWeeks = 4;
    else if (totalMonths < 36) noticeWeeks = 6;
    else noticeWeeks = 8;

    const dailyWage = grossSalary / 30;
    const grossAmount = dailyWage * (noticeWeeks * 7);

    // Deductions
    const incomeTaxBase = grossAmount; // Simplified, usually cumulative base affects this
    const incomeTax = incomeTaxBase * CONSTANTS.GELIR_VERGISI_ORANI;
    const stampTax = grossAmount * CONSTANTS.DAMGA_VERGISI_ORANI;
    
    const netAmount = grossAmount - (incomeTax + stampTax);

    return {
        noticeWeeks,
        grossAmount,
        deductions: {
            incomeTax,
            stampTax
        },
        netAmount
    };
};

/**
 * Calculate Annual Leave Pay (Yıllık İzin Ücreti)
 * @param {Object} params
 * @param {number} params.unusedDays
 * @param {number} params.grossSalary
 * @returns {Object}
 */
export const calculateAnnualLeave = ({ unusedDays, grossSalary }) => {
    const dailyWage = grossSalary / 30;
    const grossAmount = dailyWage * unusedDays;

    // Deductions
    const sgkBase = grossAmount;
    const sgkWorker = sgkBase * CONSTANTS.SGK_ISCI_PAYI;
    const unemploymentWorker = sgkBase * CONSTANTS.ISSIZLIK_SIGORTASI_ISCI_PAYI;
    
    const incomeTaxBase = grossAmount - (sgkWorker + unemploymentWorker);
    const incomeTax = incomeTaxBase * CONSTANTS.GELIR_VERGISI_ORANI;
    const stampTax = grossAmount * CONSTANTS.DAMGA_VERGISI_ORANI;

    const totalDeductions = sgkWorker + unemploymentWorker + incomeTax + stampTax;
    const netAmount = grossAmount - totalDeductions;

    return {
        grossAmount,
        deductions: {
            sgkWorker,
            unemploymentWorker,
            incomeTax,
            stampTax
        },
        netAmount
    };
};

/**
 * Calculate Overtime Pay (Fazla Mesai)
 * @param {Object} params
 * @param {number} params.grossSalary
 * @param {number} params.hours
 * @param {number} params.rate (1.5 for normal, 2.0 for holiday)
 * @returns {Object}
 */
export const calculateOvertime = ({ grossSalary, hours, rate = 1.5 }) => {
    const hourlyWage = grossSalary / 225;
    const grossAmount = hourlyWage * rate * hours;

    // Deductions
    const sgkBase = grossAmount;
    const sgkWorker = sgkBase * CONSTANTS.SGK_ISCI_PAYI;
    const unemploymentWorker = sgkBase * CONSTANTS.ISSIZLIK_SIGORTASI_ISCI_PAYI;
    
    const incomeTaxBase = grossAmount - (sgkWorker + unemploymentWorker);
    const incomeTax = incomeTaxBase * CONSTANTS.GELIR_VERGISI_ORANI;
    const stampTax = grossAmount * CONSTANTS.DAMGA_VERGISI_ORANI;

    const totalDeductions = sgkWorker + unemploymentWorker + incomeTax + stampTax;
    const netAmount = grossAmount - totalDeductions;

    return {
        hourlyWage,
        grossAmount,
        deductions: {
            sgkWorker,
            unemploymentWorker,
            incomeTax,
            stampTax
        },
        netAmount
    };
};
