/**
 * Image Optimization Utility
 * Uses Vercel's built-in image optimization for better performance
 */

/**
 * Optimize image URL using Vercel Image Optimization
 * @param {string} url - Original image URL
 * @param {number} width - Target width
 * @param {number} quality - Quality (1-100)
 * @returns {string} - Optimized image URL
 */
export const optimizeImage = (url, width = 1024, quality = 80) => {
  if (!url) return url
  
  // Skip if already optimized or local
  if (url.includes('/_vercel/image') || url.startsWith('/')) return url
  
  // Use Vercel's Image Optimization API
  // Format: /_vercel/image?url=ENCODED_URL&w=WIDTH&q=QUALITY
  const encodedUrl = encodeURIComponent(url)
  return `/_vercel/image?url=${encodedUrl}&w=${width}&q=${quality}`
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
