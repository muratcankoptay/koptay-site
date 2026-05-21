#!/usr/bin/env node
/**
 * Vite'ın ürettiği render-blocking CSS linklerini async yüklemeye çevirir.
 * dist/ altındaki tüm HTML dosyalarına uygulanır (prerender sonrası).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.resolve(__dirname, '..', 'dist')

const STYLESHEET_RE =
  /<link\s+rel="stylesheet"(?:\s+crossorigin)?\s+href="(\/assets\/[^"]+\.css)"\s*\/?>/g

const toAsync = (href) =>
  `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">` +
  `<noscript><link rel="stylesheet" href="${href}"></noscript>`

function walkHtml(dir) {
  let count = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      count += walkHtml(full)
    } else if (entry.name.endsWith('.html')) {
      const html = fs.readFileSync(full, 'utf-8')
      const next = html.replace(STYLESHEET_RE, (_, href) => toAsync(href))
      if (next !== html) {
        fs.writeFileSync(full, next)
        count++
      }
    }
  }
  return count
}

if (!fs.existsSync(DIST)) {
  console.error('❌ dist/ bulunamadı — önce vite build çalıştırın.')
  process.exit(1)
}

const patched = walkHtml(DIST)
console.log(`✅ ${patched} HTML dosyasında CSS async yükleme etkin.`)
