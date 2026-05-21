/**
 * Image Optimization Utility
 *
 * Bu modül iki çalışma modu sunar:
 *
 * 1) Pass-through (mevcut davranış): generateSrcSet ve optimizeImage URL'yi olduğu gibi
 *    döndürür. Bu, geriye dönük uyumluluk için korunmuştur.
 *
 * 2) Responsive variants (yeni): Eğer makalenin görseli için elimizde önceden üretilmiş
 *    `-{W}w.{ext}` varyantları varsa (örn. `cover-384w.webp`, `cover-768w.webp`, ...),
 *    `generateResponsivePictureSources(url)` ile WebP+JPG fallback'li gerçek bir
 *    `<picture>` source listesi oluşturulur. PageSpeed'in "resim yayınlamayı
 *    kolaylaştırın" uyarısını ortadan kaldırır.
 *
 * Convention:
 *   /images/articles/foo.jpg          → orijinal (fallback)
 *   /images/articles/foo-384w.jpg     → mobil
 *   /images/articles/foo-384w.webp
 *   /images/articles/foo-768w.jpg     → tablet
 *   /images/articles/foo-768w.webp
 *   /images/articles/foo-1200w.jpg    → desktop
 *   /images/articles/foo-1200w.webp
 *
 * Yeni bir makale eklenirken bu varyantların oluşturulması gerekir; aksi hâlde
 * `responsive` flag'ı kullanılmamalıdır (404 hatasından kaçınmak için).
 */

const RESPONSIVE_WIDTHS = [384, 512, 768, 1200]

const splitUrl = (url) => {
  const lastDot = url.lastIndexOf('.')
  if (lastDot === -1) return { base: url, ext: '' }
  return { base: url.slice(0, lastDot), ext: url.slice(lastDot) }
}

/**
 * Get optimized image URL (pass-through)
 * @param {string} url
 * @returns {string}
 */
export const optimizeImage = (url /*, width = 1024, quality = 80 */) => {
  if (!url) return url
  return url
}

/**
 * Pass-through srcset (geriye dönük uyumluluk).
 * Yeni makalelerde generateResponsiveSrcSet/generateResponsivePictureSources tercih edin.
 */
export const generateSrcSet = (url) => {
  if (!url) return ''
  return `${url} 1200w`
}

/**
 * Sizes attribute — viewport tabanlı.
 * Mobile-first: küçük ekranda %100 vw, masaüstünde max 1024px.
 */
export const generateSizes = () => {
  // Makale kapak: mobilde container ~100vw, 2x DPR'da 512/768 yeterli
  return '(max-width: 768px) min(100vw, 512px), (max-width: 1280px) min(80vw, 768px), 1024px'
}

/**
 * Responsive srcset — gerçek varyant URL'leri üretir.
 * Sadece varyantları üretilmiş görseller için kullanın.
 *
 * @param {string} url - Orijinal URL (örn. /images/articles/foo.jpg)
 * @param {string} forcedExt - Override için (örn. '.webp')
 * @returns {string} srcset
 */
export const generateResponsiveSrcSet = (url, forcedExt) => {
  if (!url) return ''
  const { base, ext } = splitUrl(url)
  const useExt = forcedExt || ext
  return RESPONSIVE_WIDTHS
    .map((w) => `${base}-${w}w${useExt} ${w}w`)
    .join(', ')
}

/**
 * <picture> elementi için <source> dizisi (WebP + orijinal format).
 * ArticlePage.jsx'te şu şekilde kullanılır:
 *
 *   <picture>
 *     {sources.map(s => <source key={s.type} type={s.type} srcSet={s.srcSet} sizes={s.sizes} />)}
 *     <img src={fallbackUrl} ... />
 *   </picture>
 *
 * @param {string} url - Orijinal URL (jpg veya png)
 * @returns {Array<{type: string, srcSet: string, sizes: string}>}
 */
export const generateResponsivePictureSources = (url) => {
  if (!url) return []
  const sizes = generateSizes()
  return [
    { type: 'image/webp', srcSet: generateResponsiveSrcSet(url, '.webp'), sizes },
    { type: 'image/jpeg', srcSet: generateResponsiveSrcSet(url), sizes },
  ]
}
