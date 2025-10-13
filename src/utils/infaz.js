// Utilities for Infaz (sentence execution) calculations and URL/localStorage sync

// Convert Y/M/D to total days using 365-day years and 30-day months (execution practice)
export function toDays({ years = 0, months = 0, days = 0 }) {
  const y = parseInt(years || 0, 10)
  const m = parseInt(months || 0, 10)
  const d = parseInt(days || 0, 10)
  return y * 365 + m * 30 + d
}

// Core calculator based on simplified rules present in the app
export function calculateInfaz(form) {
  const {
    crimeType,
    years,
    months,
    days,
    crimeDate,
    startDate,
    mahsup = '0',
    discipline = '0'
  } = form

  const crimeDateObj = new Date(`${crimeDate}T00:00:00`)
  const startDateObj = new Date(`${startDate}T00:00:00`)
  const cutoffDate = new Date('2020-03-30T00:00:00')

  // Base term
  let totalDays = toDays({ years, months, days })

  // Fractions and DS default
  let fraction = 1 / 2 // 1/2 for general crimes
  let denetimliDays = crimeDateObj < cutoffDate ? 3 * 365 : 365

  // Serious crimes overwrite fraction
  if (String(crimeType).startsWith('serious_')) {
    fraction = 3 / 4
    denetimliDays = crimeDateObj < cutoffDate ? 3 * 365 : 365
  }

  // Life sentences
  if (crimeType === 'life') {
    totalDays = 30 * 365
    fraction = 1 // no conditional release reduction beyond full term baseline used here
    denetimliDays = 3 * 365
  }
  if (crimeType === 'lifeAggravated') {
    totalDays = 36 * 365
    fraction = 1
    denetimliDays = 3 * 365
  }

  const mahsupDays = Math.max(0, parseInt(mahsup || 0, 10))
  const disciplineDays = Math.max(0, parseInt(discipline || 0, 10))

  // Compute days to conditional release and DS entry
  const fullTermDays = totalDays
  let kosulluDays = Math.ceil(totalDays * fraction) + disciplineDays - mahsupDays
  kosulluDays = Math.max(0, kosulluDays) // never negative

  let dsDays = kosulluDays - denetimliDays
  // If denetimliDays exceeds kosullu, DS starts at day 0 from startDate
  dsDays = Math.max(0, dsDays)

  const msPerDay = 24 * 60 * 60 * 1000
  const tahliyeDate = new Date(startDateObj.getTime() + fullTermDays * msPerDay)
  const kosulluDate = new Date(startDateObj.getTime() + kosulluDays * msPerDay)
  const dsDate = new Date(startDateObj.getTime() + dsDays * msPerDay)

  return {
    fullTerm: fullTermDays,
    kosullu: kosulluDays,
    denetimliS: dsDays,
    mahsupDays,
    tahliyeDate: tahliyeDate.toLocaleDateString('tr-TR'),
    kosulluDate: kosulluDate.toLocaleDateString('tr-TR'),
    dsDate: dsDate.toLocaleDateString('tr-TR'),
    fraction: Math.round(fraction * 100),
    denetimliYears: denetimliDays / 365
  }
}

export function getCrimeTypeText(type) {
  switch (type) {
    case 'general_yaralama':
      return 'Kasten Yaralama'
    case 'general_hirsizlik':
      return 'Hırsızlık'
    case 'general_dolandiricilik':
      return 'Dolandırıcılık'
    case 'general_tehdit':
      return 'Tehdit'
    case 'general_zimmet':
      return 'Zimmet'
    case 'serious_uyusturucu':
      return 'Uyuşturucu İmal ve Ticareti'
    case 'serious_teror':
      return 'Terör Suçları'
    case 'serious_orgutlu':
      return 'Örgütlü Suçlar'
    case 'serious_cinsel':
      return 'Cinsel Saldırı / Cinsel Dokunulmazlığa Karşı Suçlar'
    case 'life':
      return 'Müebbet (30 yıl)'
    case 'lifeAggravated':
      return 'Ağırlaştırılmış Müebbet (36 yıl)'
    default:
      return 'Genel Suçlar'
  }
}

// URL & Storage helpers
export const STORAGE_KEY = 'infazFormData'

export function serializeToSearchParams(form) {
  const sp = new URLSearchParams()
  Object.entries(form).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) sp.set(k, String(v))
  })
  return sp
}

export function parseFromSearchParams(searchParams, defaults) {
  const obj = { ...defaults }
  for (const [k, v] of searchParams.entries()) {
    obj[k] = v
  }
  return obj
}

export function loadFromStorage(defaults) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw)
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

export function saveToStorage(form) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
  } catch {
    // ignore
  }
}

// ============== Advanced Calculator (based on user's provided JS) ==============

export function tarihEkle(dateStr, days) {
  const base = new Date(`${dateStr}T00:00:00`)
  if (isNaN(base.getTime())) return ''
  const d = new Date(base)
  d.setDate(d.getDate() + (parseInt(days || 0, 10)))
  return d.toLocaleDateString('tr-TR')
}

export function gunHesapla(yil, ay, gun) {
  const y = parseInt(yil || 0, 10)
  const m = parseInt(ay || 0, 10)
  const d = parseInt(gun || 0, 10)
  return (y * 365) + (m * 30) + d
}

// sucTipi: 'adi' | 'istisna2_3' | 'istisna3_4' | 'muebbet'
// mukerrir: 'yok' | '1' | '2'
export function infazOrani(sucTipi, mukerrir, suctarihi) {
  let oran = 0.5 // default adi
  const t = new Date(`${suctarihi}T00:00:00`).getTime()
  const is2016Sonrasi = t > new Date('2016-07-01T00:00:00').getTime()
  const is2020Once = t < new Date('2020-03-30T00:00:00').getTime()

  if (sucTipi === 'istisna2_3') oran = 2 / 3
  else if (sucTipi === 'istisna3_4') oran = 3 / 4
  else if (sucTipi === 'muebbet') return { oran: 1, yatarOverrideDays: 8760 * 24 } // 24 years in days

  // Mükerrirlik
  // Mükerrirlik
  if (mukerrir === '1') oran = Math.max(oran, 2 / 3)
  else if (mukerrir === '2') oran = 1 // Tam yatar

  // Tarihsel lehe (647 sayılı için 1/2'ye düşür eğer lehe)
  if (t < new Date('2005-06-01T00:00:00').getTime() && oran > 0.5) oran = 0.5

  // 2016 sonrası genel 2/3 (user's rule)
  if (is2016Sonrasi && sucTipi === 'adi') oran = 2 / 3

  return { oran, leheUygula: true }
}

export function denetimliSerbestlik(yatarGun, yas, cinsiyet, iyiHal, suctarihi) {
  if (String(iyiHal) === 'hayır') return 0
  const age = parseInt(yas || 0, 10)
  let max = 365 // 1 yıl
  if (age >= 70 || (String(cinsiyet) === 'kadın' && age < 70)) max = 1460 // 4 yıl özel
  const kalan = yatarGun > 365 * 18 ? max : yatarGun // 18 ay altı direkt
  return Math.min(max, kalan)
}

export function calculateInfazAdvanced(form) {
  const {
    years, months, days,
    crimeDate, // suçTarihi
    age, gender,
    offenseCategory, // sucTipi
    recidivism, // mukerrir
    pretrialDays, // tutuklu
    goodBehavior // iyiHal
  } = form

  if (!crimeDate) {
    return { error: 'Suç tarihi zorunludur.' }
  }

  const toplamGun = gunHesapla(years, months, days)
  const info = infazOrani(offenseCategory || 'adi', recidivism || 'yok', crimeDate)
  let yatar = Math.max(0, (toplamGun * (info.oran || 1)) - (parseInt(pretrialDays || 0, 10)))

  // If there was a special override (from user's code), keep structure though likely not used
  if (info.yatarOverrideDays) yatar = info.yatarOverrideDays

  const kosTarih = tarihEkle(crimeDate, Math.round(yatar))
  const ds = denetimliSerbestlik(yatar, age, gender, goodBehavior, crimeDate)
  const dsBaslangic = tarihEkle(kosTarih, -ds)
  const toplamTahliyeTarih = tarihEkle(crimeDate, Math.round(yatar + ds))

  return {
    toplamGun,
    yatar: Math.round(yatar),
    denetimli: ds,
    kosulTarih: kosTarih,
    dsBaslangic,
    toplamTahliyeTarih,
    fraction: Math.round((info.oran || 0) * 100),
    denetimliYears: Math.round((ds / 365) * 100) / 100,
    mahsupDays: Math.max(0, parseInt(pretrialDays || 0, 10))
  }
}

// ===== Auto offense category detection based on free-text (sucAdi / TCK maddesi) =====

const sucKategorileri = {
  // Müebbet Sabit
  'soykırım': 'muebbet', 'tck 76': 'muebbet',
  'insanlığa karşı': 'muebbet', 'tck 77': 'muebbet',
  'müebbet': 'muebbet', 'ağırlaştırılmış müebbet': 'muebbet',
  
  // 2/3 İstisna (Madde 107/2)
  'öldürme': 'istisna2_3', 'kasten öldürme': 'istisna2_3', 'tck 81': 'istisna2_3', 'tck 82': 'istisna2_3', 'tck 83': 'istisna2_3',
  'yaralama': 'istisna2_3', 'ağır yaralama': 'istisna2_3', 'tck 85': 'istisna2_3', 'tck 86': 'istisna2_3', 'tck 87': 'istisna2_3',
  'işkence': 'istisna2_3', 'eziyet': 'istisna2_3', 'tck 122': 'istisna2_3', 'tck 123': 'istisna2_3',
  'cinsel saldırı': 'istisna2_3', 'tck 102': 'istisna2_3', 'reşit olmayan cinsel': 'istisna2_3', 'tck 104': 'istisna2_3', 'cinsel taciz': 'istisna2_3', 'tck 105': 'istisna2_3',
  'çocuk cinsel': 'istisna2_3', 'tck 103': 'istisna2_3',
  'özel hayat': 'istisna2_3', 'gizlilik ihlal': 'istisna2_3', 'tck 132': 'istisna2_3', 'tck 133': 'istisna2_3', 'tck 134': 'istisna2_3', 'tck 135': 'istisna2_3', 'tck 136': 'istisna2_3', 'tck 137': 'istisna2_3', 'tck 138': 'istisna2_3', 'tck 139': 'istisna2_3',
  'casusluk': 'istisna2_3', 'devlet sırları': 'istisna2_3', 'tck 326': 'istisna2_3', 'tck 327': 'istisna2_3', 'tck 328': 'istisna2_3', 'tck 329': 'istisna2_3', 'tck 330': 'istisna2_3', 'tck 331': 'istisna2_3', 'tck 332': 'istisna2_3', 'tck 333': 'istisna2_3', 'tck 334': 'istisna2_3', 'tck 335': 'istisna2_3', 'tck 336': 'istisna2_3', 'tck 337': 'istisna2_3', 'tck 338': 'istisna2_3', 'tck 339': 'istisna2_3',
  'örgüt kurma': 'istisna2_3', 'tck 220': 'istisna2_3', 'örgüte üye': 'istisna2_3', 'tck 221': 'istisna2_3', 'örgüt propaganda': 'istisna2_3', 'tck 222': 'istisna2_3', 'örgüt yardımı': 'istisna2_3', 'tck 223': 'istisna2_3',
  'terör çocuk': 'istisna2_3', 'tmk 3713': 'istisna2_3', 'istihbarat suçu': 'istisna2_3', 'tck 78': 'istisna2_3',
  'askeri sırları': 'istisna2_3', 'tck 292': 'istisna2_3', 'tck 296': 'istisna2_3', 'tck 297': 'istisna2_3',

  // 3/4 İstisna (Madde 107/2 ve TMK)
  'nitelikli cinsel': 'istisna3_4', 'çocuk istismarı': 'istisna3_4', 'tck 102/2': 'istisna3_4', 'tck 103': 'istisna3_4', 'tck 104/2': 'istisna3_4', 'tck 104/3': 'istisna3_4',
  'uyuşturucu ticareti': 'istisna3_4', 'uyuşturucu imal': 'istisna3_4', 'tck 188': 'istisna3_4',
  'terör': 'istisna3_4', 'tmk suçları': 'istisna3_4', 'silahlı örgüt': 'istisna3_4', 'tck 314': 'istisna3_4', 
  'anayasal düzen': 'istisna3_4', 'cumhurbaşkanı suikast': 'istisna3_4', 'tck 299': 'istisna3_4', 'tck 300': 'istisna3_4', 'tck 302': 'istisna3_4', 'tck 303': 'istisna3_4', 'tck 304': 'istisna3_4', 'tck 305': 'istisna3_4', 'tck 306': 'istisna3_4', 'tck 307': 'istisna3_4', 'tck 308': 'istisna3_4', 'tck 309': 'istisna3_4',
  'örgüt silah': 'istisna3_4', 'tck 315': 'istisna3_4', 'tck 316': 'istisna3_4', 'tck 317': 'istisna3_4', 'tck 318': 'istisna3_4', 'tck 319': 'istisna3_4', 'tck 320': 'istisna3_4',

  // Yaygın Adi Suçlar (Varsayılan, ama eşleşme için)
  'hırsızlık': 'adi', 'tck 141': 'adi', 'nitelikli hırsızlık': 'adi', 'tck 142': 'adi', 'tck 143': 'adi', 'tck 144': 'adi', 'tck 145': 'adi', 'tck 146': 'adi',
  'yağma': 'adi', 'tck 148': 'adi', 'tck 149': 'adi', 'tck 150': 'adi',
  'dolandırıcılık': 'adi', 'tck 154': 'adi', 'tck 156': 'adi', 'tck 157': 'adi', 'tck 158': 'adi',
  'güveni kötüye kullanma': 'adi', 'tck 155': 'adi',
  'mala zarar': 'adi', 'tck 147': 'adi', 'tck 151': 'adi', 'tck 152': 'adi', 'tck 153': 'adi',
  'tehdit': 'adi', 'tck 106': 'adi', 'şantaj': 'adi', 'tck 107': 'adi',
  'hakaret': 'adi', 'tck 125': 'adi', 'tck 126': 'adi', 'tck 127': 'adi', 'tck 128': 'adi', 'tck 129': 'adi', 'tck 130': 'adi', 'tck 131': 'adi',
  'iftira': 'adi', 'tck 253': 'adi', 'tck 254': 'adi', 'yalancı tanıklık': 'adi', 'tck 255': 'adi', 'tck 256': 'adi', 'tck 257': 'adi',
  'rüşvet': 'adi', 'tck 252': 'adi', 'tck 253': 'adi', 'görev kötüye kullanma': 'adi', 'tck 257': 'adi',
  'göçmen kaçakçılığı': 'adi', 'tck 79': 'adi', 'insan ticareti': 'adi', 'tck 80': 'adi',
  'resmi belge sahtecilik': 'adi', 'tck 204': 'adi', 'tck 205': 'adi', 'özel belge sahtecilik': 'adi', 'tck 207': 'adi', 'tck 208': 'adi',
  'bilişim suçları': 'adi', 'tck 243': 'adi', 'tck 244': 'adi', 'tck 245': 'adi', 'tck 246': 'adi', 'tck 247': 'adi'
}

function normalizeTr(str) {
  if (!str) return ''
  const low = String(str).toLowerCase()
  // remove accents/diacritics and map Turkish-specific letters
  return low
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, ' ')
    .trim()
}

export function autoDetectOffenseCategory(input) {
  if (!input) return { category: 'adi', matched: false }
  const s = normalizeTr(input)

  // 1) Direct keyword check (textual)
  let foundCategory = null
  for (const key of Object.keys(sucKategorileri)) {
    const k = normalizeTr(key)
    if (s.includes(k)) {
      foundCategory = sucKategorileri[key]
      break
    }
  }

  // 2) Numeric TCK detection (articles and subclauses)
  const altMap = {
    '102/2': 'istisna3_4',
    '104/2': 'istisna3_4',
    '104/3': 'istisna3_4'
  }
  const istisna23 = new Set([78,81,82,85,86,87,102,122,123,132,133,134,135,136,137,138,139,220,221,222,223,292,296,297,326,327,328,329,330,331,332,333,334,335,336,337,338,339])
  const istisna34 = new Set([76,77,103,188,299,300,302,303,304,305,306,307,308,309,314,315,316,317,318,319])

  const categoryRank = (cat) => ({ muebbet: 3, istisna3_4: 2, istisna2_3: 1, adi: 0 })[cat] ?? 0
  let bestCategory = foundCategory

  // explicit text for life sentences
  if (s.includes('muebbet') || s.includes('agirlastirilmis muebbet')) {
    bestCategory = 'muebbet'
  }

  const re = /(tck\s*)?(\d{2,3})(?:\/(\d))?/gi
  let m
  while ((m = re.exec(s)) !== null) {
    const art = parseInt(m[2], 10)
    const sub = m[3]
    let c = null
    if (sub && altMap[`${art}/${sub}`]) {
      c = altMap[`${art}/${sub}`]
    } else if (istisna34.has(art)) {
      c = 'istisna3_4'
    } else if (istisna23.has(art)) {
      c = 'istisna2_3'
    }
    if (c && (!bestCategory || categoryRank(c) > categoryRank(bestCategory))) {
      bestCategory = c
    }
  }

  return { category: bestCategory || 'adi', matched: !!bestCategory }
}

export function offenseCategoryLabel(category) {
  switch (category) {
    case 'istisna2_3': return 'İstisna Suç (2/3) - Örn: Kasten öldürme'
    case 'istisna3_4': return 'Nitelikli İstisna (3/4) - Örn: Uyuşturucu ticareti'
    case 'muebbet': return 'Müebbet Hapis'
    default: return 'Adi Suç (1/2) - Örn: Hırsızlık'
  }
}
