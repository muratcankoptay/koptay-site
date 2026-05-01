import { Helmet } from 'react-helmet-async'

/**
 * LocalBusiness/Attorney structured data for Google Knowledge Panel & Local Pack.
 *
 * NOT: aggregateRating, sahte sosyal medya URL'leri ve placeholder adres
 * kaldırılmıştır. Google'ın "fake review markup" yaptırımına yol açabilir.
 * Gerçek müvekkil yorumları Google İşletme Profili (GBP) üzerinden toplandığında
 * Google bunları kendi otomatik gösterir; schema'da elle yazılmamalıdır.
 *
 * Adres, telefon ve sosyal medya hesapları doğrulandıkça aşağıya eklenmelidir.
 */
const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Attorney",
    "name": "Av. Murat Can Koptay - Koptay Hukuk Bürosu",
    "image": "https://koptay.av.tr/logo.svg",
    "logo": "https://koptay.av.tr/logo.svg",
    "description": "Ankara merkezli hukuk bürosu. İş Hukuku, Trafik Kazası, Aile Hukuku, Ceza Hukuku ve Tazminat Davaları alanlarında profesyonel avukatlık hizmetleri.",
    "@id": "https://koptay.av.tr/#organization",
    "url": "https://koptay.av.tr",
    "telephone": "+905307111864",
    "email": "info@koptay.av.tr",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Aziziye Mah. Willy Brandt Sk. No:7/1",
      "addressLocality": "Çankaya",
      "addressRegion": "Ankara",
      "postalCode": "06680",
      "addressCountry": "TR"
    },
    "areaServed": [
      { "@type": "City", "name": "Ankara" },
      { "@type": "Country", "name": "Türkiye" }
    ],
    "knowsLanguage": ["tr", "en"],
    "knowsAbout": [
      "İş Hukuku",
      "Ceza Hukuku",
      "Aile Hukuku",
      "Trafik Kazası Hukuku",
      "Tazminat Hukuku",
      "Ticaret Hukuku",
      