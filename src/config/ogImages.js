import { DEFAULT_OG_IMAGE } from './site'

/** Sayfa türüne göre Open Graph kapak görselleri (1200×630) */
export const OG_IMAGES = {
  home: DEFAULT_OG_IMAGE,
  hizmetler: '/images/og/og-hizmetler.jpg',
  makaleler: '/images/og/og-makaleler.jpg',
  iletisim: '/images/og/og-iletisim.jpg',
  ekibimiz: '/images/og/og-ekibimiz.jpg',
  hesaplama: '/images/og/og-hesaplama.jpg',
  kamulastirma: '/images/og/og-kamulastirma.jpg',
  kvkk: DEFAULT_OG_IMAGE,
  'is-hukuku': '/images/og/is-hukuku.jpg',
  'ticaret-hukuku': '/images/og/ticaret-hukuku.jpg',
  'aile-hukuku': '/images/og/aile-hukuku.jpg',
  'ceza-hukuku': '/images/og/ceza-hukuku.jpg',
  'gayrimenkul-hukuku': '/images/og/gayrimenkul-hukuku.jpg'
}

export function getOgImageForPath(pathname = '/') {
  if (pathname.startsWith('/hizmetler/')) {
    const slug = pathname.replace('/hizmetler/', '').split('/')[0]
    return OG_IMAGES[slug] || OG_IMAGES.hizmetler
  }
  if (pathname.startsWith('/makale/')) return null
  if (pathname === '/hizmetlerimiz' || pathname.startsWith('/hizmetler')) return OG_IMAGES.hizmetler
  if (pathname.startsWith('/hesaplama-araclari')) return OG_IMAGES.hesaplama
  if (pathname === '/makaleler') return OG_IMAGES.makaleler
  if (pathname === '/iletisim') return OG_IMAGES.iletisim
  if (pathname === '/ekibimiz') return OG_IMAGES.ekibimiz
  if (pathname === '/kamulastirma-haritasi') return OG_IMAGES.kamulastirma
  if (pathname === '/kvkk') return OG_IMAGES.kvkk
  if (pathname === '/') return OG_IMAGES.home
  return DEFAULT_OG_IMAGE
}
