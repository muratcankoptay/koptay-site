#!/usr/bin/env node
/**
 * Build-time İçerik Enjeksiyonu — koptay.av.tr  (tarayıcı GEREKTİRMEZ)
 * --------------------------------------------------------------------------
 * prerender.js her route için <head>'i (title, meta, OG, JSON-LD) dolduruyor
 * ama <div id="root"> gövdesini boş bırakıyor; içerik yalnızca tarayıcıda
 * JavaScript ile yükleniyordu. Bu script `vite build` + `prerender.js`
 * SONRASINDA çalışır ve gerçek içeriği SAF NODE ile HTML'e basar:
 *
 *   - Makaleler: articles.json içindeki Markdown `content` -> marked ile HTML.
 *   - Hizmetler : src/data/services.js (başlık, açıklama, özellik, süreç, SSS).
 *   - Diğer sayfalar (araçlar, anasayfa, statikler): sayfanın kendi <title> ve
 *     <meta description> değerinden H1 + giriş paragrafı (boş gövde kalmaz).
 *
 * Headless Chrome / Puppeteer kullanmaz; Vercel build ortamında güvenle çalışır.
 * <head> aynen korunur. Gerçek kullanıcılar yine React SPA'yı yükler (createRoot
 * mevcut içeriği değiştirir). Bot ilk HTML yanıtında tam içeriği görür.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import { PRACTICE_AREAS } from '../src/data/services.js';

marked.setOptions({ gfm: true, breaks: false });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');
const ARTICLES_JSON = path.resolve(__dirname, '../articles.json');

const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const unesc = (s = '') => String(s)
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

// Dengeli <div id="root"> içerik değiştirme (boş ya da dolu farketmez, idempotent)
function injectRoot(html, inner) {
  const startTag = '<div id="root">';
  const i = html.indexOf(startTag);
  if (i < 0) return null;
  const contentStart = i + startTag.length;
  let depth = 1, closeIdx = -1;
  const re = /<div\b|<\/div>/g;
  re.lastIndex = contentStart;
  let m;
  while ((m = re.exec(html))) {
    if (m[0] === '</div>') { depth--; if (depth === 0) { closeIdx = m.index; break; } }
    else depth++;
  }
  if (closeIdx < 0) return null;
  return html.slice(0, contentStart) + inner + html.slice(closeIdx);
}

function writeBody(file, inner) {
  const html = fs.readFileSync(file, 'utf-8');
  const out = injectRoot(html, inner);
  if (!out) return false;
  fs.writeFileSync(file, out, 'utf-8');
  return true;
}

function getMeta(html) {
  const t = html.match(/<title>([^<]*)<\/title>/);
  const d = html.match(/<meta name="description" content="([^"]*)"/);
  return { title: unesc(t ? t[1] : ''), desc: unesc(d ? d[1] : '') };
}

const visibleLen = (s) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, '').length;

let aCount = 0, sCount = 0, bCount = 0, thin = 0;

// 1) MAKALELER
const articles = (JSON.parse(fs.readFileSync(ARTICLES_JSON, 'utf-8')).data) || [];
const articleFiles = new Set();
for (const a of articles) {
  if (!a.slug) continue;
  const file = path.join(DIST, 'makale', a.slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  articleFiles.add(file);
  const body = marked.parse(a.content || '');
  const metaBits = [a.category, a.author, a.readTime].filter(Boolean).map((x) => `<span>${esc(x)}</span>`).join(' · ');
  const inner =
    `<main><article>` +
    `<header><h1>${esc(a.title || '')}</h1>` +
    (a.excerpt ? `<p class="article-excerpt">${esc(a.excerpt)}</p>` : '') +
    (metaBits ? `<div class="article-meta">${metaBits}</div>` : '') +
    `</header>` +
    `<div class="article-content">${body}</div>` +
    `</article></main>`;
  if (writeBody(file, inner)) { aCount++; if (visibleLen(inner) < 200) thin++; }
}

// 2) HİZMETLER
const serviceFiles = new Set();
for (const s of PRACTICE_AREAS) {
  const file = path.join(DIST, 'hizmetler', s.slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  serviceFiles.add(file);
  const features = (s.features || []).map((f) => `<li>${esc(f)}</li>`).join('');
  const proc = (s.process || []).map((p) => `<li><strong>${esc(p.title)}:</strong> ${esc(p.description)}</li>`).join('');
  const faq = (s.faq || []).map((q) => `<div class="faq-item"><h3>${esc(q.question)}</h3><p>${esc(q.answer)}</p></div>`).join('');
  const inner =
    `<main><h1>${esc(s.title)}</h1>` +
    `<p>${esc(s.description || s.shortDescription || '')}</p>` +
    (features ? `<h2>Hizmet Kapsamı</h2><ul>${features}</ul>` : '') +
    (proc ? `<h2>Süreç</h2><ol>${proc}</ol>` : '') +
    (faq ? `<h2>Sıkça Sorulan Sorular</h2>${faq}` : '') +
    `</main>`;
  if (writeBody(file, inner)) sCount++;
}

// 3) DİĞER SAYFALAR (araçlar, anasayfa, statikler) — head'ten baseline
function walk(dir, cb) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['assets', 'images', 'locales', '.well-known'].includes(e.name)) continue;
      walk(f, cb);
    } else if (e.name === 'index.html') cb(f);
  }
}
walk(DIST, (file) => {
  if (articleFiles.has(file) || serviceFiles.has(file)) return;
  const html = fs.readFileSync(file, 'utf-8');
  const { title, desc } = getMeta(html);
  const h1 = ((title.split('|')[0] || title).split('—')[0] || title).trim() || title;
  const inner = `<main><h1>${esc(h1)}</h1>` + (desc ? `<p>${esc(desc)}</p>` : '') + `</main>`;
  if (writeBody(file, inner)) { bCount++; if (visibleLen(inner) < 200) thin++; }
});

console.log(`Icerik enjeksiyonu bitti. Makale: ${aCount} | Hizmet: ${sCount} | Diger(baseline): ${bCount} | Ince(<200): ${thin}`);
