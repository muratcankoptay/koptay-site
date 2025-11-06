/**
 * Image Optimization Utility
 * For Vite/React apps - returns original URL
 * Image optimization handled at source (Strapi) or CDN level
 */

/**
 * Get optimized image URL
 * @param {string} url - Original image URL
 * @param {number} width - Target width (unused in this implementation)
 * @param {number} quality - Quality (unused in this implementation)
 * @returns {string} - Image URL
 */
export const optimizeImage = (url, width = 1024, quality = 80) => {
  if (!url) return url
  
  // For Strapi images, use as-is
  // Optimization should be done at Strapi level or via CDN
  return url
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
