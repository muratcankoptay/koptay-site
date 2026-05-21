#!/usr/bin/env node
/**
 * Makale kapak görselleri için 384/768/1200 WebP+JPEG varyantları üretir.
 * articles.json içinde image.responsive = true işaretler.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const ARTICLES_JSON = path.join(ROOT, 'articles.json')
const ARTICLES_DIR = path.join(ROOT, 'public', 'images', 'articles')
const WIDTHS = [384, 512, 768, 1200]
const FORCE = process.env.FORCE_IMAGE_VARIANTS === '1' || process.argv.includes('--force')

async function generateVariants(filePath) {
  const { base, ext } = (() => {
    const name = path.basename(filePath)
    const dot = name.lastIndexOf('.')
    return { base: path.join(path.dirname(filePath), name.slice(0, dot)), ext: name.slice(dot) }
  })()

  let changed = false
  for (const w of WIDTHS) {
    const jpgOut = `${base}-${w}w.jpg`
    const webpOut = `${base}-${w}w.webp`
    if (FORCE || !fs.existsSync(jpgOut)) {
      await sharp(filePath).resize(w, null, { withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(jpgOut)
      changed = true
    }
    if (FORCE || !fs.existsSync(webpOut)) {
      await sharp(filePath)
        .resize(w, null, { withoutEnlargement: true })
        .webp({ quality: 72, effort: 6, smartSubsample: true })
        .toFile(webpOut)
      changed = true
    }
  }
  return changed
}

async function main() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.log('ℹ️  public/images/articles yok, görsel varyantı atlandı.')
    return
  }

  const originals = fs.readdirSync(ARTICLES_DIR).filter((f) => {
    if (!/\.(jpe?g|png)$/i.test(f)) return false
    return !/-\d+w\./i.test(f)
  })

  let variantCount = 0
  for (const file of originals) {
    const full = path.join(ARTICLES_DIR, file)
    if (await generateVariants(full)) {
      variantCount++
      console.log(`  ✓ ${file}`)
    }
  }

  if (!fs.existsSync(ARTICLES_JSON)) return

  const data = JSON.parse(fs.readFileSync(ARTICLES_JSON, 'utf-8'))
  let updated = 0
  for (const article of data.data || []) {
    const url = article.image?.url || article.image
    if (!url || typeof url !== 'string') continue
    const filename = path.basename(url)
    if (!originals.includes(filename)) continue
    if (typeof article.image === 'object') {
      article.image.responsive = true
    } else {
      article.image = {
        url: article.image,
        alternativeText: article.title,
        responsive: true
      }
    }
    updated++
  }

  fs.writeFileSync(ARTICLES_JSON, JSON.stringify(data, null, 2), 'utf-8')
  const publicCopy = path.join(ROOT, 'public', 'articles.json')
  if (fs.existsSync(publicCopy)) {
    fs.writeFileSync(publicCopy, JSON.stringify(data, null, 2), 'utf-8')
  }

  console.log(`✅ ${variantCount} görsel için varyantlar; ${updated} makale responsive işaretlendi.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
