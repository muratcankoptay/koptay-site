export const SITE_URL = 'https://koptay.av.tr'

export const SITE = {
  name: 'Koptay Hukuk Bürosu',
  lawyer: 'Av. Murat Can Koptay',
  phone: '+905307111864',
  phoneDisplay: '0530 711 18 64',
  email: 'info@koptay.av.tr',
  address: {
    street: 'Aziziye Mah. Willy Brandt Sk. No:7/1',
    locality: 'Çankaya',
    region: 'Ankara',
    country: 'TR',
    postalCode: '06690'
  }
}

export const DEFAULT_OG_IMAGE = '/images/og/og-default.jpg'
export const OG_SIZE = { width: 1200, height: 630 }

export function toAbsoluteUrl(path) {
  if (!path) return `${SITE_URL}${DEFAULT_OG_IMAGE}`
  if (path.startsWith('http')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
