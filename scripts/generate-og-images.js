#!/usr/bin/env node
/**
 * Marka renklerinde 1200×630 OG kapak görselleri üretir.
 * Build öncesi çalıştırılır: node scripts/generate-og-images.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, '../public/images/og')

const BRAND = {
  dark: '#1F2937',
  teal: '#548c8d',
  light: '#F8F9FA',
  white: '#ffffff'
}

const IMAGES = [
  { file: 'og-default.jpg', title: 'Koptay Hukuk Bürosu', subtitle: 'Ankara · Av. Murat Can Koptay' },
  { file: 'og-hizmetler.jpg', title: 'Çalışma Alanları', subtitle: 'Danışmanlık ve dava takibi' },
  { file: 'og-makaleler.jpg', title: 'Hukuk Makaleleri', subtitle: 'Güncel mevzuat ve içtihat rehberleri' },
  { file: 'og-iletisim.jpg', title: 'İletişim', subtitle: 'Çankaya / Ankara' },
  { file: 'og-ekibimiz.jpg', title: 'Ekibimiz', subtitle: 'Av. Murat Can Koptay' },
  { file: 'og-hesaplama.jpg', title: 'Hesaplama Araçları', subtitle: '9 hukuki hesaplama aracı' },
  { file: 'og-kamulastirma.jpg', title: 'Kamulaştırma Haritası', subtitle: 'Ankara bölgesi' },
  { file: 'is-hukuku.jpg', title: 'İş Hukuku', subtitle: 'Kıdem · İşe iade · Fazla mesai' },
  { file: 'ticaret-hukuku.jpg', title: 'Ticaret Hukuku', subtitle: 'Şirket · Sözleşme · Alacak' },
  { file: 'aile-hukuku.jpg', title: 'Aile Hukuku', subtitle: 'Boşanma · Velayet · Nafaka' },
  { file: 'ceza-hukuku.jpg', title: 'Ceza Hukuku', subtitle: 'Müdafilik ve temsil' },
  { file: 'gayrimenkul-hukuku.jpg', title: 'Gayrimenkul Hukuku', subtitle: 'Tapu · Kira · Kamulaştırma' }
]

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildSvg({ title, subtitle }) {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BRAND.dark}"/>
      <stop offset="55%" style="stop-color:#2D3748"/>
      <stop offset="100%" style="stop-color:#395d61"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="6" height="630" fill="${BRAND.teal}" opacity="0.85"/>
  <rect x="80" y="520" width="200" height="4" fill="${BRAND.teal}" opacity="0.6"/>
  <text x="80" y="120" font-family="Georgia, serif" font-size="28" fill="${BRAND.teal}" letter-spacing="4">KOPTAY HUKUK</text>
  <text x="80" y="300" font-family="Georgia, serif" font-size="64" font-weight="700" fill="${BRAND.white}">${escapeXml(title)}</text>
  <text x="80" y="370" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.85)">${escapeXml(subtitle)}</text>
  <text x="80" y="560" font-family="Arial, sans-serif" font-size="22" fill="rgba(255,255,255,0.55)">koptay.av.tr</text>
</svg>`
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  console.log('🖼️  OG görselleri üretiliyor...')

  for (const spec of IMAGES) {
    const svg = buildSvg(spec)
    const outPath = path.join(OUT_DIR, spec.file)
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(outPath)
    console.log(`  ✓ ${spec.file}`)
  }

  console.log(`✅ ${IMAGES.length} OG görseli: ${OUT_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
