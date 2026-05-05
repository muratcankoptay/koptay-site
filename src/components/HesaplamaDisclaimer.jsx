import { AlertTriangle } from 'lucide-react'

/**
 * Standart sorumluluk reddi bileşeni — tüm hesaplama araçlarına eklenir.
 *
 * Props:
 *  - aracAdi: "kıdem tazminatı hesaplama aracı" gibi spesifik isim (zorunlu)
 *  - mevzuat: "5275 sayılı Kanun" gibi temel mevzuat (opsiyonel)
 *  - ekNotlar: array of strings — araca özel ek uyarılar (opsiyonel)
 */
const HesaplamaDisclaimer = ({ aracAdi = 'hesaplama aracı', mevzuat = '', ekNotlar = [] }) => {
  return (
    <section className="py-8 bg-amber-50 border-y border-amber-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-700 mt-1 flex-shrink-0" aria-hidden="true" />
          <div className="text-sm text-amber-900 leading-relaxed">
            <strong className="block mb-2 text-base">Sorumluluk Reddi (Hukuki Uyarı)</strong>
            <p className="mb-2">
              Bu {aracAdi}{mevzuat ? `, ${mevzuat} ve ilgili mevzuat` : ''} hükümlerine dayalı
              <strong> yaklaşık bir hesaplama</strong> yapar ve yalnızca bilgilendirme amaçlıdır.
              Hukuki danışmanlık veya hukuki görüş niteliği taşımaz.
            </p>
            <p className="mb-2">
              Sonuçlar; girdiğiniz bilgilerin doğruluğuna, somut olayın özelliklerine, mahkemenin
              takdir yetkisine, bilirkişi raporlarına, mevzuat değişikliklerine ve güncel içtihatlara
              göre farklılık gösterebilir. Hesaplamanın çıktısı hiçbir şekilde resmi, kesin veya
              bağlayıcı bir belge niteliği taşımaz.
            </p>
            <p className="mb-2">
              Somut bir uyuşmazlığınız varsa hesaplamayı esas almadan önce bir avukata danışmanız
              önerilir. Bu araçtan elde ettiğiniz sonuçlara dayanarak yapacağınız işlemlerden veya
              ortaya çıkabilecek zararlardan Koptay Hukuk Bürosu sorumlu tutulamaz.
            </p>
            {ekNotlar.length > 0 && (
              <ul className="list-disc pl-5 space-y-1 mt-3 text-amber-900">
                {ekNotlar.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HesaplamaDisclaimer
