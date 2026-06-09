#!/usr/bin/env node
/**
 * Body Snapshot — koptay.av.tr
 * prerender.js her route için <head>'i (title, meta, OG, JSON-LD) dolduruyor ama
 * <div id="root"> gövdesini boş bırakıyordu. Bu script `vite build` + `prerender.js`
 * SONRASI çalışır: dist'i yerel sunucuda yayınlar, başsız Chrome ile her route'u
 * render eder ve #root içeriğini ilgili HTML dosyasının gövdesine enjekte eder.
 * <head> aynen korunur. Gerçek kullanıcılar yine React SPA yükler.
 *
 * Tarayıcı kaynağı (otomatik seçim):
 *   - CHROME_PATH verilmişse: puppeteer-core + o yol (manuel/yerel test).
 *   - Linux (Vercel/CI): @sparticuz/chromium + puppeteer-core (gerekli sistem
 *     kütüphanelerini paketin içinde getirir; Vercel build'inde güvenle çalışır).
 *   - Windows/Mac yerel: tam `puppeteer` (kuruluysa, kendi Chromium'u ile).
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST = path.resolve(__dirname, '../dist');
const PORT = Number(process.env.SNAPSHOT_PORT || 5055);
const MIN_TEXT = 200;
const NAV_TIMEOUT = 30000;
const CONTENT_TIMEOUT = 15000;
const BASE_ARGS = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];

async function getBrowser() {
  // 1) Açık CHROME_PATH (yerel test / özel kurulum)
  const envExe = process.env.CHROME_PATH;
  if (envExe && fs.existsSync(envExe)) {
    const puppeteer = (await import('puppeteer-core')).default;
    return puppeteer.launch({ headless: 'new', args: BASE_ARGS, executablePath: envExe });
  }
  // 2) Linux (Vercel/CI): @sparticuz/chromium
  if (process.platform === 'linux') {
    try {
      const chromium = (await import('@sparticuz/chromium')).default;
      const puppeteer = (await import('puppeteer-core')).default;
      chromium.setGraphicsMode = false;
      const executablePath = await chromium.executablePath();
      return puppeteer.launch({
        headless: 'new',
        args: [...chromium.args, '--disable-dev-shm-usage'],
        executablePath,
      });
    } catch (e) {
      console.warn('@sparticuz/chromium ile başlatılamadı, puppeteer deneniyor:', e.message);
    }
  }
  // 3) Windows/Mac yerel: tam puppeteer
  try {
    const puppeteer = (await import('puppeteer')).default;
    return puppeteer.launch({ headless: 'new', args: BASE_ARGS });
  } catch (e) {
    throw new Error('Tarayıcı başlatılamadı. Vercel/Linux: @sparticuz/chromium+puppeteer-core; yerel: `npm i -D puppeteer`.');
  }
}

function startServer() {
  const app = express();
  app.use(express.static(DIST));
  app.get(/.*/, (req, res) => {
    const clean = req.path.replace(/^\/+|\/+$/g, '');
    const candidate = clean ? path.join(DIST, clean, 'index.html') : path.join(DIST, 'index.html');
    if (fs.existsSync(candidate)) return res.sendFile(candidate);
    res.sendFile(path.join(DIST, 'index.html'));
  });
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

function collectRoutes() {
  const routes = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['assets', 'images', 'locales', '.well-known'].includes(entry.name)) continue;
        walk(full);
      } else if (entry.name === 'index.html') {
        const rel = path.relative(DIST, dir).split(path.sep).join('/');
        routes.push({ route: rel === '' ? '/' : '/' + rel, file: full });
      }
    }
  };
  walk(DIST);
  return routes;
}

function injectRoot(html, inner) {
  const startTag = '<div id="root">';
  const i = html.indexOf(startTag);
  if (i < 0) return null;
  const contentStart = i + startTag.length;
  let depth = 1;
  const re = /<div\b|<\/div>/g;
  re.lastIndex = contentStart;
  let m, closeIdx = -1;
  while ((m = re.exec(html))) {
    if (m[0] === '</div>') { depth--; if (depth === 0) { closeIdx = m.index; break; } }
    else depth++;
  }
  if (closeIdx < 0) return null;
  return html.slice(0, contentStart) + inner + html.slice(closeIdx);
}

const visibleLen = (s) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, '').length;

function getRootInner(html) {
  const startTag = '<div id="root">';
  const i = html.indexOf(startTag);
  if (i < 0) return '';
  const contentStart = i + startTag.length;
  let depth = 1;
  const re = /<div\b|<\/div>/g;
  re.lastIndex = contentStart;
  let m;
  while ((m = re.exec(html))) {
    if (m[0] === '</div>') { depth--; if (depth === 0) return html.slice(contentStart, m.index); }
    else depth++;
  }
  return '';
}

async function run() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('dist/index.html yok. Once vite build + prerender.js calistirin.');
    process.exit(1);
  }
  const server = await startServer();
  const browser = await getBrowser();
  const routes = collectRoutes();
  const CONCURRENCY = Number(process.env.SNAPSHOT_CONCURRENCY || 2);
  console.log(`${routes.length} route icin body snapshot (eszamanli: ${CONCURRENCY})...`);

  let ok = 0, thin = 0, fail = 0;
  const queue = [...routes];

  async function worker() {
    while (queue.length) {
      const { route, file } = queue.shift();
      if (!process.env.RESNAP) {
        const existing = getRootInner(fs.readFileSync(file, 'utf-8'));
        if (visibleLen(existing) >= MIN_TEXT) { ok++; console.log(`  . ${route} (zaten dolu)`); continue; }
      }
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 2000 });
      page.setDefaultNavigationTimeout(NAV_TIMEOUT);
      const url = `http://127.0.0.1:${PORT}${route}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        try {
          await page.waitForFunction(
            (min) => {
              const r = document.querySelector('#root');
              return r && r.innerText && r.innerText.replace(/\s/g, '').length > min;
            },
            { timeout: CONTENT_TIMEOUT }, MIN_TEXT
          );
        } catch (_) {}
        await new Promise((r) => setTimeout(r, 300));
        const inner = await page.$eval('#root', (el) => el.innerHTML);
        const html = fs.readFileSync(file, 'utf-8');
        const out = injectRoot(html, inner);
        if (!out) { console.warn(`  ! root yok: ${route}`); fail++; await page.close(); continue; }
        fs.writeFileSync(file, out, 'utf-8');
        const len = visibleLen(inner);
        if (len < MIN_TEXT) { thin++; console.log(`  ~ ${route} (${len} kar - ince)`); }
        else { ok++; console.log(`  + ${route} (${len} kar)`); }
      } catch (e) {
        fail++;
        console.warn(`  x ${route} - ${e.message.split('\n')[0]}`);
      } finally {
        await page.close();
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  await browser.close();
  server.close();
  console.log(`\nBitti. Dolu: ${ok} | Ince: ${thin} | Hata: ${fail} | Toplam: ${routes.length}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
