/**
 * Favicon Generator Script
 * SVG logosundan Google için uygun favicon'lar oluşturur
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

// Favicon boyutları - Google için en az 48x48 gerekli
const sizes = [16, 32, 48, 96, 144, 192, 512];

async function generateFavicons() {
  const svgPath = path.join(publicDir, 'logo.svg');
  
  if (!fs.existsSync(svgPath)) {
    console.error('❌ logo.svg bulunamadı!');
    process.exit(1);
  }

  console.log('🎨 Favicon\'lar oluşturuluyor...\n');

  try {
    // SVG'yi oku
    const svgBuffer = fs.readFileSync(svgPath);

    // Her boyut için PNG oluştur
    for (const size of sizes) {
      const outputPath = path.join(publicDir, `favicon-${size}x${size}.png`);
      
      await sharp(svgBuffer, { density: 300 })
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ favicon-${size}x${size}.png oluşturuldu`);
    }

    // Ana favicon.png (48x48 - Google için minimum)
    await sharp(svgBuffer, { density: 300 })
      .resize(48, 48, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));
    console.log('✅ favicon.png (48x48) oluşturuldu');

    // Apple Touch Icon (180x180)
    await sharp(svgBuffer, { density: 300 })
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✅ apple-touch-icon.png (180x180) oluşturuldu');

    // ICO formatı için 32x32 PNG'yi kullanarak basit bir ICO oluştur
    // Not: Gerçek ICO için başka bir kütüphane gerekebilir, şimdilik PNG kullanacağız
    await sharp(svgBuffer, { density: 300 })
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicDir, 'favicon.ico.png'));
    
    // favicon.ico olarak da 32x32 PNG oluştur (modern tarayıcılar PNG kabul eder)
    fs.copyFileSync(
      path.join(publicDir, 'favicon.ico.png'),
      path.join(publicDir, 'favicon.ico')
    );
    fs.unlinkSync(path.join(publicDir, 'favicon.ico.png'));
    console.log('✅ favicon.ico (32x32) oluşturuldu');

    console.log('\n🎉 Tüm favicon\'lar başarıyla oluşturuldu!');
    console.log('\n📋 Oluşturulan dosyalar:');
    sizes.forEach(size => console.log(`   - favicon-${size}x${size}.png`));
    console.log('   - favicon.png (48x48)');
    console.log('   - favicon.ico (32x32)');
    console.log('   - apple-touch-icon.png (180x180)');

  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

generateFavicons();
