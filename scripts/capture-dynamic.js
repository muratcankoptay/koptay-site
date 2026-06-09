#!/usr/bin/env node
/**
 * Dinamik Sayfa Yakalama — koptay.av.tr  (YEREL araç; Vercel'de ÇALIŞMAZ/GEREKMEZ)
 * --------------------------------------------------------------------------
 * Hesaplama araçları ve statik sayfaların içeriği React bileşenlerinin içinde
 * yazılı; düz veri değil. Bu script onları YEREL bir başsız tarayıcıyla render
 * edip #root içeriğini `src/data/prerendered-bodies.json` dosyasına kaydeder.
 *
 * Sonra `scripts/inject-content.js` (Vercel build'inde) bu JSON'u OKUR ve
 * gövdeye basar — yani Vercel'de tarayıcı gerekmez. Bu JSON commit'lenir.
 *
 * Ne zaman çalıştırmalı: bir araç/statik sayfanın görünür içeriğini değiştirince
 * `npm run capture` ile yenile. (Makaleler buna dahil DEĞİL; onlar articles.json'dan
 * marked ile her build'de tazelenir.)
 *
 * Tarayıcı: CHROME_PATH verilirse onu, yoksa `puppeteer` (yerelde) kullanır.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');
const OUT = path.resolve(__dirname, '../src/data/prerendered-bodies.json');
const PORT = Number(process.env.CAPTURE_PORT || 5066);
const MIN_TEXT = 150;
const BASE_ARGS = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];

async function getBrowser() {
  const envExe = process.env.CHROME_PATH;
  if (envExe && fs.existsSync(envExe)) {
    const p = (await import('puppeteer-core')).default;
    return p.launch({ headless: 'new', args: BASE_ARGS, executablePath: envExe });
  }
  const p = (await import('puppeteer')).default;
  return p.launch({ headless: 'new', args: BASE_ARGS });
}

function startServer() {
  const app = express();
  app.use(express.static(DIST));
  app.get(/.*/, (req, res) => {
    const clean = req.path.replace(/^\/+|\/+$/g, '');
    const f = clean ? path.join(DIST, clean, 'index.html') : path.join(DIST, 'index.html');
    res.sendFile(fs.existsSync(f) ? f : path.join(DIST, 'index.html'));
  });
  return new Promise((r) => { const s = http.createServer(app); s.listen(PORT, '127.0.0.1', () => r(s)); });
}

function collectRoutes() {
  const routes = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (['assets', 'images', 'locales', '.well-known'].includes(e.name)) continue;
        walk(f);
      } else if (e.name === 'index.html') {
        const rel = path.relative(DIST, dir).split(path.sep).join('/');
        routes.push(rel === '' ? '/' : '/' + rel);
      }
    }
  };
  walk(DIST);
  // Makaleleri HARİÇ tut (onlar marked ile tazelenir)
  return routes.filter((r) => !r.startsWith('/makale/'));
}

const visibleLen = (s) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, '').length;

async function run() {
  const server = await startServer();
  const browser = await getBrowser();
  const routes = collectRoutes();
  const CONC = Number(process.env.CAPTURE_CONCURRENCY || 2);
  console.log(`${routes.length} sayfa yakalanacak (eszamanli: ${CONC})...`);

  const out = {};
  const queue = [...routes];
  let ok = 0, thin = 0, fail = 0;

  async function worker() {
    while (queue.length) {
      const route = queue.shift();
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 2000 });
      page.setDefaultNavigationTimeout(30000);
      try {
        await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'networkidle2' });
        try {
          await page.waitForFunction((min) => {
            const r = document.querySelector('#root');
            return r && r.innerText && r.innerText.replace(/\s/g, '').length > min;
          }, { timeout: 15000 }, MIN_TEXT);
        } catch (_) {}
        await new Promise((r) => setTimeout(r, 300));
        const inner = await page.$eval('#root', (el) => el.innerHTML);
        out[route] = inner;
        const len = visibleLen(inner);
        if (len < MIN_TEXT) { thin++; console.log(`  ~ ${route} (${len})`); }
        else { ok++; console.log(`  + ${route} (${len})`); }
      } catch (e) {
        fail++; console.warn(`  x ${route} - ${e.message.split('\n')[0]}`);
      } finally { await page.close(); }
    }
  }

  await Promise.all(Array.from({ length: CONC }, () => worker()));
  await browser.close();
  server.close();

  // route sırasını sabitle (deterministik diff için)
  const sorted = {};
  for (const k of Object.keys(out).sort()) sorted[k] = out[k];
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(sorted, null, 0), 'utf-8');
  console.log(`\nYazildi: ${path.relative(process.cwd(), OUT)} | Dolu: ${ok} | Ince: ${thin} | Hata: ${fail}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
