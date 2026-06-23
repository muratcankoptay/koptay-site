import React, { useState } from 'react'
import { Shield, Sparkles, Scale, FileText, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import SEO from '../components/SEO'
import HesaplamaDisclaimer from '../components/HesaplamaDisclaimer'
import { kusurSSS, kusurSSSDuz } from '../data/kusurSSS'

/**
 * Yapay Zekâ Kusur Analizi
 * KUSURAI backend'ini /api/kusur-analizi proxy'si üzerinden kullanır.
 * API anahtarı yalnız sunucu tarafında (proxy) tutulur.
 */

const NAVY = '#0A1F3C'
const NAVY2 = '#13325B'
const GOLD = '#C9A24B'
const GOLD2 = '#A97F2E'

function severityColor(oran) {
  if (oran >= 60) return '#C7493B'
  if (oran >= 40) return '#D9A441'
  return '#2E9E6B'
}

export default function KusurAnaliziPage() {
  const [form, setForm] = useState({
    senaryo_aciklama: '',
    taraf_a_isim: '',
    taraf_b_isim: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sonuc, setSonuc] = useState(null)

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const analizEt = async () => {
    setError('')
    setSonuc(null)
    if ((form.senaryo_aciklama || '').trim().length < 15) {
      setError('Lütfen kazayı en az birkaç cümleyle açıklayın.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/kusur-analizi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senaryo_aciklama: form.senaryo_aciklama.trim(),
          taraf_a_isim: form.taraf_a_isim.trim() || 'Taraf A',
          taraf_b_isim: form.taraf_b_isim.trim() || 'Taraf B',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Analiz sırasında bir sorun oluştu.')
      } else {
        setSonuc(data)
      }
    } catch (e) {
      setError('Servise ulaşılamadı. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const oranlar = sonuc?.kusur_oranlari || []
  const yetersiz = sonuc?.yetersiz_veri || oranlar.some((o) => o.oran == null)

  return (
    <>
      <SEO
        title="Yapay Zekâ Kusur Analizi | Trafik Kazası Kusur Oranı Hesaplama — Koptay Hukuk"
        description="Kaza senaryonuzu yazın; yapay zekâ Karayolları Trafik Kanunu, TRAMER cetvelleri ve Yargıtay içtihatlarına dayalı kusur oranını gerekçesiyle hesaplasın. Bilgilendirme amaçlıdır."
        url="/hesaplama-araclari/yapay-zeka-kusur-analizi"
      />

      <style>{`
        .kx-wrap{max-width:920px;margin:0 auto;padding:2.5rem 1rem 4rem;font-family:inherit}
        .kx-hero{background:linear-gradient(150deg,${NAVY2},${NAVY});border-radius:22px;padding:2.6rem 2rem;color:#fff;position:relative;overflow:hidden}
        .kx-hero::after{content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.05) 1px,transparent 1px);background-size:22px 22px;opacity:.5;pointer-events:none}
        .kx-badge{display:inline-flex;align-items:center;gap:.45rem;background:rgba(201,162,75,.16);border:1px solid rgba(201,162,75,.4);color:${GOLD};padding:.35rem .85rem;border-radius:999px;font-size:.78rem;font-weight:600;letter-spacing:.04em;position:relative;z-index:1}
        .kx-h1{font-size:clamp(1.7rem,3.6vw,2.4rem);font-weight:700;line-height:1.15;margin:1rem 0 .6rem;position:relative;z-index:1}
        .kx-h1 em{font-style:normal;color:${GOLD}}
        .kx-sub{color:#A9BAD2;font-size:1.02rem;max-width:46ch;position:relative;z-index:1}
        .kx-card{background:#fff;border:1px solid #E2E8F0;border-radius:18px;padding:1.6rem;margin-top:1.4rem;box-shadow:0 10px 30px -18px rgba(10,31,60,.18)}
        .kx-label{display:block;font-weight:600;color:${NAVY};font-size:.92rem;margin:0 0 .4rem}
        .kx-input,.kx-textarea{width:100%;border:1px solid #D8E0EC;border-radius:12px;padding:.85rem 1rem;font-size:1rem;font-family:inherit;color:#1B2A41;background:#F8FAFC;transition:border-color .15s,box-shadow .15s;box-sizing:border-box}
        .kx-input:focus,.kx-textarea:focus{outline:none;border-color:${GOLD};box-shadow:0 0 0 3px rgba(201,162,75,.15);background:#fff}
        .kx-textarea{min-height:130px;resize:vertical;line-height:1.6}
        .kx-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem}
        @media(max-width:560px){.kx-row{grid-template-columns:1fr}}
        .kx-btn{display:inline-flex;align-items:center;gap:.55rem;background:${GOLD};color:${NAVY};border:none;font-weight:700;font-size:1.02rem;padding:.95rem 1.9rem;border-radius:12px;cursor:pointer;transition:all .18s;margin-top:1.3rem}
        .kx-btn:hover:not(:disabled){background:#E7C66A;transform:translateY(-1px)}
        .kx-btn:disabled{opacity:.65;cursor:not-allowed}
        .kx-err{display:flex;gap:.6rem;align-items:flex-start;background:#FCEBEB;border:1px solid #F0C4C4;color:#A32D2D;padding:.9rem 1rem;border-radius:12px;margin-top:1.1rem;font-size:.92rem}
        .kx-result-head{display:flex;align-items:center;gap:.6rem;font-weight:700;color:${NAVY};font-size:1.15rem;margin-bottom:.3rem}
        .kx-scenario{color:#5B6B82;font-size:.92rem;margin-bottom:1.3rem}
        .kx-bar-label{display:flex;justify-content:space-between;align-items:baseline;font-weight:600;color:${NAVY};margin-bottom:.35rem}
        .kx-bar-label .pct{font-size:1.5rem;font-weight:800}
        .kx-bar{height:13px;border-radius:999px;background:#EDF1F7;overflow:hidden;margin-bottom:1.25rem}
        .kx-bar i{display:block;height:100%;border-radius:999px}
        .kx-gerekce{background:#F7F9FC;border:1px solid #E2E8F0;border-radius:12px;padding:1rem 1.1rem;color:#1B2A41;font-size:.95rem;line-height:1.65;margin-top:.4rem}
        .kx-maddeler{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
        .kx-madde{display:inline-flex;align-items:center;gap:.4rem;background:rgba(201,162,75,.1);border:1px solid rgba(201,162,75,.3);color:${GOLD2};padding:.35rem .75rem;border-radius:8px;font-size:.82rem;font-weight:600}
        .kx-note{display:flex;gap:.6rem;align-items:flex-start;background:#FAF6EC;border:1px solid #EAD9B0;color:#6B5418;padding:.85rem 1rem;border-radius:12px;margin-top:1.1rem;font-size:.88rem;line-height:1.55}
        .kx-seo{margin-top:2.8rem}
        .kx-seo h2{font-size:1.55rem;color:${NAVY};font-weight:800;margin:0 0 .5rem;letter-spacing:-.01em}
        .kx-seo .kx-intro{color:#5B6B82;font-size:1rem;line-height:1.7;max-width:62ch;margin-bottom:1.6rem}
        .kx-faq-cat{font-size:1.05rem;color:${GOLD2};font-weight:700;margin:1.8rem 0 .7rem;padding-left:.1rem}
        .kx-faq details{border:1px solid #E2E8F0;border-radius:12px;background:#fff;margin-bottom:.6rem;overflow:hidden;transition:border-color .15s}
        .kx-faq details[open]{border-color:rgba(201,162,75,.4)}
        .kx-faq summary{cursor:pointer;list-style:none;padding:1rem 1.15rem;font-weight:600;color:${NAVY};display:flex;justify-content:space-between;align-items:center;gap:1rem;font-size:.98rem}
        .kx-faq summary::-webkit-details-marker{display:none}
        .kx-faq summary::after{content:'+';color:${GOLD2};font-size:1.45rem;font-weight:400;flex:none;line-height:1}
        .kx-faq details[open] summary::after{content:'–'}
        .kx-faq .kx-ans{padding:0 1.15rem 1.15rem;color:#3A4961;font-size:.95rem;line-height:1.72}
      `}</style>

      <div className="kx-wrap">
        <div className="kx-hero">
          <span className="kx-badge"><Sparkles size={14} /> Yapay Zekâ Destekli</span>
          <h1 className="kx-h1">Trafik Kazası <em>Kusur Oranı</em> Analizi</h1>
          <p className="kx-sub">
            Kazayı kendi cümlelerinizle anlatın. Yapay zekâ; Karayolları Trafik Kanunu, TRAMER
            kusur cetvelleri ve Yargıtay içtihatlarına dayanarak taraflar arasındaki kusur
            dağılımını gerekçesiyle tahmin etsin.
          </p>
        </div>

        <div className="kx-card">
          <label className="kx-label" htmlFor="senaryo">Kaza senaryosu / olay açıklaması</label>
          <textarea
            id="senaryo"
            className="kx-textarea"
            placeholder="Örn: Ana yolda seyir halindeyken, sağ taraftaki tali yoldan çıkan araç önüme aniden çıktı ve sol ön çamurluğuma çarptı. Kavşakta dur levhası tali yoldaki araç içindi..."
            value={form.senaryo_aciklama}
            onChange={(e) => set('senaryo_aciklama', e.target.value)}
            maxLength={5000}
          />
          <div className="kx-row">
            <div>
              <label className="kx-label" htmlFor="ta">1. Taraf adı (opsiyonel)</label>
              <input id="ta" className="kx-input" placeholder="Örn: Ben / Müvekkil"
                value={form.taraf_a_isim} onChange={(e) => set('taraf_a_isim', e.target.value)} />
            </div>
            <div>
              <label className="kx-label" htmlFor="tb">2. Taraf adı (opsiyonel)</label>
              <input id="tb" className="kx-input" placeholder="Örn: Karşı taraf"
                value={form.taraf_b_isim} onChange={(e) => set('taraf_b_isim', e.target.value)} />
            </div>
          </div>

          {error && (
            <div className="kx-err"><AlertCircle size={18} /> <span>{error}</span></div>
          )}

          <button className="kx-btn" onClick={analizEt} disabled={loading}>
            {loading ? (<><Loader2 size={18} className="kx-spin" style={{ animation: 'spin 1s linear infinite' }} /> Analiz ediliyor…</>) : (<>Kusur Analizini Başlat <ArrowRight size={18} /></>)}
          </button>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>

        {sonuc && (
          <div className="kx-card">
            <div className="kx-result-head"><Scale size={20} color={GOLD} /> Kusur Dağılımı</div>
            <div className="kx-scenario">
              {sonuc.senaryo_adi ? `Tespit edilen senaryo: ${sonuc.senaryo_adi}` : 'Analiz tamamlandı.'}
              {typeof sonuc.guven_skoru === 'number' && ` · Güven: %${Math.round(sonuc.guven_skoru * 100)}`}
            </div>

            {yetersiz ? (
              <div className="kx-note">
                <AlertCircle size={18} />
                <span>Verilen bilgi kusur dağılımını kesinleştirmek için yeterli olmadı. Daha fazla
                  detay (yön, hız, trafik işaretleri, çarpışma noktası) ekleyerek tekrar deneyin.</span>
              </div>
            ) : (
              oranlar.map((o, i) => (
                <div key={i}>
                  <div className="kx-bar-label">
                    <span>{o.taraf_isim || `Taraf ${o.taraf}`}{o.taraf_tanim ? ` — ${o.taraf_tanim}` : ''}</span>
                    <span className="pct" style={{ color: severityColor(o.oran || 0) }}>%{o.oran ?? '—'}</span>
                  </div>
                  <div className="kx-bar">
                    <i style={{ width: `${o.oran || 0}%`, background: severityColor(o.oran || 0) }} />
                  </div>
                </div>
              ))
            )}

            {sonuc.gerekce && !yetersiz && (
              <div className="kx-gerekce"><strong>Gerekçe:</strong> {sonuc.gerekce}</div>
            )}

            {Array.isArray(sonuc.ilgili_maddeler) && sonuc.ilgili_maddeler.length > 0 && (
              <div className="kx-maddeler">
                {sonuc.ilgili_maddeler.map((m, i) => (
                  <span className="kx-madde" key={i}><FileText size={13} /> {typeof m === 'string' ? m : (m.madde || m.kod || JSON.stringify(m))}</span>
                ))}
              </div>
            )}

            <div className="kx-note">
              <Shield size={18} />
              <span>Bu analiz <strong>bilgilendirme amaçlıdır</strong> ve resmî bilirkişi raporu yerine
                geçmez. Hukuki süreçte yetkili mahkeme, sigorta tahkim ve bilirkişi mercilerine
                başvurulması gerekir. Dosyanızın değerlendirilmesi için bizimle iletişime geçebilirsiniz.</span>
            </div>
          </div>
        )}

        <section className="kx-seo">
          <h2>Trafik Kazası Kusur Oranı Hakkında Sıkça Sorulan Sorular</h2>
          <p className="kx-intro">
            Kusur oranı nasıl belirlenir, arkadan çarpma ve kavşak kazalarında kim kusurludur,
            değer kaybı ile sigorta tahkim süreci nasıl işler? Trafik kazalarında kusur ve
            tazminata dair en çok merak edilen soruları Koptay Hukuk Bürosu için derledik.
          </p>

          {kusurSSS.map((grup) => (
            <div key={grup.kategori}>
              <h3 className="kx-faq-cat">{grup.kategori}</h3>
              <div className="kx-faq">
                {grup.sorular.map((q, i) => (
                  <details key={i}>
                    <summary>{q.s}</summary>
                    <div className="kx-ans">{q.c}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </section>

        <div style={{ marginTop: '1.6rem' }}>
          <HesaplamaDisclaimer />
        </div>
      </div>

      {/* Google zengin sonuçları için FAQPage yapısal verisi */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: kusurSSSDuz.map((q) => ({
              '@type': 'Question',
              name: q.s,
              acceptedAnswer: { '@type': 'Answer', text: q.c },
            })),
          }),
        }}
      />
    </>
  )
}
