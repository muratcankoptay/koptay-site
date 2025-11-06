/**
 * Image Optimization Utility
 * Converts Strapi images to optimized formats using external services
 */

/**
 * Optimize image URL using wsrv.nl (free CDN with WebP conversion)
 * @param {string} url - Original image URL
 * @param {number} width - Target width
 * @param {number} quality - Quality (1-100)
 * @returns {string} - Optimized image URL
 */
export const optimizeImage = (url, width = 1024, quality = 80) => {
  if (!url) return url
  
  // Skip if already optimized or local
  if (url.includes('wsrv.nl') || url.startsWith('/')) return url
  
  // Use wsrv.nl for WebP conversion and optimization
  // Format: https://wsrv.nl/?url=ORIGINAL_URL&w=WIDTH&q=QUALITY&output=webp
  const encodedUrl = encodeURIComponent(url)
  return `https://wsrv.nl/?url=${encodedUrl}&w=${width}&q=${quality}&output=webp&il`
}

/**
 * Generate srcset for responsive images
 * @param {string} url - Original image URL
 * @returns {string} - srcset attribute value
 */
export const generateSrcSet = (url) => {
  if (!url) return ''
  
  const widths = [640, 768, 1024, 1280, 1536]
  return widths
    .map(width => `${optimizeImage(url, width, 80)} ${width}w`)
    .join(', ')
}

/**
 * Generate sizes attribute for responsive images
 * @returns {string} - sizes attribute value
 */
export const generateSizes = () => {
  return '(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1280px'
}
