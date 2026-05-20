/** Makale görüntülenme sayısı — 0 iken UI'da gösterilmez */
export function shouldShowViewCount(count) {
  const n = Number(count)
  return Number.isFinite(n) && n > 0
}

export function formatViewCount(count) {
  if (!shouldShowViewCount(count)) return null
  return `${Math.floor(Number(count)).toLocaleString('tr-TR')} görüntülenme`
}
