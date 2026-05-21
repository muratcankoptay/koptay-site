#!/usr/bin/env node
/**
 * articles.json → articles-index.json (içeriksiz) + articles/{slug}.json (tek makale)
 * Makale sayfasında 105 KiB yerine ~3–8 KiB index + tek makale JSON yüklenir.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SOURCE = path.join(ROOT, 'articles.json')
const PUBLIC_DIR = path.join(ROOT, 'public')
const INDEX_OUT = path.join(PUBLIC_DIR, 'articles-index.json')
const SLUG_DIR = path.join(PUBLIC_DIR, 'articles')

function stripContent(article) {
  const { content, ...rest } = article
  return rest
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.warn('⚠️  articles.json bulunamadı, atlanıyor.')
    return
  }

  const raw = JSON.parse(fs.readFileSync(SOURCE, 'utf-8'))
  const articles = raw.data || []

  const indexPayload = {
    meta: raw.meta || { total: articles.length },
    data: articles.map(stripContent)
  }

  fs.mkdirSync(SLUG_DIR, { recursive: true })

  // Eski slug dosyalarını temizle
  for (const file of fs.readdirSync(SLUG_DIR)) {
    if (file.endsWith('.json')) fs.unlinkSync(path.join(SLUG_DIR, file))
  }

  for (const article of articles) {
    if (!article.slug) continue
    const slugPath = path.join(SLUG_DIR, `${article.slug}.json`)
    fs.writeFileSync(slugPath, JSON.stringify({ data: article }), 'utf-8')
  }

  fs.writeFileSync(INDEX_OUT, JSON.stringify(indexPayload), 'utf-8')
  // Geriye dönük: tam dosya da public'te kalsın (admin / eski cache)
  fs.copyFileSync(SOURCE, path.join(PUBLIC_DIR, 'articles.json'))

  const indexKb = (fs.statSync(INDEX_OUT).size / 1024).toFixed(1)
  console.log(`✅ articles-index.json (${indexKb} KiB, ${articles.length} makale)`)
  console.log(`✅ public/articles/*.json (${articles.length} dosya)`)
}

main()
