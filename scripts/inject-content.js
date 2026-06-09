#!/usr/bin/env node
/**
 * Build-time İçerik Enjeksiyonu — koptay.av.tr  (tarayıcı GEREKTİRMEZ)
 * --------------------------------------------------------------------------
 * prerender.js her route için <head>'i dolduruyor ama <div id="root"> gövdesi
 * boş kalıyordu (içerik yalnızca tarayıcıda yükleniyordu). Bu script
 * `vite build` + `prerender.js` SONRASI çalışır ve gerçek içeriği SAF NODE ile
 * HTML gövdesine basar:
 *
 *   1) Makaleler        : articles.json -> marked ile HTML (her build'de taze).
 *   2) Hizmet sayfaları : src/data/services.js (taze).
 *   3) Araç + statikler : src/data/prerendered-bodies.json (yerelde `npm run capture`
 *                         ile bir kez yakalanan zengin içerik; commit'lenir).
 *   4) JSON'da olmayan   : sayfanın <title>/<meta>'sından H1 + giriş (yedek).
 *
 * Headless Chrome kullanmaz; Vercel build'inde güvenle çalışır. <head> korunur.
 * Gerçek kullanıcılar yine React SPA'yı yükler (createRoot içeriği değiştirir).
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
const BODIES_JSON = path.resolve(__dirname, '../src/data/prerendered-bodies.json');

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const unesc = (s = '') => String(s)
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function injectRoot(html, inner) {
  const startTag = '<div id="root">';
  const i = html.indexOf(startTag);
  if (i < 0) return null;
  const cs = i + startTag.length;
  let depth = 1, closeIdx = -1;
  const re = /<div\b|<\/div>/g;
  re.lastIndex = cs;
  let m;
  while ((m = re.exec(html))) {
    if (m[0] === '</div>') { depth--; if (depth === 0) { closeIdx = m.index; break; } }
    else depth++;
  }
  if (closeIdx < 0) return null;
  return html.slice(0, cs) + inner + html.slice(closeIdx);
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

const fileToRoute = (file) => {
  const rel = path.relative(DIST, path.dirname(file)).split(path.sep).join('/');
  return rel === '' ? '/' : '/' + rel;
};

// Yakalanmış araç/statik gövdeleri (varsa)
let bodies = {};
if (fs.existsSync(BODIES_JSON)) {
  try { bodies = JSON.parse(fs.readFileSync(BODIES_JSON, 'utf-8')); }
  catch (e) { console.warn('prerendered-bodies.json okunamadi:', e.message); }
}

let aCount = 0, sCount = 0, cCount = 0, bCount = 0, thin = 0;

// 1) MAKALELER (marked)
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
    `<main><article><header><h1>${esc(a.title || '')}</h1>` +
    (a.excerpt ? `<p class="article-excerpt">${esc(a.excerpt)}</p>` : '') +
    (metaBits ? `<div class="article-meta">${metaBits}</div>` : '') +
    `</header><div class="article-content">${body}</div></article></main>`;
  if (writeBody(file, inner)) { aCount++; if (visibleLen(inner) < 200) thin++; }
}

// 2) HİZMETLER (services.js)
const serviceFiles = new Set();
for (const s of PRACTICE_AREAS) {
  const file = path.join(DIST, 'hizmetler', s.slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  serviceFiles.add(file);
  const features = (s.features || []).map((f) => `<li>${esc(f)}</li>`).join('');
  const proc = (s.process || []).map((p) => `<li><strong>${esc(p.title)}:</strong> ${esc(p.description)}</li>`).join('');
  const faq = (s.faq || []).map((q) => `<div class="faq-item"><h3>${esc(q.question)}</h3><p>${esc(q.answer)}</p></div>`).join('');
  const inner =
    `<main><h1>${esc(s.title)}</h1><p>${esc(s.description || s.shortDescription || '')}</p>` +
    (features ? `<h2>Hizmet Kapsamı</h2><ul>${features}</ul>` : '') +
    (proc ? `<h2>Süreç</h2><ol>${proc}</ol>` : '') +
    (faq ? `<h2>Sıkça Sorulan Sorular</h2>${faq}` : '') +
    `</main>`;
  if (writeBody(file, inner)) sCount++;
}

// 3) DİĞER (araç + statik): once yakalanmis JSON, yoksa baseline
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
  const route = fileToRoute(file);
  if (bodies[route] && visibleLen(bodies[route]) >= 150) {
    if (writeBody(file, bodies[route])) cCount++;
    return;
  }
  const { title, desc } = getMeta(fs.readFileSync(file, 'utf-8'));
  const h1 = ((title.split('|')[0] || title).split('—')[0] || title).trim() || title;
  const inner = `<main><h1>${esc(h1)}</h1>` + (desc ? `<p>${esc(desc)}</p>` : '') + `</main>`;
  if (writeBody(file, inner)) { bCount++; if (visibleLen(inner) < 200) thin++; }
});

console.log(`Enjeksiyon bitti. Makale: ${aCount} | Hizmet: ${sCount} | Yakalanan(arac/statik): ${cCount} | Baseline: ${bCount} | Ince(<200): ${thin}`);
